import ArrayHelper from '../helpers/array-helper';
import XmlHelper from '../helpers/xml-helper';
import { ChannelMapSet, ZoneGroup, ZoneMember } from '../models/zone-group';
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

  private static ParseChannelMapSet(channelMapSet: unknown): ChannelMapSet | undefined {
    if (typeof channelMapSet !== 'string' || channelMapSet === '') {
      return undefined;
    }
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

  private static ParseMember(member: any): ZoneMember {
    const uri = new URL(member.Location);
    return {
      name: member.ZoneName,
      uuid: member.UUID,
      host: uri.hostname,
      port: parseInt(uri.port, 10),
      ChannelMapSet: ZoneGroupTopologyService.ParseChannelMapSet(member.ChannelMapSet),
      Icon: member.Icon,
      // This code looks strange, but have a look at https://github.com/svrooij/node-sonos-ts/issues/125
      MicEnabled: member.MicEnabled === 1 || member.MicEnabled === '1',
      Invisible: member.Invisible === 1 || member.Invisible === '1',
      SoftwareVersion: member.SoftwareVersion,
      SwGen: member.SWGen,
      HasConfiguredSSID: member.HasConfiguredSSID === '1' || member.HasConfiguredSSID === 1,
      WifiEnabled: member.WifiEnabled === '1' || member.WifiEnabled === 1,
      TVConfigurationError: parseInt(member.TVConfigurationError, 10),
      HdmiCecAvailable: member.HdmiCecAvailable === '1' || member.HdmiCecAvailable === 1,
    };
  }

  private static ParseGroup(group: any): ZoneGroup {
    const members: ZoneMember[] = ArrayHelper.ForceArray(group.ZoneGroupMember).map((m: any) => ZoneGroupTopologyService.ParseMember(m));
    const coordinator: ZoneMember | undefined = members.find((m) => m.uuid === group.Coordinator);

    if (coordinator === undefined) throw new Error('Error parsing ZoneGroup');

    let { name } = coordinator;
    if (members.length > 1) name += ` + ${members.length - 1}`;

    return {
      groupId: group.ID,
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
