import debug, { Debugger } from 'debug';
import { EventEmitter } from 'events';
import { ZoneGroup } from './models/zone-group';
import { ZoneGroupTopologyService, ZoneGroupTopologyServiceEvent } from './services';
import SonosDevice from './sonos-device';
import SonosDeviceDiscovery from './sonos-device-discovery';
import { ServiceEvents, PlayNotificationOptions, PlayTtsOptions } from './models';
import TtsHelper from './helpers/tts-helper';
/**
 * The SonosManager will manage the logical devices for you. It will also manage group updates so be sure to call .Close on exit to remove open listeners.
 *
 * @export
 * @class SonosManager
 */
export default class SonosManager {
  private readonly events: EventEmitter;

  private readonly debug: Debugger;

  private devices: SonosDevice[] = [];

  private zoneService: ZoneGroupTopologyService | undefined;

  constructor() {
    this.events = new EventEmitter();
    this.debug = debug('sonos:sonosmanager');
  }

  /**
   * Initialize the manager with one known device. Useful in special network environments.
   *
   * @param {string} host
   * @param {number} [port=1400]
   * @returns {Promise<boolean>}
   * @memberof SonosManager
   */
  public async InitializeFromDevice(host: string, port = 1400): Promise<boolean> {
    this.debug('InitializeFromDevice %s', host);
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
    this.debug('InitializeWithDiscovery timeout: %d', timeoutInSeconds);
    const deviceDiscovery = new SonosDeviceDiscovery();
    const player = await deviceDiscovery.SearchOne(timeoutInSeconds);
    this.debug('Discovery found player with ip: %s', player.host);
    this.zoneService = new ZoneGroupTopologyService(player.host, player.port);
    return await this.Initialize();
  }

  private async Initialize(): Promise<boolean> {
    this.debug('Initialize()');
    const groups = await this.LoadAllGroups();
    const success = this.InitializeWithGroups(groups);
    return this.SubscribeForGroupEvents(success);
  }

  private async LoadAllGroups(): Promise<ZoneGroup[]> {
    if (this.zoneService === undefined) throw new Error('Manager is\'t initialized');
    return await this.zoneService.GetParsedZoneGroupState();
  }

  private InitializeWithGroups(groups: ZoneGroup[]): boolean {
    groups.forEach((g) => {
      const coordinator = new SonosDevice(g.coordinator.host, g.coordinator.port, g.coordinator.uuid, g.coordinator.name, { name: g.name, managerEvents: this.events });
      if (this.devices.findIndex((v) => v.Uuid === coordinator.Uuid) === -1) this.devices.push(coordinator);
      g.members.forEach((m) => {
        // Check if device exists
        if (this.devices.findIndex((v) => v.Uuid === m.uuid) === -1) {
          this.devices.push(new SonosDevice(m.host, m.port, m.uuid, m.name, { coordinator: m.uuid === g.coordinator.uuid ? undefined : coordinator, name: g.name, managerEvents: this.events }));
        }
      });
    });
    return true;
  }

  private SubscribeForGroupEvents(success: boolean): boolean {
    if (success && this.zoneService) {
      this.zoneService.Events.on(ServiceEvents.ServiceEvent, this.zoneEventSubscription);
    }
    return success;
  }

  private zoneEventSubscription = this.handleZoneEventData.bind(this);

  private handleZoneEventData(data: ZoneGroupTopologyServiceEvent): void {
    if (data.ZoneGroupState !== undefined && typeof data.ZoneGroupState !== 'string') {
      data.ZoneGroupState.forEach((g) => {
        let coordinator = this.devices.find((d) => d.Uuid === g.coordinator.uuid);
        if (coordinator === undefined) {
          coordinator = new SonosDevice(g.coordinator.host, g.coordinator.port, g.coordinator.uuid, g.coordinator.name, { coordinator: undefined, name: g.name, managerEvents: this.events });
          this.devices.push(coordinator);
          this.events.emit('NewDevice', coordinator);
        }

        // New members
        g.members
          .filter((m) => !this.devices.some((d) => d.Uuid === m.uuid))
          .forEach((m) => {
            const newDevice = new SonosDevice(m.host, m.port, m.uuid, m.name, { coordinator: m.uuid === g.coordinator.uuid ? undefined : coordinator, name: g.name, managerEvents: this.events });
            this.devices.push(newDevice);
            this.events.emit('NewDevice', coordinator);
          });

        g.members.forEach((m) => {
          this.events.emit(m.uuid, { coordinator: g.coordinator.uuid === m.uuid ? undefined : coordinator, name: g.name });
        });
      });
    }
  }

