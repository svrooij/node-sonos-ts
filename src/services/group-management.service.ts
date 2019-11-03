// Auto-generated on Sun Nov 03 2019 16:33:10 GMT+0100 (Central European Standard Time)
import { BaseService } from './base-service';

export class GroupManagementService extends BaseService {
  readonly serviceNane: string = 'GroupManagement';
  readonly controlUrl: string = '/GroupManagement/Control';  
  readonly eventSubUrl: string = '/GroupManagement/Event';
  readonly scpUrl: string = '/xml/GroupManagement1.xml';
  

  // Actions
  AddMember(input: { MemberID: string, BootSeq: number }): Promise<AddMemberResponse> { return this.SoapRequestWithBody<typeof input, AddMemberResponse>('AddMember', input); }
  RemoveMember(input: { MemberID: string }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('RemoveMember', input); }
  ReportTrackBufferingResult(input: { MemberID: string, ResultCode: number }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('ReportTrackBufferingResult', input); }
  SetSourceAreaIds(input: { DesiredSourceAreaIds: string }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetSourceAreaIds', input); }
}

// Response classes
export interface AddMemberResponse {
  CurrentTransportSettings: string,
  CurrentURI: string,
  GroupUUIDJoined: string,
  ResetVolumeAfter: boolean,
  VolumeAVTransportURI: string
}
