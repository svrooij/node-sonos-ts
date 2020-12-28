/**
 * Error that is thrown by AsyncEvent, if event didn't trigger before timeout
 *
 * @export
 * @class EventTimeoutError
 * @extends {Error}
 */
export default class EventTimeoutError extends Error {
  constructor(eventName: string) {
    super(`Event ${eventName} didn't fire before timeout`);
    this.name = 'EventTimeoutError';
  }
}
