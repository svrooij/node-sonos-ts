import { GetZoneGroupStateResponse } from '../services'
import { XmlHelper } from '../'
import { URL } from 'url'
export class ZoneHelper {
  static ParseZoneGroupStateResponse(zoneGroupStateResponse: GetZoneGroupStateResponse): ZoneGroup[] {
    return this.DecodedObjectToGroups(XmlHelper.DecodeAndParseXml(zoneGroupStateResponse.ZoneGroupState))
  }

  static DecodedObjectToGroups(state: any): ZoneGroup[] {
    const groups = Array.isArray(state.ZoneGroupState.ZoneGroups.ZoneGroup) ? state.ZoneGroupState.ZoneGroups.ZoneGroup : [state.ZoneGroupState.ZoneGroups.ZoneGroup]
    return groups.map(this.ParseGroup)
  }

  private static ParseGroup(group: any): ZoneGroup {
    const members: ZoneMember[] = Array.isArray(group.ZoneGroupMember) ? group.ZoneGroupMember.map(ZoneHelper.ParseMember) : [ZoneHelper.ParseMember(group.ZoneGroupMember)]
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

  private static ParseMember(member: any): ZoneMember {
    const uri = new URL(member._Location)
    return {
      name: member._ZoneName,
      uuid: member._UUID,
      host: uri.hostname,
      port: parseInt(uri.port)
    }
  }
}

export interface ZoneGroup {
  name: string,
  coordinator: ZoneMember,
  members: ZoneMember[]
}

interface ZoneMember {
  host: string,
  port: number,
  uuid: string,
  name: string
}
