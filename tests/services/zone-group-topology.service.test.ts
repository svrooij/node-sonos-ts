import { TestHelpers } from '../test-helpers';
import { ZoneGroupTopologyService } from '../../src/services/zone-group-topology.service.extension';

describe('ZoneGroupTopologyService', () => {
  describe('ChannelMapSet', () => {
    test('parses ChannelMapSet for stereo pair', async () => {
      TestHelpers.mockZoneGroupState(TestHelpers.getScope(), 'zone-group.GroupState.ChannelMapSet.stereo.xml');
      process.env.SONOS_DISABLE_EVENTS = 'true'
      const service = new ZoneGroupTopologyService(TestHelpers.testHost, 1400);
      const groups = await service.GetParsedZoneGroupState();
      expect(groups).toHaveLength(1);
      expect(groups[0]).toHaveProperty('members');
      expect(groups[0].members).toHaveLength(2);
      expect(groups[0].members[0]).toHaveProperty('ChannelMapSet');
      expect(groups[0].members[1]).toHaveProperty('ChannelMapSet');
      expect(groups[0].members[0].ChannelMapSet).toEqual({
        LF: 'RINCON_FFFFFFFFFFFFFFFF0',
        RF: 'RINCON_FFFFFFFFF0000FFF0'
      });
      expect(groups[0].members[1].ChannelMapSet).toEqual({
        LF: 'RINCON_FFFFFFFFFFFFFFFF0',
        RF: 'RINCON_FFFFFFFFF0000FFF0'
      });
    });

    test('parses HTSatChanMapSet for home theater', async () => {
      TestHelpers.mockZoneGroupState(TestHelpers.getScope(), 'zone-group.GroupState.ChannelMapSet.home-theater.xml');
      process.env.SONOS_DISABLE_EVENTS = 'true'
      const service = new ZoneGroupTopologyService(TestHelpers.testHost, 1400);
      const groups = await service.GetParsedZoneGroupState();
      expect(groups).toHaveLength(2);
      expect(groups[0]).toHaveProperty('members');
      expect(groups[0].members).toHaveLength(1);
      expect(groups[0].members[0]).toHaveProperty('ChannelMapSet');
      expect(groups[0].members[0].ChannelMapSet).toEqual({
        'LF,RF': "RINCON_FFFFFFFFFFFFFFFF0",
        SW: "RINCON_FFFFFFFFFFFFFF0FF",
        LR: "RINCON_FFFFFFFFFFFFFFF0F",
        RR: "RINCON_FFFFFFFFFFFFF0FFF"
      });
      expect(groups[1]).toHaveProperty('members');
      expect(groups[1].members).toHaveLength(1);
      expect(groups[1].members[0]).toHaveProperty('ChannelMapSet');
      expect(groups[1].members[0].ChannelMapSet).toBeUndefined();
    });

    test('parses device with no ChannelMapSet', async () => {
      TestHelpers.mockZoneGroupState(TestHelpers.getScope(), 'zone-group.GroupState.ChannelMapSet.normal.xml');
      process.env.SONOS_DISABLE_EVENTS = 'true'
      const service = new ZoneGroupTopologyService(TestHelpers.testHost, 1400);
      const groups = await service.GetParsedZoneGroupState();
      expect(groups).toHaveLength(1);
      expect(groups[0]).toHaveProperty('members');
      expect(groups[0].members).toHaveLength(2);
      expect(groups[0].members[0].ChannelMapSet).not.toBeDefined();
      expect(groups[0].members[1].ChannelMapSet).not.toBeDefined();
    });
  });
});