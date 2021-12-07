import { EventEmitter } from 'events';
import EventTimeoutError from './event-timeout-error';

/**
 * Async helper exposes a function to wait for an event or timeout.
 *
 * @export
 * @hidden
 * @class AsyncHelper
 */
export default class AsyncHelper {
  /**
   * Awaitable event handler with timeout
   *
   * @static
   * @template TResult
   * @param {EventEmitter} eventEmitter Event emitter that should be subscribed to.
   * @param {string} eventName Name of event to listen for.
   * @param {number} [timeout] Seconds to wait for event
   * @returns {Promise<TResult>}
   * @memberof AsyncHelper
   */
  static async AsyncEvent<TResult>(eventEmitter: EventEmitter, eventName: string, timeout?: number): Promise<TResult> {
    return await new Promise((resolve, reject) => {
      let timer: NodeJS.Timeout | undefined;
      if (timeout !== undefined && timeout > 0) {
        timer = setTimeout(() => {
          reject(new EventTimeoutError(eventName));
        }, timeout * 1000);
      }
      eventEmitter.once(eventName, (data) => {
        if (timer !== undefined) clearTimeout(timer);
        resolve(data);
      });
    });
  }

  /**
   * Awaitable delay
   *
   * @static
   * @param {number} ms Time to wait in milliseconds
   * @returns {Promise<void>}
   * @memberof AsyncHelper
   */
  static async Delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(() => resolve(undefined), ms));
  }

  static async catchEm<T>(promise: Promise<T>): Promise<{reason: Error | null, data: T | null}> {
    return promise
      .then((data: T) => ({
        reason: null,
        data,
      }))
      .catch((reason: Error) => ({
        reason,
        data: null,
      }));
  }
}
