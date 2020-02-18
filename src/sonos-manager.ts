import { ZoneGroupTopologyService, ZoneGroup } from './services'
import { SonosDevice } from './sonos-device'
import { SonosDeviceDiscovery } from './sonos-device-discovery'
import { ServiceEvents } from './models'
import { EventEmitter } from 'events';
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
  public async InitializeFromDevice(host: string, port = 1400): Promise<boolean> {
    this.zoneService = new ZoneGroupTopologyService(host, port);
    return await this.Initialize();
  }

  /**
   * Initialize the manager by searching for one Sonos device in your network.
   *
   * @param {number} [timeoutInSeconds=10]
   * @returns {Promise<boolean>}
   * @memberof SonosManager
   */
  public async InitializeWithDiscovery(timeoutInSeconds = 10): Promise<boolean> {
    const deviceDiscovery = new SonosDeviceDiscovery();
    const player = await deviceDiscovery.SearchOne(timeoutInSeconds);
    this.zoneService = new ZoneGroupTopologyService(player.host, player.port);
    return await this.Initialize();
  }

  private async Initialize(): Promise<boolean> {
    const groups = await this.LoadAllGroups();
    const success = this.InitializeDevices(groups);
    return this.SubscribeForGroupEvents(success);
  }

  private async LoadAllGroups(): Promise<ZoneGroup[]> {
    if (this.zoneService === undefined) throw new Error('Manager is\'t initialized')
    return await this.zoneService.GetParsedZoneGroupState();
  }

  private InitializeDevices(groups: ZoneGroup[]): boolean {
    groups.forEach(g => {
      const coordinator = new SonosDevice(g.coordinator.host, g.coordinator.port, g.coordinator.uuid, g.coordinator.name, { name: g.name, managerEvents: this.events });
      if(this.devices.findIndex(v => v.uuid === coordinator.uuid) === -1)
        this.devices.push(coordinator);
      g.members.forEach(m => {
        // Check if device exists
        if(this.devices.findIndex(v => v.uuid === m.uuid) === -1){
          this.devices.push(new SonosDevice(m.host, m.port, m.uuid, m.name, { coordinator: m.uuid === g.coordinator.uuid ? undefined : coordinator, name: g.name, managerEvents: this.events }));
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
        const coordinator = this.devices.find(d => d.uuid === g.coordinator.uuid) || new SonosDevice(g.coordinator.host, g.coordinator.port, g.coordinator.uuid, g.coordinator.name);
        g.members.forEach(m => {
          this.events.emit(m.uuid, {coordinator: g.coordinator.uuid === m.uuid ? undefined : coordinator, name: g.name});
        })
      })
    })
  }

  /**
   * Cancel the subscription (this will unsubscribe for zone events)
   *
   * @memberof SonosManager
   */
  public CancelSubscription(): void {
    if(this.zoneService !== undefined)
      this.zoneService.Events.removeListener(ServiceEvents.Data, this.zoneEventSubscription);
  }

  /**
   * Get all found devices, call InitializeWithDiscovery or InitializeFromDevice first.
   *
   * @readonly
   * @type {SonosDevice[]}
   * @memberof SonosManager
   */
  public get Devices(): SonosDevice[] {
    if (this.devices.length === 0) throw new Error('No Devices available!')
    return this.devices;
  }
}
