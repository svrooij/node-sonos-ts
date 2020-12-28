import { expect }  from 'chai'
import SonosDeviceDiscovery from '../src/sonos-device-discovery'

describe('SonosDeviceDiscovery', () => {
  it('timesout after timeout', async (done) => {
    const discovery = new SonosDeviceDiscovery();
    const device = await discovery.SearchOne(1).catch((err) => {
      expect(err).to.not.be.undefined;
      expect(err).to.have.property('message', 'No players found');
      done();
    });

  }, 1500)
});
