import { expect }  from 'chai'
import { TestHelpers } from './test-helpers';
import SonosManager from '../src/sonos-manager'


(process.env.SONOS_HOST ? describe : describe.skip)('SonosManager - local', () => {

  it('Initializes from device (local)', async (done) => {
    const manager = new SonosManager();
    await manager.InitializeFromDevice(process.env.SONOS_HOST || 'SHOULD_NEVER_GET_HERE');
    manager.CancelSubscription();
    expect(manager.Devices).to.be.an('array');
    expect(manager.Devices).to.have.length.greaterThan(1);
    done();
  }, 100)
  it('Initializes from discovery (local)', async (done) => {
    const manager = new SonosManager();
    await manager.InitializeWithDiscovery();
    manager.CancelSubscription();
    expect(manager.Devices).to.be.an('array');
    expect(manager.Devices).to.have.length.greaterThan(1);
    done();
  }, 1000)
});

(process.env.SONOS_HOST ? describe.skip : describe)('SonosManager', () => {

  it('Initializes from device', async (done) => {
    const port = 1800;
    const scope = TestHelpers.getScope(port);
    TestHelpers.mockZoneGroupState(scope);
    process.env.SONOS_DISABLE_EVENTS = "true";
    const manager = new SonosManager();
    await manager.InitializeFromDevice(TestHelpers.testHost, port);
    manager.CancelSubscription();
    delete process.env.SONOS_DISABLE_EVENTS;
    expect(manager.Devices).to.be.an('array');
    expect(manager.Devices).to.have.length.greaterThan(1);
    done();
  }, 100)

  it('refreshes event subscriptions', async(done) => {
    const port = 1801;
    const scope = TestHelpers.getScope(port);
    TestHelpers.mockZoneGroupState(scope);
    process.env.SONOS_DISABLE_EVENTS = "true";
    const manager = new SonosManager();
    await manager.InitializeFromDevice(TestHelpers.testHost, port);
    await manager.CheckAllEventSubscriptions();
    manager.CancelSubscription();
    delete process.env.SONOS_DISABLE_EVENTS;
    done();
  })
})
