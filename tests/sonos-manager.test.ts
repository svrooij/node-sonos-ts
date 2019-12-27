import { SonosManager } from '../src/sonos-manager'
import { expect }  from 'chai'
import 'mocha';

(process.env.SONOS_HOST ? describe : describe.skip)('SonosManager - local', function () {
  this.afterAll(() => {
    process.exit()
  })
  it('Initializes from device', async function() {
    this.timeout(100);
    const manager = new SonosManager();
    await manager.InitializeFromDevice(process.env.SONOS_HOST || 'SHOULD_NEVER_GET_HERE')
    expect(manager.Devices).to.be.an('array');
    expect(manager.Devices).to.have.length.greaterThan(1)
    manager.CancelSubscription()
  })
  it('Initializes from discovery', async function() {
    this.timeout(100);
    const manager = new SonosManager();
    await manager.InitializeWithDiscovery()
    expect(manager.Devices).to.be.an('array');
    expect(manager.Devices).to.have.length.greaterThan(1)
    manager.CancelSubscription()
  })
})