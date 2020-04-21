export interface ServiceEvent<TEventType> {
  serviceEvent: (eventData: TEventType) => void;
  rawEvent: (eventData: any) => void;
  removeListener: void;
  newListener: void;
}
