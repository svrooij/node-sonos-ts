import { expect }  from 'chai'
import SonosDeviceDiscovery from '../src/sonos-device-discovery'
import { TestHelpers } from './test-helpers';

describe('SonosDeviceDiscovery', () => {
  it('timesout after timeout', async (done) => {
    const discovery = new SonosDeviceDiscovery();
    const device = await discovery.Search(1).catch((err) => {
      expect(err).to.not.be.undefined;
      expect(err).to.have.property('message', 'No players found');
      done();
    });
  }, 1500)

  it('discovered device', async (done) => {
    const discovery = new SonosDeviceDiscovery();
    const interval = setInterval(async () => {
      await TestHelpers.emitSsdpMessage().catch((err) => {});
    }, 800);

    const device = await discovery.SearchOne(15).catch(err => {
      clearInterval(interval);
      fail(err);
    });
    
    expect(device).to.not.be.undefined;
    expect(device).to.have.property('model');
    clearInterval(interval);
    done();
  }, 15000);
});
