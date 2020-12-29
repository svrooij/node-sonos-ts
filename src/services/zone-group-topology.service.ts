/**
 * Sonos ZoneGroupTopologyService
 *
 * Stephan van Rooij
 * https://svrooij.io
 *
 * This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 */
import { URL } from 'url';
import BaseService from './base-service';
import ArrayHelper from '../helpers/array-helper';
import XmlHelper from '../helpers/xml-helper';
import { SonosUpnpError } from '../models/sonos-upnp-error';
import SonosUpnpErrors from './sonos-upnp-errors';

/**
 * Zone config stuff, eg getting all the configured sonos zones.
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

  // Event properties from service description.
  protected eventProperties(): {[key: string]: string} {
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

export interface ZoneGroup {
  name: string;
  coordinator: ZoneMember;
  members: ZoneMember[];
}

interface ChannelMapSet {
  [channel: string]: string;
}

interface ZoneMember {
  host: string;
  port: number;
  uuid: string;
  name: string;
  Icon: string;
  MicEnabled: boolean;
  SoftwareVersion: string;
  SwGen: string;
  ChannelMapSet?: ChannelMapSet;
}

/**
 * Zone config stuff, eg getting all the configured sonos zones.
 *
 * @export
 * @class ZoneGroupTopologyService
 * @extends {ZoneGroupTopologyServiceBase}
 */
export class ZoneGroupTopologyService extends ZoneGroupTopologyServiceBase {
  /**
   * Get all the sonos groups in your current network. Parsed the GetZoneGroupState output.
   *
   * @returns {Promise<ZoneGroup[]>}
   * @memberof ZoneGroupTopologyService
   */
  async GetParsedZoneGroupState(): Promise<ZoneGroup[]> {
    const groupStateResponse = await this.GetZoneGroupState();
    if (typeof groupStateResponse.ZoneGroupState === 'string') {
      const decodedGroupState = XmlHelper.DecodeAndParseXml(groupStateResponse.ZoneGroupState, '');
      const groups = ArrayHelper.ForceArray(decodedGroupState.ZoneGroupState.ZoneGroups.ZoneGroup);
      return groups.map((g: any) => ZoneGroupTopologyService.ParseGroup(g));
    }
    return groupStateResponse.ZoneGroupState; // This should never happen, because it always is a string.
  }

  private static ParseMember(member: any): ZoneMember {
    const uri = new URL(member.Location);
    return {
      name: member.ZoneName,
      uuid: member.UUID,
      host: uri.hostname,
      port: parseInt(uri.port, 10),
      Icon: member.Icon,
      MicEnabled: member.MicEnabled === 1,
      SoftwareVersion: member.SoftwareVersion,
      SwGen: member.SWGen,
      ChannelMapSet: member.ChannelMapSet ? ZoneGroupTopologyService.ParseChannelMapSet(member.ChannelMapSet) : undefined,
    };
  }

  private static ParseGroup(group: any): ZoneGroup {
    const members: ZoneMember[] = ArrayHelper.ForceArray(group.ZoneGroupMember).map((m: any) => ZoneGroupTopologyService.ParseMember(m));
    const coordinator: ZoneMember | undefined = members.find((m) => m.uuid === group.Coordinator);

    if (coordinator === undefined) throw new Error('Error parsing ZoneGroup');

    let { name } = coordinator;
    if (members.length > 1) name += ` + ${members.length - 1}`;

    return {
      name,
      coordinator,
      members,
    };
  }

  private static ParseChannelMapSet(channelMapSet: string): ChannelMapSet {
    const channels = channelMapSet.split(';');
    return channels.map((channel) => {
      const [uuid, channelId] = channel.split(',');
      return {
        uuid: uuid.split(':')[0],
        channelId,
      };
    }).reduce<ChannelMapSet>((previousChannels, channel) => ({
      ...previousChannels,
      [channel.channelId]: channel.uuid,
    }), {});
  }

  protected ResolveEventPropertyValue(name: string, originalValue: any, type: string): any {
    const parsedValue = super.ResolveEventPropertyValue(name, originalValue, type);
    if (name === 'ZoneGroupState') {
      const groups = ArrayHelper.ForceArray(parsedValue.ZoneGroupState.ZoneGroups.ZoneGroup);
      return groups.map((g: any) => ZoneGroupTopologyService.ParseGroup(g));
    }

    return parsedValue;
  }
}
