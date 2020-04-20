/**
 * The sonos device will throw this error if it receives a non-ok status code.
 *
 * @export
 * @class HttpError
 * @extends {Error}
 */
export default class HttpError extends Error {
  constructor(public readonly Action: string, public HttpStatusCode: number, public HttpStatusText?: string) {
    super(`Http status ${HttpStatusCode} (${HttpStatusText})`);
    this.name = 'HttpError';
  }
}