import { expect }  from 'chai'
import SonosDeviceDiscovery from '../src/sonos-device-discovery'
import { TestHelpers } from './test-helpers';

describe('SonosDeviceDiscovery', () => {

  describe('Search()', () => {
    it.skip('discovered fake device', async (done) => {
      const discovery = new SonosDeviceDiscovery();
      const interval = setInterval(async () => {
        await TestHelpers.emitSsdpMessage(discovery.port).catch((err) => {});
        await TestHelpers.emitSsdpMessage(discovery.port).catch((err) => {});
      }, 800);
  
      const device = await discovery.Search(5).catch(err => {
        clearInterval(interval);
        fail(err);
      });
      
      expect(device).to.not.be.undefined;
      expect(device).to.have.property('model');
      clearInterval(interval);
      done();
    }, 6000);

    it('throws after timeout', async (done) => {
      const discovery = new SonosDeviceDiscovery();
      const device = await discovery.Search(5)
      .then((player) => { // If an actual device is available, it might respond in one second
        done();
      })
      .catch((err) => {
        expect(err).to.have.property('message', 'No players found');
        done();
      });
    }, 5500)
  })
  
  describe('SearchOne()', () => {
    it('discovered fake device', async (done) => {
      const discovery = new SonosDeviceDiscovery();
      const interval = setInterval(async () => {
        await TestHelpers.emitSsdpMessage(discovery.port).catch((err) => {});
      }, 800);
  
      const device = await discovery.SearchOne(3).catch(err => {
        clearInterval(interval);
        fail(err);
      });
      
      expect(device).to.have.property('model');
      clearInterval(interval);
      done();
    }, 4000);

    it.skip('throws after timeout', async (done) => {
      const discovery = new SonosDeviceDiscovery();
      const device = await discovery.SearchOne(1)
      .then((player) => { // If an actual device is available, it might respond in one second
        done();
      })
      .catch((err) => {
        expect(err).to.have.property('message', 'No players found');
        done();
      });
    }, 1500)
  })
  
});
