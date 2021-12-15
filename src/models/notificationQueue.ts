import { PlayNotificationOptions, PlayTtsOptions } from "./requests";

export interface PlayNotificationTwoOptions extends PlayNotificationOptions {
  
  /**
   *
   */
   resolveAfterRevert?: boolean;

   /**
    * In case no other timeout given this will result in 30 Minutes Default Timeout for Playing time only
    */
   defaultTimeout?: number;
 
   /**
    * This timeout starts as soon as this item is played next in the queue.
    * Thus in case of an error resolving the PlayNotificationCall with false.
    */
   specificTimeout?: number;
 
   /**
    * If an error occurs playing a notification queue, this flag would prevent the error from bubbling to your main application.
    */
   catchQueueErrors?: boolean;
}

export interface PlayTtsTwoOptions extends PlayTtsOptions {
  /**
 *
 * @deprecated Experimental feature, please dont depend on this
 */
   resolveAfterRevert?: boolean;

   /**
    * In case no other timeout given this will result in 30 Minutes Default Timeout for Playing time only
    */
   defaultTimeout?: number;
 
   /**
    * This timeout starts as soon as this item is played next in the queue.
    * Thus in case of an error resolving the PlayNotificationCall with false.
    */
   specificTimeout?: number;
 
   /**
    * If an error occurs playing a notification queue, this flag would prevent the error from bubbling to your main application.
    *
    */
   catchQueueErrors?: boolean;
}

export interface NotificationQueueItem {
  /**
   * Desired PlayNotificationOptions
   *
   * @type {number}
   */
  options: PlayNotificationTwoOptions;

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
   * Whether we should only resolve the promise when we reverted correctly
   *
   * @type {boolean}
   */
  resolveAfterRevert: boolean;

  /**
   * Object with details regarding the timeout for this queue item
   *
   * @type {NotificationQueueTimeoutItem}
   */
  generalTimeout?: NotificationQueueTimeoutItem;

  /**
   * Object with details regarding the timeout for this specific queue item (Starting when this is Queue Item becomes first)
   *
   * @type {NotificationQueueTimeoutItem}
   */
  individualTimeout?: NotificationQueueTimeoutItem;
}

export class NotificationQueueTimeoutItem {
  public constructor(
    /**
    * The timeout reference to clear if anything is okay
    *
    * @type {NotificationQueueTimeoutItem}
    */
    public timeout: NodeJS.Timeout,

    /**
    * The timestamp when the timeout will fire
    *
    * @type {NotificationQueueTimeoutItem}
    */
    public fireTime: number,
  ) { }

  public timeLeft(): number {
    return this.fireTime - (new Date()).getTime();
  }
}

export class NotificationQueue {
  public queue: NotificationQueueItem[] = [];

  public promisesToResolve: Array<{
    promise: (resolve: boolean | PromiseLike<boolean>) => void,
    value: boolean,
    timeout?: NotificationQueueTimeoutItem,
  }> = [];

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
