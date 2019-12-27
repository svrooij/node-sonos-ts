import { EventEmitter } from 'events'
/**
 * Async helper exposes a function to wait for an event or timeout.
 *
 * @export
 * @hidden
 * @class AsyncHelper
 */
export class AsyncHelper {
  /**
   * Awaitable event handler with timeout
   *
   * @static
   * @template TResult
   * @param {EventEmitter} eventEmitter
   * @param {string} eventName
   * @param {number} [timeout]
   * @returns {Promise<TResult>}
   * @memberof AsyncHelper
   */
  static AsyncEvent<TResult>(eventEmitter: EventEmitter, eventName: string, timeout?: number): Promise<TResult> {
    return new Promise((resolve, reject) => {
      let timer: NodeJS.Timeout | undefined ;
      if (timeout !== undefined) {
        timer = setTimeout(() => {
          reject(new Error('Event didn\'t happen before timeout'))
        }, timeout * 1000)
      }
      eventEmitter.once(eventName, (data) => {
        if(timer !== undefined) clearTimeout(timer)
        resolve(data);
      })
    })
  }
}