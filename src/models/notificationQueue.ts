import { PlayNotificationOptions } from './requests';

export interface NotificationQueueItem {
  /**
   * Desired PlayNotificationOptions
   *
   * @type {number}
   */
  options: PlayNotificationOptions;

  /**
   * The Resolve Promise we have to resolve once finished successfully
   *
   * @type {(reject: boolean | PromiseLike<boolean>) => void}
   */
  resolve: (resolve: boolean | PromiseLike<boolean>) => void;

  /**
  * The Reject Promise we have to resolve once finished with failure
  *
  * @type {(reject: boolean | PromiseLike<boolean>) => void}
  */
  reject: (reject: boolean | PromiseLike<boolean>) => void;

  /**
  * Wether we should only resolve the promise when we reverted correctly
  *
  * @type {boolean}
  */
  resolveAfterRevert: boolean;
}

export class NotificationQueue {
  public queue: NotificationQueueItem[] = [];

  public promisesToResolve: Array<{promise: (resolve: boolean | PromiseLike<boolean>) => void, value: boolean}> = [];

  public playing = false;

  /**
  * Whether any item in the Queue changed the volume
  *
  * @type {boolean}
  */
  public volumeChanged = false;

  /**
  * Whether the Queue played any item at all
  *
  * @type {boolean}
  */
  public anythingPlayed = false;
}
