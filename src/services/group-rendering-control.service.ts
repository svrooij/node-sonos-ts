/**
 * Sonos GroupRenderingControlService
 * 
 * Stephan van Rooij
 * https://svrooij.io
 *
 * This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 */
import BaseService from './base-service';

/**
 * Volume related controls for groups. Group volume is the average volume of all players. Snapshot stores the volume ratio between players.
 *
 * @export
 * @class GroupRenderingControlService
 * @extends {BaseService}
 */
export class GroupRenderingControlService extends BaseService<GroupRenderingControlServiceEvent> {
  readonly serviceNane: string = 'GroupRenderingControl';

  readonly controlUrl: string = '/MediaRenderer/GroupRenderingControl/Control';

  readonly eventSubUrl: string = '/MediaRenderer/GroupRenderingControl/Event';

  readonly scpUrl: string = '/xml/GroupRenderingControl1.xml';

  // #region actions
  /**
   * Get 1 for muted, 0 for un-muted
   *
   * @param {number} input.InstanceID - InstanceID should always be 0
   * @remarks Send to non-coordinator returns error code 701
   */
  async GetGroupMute(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<GetGroupMuteResponse> { return await this.SoapRequestWithBody<typeof input, GetGroupMuteResponse>('GetGroupMute', input); }

  /**
   * Get the group volume.
   *
   * @param {number} input.InstanceID - InstanceID should always be 0
   * @remarks Send to non-coordinator returns error code 701
   */
  async GetGroupVolume(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<GetGroupVolumeResponse> { return await this.SoapRequestWithBody<typeof input, GetGroupVolumeResponse>('GetGroupVolume', input); }

  /**
   * (Un-/)Mute the entire group
   *
   * @param {number} input.InstanceID - InstanceID should always be 0
   * @param {boolean} input.DesiredMute - True for mute, false for un-mute
   * @remarks Send to non-coordinator returns error code 701
   */
  async SetGroupMute(input: { InstanceID: number; DesiredMute: boolean }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetGroupMute', input); }

  /**
   * Change group volume. Players volume will be changed proportionally based on last snapshot
   *
   * @param {number} input.InstanceID - InstanceID should always be 0
   * @param {number} input.DesiredVolume - New volume between 0 and 100
   * @remarks Send to non-coordinator returns error code 701
   */
  async SetGroupVolume(input: { InstanceID: number; DesiredVolume: number }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetGroupVolume', input); }

  /**
   * Relatively change group volume - returns final group volume. Players volume will be changed proportionally based on last snapshot
   *
   * @param {number} input.InstanceID - InstanceID should always be 0
   * @param {number} input.Adjustment - Number between -100 and +100
   * @remarks Send to non-coordinator returns error code 701
   */
  async SetRelativeGroupVolume(input: { InstanceID: number; Adjustment: number }):
  Promise<SetRelativeGroupVolumeResponse> { return await this.SoapRequestWithBody<typeof input, SetRelativeGroupVolumeResponse>('SetRelativeGroupVolume', input); }

  /**
   * Creates a new group volume snapshot,  the volume ratio between all players. It is used by SetGroupVolume and SetRelativeGroupVolume
   *
   * @param {number} input.InstanceID - InstanceID should always be 0
   * @remarks Send to non-coordinator returns error code 701
   */
  async SnapshotGroupVolume(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SnapshotGroupVolume', input); }
  // #endregion

  // Event properties from service description.
  protected eventProperties(): {[key: string]: string} {
    return {
      GroupMute: 'boolean',
      GroupVolume: 'number',
      GroupVolumeChangeable: 'boolean',
    };
  }
}

// Generated responses
export interface GetGroupMuteResponse {
  CurrentMute: boolean;
}

export interface GetGroupVolumeResponse {
  CurrentVolume: number;
}

export interface SetRelativeGroupVolumeResponse {
  NewVolume: number;
}

// Strong type event
export interface GroupRenderingControlServiceEvent {
  GroupMute?: boolean;
  GroupVolume?: number;
  GroupVolumeChangeable?: boolean;
}
