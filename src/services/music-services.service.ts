/**
 * Sonos MusicServices service
 *
 * Stephan van Rooij
 * https://svrooij.io
 *
 * This file is generated, do not edit manually. https://sonos.svrooij.io/
 */
import BaseService from './base-service';
import { SonosUpnpError } from '../models/sonos-upnp-error';
import SonosUpnpErrors from './sonos-upnp-errors';

/**
 * Access to external music services, like Spotify or Youtube Music
 *
 * @export
 * @class MusicServicesServiceBase
 * @extends {BaseService}
 */
export class MusicServicesServiceBase extends BaseService<MusicServicesServiceEvent> {
  readonly serviceNane: string = 'MusicServices';

  readonly controlUrl: string = '/MusicServices/Control';

  readonly eventSubUrl: string = '/MusicServices/Event';

  readonly scpUrl: string = '/xml/MusicServices1.xml';

  readonly errors: SonosUpnpError[] = SonosUpnpErrors.defaultErrors;

  // #region actions
  GetSessionId(input: { ServiceId: number; Username: string }):
  Promise<GetSessionIdResponse> { return this.SoapRequestWithBody<typeof input, GetSessionIdResponse>('GetSessionId', input); }

  /**
   * Load music service list as xml
   * @remarks Some libraries also support ListAndParseAvailableServices
   */
  ListAvailableServices():
  Promise<ListAvailableServicesResponse> { return this.SoapRequest<ListAvailableServicesResponse>('ListAvailableServices'); }

  UpdateAvailableServices():
  Promise<boolean> { return this.SoapRequestNoResponse('UpdateAvailableServices'); }
  // #endregion

  protected responseProperties(): { [key: string]: string } {
    return {
      SessionId: 'string',
      AvailableServiceDescriptorList: 'string',
      AvailableServiceTypeList: 'string',
      AvailableServiceListVersion: 'string',
    };
  }

  // Event properties from service description.
  protected eventProperties(): { [key: string]: string } {
    return {
      ServiceId: 'number',
      ServiceListVersion: 'string',
      SessionId: 'string',
      Username: 'string',
    };
  }
}

// Generated responses
export interface GetSessionIdResponse {
  SessionId: string;
}

export interface ListAvailableServicesResponse {
  AvailableServiceDescriptorList: string;
  AvailableServiceTypeList: string;
  AvailableServiceListVersion: string;
}

// Strong type event
export interface MusicServicesServiceEvent {
  ServiceId?: number;
  ServiceListVersion?: string;
  SessionId?: string;
  Username?: string;
}
