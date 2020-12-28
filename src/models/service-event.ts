export interface ServiceEvent<TEventType> {
  serviceEvent: (eventData: TEventType) => void;
  rawEvent: (eventData: unknown) => void;
  removeListener: void;
  newListener: void;
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
  Unprocessed = 'rawEvent'
}
