import { ZoneGroupTopologyService } from './services'
import { SonosDevice, SonosDeviceDiscovery, ZoneHelper } from './'
import { ServiceEvents } from './models'
import { EventEmitter } from 'events';
import { ZoneGroup } from './helpers/zone-helper';
/**
 * The SonosManager will manage the logical devices for you. It will also manage group updates so be sure to call .Close on exit to remove open listeners.
 *
 * @export
 * @class SonosManager
 */
export class SonosManager {
  private readonly events: EventEmitter;
  private devices: SonosDevice[] = [];
  private zoneService: ZoneGroupTopologyService | undefined
  constructor() {
    this.events = new EventEmitter();
  }

  /**
   * Initialize the manager with one known device. Usefull in special network environments.
   *
   * @param {string} host
   * @param {number} [port=1400]
   * @returns {Promise<boolean>}
   * @memberof SonosManager
   */
  public InitializeFromDevice(host: string, port = 1400): Promise<boolean> {
    this.zoneService = new ZoneGroupTopologyService(host, port);
    return this.LoadAllGroups()
      .then(groups => this.InitializeDevices(groups))
      .then(success => this.SubscribeForGroupEvents(success));
  }

  /**
   * Initialize the manager by searching for one Sonos device in your network.
   *
   * @param {10} timeoutInSeconds
   * @returns {Promise<boolean>}
   * @memberof SonosManager
   */
  public InitializeWithDiscovery(timeoutInSeconds: 10): Promise<boolean> {
    const deviceDiscovery = new SonosDeviceDiscovery();
    return deviceDiscovery
      .SearchOne(timeoutInSeconds)
      .then(player => {
        this.zoneService = new ZoneGroupTopologyService(player.host, player.port);
        return this.LoadAllGroups()
        .then(groups => this.InitializeDevices(groups))
        .then(success => this.SubscribeForGroupEvents(success));
      })
  }

  private LoadAllGroups(): Promise<ZoneGroup[]> {
    if (this.zoneService === undefined) throw new Error('Manager is\'t initialized')
    return this.zoneService.GetZoneGroupState()
      .then(zoneGroupResponse => {
        return ZoneHelper.ParseZoneGroupStateResponse(zoneGroupResponse)
      })
  }

  private InitializeDevices(groups: ZoneGroup[]): boolean {
    groups.forEach(g => {
      const coordinator = new SonosDevice(g.coordinator.host, g.coordinator.port, g.coordinator.uuid);
      g.members.forEach(m => {
        // Check if device exists
        if(this.devices.findIndex(v => v.uuid === m.uuid) === -1){
          this.devices.push(new SonosDevice(m.host, m.port, m.uuid, m.name, { coordinator: coordinator, name: g.name, managerEvents: this.events }));
        }
      })
    })
    return true;
  }

  private SubscribeForGroupEvents(success: boolean): boolean {
    if(success && this.zoneService) {
      this.zoneService.Events.on(ServiceEvents.Data, this.zoneEventSubscription)
    }
    return success;
  }

  private zoneEventSubscription = this.handleZoneEventData.bind(this)
  private handleZoneEventData(): void { // The data from this event isn't used. It's just a trigger to reload stuff.
    this.LoadAllGroups().then(groups => {
      groups.forEach(g => {
        const coordinator = new SonosDevice(g.coordinator.host, g.coordinator.port, g.coordinator.uuid)
        g.members.forEach(m => {
          this.events.emit(m.uuid, {coordinator: coordinator, name: g.name});
        })
      })
    })
  }

  public CancelSubscription(): void {
    if(this.zoneService !== undefined)
      this.zoneService.Events.removeListener(ServiceEvents.Data, this.zoneEventSubscription);
  }

  public get Devices(): SonosDevice[] {
    if (this.devices.length === 0) throw new Error('No Devices available!')
    return this.devices;
  }
}