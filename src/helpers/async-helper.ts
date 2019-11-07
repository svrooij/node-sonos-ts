import { EventEmitter } from 'events'
export class AsyncHelper {
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