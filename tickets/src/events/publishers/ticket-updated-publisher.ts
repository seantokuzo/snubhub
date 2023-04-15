import { Publisher, Subjects, TicketUpdatedEvent } from '@snubhub/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
