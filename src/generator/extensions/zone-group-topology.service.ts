
export interface ZoneGroup {
  name: string;
  coordinator: ZoneMember;
  members: ZoneMember[];
}

interface ZoneMember {
  host: string;
  port: number;
  uuid: string;
  name: string;
}

import { XmlHelper } from '../helpers/xml-helper';
import { ArrayHelper } from '../helpers/array-helper';
import { URL } from 'url'

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
  async GetParsedZoneGroupState (): Promise<ZoneGroup[]> {
    const groupStateResponse = await this.GetZoneGroupState();
    const decodedGroupState = XmlHelper.DecodeAndParseXml(groupStateResponse.ZoneGroupState)
    const groups = ArrayHelper.ForceArray(decodedGroupState.ZoneGroupState.ZoneGroups.ZoneGroup)
    return groups.map(this.ParseGroup)
  }

  private ParseMember(member: any): ZoneMember {
    const uri = new URL(member._Location)
    return {
      name: member._ZoneName,
      uuid: member._UUID,
      host: uri.hostname,
      port: parseInt(uri.port)
    }
  }

  private ParseGroup(group: any): ZoneGroup {
    const members: ZoneMember[] = ArrayHelper.ForceArray(group.ZoneGroupMember).map(this.ParseMember)
    const coordinator: ZoneMember | undefined = members.find(m => m.uuid === group._Coordinator)

    if (coordinator === undefined) throw new Error('Error parsing ZoneGroup')

    let name = coordinator.name
    if(members.length > 1) name += ` + ${members.length - 1}`

    return {
      name: name,
      coordinator: coordinator,
      members: members
    }
  }
}
