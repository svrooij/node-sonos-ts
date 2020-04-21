import SonosManager from '../src/sonos-manager'
import { expect }  from 'chai'

(process.env.SONOS_HOST ? describe : describe.skip)('SonosManager - local', () => {

  it('Initializes from device', async (done) => {
    const manager = new SonosManager();
    await manager.InitializeFromDevice(process.env.SONOS_HOST || 'SHOULD_NEVER_GET_HERE');
    manager.CancelSubscription();
    expect(manager.Devices).to.be.an('array');
    expect(manager.Devices).to.have.length.greaterThan(1);
    done();
  }, 100)
  it('Initializes from discovery', async (done) => {
    const manager = new SonosManager();
    await manager.InitializeWithDiscovery();
    manager.CancelSubscription();
    expect(manager.Devices).to.be.an('array');
    expect(manager.Devices).to.have.length.greaterThan(1);
    done();
  }, 1000)
})
