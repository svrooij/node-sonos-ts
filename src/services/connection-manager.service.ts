/**
 * Sonos ConnectionManager service
 *
 * Stephan van Rooij
 * https://svrooij.io
 *
 * This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 */
import BaseService from './base-service';
import { SonosUpnpError } from '../models/sonos-upnp-error';
import SonosUpnpErrors from './sonos-upnp-errors';

/**
 * Services related to connections and protocols
 *
 * @export
 * @class ConnectionManagerService
 * @extends {BaseService}
 */
export class ConnectionManagerService extends BaseService<ConnectionManagerServiceEvent> {
  readonly serviceNane: string = 'ConnectionManager';

  readonly controlUrl: string = '/MediaRenderer/ConnectionManager/Control';

  readonly eventSubUrl: string = '/MediaRenderer/ConnectionManager/Event';

  readonly scpUrl: string = '/xml/ConnectionManager1.xml';

  readonly errors: SonosUpnpError[] = SonosUpnpErrors.defaultErrors;

  // #region actions
  async GetCurrentConnectionIDs():
  Promise<GetCurrentConnectionIDsResponse> { return await this.SoapRequest<GetCurrentConnectionIDsResponse>('GetCurrentConnectionIDs'); }

  async GetCurrentConnectionInfo(input: { ConnectionID: number }):
  Promise<GetCurrentConnectionInfoResponse> { return await this.SoapRequestWithBody<typeof input, GetCurrentConnectionInfoResponse>('GetCurrentConnectionInfo', input); }

  async GetProtocolInfo():
  Promise<GetProtocolInfoResponse> { return await this.SoapRequest<GetProtocolInfoResponse>('GetProtocolInfo'); }
  // #endregion

  protected responseProperties(): {[key: string]: string} {
    return {
      ConnectionIDs: 'string',
      RcsID: 'number',
      AVTransportID: 'number',
      ProtocolInfo: 'string',
      PeerConnectionManager: 'string',
      PeerConnectionID: 'number',
      Direction: 'string',
      Status: 'string',
      Source: 'string',
      Sink: 'string',
    };
  }

  // Event properties from service description.
  protected eventProperties(): {[key: string]: string} {
    return {
      CurrentConnectionIDs: 'string',
      SinkProtocolInfo: 'string',
      SourceProtocolInfo: 'string',
    };
  }
}

// Generated responses
export interface GetCurrentConnectionIDsResponse {
  ConnectionIDs: string;
}

export interface GetCurrentConnectionInfoResponse {
  RcsID: number;
  AVTransportID: number;
  ProtocolInfo: string;
  PeerConnectionManager: string;
  PeerConnectionID: number;
  Direction: string;
  Status: string;
}

export interface GetProtocolInfoResponse {
  Source: string;
  Sink: string;
}

// Strong type event
export interface ConnectionManagerServiceEvent {
  CurrentConnectionIDs?: string;
  SinkProtocolInfo?: string;
  SourceProtocolInfo?: string;
}
