/**
 * You'll get this error if your music service throws an error
 *
 * @export
 * @class SmapiError
 * @extends {Error}
 */
export default class SmapiError extends Error {
  constructor(public readonly ServiceName: string, public readonly Action: string, public readonly Fault: unknown) {
    super(`Sonos music API error for ${Action} ${ServiceName}`);
    this.name = 'SmapiError';
  }
}
