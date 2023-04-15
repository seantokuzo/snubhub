import { PaymentCreatedEvent, Publisher, Subjects } from '@snubhub/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}
