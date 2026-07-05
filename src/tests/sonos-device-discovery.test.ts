import SonosDeviceDiscovery from '../sonos-device-discovery';
import { TestHelpers } from './test-helpers';

describe('SonosDeviceDiscovery', () => {

  describe('Search()', () => {
    it.skip('discovered fake device', async () => {
      const discovery = new SonosDeviceDiscovery();
      const interval = setInterval(async () => {
        await TestHelpers.emitSsdpMessage(discovery.port).catch((_err) => {});
        await TestHelpers.emitSsdpMessage(discovery.port).catch((_err) => {});
      }, 800);
  
      const device = await discovery.Search(5).catch(err => {
        clearInterval(interval);
        fail(err);
      });
      
      expect(device).toBeDefined();
      expect(device).toHaveProperty('model');
      clearInterval(interval);
    }, 6000);

    it('throws after timeout', async () => {
      const discovery = new SonosDeviceDiscovery();
      try {
        // Search for 2 seconds
        const _device = await discovery.Search(2);
      } catch (err) {
        expect(err).toHaveProperty('message', 'No players found');
      }

    }, 4000);
  });
  
  describe('SearchOne()', () => {
    it('discovered fake device', async () => {
      const discovery = new SonosDeviceDiscovery();
      const interval = setInterval(() => {
        TestHelpers.emitSsdpMessage(discovery.port).catch((_err) => {});
      }, 800);
  
      try {
        const device = await discovery.SearchOne(3);
        expect(device).toHaveProperty('model');
      } finally {
        clearInterval(interval);
      }
    }, 4000);

    it.skip('throws after timeout', async () => {
      const discovery = new SonosDeviceDiscovery();
      try {
        const _device = await discovery.SearchOne(1);
      } catch (err) {
        expect(err).toHaveProperty('message', 'No players found');
      }

    }, 2000);
  });
  
});
