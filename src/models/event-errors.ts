export class EventsError extends Error {
  constructor(public code: EventsErrorCode, baseError?: Error) {
    super(baseError?.message);
    this.name = 'EventsError';
    this.stack = baseError?.stack;
  }
}

export enum EventsErrorCode {
  SubscribeFailed = 'SubscribeFailed',
  RenewSubscriptionFailed = 'RenewSubscriptionFailed',
  UnsubscribeFailed = 'UnsubscribeFailed',
}
