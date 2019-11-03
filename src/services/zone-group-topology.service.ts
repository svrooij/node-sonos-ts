// Auto-generated on Sun Nov 03 2019 16:33:10 GMT+0100 (Central European Standard Time)
import { BaseService } from './base-service';

export class ZoneGroupTopologyService extends BaseService {
  readonly serviceNane: string = 'ZoneGroupTopology';
  readonly controlUrl: string = '/ZoneGroupTopology/Control';  
  readonly eventSubUrl: string = '/ZoneGroupTopology/Event';
  readonly scpUrl: string = '/xml/ZoneGroupTopology1.xml';
  

  // Actions
  BeginSoftwareUpdate(input: { UpdateURL: string, Flags: number, ExtraOptions: string }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('BeginSoftwareUpdate', input); }
  CheckForUpdate(input: { UpdateType: string, CachedOnly: boolean, Version: string }): Promise<CheckForUpdateResponse> { return this.SoapRequestWithBody<typeof input, CheckForUpdateResponse>('CheckForUpdate', input); }
  GetZoneGroupAttributes(): Promise<GetZoneGroupAttributesResponse> { return this.SoapRequest<GetZoneGroupAttributesResponse>('GetZoneGroupAttributes'); }
  GetZoneGroupState(): Promise<GetZoneGroupStateResponse> { return this.SoapRequest<GetZoneGroupStateResponse>('GetZoneGroupState'); }
  RegisterMobileDevice(input: { MobileDeviceName: string, MobileDeviceUDN: string, MobileIPAndPort: string }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('RegisterMobileDevice', input); }
  ReportAlarmStartedRunning(): Promise<boolean> { return this.SoapRequestNoResponse('ReportAlarmStartedRunning'); }
  ReportUnresponsiveDevice(input: { DeviceUUID: string, DesiredAction: string }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('ReportUnresponsiveDevice', input); }
  SubmitDiagnostics(input: { IncludeControllers: boolean, Type: string }): Promise<SubmitDiagnosticsResponse> { return this.SoapRequestWithBody<typeof input, SubmitDiagnosticsResponse>('SubmitDiagnostics', input); }
}

// Response classes
export interface CheckForUpdateResponse {
  UpdateItem: string
}

export interface GetZoneGroupAttributesResponse {
  CurrentZoneGroupName: string,
  CurrentZoneGroupID: string,
  CurrentZonePlayerUUIDsInGroup: string,
  CurrentMuseHouseholdId: string
}

export interface GetZoneGroupStateResponse {
  ZoneGroupState: string
}

export interface SubmitDiagnosticsResponse {
  DiagnosticID: number
}
