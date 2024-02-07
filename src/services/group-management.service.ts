/**
 * Sonos GroupManagement service
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
 * Services related to groups
 *
 * @export
 * @class GroupManagementService
 * @extends {BaseService}
 */
export class GroupManagementService extends BaseService<GroupManagementServiceEvent> {
  readonly serviceNane: string = 'GroupManagement';

  readonly controlUrl: string = '/GroupManagement/Control';

  readonly eventSubUrl: string = '/GroupManagement/Event';

  readonly scpUrl: string = '/xml/GroupManagement1.xml';

  readonly errors: SonosUpnpError[] = SonosUpnpErrors.defaultErrors;

  // #region actions
  async AddMember(input: { MemberID: string; BootSeq: number }):
  Promise<AddMemberResponse> { return await this.SoapRequestWithBody<typeof input, AddMemberResponse>('AddMember', input); }

  async RemoveMember(input: { MemberID: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('RemoveMember', input); }

  async ReportTrackBufferingResult(input: { MemberID: string; ResultCode: number }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('ReportTrackBufferingResult', input); }

  async SetSourceAreaIds(input: { DesiredSourceAreaIds: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetSourceAreaIds', input); }
  // #endregion

  protected responseProperties(): { [key: string]: string } {
    return {
      CurrentTransportSettings: 'string',
      CurrentURI: 'string',
      GroupUUIDJoined: 'string',
      ResetVolumeAfter: 'boolean',
      VolumeAVTransportURI: 'string',
    };
  }

  // Event properties from service description.
  protected eventProperties(): { [key: string]: string } {
    return {
      GroupCoordinatorIsLocal: 'boolean',
      LocalGroupUUID: 'string',
      ResetVolumeAfter: 'boolean',
      SourceAreaIds: 'string',
      VirtualLineInGroupID: 'string',
      VolumeAVTransportURI: 'string',
    };
  }
}

// Generated responses
export interface AddMemberResponse {
  CurrentTransportSettings: string;
  CurrentURI: string;
  GroupUUIDJoined: string;
  ResetVolumeAfter: boolean;
  VolumeAVTransportURI: string;
}

// Strong type event
export interface GroupManagementServiceEvent {
  GroupCoordinatorIsLocal?: boolean;
  LocalGroupUUID?: string;
  ResetVolumeAfter?: boolean;
  SourceAreaIds?: string;
  VirtualLineInGroupID?: string;
  VolumeAVTransportURI?: string;
}
