/**
 * The sonos device will throw this error if it receives a Soap Fault, gives access to UpnpErrorCode.
 *
 * @export
 * @class SonosError
 * @remarks See http://upnp.org/specs/arch/UPnP-arch-DeviceArchitecture-v2.0.pdf page 86 for error descriptions. Sadly Sonos doesn't send the error description.
 * @extends {Error}
 */
export default class SonosError extends Error {
  constructor(public readonly Action: string, public readonly FaultCode: string, public readonly Fault: string, public readonly UpnpErrorCode?: number, public readonly UpnpErrorDescription?: string) {
    super(`Sonos error on ${Action} ${Fault} ${UpnpErrorCode} (${UpnpErrorDescription})`);
    this.name = 'SonosError';
  }
}
