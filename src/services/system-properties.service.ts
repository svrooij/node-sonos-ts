/**
 * Sonos SystemProperties service
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
 * Manage system-wide settings, mainly account stuff
 *
 * @export
 * @class SystemPropertiesServiceBase
 * @extends {BaseService}
 */
export class SystemPropertiesServiceBase extends BaseService<SystemPropertiesServiceEvent> {
  readonly serviceNane: string = 'SystemProperties';

  readonly controlUrl: string = '/SystemProperties/Control';

  readonly eventSubUrl: string = '/SystemProperties/Event';

  readonly scpUrl: string = '/xml/SystemProperties1.xml';

  readonly errors: SonosUpnpError[] = SonosUpnpErrors.defaultErrors;

  // #region actions
  async AddAccountX(input: { AccountType: number; AccountID: string; AccountPassword: string }):
  Promise<AddAccountXResponse> { return await this.SoapRequestWithBody<typeof input, AddAccountXResponse>('AddAccountX', input); }

  async AddOAuthAccountX(input: { AccountType: number; AccountToken: string; AccountKey: string; OAuthDeviceID: string; AuthorizationCode: string; RedirectURI: string; UserIdHashCode: string; AccountTier: number }):
  Promise<AddOAuthAccountXResponse> { return await this.SoapRequestWithBody<typeof input, AddOAuthAccountXResponse>('AddOAuthAccountX', input); }

  async DoPostUpdateTasks():
  Promise<boolean> { return await this.SoapRequestNoResponse('DoPostUpdateTasks'); }

  async EditAccountMd(input: { AccountType: number; AccountID: string; NewAccountMd: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('EditAccountMd', input); }

  async EditAccountPasswordX(input: { AccountType: number; AccountID: string; NewAccountPassword: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('EditAccountPasswordX', input); }

  async EnableRDM(input: { RDMValue: boolean }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('EnableRDM', input); }

  async GetRDM():
  Promise<GetRDMResponse> { return await this.SoapRequest<GetRDMResponse>('GetRDM'); }

  /**
   * Get a saved string.
   *
   * @param {string} input.VariableName - The key for this variable
   * @remarks Strings are saved in the system with SetString, every speaker should return the same data. Will error when not existing
   */
  async GetString(input: { VariableName: string }):
  Promise<GetStringResponse> { return await this.SoapRequestWithBody<typeof input, GetStringResponse>('GetString', input); }

  async GetWebCode(input: { AccountType: number }):
  Promise<GetWebCodeResponse> { return await this.SoapRequestWithBody<typeof input, GetWebCodeResponse>('GetWebCode', input); }

  async ProvisionCredentialedTrialAccountX(input: { AccountType: number; AccountID: string; AccountPassword: string }):
  Promise<ProvisionCredentialedTrialAccountXResponse> { return await this.SoapRequestWithBody<typeof input, ProvisionCredentialedTrialAccountXResponse>('ProvisionCredentialedTrialAccountX', input); }

  async RefreshAccountCredentialsX(input: { AccountType: number; AccountUID: number; AccountToken: string; AccountKey: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('RefreshAccountCredentialsX', input); }

  /**
   * Remove a saved string
   *
   * @param {string} input.VariableName - The key for this variable
   * @remarks Not sure what happens if you call this with a VariableName that doesn't exists.
   */
  async Remove(input: { VariableName: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('Remove', input); }

  async RemoveAccount(input: { AccountType: number; AccountID: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('RemoveAccount', input); }

  async ReplaceAccountX(input: { AccountUDN: string; NewAccountID: string; NewAccountPassword: string; AccountToken: string; AccountKey: string; OAuthDeviceID: string }):
  Promise<ReplaceAccountXResponse> { return await this.SoapRequestWithBody<typeof input, ReplaceAccountXResponse>('ReplaceAccountX', input); }

  async ResetThirdPartyCredentials():
  Promise<boolean> { return await this.SoapRequestNoResponse('ResetThirdPartyCredentials'); }

  async SetAccountNicknameX(input: { AccountUDN: string; AccountNickname: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetAccountNicknameX', input); }

  /**
   * Save a string in the system
   *
   * @param {string} input.VariableName - The key for this variable, use something unique
   * @param {string} input.StringValue
   * @remarks Strings are saved in the system, retrieve values with GetString.
   */
  async SetString(input: { VariableName: string; StringValue: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetString', input); }
  // #endregion

  protected responseProperties(): { [key: string]: string } {
    return {
      AccountUDN: 'string',
      AccountNickname: 'string',
      RDMValue: 'boolean',
      StringValue: 'string',
      WebCode: 'string',
      IsExpired: 'boolean',
      NewAccountUDN: 'string',
    };
  }

  // Event properties from service description.
  protected eventProperties(): { [key: string]: string } {
    return {
      CustomerID: 'string',
      ThirdPartyHash: 'string',
      UpdateID: 'number',
      UpdateIDX: 'number',
      VoiceUpdateID: 'number',
    };
  }
}

// Generated responses
export interface AddAccountXResponse {
  AccountUDN: string;
}

export interface AddOAuthAccountXResponse {
  AccountUDN: string;
  AccountNickname: string;
}

export interface GetRDMResponse {
  RDMValue: boolean;
}

export interface GetStringResponse {
  StringValue: string;
}

export interface GetWebCodeResponse {
  WebCode: string;
}

export interface ProvisionCredentialedTrialAccountXResponse {
  IsExpired: boolean;
  AccountUDN: string;
}

export interface ReplaceAccountXResponse {
  NewAccountUDN: string;
}

// Strong type event
export interface SystemPropertiesServiceEvent {
  CustomerID?: string;
  ThirdPartyHash?: string;
  UpdateID?: number;
  UpdateIDX?: number;
  VoiceUpdateID?: number;
}
