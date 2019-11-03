// Auto-generated on Sun Nov 03 2019 16:33:10 GMT+0100 (Central European Standard Time)
import { BaseService } from './base-service';

export class RenderingControlService extends BaseService {
  readonly serviceNane: string = 'RenderingControl';
  readonly controlUrl: string = '/MediaRenderer/RenderingControl/Control';  
  readonly eventSubUrl: string = '/MediaRenderer/RenderingControl/Event';
  readonly scpUrl: string = '/xml/RenderingControl1.xml';
  

  // Actions
  GetBass(input: { InstanceID: number } = { InstanceID: 0 }): Promise<GetBassResponse> { return this.SoapRequestWithBody<typeof input, GetBassResponse>('GetBass', input); }
  GetEQ(input: { InstanceID: number, EQType: string }): Promise<GetEQResponse> { return this.SoapRequestWithBody<typeof input, GetEQResponse>('GetEQ', input); }
  GetHeadphoneConnected(input: { InstanceID: number } = { InstanceID: 0 }): Promise<GetHeadphoneConnectedResponse> { return this.SoapRequestWithBody<typeof input, GetHeadphoneConnectedResponse>('GetHeadphoneConnected', input); }
  GetLoudness(input: { InstanceID: number, Channel: string }): Promise<GetLoudnessResponse> { return this.SoapRequestWithBody<typeof input, GetLoudnessResponse>('GetLoudness', input); }
  GetMute(input: { InstanceID: number, Channel: string }): Promise<GetMuteResponse> { return this.SoapRequestWithBody<typeof input, GetMuteResponse>('GetMute', input); }
  GetOutputFixed(input: { InstanceID: number } = { InstanceID: 0 }): Promise<GetOutputFixedResponse> { return this.SoapRequestWithBody<typeof input, GetOutputFixedResponse>('GetOutputFixed', input); }
  GetRoomCalibrationStatus(input: { InstanceID: number } = { InstanceID: 0 }): Promise<GetRoomCalibrationStatusResponse> { return this.SoapRequestWithBody<typeof input, GetRoomCalibrationStatusResponse>('GetRoomCalibrationStatus', input); }
  GetSupportsOutputFixed(input: { InstanceID: number } = { InstanceID: 0 }): Promise<GetSupportsOutputFixedResponse> { return this.SoapRequestWithBody<typeof input, GetSupportsOutputFixedResponse>('GetSupportsOutputFixed', input); }
  GetTreble(input: { InstanceID: number } = { InstanceID: 0 }): Promise<GetTrebleResponse> { return this.SoapRequestWithBody<typeof input, GetTrebleResponse>('GetTreble', input); }
  GetVolume(input: { InstanceID: number, Channel: string }): Promise<GetVolumeResponse> { return this.SoapRequestWithBody<typeof input, GetVolumeResponse>('GetVolume', input); }
  GetVolumeDB(input: { InstanceID: number, Channel: string }): Promise<GetVolumeDBResponse> { return this.SoapRequestWithBody<typeof input, GetVolumeDBResponse>('GetVolumeDB', input); }
  GetVolumeDBRange(input: { InstanceID: number, Channel: string }): Promise<GetVolumeDBRangeResponse> { return this.SoapRequestWithBody<typeof input, GetVolumeDBRangeResponse>('GetVolumeDBRange', input); }
  RampToVolume(input: { InstanceID: number, Channel: string, RampType: string, DesiredVolume: number, ResetVolumeAfter: boolean, ProgramURI: string }): Promise<RampToVolumeResponse> { return this.SoapRequestWithBody<typeof input, RampToVolumeResponse>('RampToVolume', input); }
  ResetBasicEQ(input: { InstanceID: number } = { InstanceID: 0 }): Promise<ResetBasicEQResponse> { return this.SoapRequestWithBody<typeof input, ResetBasicEQResponse>('ResetBasicEQ', input); }
  ResetExtEQ(input: { InstanceID: number, EQType: string }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('ResetExtEQ', input); }
  RestoreVolumePriorToRamp(input: { InstanceID: number, Channel: string }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('RestoreVolumePriorToRamp', input); }
  SetBass(input: { InstanceID: number, DesiredBass: number }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetBass', input); }
  SetChannelMap(input: { InstanceID: number, ChannelMap: string }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetChannelMap', input); }
  SetEQ(input: { InstanceID: number, EQType: string, DesiredValue: number }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetEQ', input); }
  SetLoudness(input: { InstanceID: number, Channel: string, DesiredLoudness: boolean }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetLoudness', input); }
  SetMute(input: { InstanceID: number, Channel: string, DesiredMute: boolean }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetMute', input); }
  SetOutputFixed(input: { InstanceID: number, DesiredFixed: boolean }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetOutputFixed', input); }
  SetRelativeVolume(input: { InstanceID: number, Channel: string, Adjustment: number }): Promise<SetRelativeVolumeResponse> { return this.SoapRequestWithBody<typeof input, SetRelativeVolumeResponse>('SetRelativeVolume', input); }
  SetRoomCalibrationStatus(input: { InstanceID: number, RoomCalibrationEnabled: boolean }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetRoomCalibrationStatus', input); }
  SetRoomCalibrationX(input: { InstanceID: number, CalibrationID: string, Coefficients: string, CalibrationMode: string }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetRoomCalibrationX', input); }
  SetTreble(input: { InstanceID: number, DesiredTreble: number }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetTreble', input); }
  SetVolume(input: { InstanceID: number, Channel: string, DesiredVolume: number }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetVolume', input); }
  SetVolumeDB(input: { InstanceID: number, Channel: string, DesiredVolume: number }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetVolumeDB', input); }
}

// Response classes
export interface GetBassResponse {
  CurrentBass: number
}

export interface GetEQResponse {
  CurrentValue: number
}

export interface GetHeadphoneConnectedResponse {
  CurrentHeadphoneConnected: boolean
}

export interface GetLoudnessResponse {
  CurrentLoudness: boolean
}

export interface GetMuteResponse {
  CurrentMute: boolean
}

export interface GetOutputFixedResponse {
  CurrentFixed: boolean
}

export interface GetRoomCalibrationStatusResponse {
  RoomCalibrationEnabled: boolean,
  RoomCalibrationAvailable: boolean
}

export interface GetSupportsOutputFixedResponse {
  CurrentSupportsFixed: boolean
}

export interface GetTrebleResponse {
  CurrentTreble: number
}

export interface GetVolumeResponse {
  CurrentVolume: number
}

export interface GetVolumeDBResponse {
  CurrentVolume: number
}

export interface GetVolumeDBRangeResponse {
  MinValue: number,
  MaxValue: number
}

export interface RampToVolumeResponse {
  RampTime: number
}

export interface ResetBasicEQResponse {
  Bass: number,
  Treble: number,
  Loudness: boolean,
  LeftVolume: number,
  RightVolume: number
}

export interface SetRelativeVolumeResponse {
  NewVolume: number
}
