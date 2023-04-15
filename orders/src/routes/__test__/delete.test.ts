import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { OrderStatus } from '../../models/order'
import { natsWrapper } from '../../nats-wrapper'
import mongoose from 'mongoose'

it('marks an order as cancelled', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'CONCERT',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString()
  })
  await ticket.save()

  const user = global.signin()
  // make request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // make request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  // expectation to make sure ticket is cancelled
  const { body: updatedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)
  // OR
  // const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder.status).toEqual(OrderStatus.Cancelled)
})

it('emits an order cancelled event', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'CONCERT',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString()
  })
  await ticket.save()

  const user = global.signin()
  // make request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // make request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
