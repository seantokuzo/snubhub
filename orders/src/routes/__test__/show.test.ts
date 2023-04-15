import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

it('returns a 401 if user is not signed in', async () => {
  await request(app).get('/api/orders/1234567890').send({}).expect(401)
})

it('returns 400 if orderId is not valid mongoose id', async () => {
  await request(app)
    .get('/api/orders/1234567890')
    .set('Cookie', global.signin())
    .send({})
    .expect(400)
})

it('returns a 404 if order is not found', async () => {
  await request(app)
    .get(`/api/orders/${new mongoose.Types.ObjectId()}`)
    .set('Cookie', global.signin())
    .send({})
    .expect(404)
})

it('fetches the order', async () => {
  // Create ticket
  const ticket = Ticket.build({
    title: 'CONCERT',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString()
  })
  await ticket.save()

  const user = global.signin()
  // make request to build order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  //make request to fetch the order

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)

  expect(fetchedOrder.id).toEqual(order.id)
})

it('returns error if one user tries to fetch another users order', async () => {
  // Create ticket
  const ticket = Ticket.build({
    title: 'CONCERT',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString()
  })
  await ticket.save()

  const user = global.signin()
  // make request to build order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  //make request to fetch the order

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401)
})
