// Auto-generated on Sun Nov 03 2019 16:33:10 GMT+0100 (Central European Standard Time)
import { BaseService } from './base-service';

export class GroupRenderingControlService extends BaseService {
  readonly serviceNane: string = 'GroupRenderingControl';
  readonly controlUrl: string = '/MediaRenderer/GroupRenderingControl/Control';  
  readonly eventSubUrl: string = '/MediaRenderer/GroupRenderingControl/Event';
  readonly scpUrl: string = '/xml/GroupRenderingControl1.xml';
  

  // Actions
  GetGroupMute(input: { InstanceID: number } = { InstanceID: 0 }): Promise<GetGroupMuteResponse> { return this.SoapRequestWithBody<typeof input, GetGroupMuteResponse>('GetGroupMute', input); }
  GetGroupVolume(input: { InstanceID: number } = { InstanceID: 0 }): Promise<GetGroupVolumeResponse> { return this.SoapRequestWithBody<typeof input, GetGroupVolumeResponse>('GetGroupVolume', input); }
  SetGroupMute(input: { InstanceID: number, DesiredMute: boolean }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetGroupMute', input); }
  SetGroupVolume(input: { InstanceID: number, DesiredVolume: number }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetGroupVolume', input); }
  SetRelativeGroupVolume(input: { InstanceID: number, Adjustment: number }): Promise<SetRelativeGroupVolumeResponse> { return this.SoapRequestWithBody<typeof input, SetRelativeGroupVolumeResponse>('SetRelativeGroupVolume', input); }
  SnapshotGroupVolume(input: { InstanceID: number } = { InstanceID: 0 }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SnapshotGroupVolume', input); }
}

// Response classes
export interface GetGroupMuteResponse {
  CurrentMute: boolean
}

export interface GetGroupVolumeResponse {
  CurrentVolume: number
}

export interface SetRelativeGroupVolumeResponse {
  NewVolume: number
}
