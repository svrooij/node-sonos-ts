import { EventEmitter } from 'events';
import { PlayNotificationOptions } from './requests';

export interface NotificationQueueItem {
  /**
   * Desired PlayNotificationOptions
   *
   * @type {number}
   */
  options: PlayNotificationOptions;

  /**
   * The name of the event fired when finished
   *
   * @type {Promise<boolean>}
   */
  eventName: string
}

export class NotificationQueue {
  public queue: NotificationQueueItem[] = [];

  public events = new EventEmitter();

  public playing = false;
}
