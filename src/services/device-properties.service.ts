/**
 * Sonos DeviceProperties service
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
 * Modify device properties, like LED status and stereo pairs
 *
 * @export
 * @class DevicePropertiesService
 * @extends {BaseService}
 */
export class DevicePropertiesService extends BaseService<DevicePropertiesServiceEvent> {
  readonly serviceNane: string = 'DeviceProperties';

  readonly controlUrl: string = '/DeviceProperties/Control';

  readonly eventSubUrl: string = '/DeviceProperties/Event';

  readonly scpUrl: string = '/xml/DeviceProperties1.xml';

  readonly errors: SonosUpnpError[] = SonosUpnpErrors.defaultErrors;

  // #region actions
  async AddBondedZones(input: { ChannelMapSet: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('AddBondedZones', input); }

  async AddHTSatellite(input: { HTSatChanMapSet: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('AddHTSatellite', input); }

  /**
   * Create a stereo pair (left, right speakers), right one becomes hidden
   *
   * @param {string} input.ChannelMapSet - example: `RINCON_B8E9375831C001400:LF,LF;RINCON_000E58FE3AEA01400:RF,RF`
   * @remarks No all speakers support StereoPairs
   */
  async CreateStereoPair(input: { ChannelMapSet: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('CreateStereoPair', input); }

  async EnterConfigMode(input: { Mode: string; Options: string }):
  Promise<EnterConfigModeResponse> { return await this.SoapRequestWithBody<typeof input, EnterConfigModeResponse>('EnterConfigMode', input); }

  async ExitConfigMode(input: { Options: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('ExitConfigMode', input); }

  async GetAutoplayLinkedZones(input: { Source: string }):
  Promise<GetAutoplayLinkedZonesResponse> { return await this.SoapRequestWithBody<typeof input, GetAutoplayLinkedZonesResponse>('GetAutoplayLinkedZones', input); }

  async GetAutoplayRoomUUID(input: { Source: string }):
  Promise<GetAutoplayRoomUUIDResponse> { return await this.SoapRequestWithBody<typeof input, GetAutoplayRoomUUIDResponse>('GetAutoplayRoomUUID', input); }

  async GetAutoplayVolume(input: { Source: string }):
  Promise<GetAutoplayVolumeResponse> { return await this.SoapRequestWithBody<typeof input, GetAutoplayVolumeResponse>('GetAutoplayVolume', input); }

  /**
   * Get the current button lock state
   */
  async GetButtonLockState():
  Promise<GetButtonLockStateResponse> { return await this.SoapRequest<GetButtonLockStateResponse>('GetButtonLockState'); }

  async GetButtonState():
  Promise<GetButtonStateResponse> { return await this.SoapRequest<GetButtonStateResponse>('GetButtonState'); }

  async GetHouseholdID():
  Promise<GetHouseholdIDResponse> { return await this.SoapRequest<GetHouseholdIDResponse>('GetHouseholdID'); }

  /**
   * Get the current LED state
   */
  async GetLEDState():
  Promise<GetLEDStateResponse> { return await this.SoapRequest<GetLEDStateResponse>('GetLEDState'); }

  async GetUseAutoplayVolume(input: { Source: string }):
  Promise<GetUseAutoplayVolumeResponse> { return await this.SoapRequestWithBody<typeof input, GetUseAutoplayVolumeResponse>('GetUseAutoplayVolume', input); }

  async GetZoneAttributes():
  Promise<GetZoneAttributesResponse> { return await this.SoapRequest<GetZoneAttributesResponse>('GetZoneAttributes'); }

  /**
   * Get information about this specific speaker
   */
  async GetZoneInfo():
  Promise<GetZoneInfoResponse> { return await this.SoapRequest<GetZoneInfoResponse>('GetZoneInfo'); }

  async RemoveBondedZones(input: { ChannelMapSet: string; KeepGrouped: boolean }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('RemoveBondedZones', input); }

  async RemoveHTSatellite(input: { SatRoomUUID: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('RemoveHTSatellite', input); }

  async RoomDetectionStartChirping(input: { Channel: number; DurationMilliseconds: number }):
  Promise<RoomDetectionStartChirpingResponse> { return await this.SoapRequestWithBody<typeof input, RoomDetectionStartChirpingResponse>('RoomDetectionStartChirping', input); }

  async RoomDetectionStopChirping(input: { PlayId: number }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('RoomDetectionStopChirping', input); }

  /**
   * Separate a stereo pair
   *
   * @param {string} input.ChannelMapSet - example: `RINCON_B8E9375831C001400:LF,LF;RINCON_000E58FE3AEA01400:RF,RF`
   * @remarks No all speakers support StereoPairs
   */
  async SeparateStereoPair(input: { ChannelMapSet: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SeparateStereoPair', input); }

  async SetAutoplayLinkedZones(input: { IncludeLinkedZones: boolean; Source: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetAutoplayLinkedZones', input); }

  async SetAutoplayRoomUUID(input: { RoomUUID: string; Source: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetAutoplayRoomUUID', input); }

  async SetAutoplayVolume(input: { Volume: number; Source: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetAutoplayVolume', input); }

  /**
   * Set the button lock state
   *
   * @param {string} input.DesiredButtonLockState [ 'On' / 'Off' ]
   */
  async SetButtonLockState(input: { DesiredButtonLockState: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetButtonLockState', input); }

  /**
   * Set the LED state
   *
   * @param {string} input.DesiredLEDState [ 'On' / 'Off' ]
   */
  async SetLEDState(input: { DesiredLEDState: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetLEDState', input); }

  async SetUseAutoplayVolume(input: { UseVolume: boolean; Source: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetUseAutoplayVolume', input); }

  async SetZoneAttributes(input: { DesiredZoneName: string; DesiredIcon: string; DesiredConfiguration: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetZoneAttributes', input); }
  // #endregion

  protected responseProperties(): {[key: string]: string} {
    return {
      State: 'string',
      IncludeLinkedZones: 'boolean',
      RoomUUID: 'string',
      CurrentVolume: 'number',
      CurrentButtonLockState: 'string',
      CurrentHouseholdID: 'string',
      CurrentLEDState: 'string',
      UseVolume: 'boolean',
      CurrentZoneName: 'string',
      CurrentIcon: 'string',
      CurrentConfiguration: 'string',
      SerialNumber: 'string',
      SoftwareVersion: 'string',
      DisplaySoftwareVersion: 'string',
      HardwareVersion: 'string',
      IPAddress: 'string',
      MACAddress: 'string',
      CopyrightInfo: 'string',
      ExtraInfo: 'string',
      HTAudioIn: 'number',
      Flags: 'number',
      PlayId: 'number',
      ChirpIfPlayingSwappableAudio: 'boolean',
    };
  }

  // Event properties from service description.
  protected eventProperties(): {[key: string]: string} {
    return {
      AirPlayEnabled: 'boolean',
      AutoplayIncludeLinkedZones: 'boolean',
      AutoplayRoomUUID: 'string',
      AutoplaySource: 'string',
      AutoplayUseVolume: 'boolean',
      AutoplayVolume: 'number',
      AvailableRoomCalibration: 'string',
      BehindWifiExtender: 'number',
      ButtonLockState: 'string',
      ChannelFreq: 'number',
      ChannelMapSet: 'string',
      ConfigMode: 'string',
      Configuration: 'string',
      CopyrightInfo: 'string',
      DisplaySoftwareVersion: 'string',
      ExtraInfo: 'string',
      Flags: 'number',
      HardwareVersion: 'string',
      HasConfiguredSSID: 'boolean',
      HdmiCecAvailable: 'boolean',
      HouseholdID: 'string',
      HTAudioIn: 'number',
      HTBondedZoneCommitState: 'number',
      HTFreq: 'number',
      HTSatChanMapSet: 'string',
      Icon: 'string',
      Invisible: 'boolean',
      IPAddress: 'string',
      IsIdle: 'boolean',
      IsZoneBridge: 'boolean',
      KeepGrouped: 'boolean',
      LastChangedPlayState: 'string',
      LEDState: 'string',
      MACAddress: 'string',
      MicEnabled: 'number',
      MoreInfo: 'string',
      Orientation: 'number',
      RoomCalibrationState: 'number',
      SatRoomUUID: 'string',
      SecureRegState: 'number',
      SerialNumber: 'string',
      SettingsReplicationState: 'string',
      SoftwareVersion: 'string',
      SupportsAudioClip: 'boolean',
      SupportsAudioIn: 'boolean',
      TargetRoomName: 'string',
      TVConfigurationError: 'boolean',
      VoiceConfigState: 'number',
      WifiEnabled: 'boolean',
      WirelessLeafOnly: 'boolean',
      WirelessMode: 'number',
      ZoneName: 'string',
    };
  }
}

// Generated responses
export interface EnterConfigModeResponse {
  State: string;
}

export interface GetAutoplayLinkedZonesResponse {
  IncludeLinkedZones: boolean;
}

export interface GetAutoplayRoomUUIDResponse {
  RoomUUID: string;
}

export interface GetAutoplayVolumeResponse {
  CurrentVolume: number;
}

export interface GetButtonLockStateResponse {
  CurrentButtonLockState: string;
}

export interface GetButtonStateResponse {
  State: string;
}

export interface GetHouseholdIDResponse {
  CurrentHouseholdID: string;
}

export interface GetLEDStateResponse {
  CurrentLEDState: string;
}

export interface GetUseAutoplayVolumeResponse {
  UseVolume: boolean;
}

export interface GetZoneAttributesResponse {
  CurrentZoneName: string;
  CurrentIcon: string;
  CurrentConfiguration: string;
}

export interface GetZoneInfoResponse {
  SerialNumber: string;
  SoftwareVersion: string;
  DisplaySoftwareVersion: string;
  HardwareVersion: string;
  IPAddress: string;
  MACAddress: string;
  CopyrightInfo: string;
  ExtraInfo: string;
  HTAudioIn: number;
  Flags: number;
}

export interface RoomDetectionStartChirpingResponse {
  PlayId: number;
  ChirpIfPlayingSwappableAudio: boolean;
}

// Strong type event
export interface DevicePropertiesServiceEvent {
  AirPlayEnabled?: boolean;
  AutoplayIncludeLinkedZones?: boolean;
  AutoplayRoomUUID?: string;
  AutoplaySource?: string;
  AutoplayUseVolume?: boolean;
  AutoplayVolume?: number;
  AvailableRoomCalibration?: string;
  BehindWifiExtender?: number;
  ButtonLockState?: string;
  ChannelFreq?: number;
  ChannelMapSet?: string;
  ConfigMode?: string;
  Configuration?: string;
  CopyrightInfo?: string;
  DisplaySoftwareVersion?: string;
  ExtraInfo?: string;
  Flags?: number;
  HardwareVersion?: string;
  HasConfiguredSSID?: boolean;
  HdmiCecAvailable?: boolean;
  HouseholdID?: string;
  HTAudioIn?: number;
  HTBondedZoneCommitState?: number;
  HTFreq?: number;
  HTSatChanMapSet?: string;
  Icon?: string;
  Invisible?: boolean;
  IPAddress?: string;
  IsIdle?: boolean;
  IsZoneBridge?: boolean;
  KeepGrouped?: boolean;
  LastChangedPlayState?: string;
  LEDState?: string;
  MACAddress?: string;
  MicEnabled?: number;
  MoreInfo?: string;
  Orientation?: number;
  RoomCalibrationState?: number;
  SatRoomUUID?: string;
  SecureRegState?: number;
  SerialNumber?: string;
  SettingsReplicationState?: string;
  SoftwareVersion?: string;
  SupportsAudioClip?: boolean;
  SupportsAudioIn?: boolean;
  TargetRoomName?: string;
  TVConfigurationError?: boolean;
  VoiceConfigState?: number;
  WifiEnabled?: boolean;
  WirelessLeafOnly?: boolean;
  WirelessMode?: number;
  ZoneName?: string;
}
