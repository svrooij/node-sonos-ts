/**
 * Sonos HTControl service
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
 * Service related to the TV remote control
 *
 * @export
 * @class HTControlService
 * @extends {BaseService}
 */
export class HTControlService extends BaseService<HTControlServiceEvent> {
  readonly serviceNane: string = 'HTControl';

  readonly controlUrl: string = '/HTControl/Control';

  readonly eventSubUrl: string = '/HTControl/Event';

  readonly scpUrl: string = '/xml/HTControl1.xml';

  readonly errors: SonosUpnpError[] = SonosUpnpErrors.defaultErrors;

  // #region actions
  CommitLearnedIRCodes(input: { Name: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('CommitLearnedIRCodes', input); }

  GetIRRepeaterState():
  Promise<GetIRRepeaterStateResponse> { return this.SoapRequest<GetIRRepeaterStateResponse>('GetIRRepeaterState'); }

  GetLEDFeedbackState():
  Promise<GetLEDFeedbackStateResponse> { return this.SoapRequest<GetLEDFeedbackStateResponse>('GetLEDFeedbackState'); }

  IdentifyIRRemote(input: { Timeout: number }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('IdentifyIRRemote', input); }

  IsRemoteConfigured():
  Promise<IsRemoteConfiguredResponse> { return this.SoapRequest<IsRemoteConfiguredResponse>('IsRemoteConfigured'); }

  LearnIRCode(input: { IRCode: string; Timeout: number }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('LearnIRCode', input); }

  SetIRRepeaterState(input: { DesiredIRRepeaterState: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetIRRepeaterState', input); }

  SetLEDFeedbackState(input: { LEDFeedbackState: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetLEDFeedbackState', input); }
  // #endregion

  protected responseProperties(): { [key: string]: string } {
    return {
      CurrentIRRepeaterState: 'string',
      LEDFeedbackState: 'string',
      RemoteConfigured: 'boolean',
    };
  }

  // Event properties from service description.
  protected eventProperties(): { [key: string]: string } {
    return {
      IRRepeaterState: 'string',
      LEDFeedbackState: 'string',
      RemoteConfigured: 'boolean',
      TOSLinkConnected: 'boolean',
    };
  }
}

// Generated responses
export interface GetIRRepeaterStateResponse {
  CurrentIRRepeaterState: string;
}

export interface GetLEDFeedbackStateResponse {
  LEDFeedbackState: string;
}

export interface IsRemoteConfiguredResponse {
  RemoteConfigured: boolean;
}

// Strong type event
export interface HTControlServiceEvent {
  IRRepeaterState?: string;
  LEDFeedbackState?: string;
  RemoteConfigured?: boolean;
  TOSLinkConnected?: boolean;
}
