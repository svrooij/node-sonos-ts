/**
 * Sonos GroupRenderingControl service
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
 * Volume related controls for groups
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

  /**
   * Default errors and service specific errors
   *
   * @type {SonosUpnpError[]}
   * @remarks See https://svrooij.io/sonos-api-docs/#manual-documentation-file
   */
  readonly errors: SonosUpnpError[] = [
    ...SonosUpnpErrors.defaultErrors,
    { code: 701, description: 'Player isn&#x27;t the coordinator' },
  ];

  // #region actions
  /**
   * Get the group mute state.
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @remarks Should be send to coordinator only
   */
  async GetGroupMute(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<GetGroupMuteResponse> { return await this.SoapRequestWithBody<typeof input, GetGroupMuteResponse>('GetGroupMute', input); }

  /**
   * Get the group volume.
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @remarks Should be send to coordinator only
   */
  async GetGroupVolume(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<GetGroupVolumeResponse> { return await this.SoapRequestWithBody<typeof input, GetGroupVolumeResponse>('GetGroupVolume', input); }

  /**
   * (Un-/)Mute the entire group
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {boolean} input.DesiredMute
   * @remarks Should be send to coordinator only
   */
  async SetGroupMute(input: { InstanceID: number; DesiredMute: boolean }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetGroupMute', input); }

  /**
   * Change group volume. Players volume will be changed proportionally based on last snapshot
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {number} input.DesiredVolume - New volume between 0 and 100
   * @remarks Should be send to coordinator only
   */
  async SetGroupVolume(input: { InstanceID: number; DesiredVolume: number }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetGroupVolume', input); }

  /**
   * Relatively change group volume - returns final group volume. Players volume will be changed proportionally based on last snapshot
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {number} input.Adjustment - Number between -100 and +100
   * @remarks Should be send to coordinator only
   */
  async SetRelativeGroupVolume(input: { InstanceID: number; Adjustment: number }):
  Promise<SetRelativeGroupVolumeResponse> { return await this.SoapRequestWithBody<typeof input, SetRelativeGroupVolumeResponse>('SetRelativeGroupVolume', input); }

  /**
   * Creates a new group volume snapshot,  the volume ratio between all players. It is used by SetGroupVolume and SetRelativeGroupVolume
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @remarks Should be send to coordinator only
   */
  async SnapshotGroupVolume(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SnapshotGroupVolume', input); }
  // #endregion

  protected responseProperties(): {[key: string]: string} {
    return {
      CurrentMute: 'boolean',
      CurrentVolume: 'number',
      NewVolume: 'number',
    };
  }

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
