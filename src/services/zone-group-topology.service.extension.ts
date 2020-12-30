import ArrayHelper from '../helpers/array-helper';
import XmlHelper from '../helpers/xml-helper';
import { ZoneGroup, ZoneMember } from '../models/zone-group';
import { ZoneGroupTopologyServiceBase } from './zone-group-topology.service';

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

  protected ResolveEventPropertyValue(name: string, originalValue: unknown, type: string): any {
    const parsedValue = super.ResolveEventPropertyValue(name, originalValue, type);
    if (name === 'ZoneGroupState') {
      const groups = ArrayHelper.ForceArray(parsedValue.ZoneGroupState.ZoneGroups.ZoneGroup);
      return groups.map((g: any) => ZoneGroupTopologyService.ParseGroup(g));
    }

    return parsedValue;
  }
}
