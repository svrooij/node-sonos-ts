/**
 * Sonos RenderingControl service
 *
 * Stephan van Rooij
 * https://svrooij.io
 *
 * This file is generated, do not edit manually. https://sonos.svrooij.io/
 */
import BaseService from './base-service';
import { SonosUpnpError } from '../models/sonos-upnp-error';
import SonosUpnpErrors from './sonos-upnp-errors';
import {
  ChannelValue,
} from '../models';

/**
 * Volume related controls
 *
 * @export
 * @class RenderingControlServiceBase
 * @extends {BaseService}
 */
export class RenderingControlServiceBase extends BaseService<RenderingControlServiceEvent> {
  readonly serviceNane: string = 'RenderingControl';

  readonly controlUrl: string = '/MediaRenderer/RenderingControl/Control';

  readonly eventSubUrl: string = '/MediaRenderer/RenderingControl/Event';

  readonly scpUrl: string = '/xml/RenderingControl1.xml';

  readonly errors: SonosUpnpError[] = SonosUpnpErrors.defaultErrors;

  // #region actions
  /**
   * Get bass level between -10 and 10
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   */
  GetBass(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<GetBassResponse> { return this.SoapRequestWithBody<typeof input, GetBassResponse>('GetBass', input); }

  /**
   * Get equalizer value
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {string} input.EQType - Allowed values `DialogLevel` (bool) / `MusicSurroundLevel` (-15/+15) /  `NightMode` (bool) / `SubGain` (-10/+10) / `SurroundEnable` (bool) / `SurroundLevel` (-15/+15) / `SurroundMode` (0 = ambient, 1 = full) / `HeightChannelLevel` (-10/+10)
   * @remarks Not all EQ types are available on every speaker
   */
  GetEQ(input: { InstanceID: number; EQType: string }):
  Promise<GetEQResponse> { return this.SoapRequestWithBody<typeof input, GetEQResponse>('GetEQ', input); }

  GetHeadphoneConnected(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<GetHeadphoneConnectedResponse> { return this.SoapRequestWithBody<typeof input, GetHeadphoneConnectedResponse>('GetHeadphoneConnected', input); }

  /**
   * Whether or not Loudness is on
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {string} input.Channel [ 'Master' / 'LF' / 'RF' ]
   */
  GetLoudness(input: { InstanceID: number; Channel: string }):
  Promise<GetLoudnessResponse> { return this.SoapRequestWithBody<typeof input, GetLoudnessResponse>('GetLoudness', input); }

  GetMute(input: { InstanceID: number; Channel: string }):
  Promise<GetMuteResponse> { return this.SoapRequestWithBody<typeof input, GetMuteResponse>('GetMute', input); }

  GetOutputFixed(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<GetOutputFixedResponse> { return this.SoapRequestWithBody<typeof input, GetOutputFixedResponse>('GetOutputFixed', input); }

  GetRoomCalibrationStatus(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<GetRoomCalibrationStatusResponse> { return this.SoapRequestWithBody<typeof input, GetRoomCalibrationStatusResponse>('GetRoomCalibrationStatus', input); }

  GetSupportsOutputFixed(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<GetSupportsOutputFixedResponse> { return this.SoapRequestWithBody<typeof input, GetSupportsOutputFixedResponse>('GetSupportsOutputFixed', input); }

  /**
   * Get treble
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   */
  GetTreble(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<GetTrebleResponse> { return this.SoapRequestWithBody<typeof input, GetTrebleResponse>('GetTreble', input); }

  /**
   * Get volume
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {string} input.Channel [ 'Master' / 'LF' / 'RF' ]
   */
  GetVolume(input: { InstanceID: number; Channel: string }):
  Promise<GetVolumeResponse> { return this.SoapRequestWithBody<typeof input, GetVolumeResponse>('GetVolume', input); }

  GetVolumeDB(input: { InstanceID: number; Channel: string }):
  Promise<GetVolumeDBResponse> { return this.SoapRequestWithBody<typeof input, GetVolumeDBResponse>('GetVolumeDB', input); }

  GetVolumeDBRange(input: { InstanceID: number; Channel: string }):
  Promise<GetVolumeDBRangeResponse> { return this.SoapRequestWithBody<typeof input, GetVolumeDBRangeResponse>('GetVolumeDBRange', input); }

  RampToVolume(input: { InstanceID: number; Channel: string; RampType: string; DesiredVolume: number; ResetVolumeAfter: boolean; ProgramURI: string }):
  Promise<RampToVolumeResponse> { return this.SoapRequestWithBody<typeof input, RampToVolumeResponse>('RampToVolume', input); }

  ResetBasicEQ(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<ResetBasicEQResponse> { return this.SoapRequestWithBody<typeof input, ResetBasicEQResponse>('ResetBasicEQ', input); }

  ResetExtEQ(input: { InstanceID: number; EQType: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('ResetExtEQ', input); }

  RestoreVolumePriorToRamp(input: { InstanceID: number; Channel: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('RestoreVolumePriorToRamp', input); }

  /**
   * Set bass level, between -10 and 10
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {number} input.DesiredBass
   */
  SetBass(input: { InstanceID: number; DesiredBass: number }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetBass', input); }

  SetChannelMap(input: { InstanceID: number; ChannelMap: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetChannelMap', input); }

  /**
   * Set equalizer value for different types
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {string} input.EQType - Allowed values `DialogLevel` (bool) / `MusicSurroundLevel` (-15/+15) /  `NightMode` (bool) / `SubGain` (-10/+10) / `SurroundEnable` (bool) / `SurroundLevel` (-15/+15) / `SurroundMode` (0 = ambient, 1 = full) / `HeightChannelLevel` (-10/+10)
   * @param {number} input.DesiredValue - Booleans required `1` for true or `0` for false, rest number as specified
   * @remarks Not supported by all speakers, TV related
   */
  SetEQ(input: { InstanceID: number; EQType: string; DesiredValue: number }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetEQ', input); }

  /**
   * Set loudness on / off
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {string} input.Channel [ 'Master' / 'LF' / 'RF' ]
   * @param {boolean} input.DesiredLoudness
   */
  SetLoudness(input: { InstanceID: number; Channel: string; DesiredLoudness: boolean }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetLoudness', input); }

  SetMute(input: { InstanceID: number; Channel: string; DesiredMute: boolean }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetMute', input); }

  SetOutputFixed(input: { InstanceID: number; DesiredFixed: boolean }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetOutputFixed', input); }

  SetRelativeVolume(input: { InstanceID: number; Channel: string; Adjustment: number }):
  Promise<SetRelativeVolumeResponse> { return this.SoapRequestWithBody<typeof input, SetRelativeVolumeResponse>('SetRelativeVolume', input); }

  SetRoomCalibrationStatus(input: { InstanceID: number; RoomCalibrationEnabled: boolean }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetRoomCalibrationStatus', input); }

  SetRoomCalibrationX(input: { InstanceID: number; CalibrationID: string; Coefficients: string; CalibrationMode: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetRoomCalibrationX', input); }

  /**
   * Set treble level
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {number} input.DesiredTreble - between -10 and 10
   */
  SetTreble(input: { InstanceID: number; DesiredTreble: number }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetTreble', input); }

  SetVolume(input: { InstanceID: number; Channel: string; DesiredVolume: number }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetVolume', input); }

  SetVolumeDB(input: { InstanceID: number; Channel: string; DesiredVolume: number }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetVolumeDB', input); }
  // #endregion

  protected responseProperties(): { [key: string]: string } {
    return {
      CurrentBass: 'number',
      CurrentValue: 'number',
      CurrentHeadphoneConnected: 'boolean',
      CurrentLoudness: 'boolean',
      CurrentMute: 'boolean',
      CurrentFixed: 'boolean',
      RoomCalibrationEnabled: 'boolean',
      RoomCalibrationAvailable: 'boolean',
      CurrentSupportsFixed: 'boolean',
      CurrentTreble: 'number',
      CurrentVolume: 'number',
      MinValue: 'number',
      MaxValue: 'number',
      RampTime: 'number',
      Bass: 'number',
      Treble: 'number',
      Loudness: 'boolean',
      LeftVolume: 'number',
      RightVolume: 'number',
      NewVolume: 'number',
    };
  }

  // Event properties from service description.
  protected eventProperties(): { [key: string]: string } {
    return {
      AudioDelay: 'string',
      AudioDelayLeftRear: 'string',
      AudioDelayRightRear: 'string',
      Bass: 'number',
      DialogLevel: 'string',
      EQValue: 'number',
      HeadphoneConnected: 'boolean',
      HeightChannelLevel: 'number',
      LastChange: 'string',
      Loudness: 'boolean',
      MusicSurroundLevel: 'string',
      Mute: 'ChannelValue<boolean>',
      NightMode: 'boolean',
      OutputFixed: 'boolean',
      PresetNameList: 'string',
      RoomCalibrationAvailable: 'boolean',
      RoomCalibrationCalibrationMode: 'string',
      RoomCalibrationCoefficients: 'string',
      RoomCalibrationEnabled: 'boolean',
      RoomCalibrationID: 'string',
      SpeakerSize: 'number',
      SubCrossover: 'string',
      SubEnabled: 'boolean',
      SubGain: 'string',
      SubPolarity: 'string',
      SupportsOutputFixed: 'boolean',
      SurroundEnabled: 'boolean',
      SurroundLevel: 'string',
      SurroundMode: 'string',
      Treble: 'number',
      Volume: 'ChannelValue<number>',
      VolumeDB: 'number',
    };
  }
}

// Generated responses
export interface GetBassResponse {
  CurrentBass: number;
}

export interface GetEQResponse {
  CurrentValue: number;
}

export interface GetHeadphoneConnectedResponse {
  CurrentHeadphoneConnected: boolean;
}

export interface GetLoudnessResponse {
  CurrentLoudness: boolean;
}

export interface GetMuteResponse {
  CurrentMute: boolean;
}

export interface GetOutputFixedResponse {
  CurrentFixed: boolean;
}

export interface GetRoomCalibrationStatusResponse {
  RoomCalibrationEnabled: boolean;
  RoomCalibrationAvailable: boolean;
}

export interface GetSupportsOutputFixedResponse {
  CurrentSupportsFixed: boolean;
}

export interface GetTrebleResponse {
  CurrentTreble: number;
}

export interface GetVolumeResponse {
  CurrentVolume: number;
}

export interface GetVolumeDBResponse {
  CurrentVolume: number;
}

export interface GetVolumeDBRangeResponse {
  MinValue: number;
  MaxValue: number;
}

export interface RampToVolumeResponse {
  RampTime: number;
}

export interface ResetBasicEQResponse {
  Bass: number;
  Treble: number;
  Loudness: boolean;
  LeftVolume: number;
  RightVolume: number;
}

export interface SetRelativeVolumeResponse {
  NewVolume: number;
}

// Strong type event
export interface RenderingControlServiceEvent {
  AudioDelay?: string;
  AudioDelayLeftRear?: string;
  AudioDelayRightRear?: string;
  Bass?: number;
  DialogLevel?: string;
  EQValue?: number;
  HeadphoneConnected?: boolean;
  HeightChannelLevel?: number;
  LastChange?: string;
  Loudness?: boolean;
  MusicSurroundLevel?: string;
  Mute?: ChannelValue<boolean>;
  NightMode?: boolean;
  OutputFixed?: boolean;
  PresetNameList?: string;
  RoomCalibrationAvailable?: boolean;
  RoomCalibrationCalibrationMode?: string;
  RoomCalibrationCoefficients?: string;
  RoomCalibrationEnabled?: boolean;
  RoomCalibrationID?: string;
  SpeakerSize?: number;
  SubCrossover?: string;
  SubEnabled?: boolean;
  SubGain?: string;
  SubPolarity?: string;
  SupportsOutputFixed?: boolean;
  SurroundEnabled?: boolean;
  SurroundLevel?: string;
  SurroundMode?: string;
  Treble?: number;
  Volume?: ChannelValue<number>;
  VolumeDB?: number;
}