  /**
   * Cancel the subscription (this will unsubscribe for zone events)
   *
   * @memberof SonosManager
   */
  public CancelSubscription(): void {
    if (this.zoneService !== undefined) this.zoneService.Events.removeListener(ServiceEvents.ServiceEvent, this.zoneEventSubscription);
  }

  /**
   * Get all found devices, call InitializeWithDiscovery or InitializeFromDevice first.
   *
   * @readonly
   * @type {SonosDevice[]}
   * @memberof SonosManager
   */
  public get Devices(): SonosDevice[] {
    if (this.devices.length === 0) throw new Error('No Devices available!');
    return this.devices;
  }

  /**
   * Subscribe to receive new devices.
   *
   * @param {(device: SonosDevice) => void} listener
   * @memberof SonosManager
   */
  public OnNewDevice(listener: (device: SonosDevice) => void): void {
    this.events.on('NewDevice', listener);
  }

  /**
   * Play a notification on all groups, without changing the current groups (for now).
   *
   * @param {PlayNotificationOptions} options The options
   * @param {string} options.trackUri The uri of the sound to play as notification, can be every supported sonos uri.
   * @param {string|Track} [options.metadata] The metadata of the track to play, will be guesses if undefined.
   * @param {number} [options.delayMs] Delay in ms between commands, for better notification playback stability
   * @param {boolean} [options.onlyWhenPlaying] Only play a notification if currently playing music. You don't have to check if the user is home ;)
   * @param {number} [options.timeout] Number of seconds the notification should play, as a fallback if the event doesn't come through.
   * @param {number} [options.volume] Change the volume for the notication and revert afterwards.
   * @returns {Promise<boolean>} Returns true is notification was played (and the state is set back to original)
   * @memberof SonosManager
   */
  public async PlayNotification(options: PlayNotificationOptions): Promise<boolean> {
    this.debug('PlayNotification(%o)', options);

    const commands = this.Devices
      .filter((d) => d.Coordinator.Uuid === d.Uuid)
      .map((d) => d.PlayNotification(options));
    return Promise
      .all(commands)
      .then((values) => values.some((v) => v));
  }

  /**
   * Play text to speech message on all groups, without changing the current groups (for now).
   *
   * @param {PlayTtsOptions} options
   * @param {string} options.text Text to request a TTS file for.
   * @param {string} options.lang Language to request tts file for.
   * @param {string} [options.endpoint] TTS endpoint, see documentation, can also be set by environment variable 'SONOS_TTS_ENDPOINT'
   * @param {string} [options.gender] Supply gender, some languages support both genders.
   * @param {string} [options.name] Supply voice name, some services support several voices with different names.
   * @param {number} [options.delayMs] Delay in ms between commands, for better notification playback stability
   * @param {boolean} [options.onlyWhenPlaying] Only play a notification if currently playing music. You don't have to check if the user is home ;)
   * @param {number} [options.timeout] Number of seconds the notification should play, as a fallback if the event doesn't come through.
   * @param {number} [options.volume] Change the volume for the notication and revert afterwards.
   * @returns {Promise<boolean>} returns true if notification actually played
   * @memberof SonosDevice
   */
  public async PlayTTS(options: PlayTtsOptions): Promise<boolean> {
    this.debug('PlayTTS(%o)', options);
    const notificationOptions = await TtsHelper.TtsOptionsToNotification(options);
    if (typeof (notificationOptions) === 'undefined') {
      return false;
    }

    return await this.PlayNotification(notificationOptions);
  }

  /**
   * Check the event subscriptions for all known devices.
   *
   * @returns {Promise<void>}
   * @memberof SonosManager
   */
  public async CheckAllEventSubscriptions(): Promise<void> {
    await this.zoneService?.CheckEventListener();
    await Promise.all(this.devices.map((device) => device.RefreshEventSubscriptions()));
  }
}
