import { TestHelpers } from './test-helpers';
import SonosManager from '../sonos-manager';
import SonosDeviceDiscovery from '../sonos-device-discovery';
import AsyncHelper from '../helpers/async-helper';
import { ZoneGroupTopologyService } from '../services';
import { EventEmitter } from 'stream';

class TestSonosManager extends SonosManager {
  public zoneService: ZoneGroupTopologyService | undefined = undefined;
  readonly events: EventEmitter = new EventEmitter();
}

(process.env.SONOS_HOST ? describe : describe.skip)('SonosManager - local', () => {

  it('Initializes from device (local)', async () => {
    const manager = new SonosManager();
    await manager.InitializeFromDevice(process.env.SONOS_HOST || 'SHOULD_NEVER_GET_HERE');
    manager.CancelSubscription();
    expect(manager.Devices).toBeDefined();
    expect(manager.Devices.length).toBeGreaterThan(1);
  }, 100);
  it('Initializes from discovery (local)', async () => {
    const manager = new SonosManager();
    await manager.InitializeWithDiscovery();
    manager.CancelSubscription();
    expect(manager.Devices).toBeDefined();
    expect(manager.Devices.length).toBeGreaterThan(1)
  }, 1000);
});

(process.env.SONOS_HOST ? describe.skip : describe)('SonosManager', () => {

  // This test is disabled because it's not reliable in CI
  // stopped working after major framework upgrade
  it.skip('Emit new device after event', async () => {
    const port = 1806;
    const scope = TestHelpers.getScope(port);
    TestHelpers.mockZoneGroupState(scope);
    process.env.SONOS_DISABLE_EVENTS = 'true';
    const manager = new TestSonosManager();
    // Setup a fix state timeout
    const failed = setTimeout(() => {
      manager.CancelSubscription();
      delete process.env.SONOS_DISABLE_EVENTS;
      throw new Error('Failed to emit new device event');
    }, 5000);
    await manager.InitializeFromDevice(TestHelpers.testHost, port);

    var device = await AsyncHelper.AsyncEvent(manager.events, 'NewDevice', 1000);
    expect(device).toBeDefined();
    manager.CancelSubscription();
    delete process.env.SONOS_DISABLE_EVENTS;
    clearTimeout(failed);
  }, 5500);

  it('Initializes from device', async () => {
    const port = 1800;
    const scope = TestHelpers.getScope(port);
    TestHelpers.mockZoneGroupState(scope);
    process.env.SONOS_DISABLE_EVENTS = 'true';
    const manager = new SonosManager();
    await manager.InitializeFromDevice(TestHelpers.testHost, port);
    manager.CancelSubscription();
    delete process.env.SONOS_DISABLE_EVENTS;
    expect(manager.Devices).toBeDefined();
    expect(manager.Devices.length).toBeGreaterThan(1);
  }, 5000);

  it('Initializes from discovery', async () => {
    const port = 1400;
    const scope = TestHelpers.getScope(port, undefined, '127.0.0.1');
    TestHelpers.mockZoneGroupState(scope);
    process.env.SONOS_DISABLE_EVENTS = 'true';
    const manager = new SonosManager();
    const discovery = new SonosDeviceDiscovery();
    const interval = setInterval(async () => {
      await TestHelpers.emitSsdpMessage(discovery.port).catch((err) => {});
    }, 800);
    await manager.InitializeWithDiscovery(3, discovery);
    manager.CancelSubscription();
    clearInterval(interval);
    delete process.env.SONOS_DISABLE_EVENTS;
    expect(manager.Devices).toBeDefined();
    expect(manager.Devices.length).toBeGreaterThan(1);
  }, 5000);

  it('Refreshes event subscriptions', async () => {
    const port = 1801;
    const scope = TestHelpers.getScope(port);
    TestHelpers.mockZoneGroupState(scope);
    process.env.SONOS_DISABLE_EVENTS = 'true';
    const manager = new SonosManager();
    await manager.InitializeFromDevice(TestHelpers.testHost, port);
    await manager.CheckAllEventSubscriptions();
    manager.CancelSubscription();
    delete process.env.SONOS_DISABLE_EVENTS;
    await AsyncHelper.Delay(500);
  }, 2000);
});
