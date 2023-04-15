import { Subjects, Publisher, ExpirationCompleteEvent } from "@snubhub/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}
