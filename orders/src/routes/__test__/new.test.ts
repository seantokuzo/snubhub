import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/orders').send({}).expect(401)
})

it('returns an error if req.body is not validated', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId: ''
    })
    .expect(400)
})

it('returns an error if ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404)
})

it('returns an error if ticket is reserved', async () => {
  const ticket = Ticket.build({
    title: 'CONCERT',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString()
  })
  await ticket.save()
  const order = Order.build({
    ticket,
    userId: 'randomId',
    status: OrderStatus.Created,
    expiresAt: new Date()
  })
  await order.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400)
})

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'CONCERT',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString()
  })
  await ticket.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201)
})

it('emits an order created event', async () => {
  const ticket = Ticket.build({
    title: 'CONCERT',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString()
  })
  await ticket.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
