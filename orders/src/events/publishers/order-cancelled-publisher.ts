import { OrderCancelledEvent, Publisher, Subjects } from '@snubhub/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
