import { expect }  from 'chai'
import { TestHelpers } from './test-helpers';
import SonosManager from '../src/sonos-manager'
import SonosDeviceDiscovery from '../src/sonos-device-discovery';


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

  it('Emit new device after event', async (done) => {
    const port = 1806;
    const scope = TestHelpers.getScope(port);
    TestHelpers.mockZoneGroupState(scope);
    process.env.SONOS_DISABLE_EVENTS = "true";
    const manager = new SonosManager();
    await manager.InitializeFromDevice(TestHelpers.testHost, port);
    // Setup a fix state timeout
    const failed = setTimeout(() => {
      manager.CancelSubscription();
      delete process.env.SONOS_DISABLE_EVENTS;
      fail();
    }, 1500)

    // This event should be triggered
    manager.OnNewDevice((device) => {
      manager.CancelSubscription();
      delete process.env.SONOS_DISABLE_EVENTS;
      clearTimeout(failed);
      done();
    })

    // Emit event with fake data on private member. This should trigger the discovery of a new device.
    const timeout = setTimeout(() => {
      manager['zoneService']?.ParseEvent(`<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0">
      <e:property>
        <ZoneGroupState>&lt;ZoneGroupState&gt;&lt;ZoneGroups&gt;&lt;ZoneGroup Coordinator=&quot;RINCON_000ABABABAB101400&quot; ID=&quot;RINCON_111ABABABAB101400:3625074114&quot;&gt;&lt;ZoneGroupMember UUID=&quot;RINCON_000ABABABAB101400&quot; Location=&quot;http://192.168.1.12:1400/xml/device_description.xml&quot; ZoneName=&quot;Keuken&quot; Icon=&quot;x-rincon-roomicon:kitchen&quot; Configuration=&quot;1&quot; SoftwareVersion=&quot;57.9-23290&quot; SWGen=&quot;1&quot; MinCompatibleVersion=&quot;56.0-00000&quot; LegacyCompatibleVersion=&quot;36.0-00000&quot; BootSeq=&quot;107&quot; TVConfigurationError=&quot;0&quot; HdmiCecAvailable=&quot;0&quot; WirelessMode=&quot;0&quot; WirelessLeafOnly=&quot;0&quot; HasConfiguredSSID=&quot;0&quot; ChannelFreq=&quot;2412&quot; BehindWifiExtender=&quot;0&quot; WifiEnabled=&quot;1&quot; Orientation=&quot;0&quot; RoomCalibrationState=&quot;4&quot; SecureRegState=&quot;3&quot; VoiceConfigState=&quot;0&quot; MicEnabled=&quot;0&quot; AirPlayEnabled=&quot;0&quot; IdleState=&quot;1&quot; MoreInfo=&quot;&quot;/&gt;&lt;/ZoneGroup&gt;&lt;/ZoneGroups&gt;&lt;/ZoneGroupState&gt;</ZoneGroupState>
      </e:property>
      <e:property>
        <ZonePlayerUUIDsInGroup>RINCON_000E58644CBC01400</ZonePlayerUUIDsInGroup>
      </e:property>
    </e:propertyset>`)
    }, 500)
  }, 3000)

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

  it('Initializes from discovery', async (done) => {
    const port = 1400;
    const scope = TestHelpers.getScope(port, undefined, '127.0.0.1');
    TestHelpers.mockZoneGroupState(scope);
    process.env.SONOS_DISABLE_EVENTS = "true";
    const manager = new SonosManager();
    const discovery = new SonosDeviceDiscovery();
    const interval = setInterval(async () => {
      await TestHelpers.emitSsdpMessage(discovery.port).catch((err) => {});
    }, 800);
    await manager.InitializeWithDiscovery(1, discovery);
    manager.CancelSubscription();
    clearInterval(interval);
    delete process.env.SONOS_DISABLE_EVENTS;
    expect(manager.Devices).to.be.an('array');
    expect(manager.Devices).to.have.length.greaterThan(1);
    done();
  }, 5000)

  it('Refreshes event subscriptions', async(done) => {
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
  }, 2000)
})
