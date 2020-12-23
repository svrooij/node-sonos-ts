/**
 * Sonos VirtualLineInService
 *
 * Stephan van Rooij
 * https://svrooij.io
 *
 * This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 */
import BaseService from './base-service';
import { SonosUpnpError } from '../models/sonos-upnp-error';
import SonosUpnpErrors from './sonos-upnp-errors';
import {
  Track,
} from '../models';

export class VirtualLineInService extends BaseService<VirtualLineInServiceEvent> {
  readonly serviceNane: string = 'VirtualLineIn';

  readonly controlUrl: string = '/MediaRenderer/VirtualLineIn/Control';

  readonly eventSubUrl: string = '/MediaRenderer/VirtualLineIn/Event';

  readonly scpUrl: string = '/xml/VirtualLineIn1.xml';

  readonly errors: SonosUpnpError[] = SonosUpnpErrors.defaultErrors;

  // #region actions
  async Next(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('Next', input); }

  async Pause(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('Pause', input); }

  async Play(input: { InstanceID: number; Speed: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('Play', input); }

  async Previous(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('Previous', input); }

  async SetVolume(input: { InstanceID: number; DesiredVolume: number }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetVolume', input); }

  async StartTransmission(input: { InstanceID: number; CoordinatorID: string }):
  Promise<StartTransmissionResponse> { return await this.SoapRequestWithBody<typeof input, StartTransmissionResponse>('StartTransmission', input); }

  async Stop(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('Stop', input); }

  async StopTransmission(input: { InstanceID: number; CoordinatorID: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('StopTransmission', input); }
  // #endregion

  protected responseProperties(): {[key: string]: string} {
    return {
      CurrentTransportSettings: 'string',
    };
  }

  // Event properties from service description.
  protected eventProperties(): {[key: string]: string} {
    return {
      AVTransportURIMetaData: 'Track | string',
      CurrentTrackMetaData: 'Track | string',
      CurrentTransportActions: 'string',
      EnqueuedTransportURIMetaData: 'Track | string',
      LastChange: 'string',
    };
  }
}

// Generated responses
export interface StartTransmissionResponse {
  CurrentTransportSettings: string;
}

// Strong type event
export interface VirtualLineInServiceEvent {
  AVTransportURIMetaData?: Track | string;
  CurrentTrackMetaData?: Track | string;
  CurrentTransportActions?: string;
  EnqueuedTransportURIMetaData?: Track | string;
  LastChange?: string;
}
