/**
 * Sonos ZoneGroupTopology service
 *
 * Stephan van Rooij
 * https://svrooij.io
 *
 * This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 */
import BaseService from './base-service';
import { SonosUpnpError } from '../models/sonos-upnp-error';
import SonosUpnpErrors from './sonos-upnp-errors';
import {
  ZoneGroup,
} from '../models';

/**
 * Zone config stuff, eg getting all the configured sonos zones
 *
 * @export
 * @class ZoneGroupTopologyServiceBase
 * @extends {BaseService}
 */
export class ZoneGroupTopologyServiceBase extends BaseService<ZoneGroupTopologyServiceEvent> {
  readonly serviceNane: string = 'ZoneGroupTopology';

  readonly controlUrl: string = '/ZoneGroupTopology/Control';

  readonly eventSubUrl: string = '/ZoneGroupTopology/Event';

  readonly scpUrl: string = '/xml/ZoneGroupTopology1.xml';

  readonly errors: SonosUpnpError[] = SonosUpnpErrors.defaultErrors;

  // #region actions
  async BeginSoftwareUpdate(input: { UpdateURL: string; Flags: number; ExtraOptions: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('BeginSoftwareUpdate', input); }

  async CheckForUpdate(input: { UpdateType: string; CachedOnly: boolean; Version: string }):
  Promise<CheckForUpdateResponse> { return await this.SoapRequestWithBody<typeof input, CheckForUpdateResponse>('CheckForUpdate', input); }

  /**
   * Get information about the current Zone
   */
  async GetZoneGroupAttributes():
  Promise<GetZoneGroupAttributesResponse> { return await this.SoapRequest<GetZoneGroupAttributesResponse>('GetZoneGroupAttributes'); }

  /**
   * Get all the Sonos groups, (as XML)
   * @remarks Some libraries also support GetParsedZoneGroupState that parses the xml for you.
   */
  async GetZoneGroupState():
  Promise<GetZoneGroupStateResponse> { return await this.SoapRequest<GetZoneGroupStateResponse>('GetZoneGroupState'); }

  async RegisterMobileDevice(input: { MobileDeviceName: string; MobileDeviceUDN: string; MobileIPAndPort: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('RegisterMobileDevice', input); }

  async ReportAlarmStartedRunning():
  Promise<boolean> { return await this.SoapRequestNoResponse('ReportAlarmStartedRunning'); }

  async ReportUnresponsiveDevice(input: { DeviceUUID: string; DesiredAction: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('ReportUnresponsiveDevice', input); }

  async SubmitDiagnostics(input: { IncludeControllers: boolean; Type: string }):
  Promise<SubmitDiagnosticsResponse> { return await this.SoapRequestWithBody<typeof input, SubmitDiagnosticsResponse>('SubmitDiagnostics', input); }
  // #endregion

  protected responseProperties(): { [key: string]: string } {
    return {
      UpdateItem: 'string',
      CurrentZoneGroupName: 'string',
      CurrentZoneGroupID: 'string',
      CurrentZonePlayerUUIDsInGroup: 'string',
      CurrentMuseHouseholdId: 'string',
      ZoneGroupState: 'Array<ZoneGroup> | string',
      DiagnosticID: 'number',
    };
  }

  // Event properties from service description.
  protected eventProperties(): { [key: string]: string } {
    return {
      AlarmRunSequence: 'string',
      AreasUpdateID: 'string',
      AvailableSoftwareUpdate: 'string',
      DiagnosticID: 'number',
      MuseHouseholdId: 'string',
      NetsettingsUpdateID: 'string',
      SourceAreasUpdateID: 'string',
      ThirdPartyMediaServersX: 'string',
      ZoneGroupID: 'string',
      ZoneGroupName: 'string',
      ZoneGroupState: 'Array<ZoneGroup> | string',
      ZonePlayerUUIDsInGroup: 'string',
    };
  }
}

// Generated responses
export interface CheckForUpdateResponse {
  UpdateItem: string;
}

export interface GetZoneGroupAttributesResponse {
  CurrentZoneGroupName: string;
  CurrentZoneGroupID: string;
  CurrentZonePlayerUUIDsInGroup: string;
  CurrentMuseHouseholdId: string;
}

export interface GetZoneGroupStateResponse {
  ZoneGroupState: Array<ZoneGroup> | string;
}

export interface SubmitDiagnosticsResponse {
  DiagnosticID: number;
}

// Strong type event
export interface ZoneGroupTopologyServiceEvent {
  AlarmRunSequence?: string;
  AreasUpdateID?: string;
  AvailableSoftwareUpdate?: string;
  DiagnosticID?: number;
  MuseHouseholdId?: string;
  NetsettingsUpdateID?: string;
  SourceAreasUpdateID?: string;
  ThirdPartyMediaServersX?: string;
  ZoneGroupID?: string;
  ZoneGroupName?: string;
  ZoneGroupState?: Array<ZoneGroup> | string;
  ZonePlayerUUIDsInGroup?: string;
}
