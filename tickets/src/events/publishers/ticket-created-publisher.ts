import { Publisher, Subjects, TicketCreatedEvent } from '@snubhub/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}
