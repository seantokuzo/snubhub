export enum OrderStatus {
  // When order has been created
  // but ticket it is trying to order has not been reserved
  Created = 'created',

  // ticket order is trying to reserve is already reserved
  // OR user has cancelled the order
  // OR order expires before payment
  Cancelled = 'cancelled',

  // order has successfully reserved the ticket
  AwaitingPayment = 'awaiting:payment',

  // order has reserved the ticket and user has paid
  Complete = 'complete'
}
