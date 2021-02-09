import { EventsError } from './event-errors';

export interface ServiceEvent<TEventType> {
  serviceEvent: (eventData: TEventType) => void;
  subscriptionError: (error: EventsError) => void;
  rawEvent: (eventData: unknown) => void;
  removeListener: (eventName: string | symbol) => void;
  newListener: (eventName: string | symbol) => void;
}

export enum ServiceEvents {
  /**
   * @deprecated switch to ServiceEvent
   */
  Data = 'serviceEvent',
  /**
   * @deprecated switch to ServiceEvent
   */
  LastChange = 'serviceEvent',
  ServiceEvent = 'serviceEvent',
  SubscriptionError = 'subscriptionError',
  Unprocessed = 'rawEvent'
}
