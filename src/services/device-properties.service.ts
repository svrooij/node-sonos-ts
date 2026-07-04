/**
 * Sonos DeviceProperties service
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
  AddBondedZones(input: { ChannelMapSet: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('AddBondedZones', input); }

  /**
   * Adds satellites and/or a sub woofer to a (main) player. The satellites become hidden. The main player RINCON_* is mandatory. RR: right - rear, LF: left - front, SW: subwoofer
   *
   * @param {string} input.HTSatChanMapSet - example: `RINCON_000PPP1400:LF,RF;RINCON_000RRR1400:RR;RINCON_000SSS1400:LR;RINCON_000QQQ1400:SW`
   * @remarks Not all speakers support satellites or sub woofer. Satellites should be of same type (e.g. Play:1)
   */
  AddHTSatellite(input: { HTSatChanMapSet: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('AddHTSatellite', input); }

  /**
   * Create a stereo pair (left, right speakers), right one becomes hidden
   *
   * @param {string} input.ChannelMapSet - example: `RINCON_B8E9375831C001400:LF,LF;RINCON_000E58FE3AEA01400:RF,RF`
   * @remarks Not all speakers support StereoPairs
   */
  CreateStereoPair(input: { ChannelMapSet: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('CreateStereoPair', input); }

  EnterConfigMode(input: { Mode: string; Options: string }):
  Promise<EnterConfigModeResponse> { return this.SoapRequestWithBody<typeof input, EnterConfigModeResponse>('EnterConfigMode', input); }

  ExitConfigMode(input: { Options: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('ExitConfigMode', input); }

  GetAutoplayLinkedZones(input: { Source: string }):
  Promise<GetAutoplayLinkedZonesResponse> { return this.SoapRequestWithBody<typeof input, GetAutoplayLinkedZonesResponse>('GetAutoplayLinkedZones', input); }

  GetAutoplayRoomUUID(input: { Source: string }):
  Promise<GetAutoplayRoomUUIDResponse> { return this.SoapRequestWithBody<typeof input, GetAutoplayRoomUUIDResponse>('GetAutoplayRoomUUID', input); }

  GetAutoplayVolume(input: { Source: string }):
  Promise<GetAutoplayVolumeResponse> { return this.SoapRequestWithBody<typeof input, GetAutoplayVolumeResponse>('GetAutoplayVolume', input); }

  /**
   * Get the current button lock state
   */
  GetButtonLockState():
  Promise<GetButtonLockStateResponse> { return this.SoapRequest<GetButtonLockStateResponse>('GetButtonLockState'); }

  GetButtonState():
  Promise<GetButtonStateResponse> { return this.SoapRequest<GetButtonStateResponse>('GetButtonState'); }

  GetHouseholdID():
  Promise<GetHouseholdIDResponse> { return this.SoapRequest<GetHouseholdIDResponse>('GetHouseholdID'); }

  GetHTForwardState():
  Promise<GetHTForwardStateResponse> { return this.SoapRequest<GetHTForwardStateResponse>('GetHTForwardState'); }

  /**
   * Get the current LED state
   */
  GetLEDState():
  Promise<GetLEDStateResponse> { return this.SoapRequest<GetLEDStateResponse>('GetLEDState'); }

  GetUseAutoplayVolume(input: { Source: string }):
  Promise<GetUseAutoplayVolumeResponse> { return this.SoapRequestWithBody<typeof input, GetUseAutoplayVolumeResponse>('GetUseAutoplayVolume', input); }

  GetZoneAttributes():
  Promise<GetZoneAttributesResponse> { return this.SoapRequest<GetZoneAttributesResponse>('GetZoneAttributes'); }

  /**
   * Get information about this specific speaker
   */
  GetZoneInfo():
  Promise<GetZoneInfoResponse> { return this.SoapRequest<GetZoneInfoResponse>('GetZoneInfo'); }

  RemoveBondedZones(input: { ChannelMapSet: string; KeepGrouped: boolean }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('RemoveBondedZones', input); }

  /**
   * Removes a satellite or a sub woofer from (main) player. The satellite becomes visible.
   *
   * @param {string} input.SatRoomUUID - example: `RINCON_000RRR1400`
   * @remarks Not all speakers support satellites or sub woofer. Multiples RINCON_* are not allowed.
   */
  RemoveHTSatellite(input: { SatRoomUUID: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('RemoveHTSatellite', input); }

  RoomDetectionStartChirping(input: { Channel: number; DurationMilliseconds: number; ChirpIfPlayingSwappableAudio: boolean }):
  Promise<RoomDetectionStartChirpingResponse> { return this.SoapRequestWithBody<typeof input, RoomDetectionStartChirpingResponse>('RoomDetectionStartChirping', input); }

  RoomDetectionStopChirping(input: { PlayId: number }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('RoomDetectionStopChirping', input); }

  /**
   * Separate a stereo pair
   *
   * @param {string} input.ChannelMapSet - example: `RINCON_B8E9375831C001400:LF,LF;RINCON_000E58FE3AEA01400:RF,RF`
   * @remarks Not all speakers support StereoPairs
   */
  SeparateStereoPair(input: { ChannelMapSet: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SeparateStereoPair', input); }

  SetAutoplayLinkedZones(input: { IncludeLinkedZones: boolean; Source: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetAutoplayLinkedZones', input); }

  SetAutoplayRoomUUID(input: { RoomUUID: string; Source: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetAutoplayRoomUUID', input); }

  SetAutoplayVolume(input: { Volume: number; Source: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetAutoplayVolume', input); }

  /**
   * Set the button lock state
   *
   * @param {string} input.DesiredButtonLockState [ 'On' / 'Off' ]
   */
  SetButtonLockState(input: { DesiredButtonLockState: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetButtonLockState', input); }

  /**
   * Set the LED state
   *
   * @param {string} input.DesiredLEDState [ 'On' / 'Off' ]
   */
  SetLEDState(input: { DesiredLEDState: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetLEDState', input); }

  SetUseAutoplayVolume(input: { UseVolume: boolean; Source: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetUseAutoplayVolume', input); }

  SetZoneAttributes(input: { DesiredZoneName: string; DesiredIcon: string; DesiredConfiguration: string; DesiredTargetRoomName: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetZoneAttributes', input); }
  // #endregion

  protected responseProperties(): { [key: string]: string } {
    return {
      State: 'string',
      IncludeLinkedZones: 'boolean',
      RoomUUID: 'string',
      CurrentVolume: 'number',
      CurrentButtonLockState: 'string',
      CurrentHouseholdID: 'string',
      IsHTForwardEnabled: 'boolean',
      CurrentLEDState: 'string',
      UseVolume: 'boolean',
      CurrentZoneName: 'string',
      CurrentIcon: 'string',
      CurrentConfiguration: 'string',
      CurrentTargetRoomName: 'string',
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
    };
  }

  // Event properties from service description.
  protected eventProperties(): { [key: string]: string } {
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
      EthLink: 'boolean',
      ExtraInfo: 'string',
      Flags: 'number',
      HardwareVersion: 'string',
      HasConfiguredSSID: 'boolean',
      HdmiCecAvailable: 'boolean',
      HouseholdID: 'string',
      HTAudioIn: 'number',
      HTBondedZoneCommitState: 'number',
      HTForwardEnabled: 'boolean',
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

export interface GetHTForwardStateResponse {
  IsHTForwardEnabled: boolean;
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
  CurrentTargetRoomName: string;
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
  EthLink?: boolean;
  ExtraInfo?: string;
  Flags?: number;
  HardwareVersion?: string;
  HasConfiguredSSID?: boolean;
  HdmiCecAvailable?: boolean;
  HouseholdID?: string;
  HTAudioIn?: number;
  HTBondedZoneCommitState?: number;
  HTForwardEnabled?: boolean;
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
