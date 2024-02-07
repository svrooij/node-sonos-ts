import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter';
import fetch from 'node-fetch';
import WebSocket from 'ws';
import SonosDeviceBase from './sonos-device-base';
import {
  GetZoneInfoResponse, GetZoneAttributesResponse, AddURIToQueueResponse, AVTransportServiceEvent, RenderingControlServiceEvent, MusicService, AccountData,
} from './services';
import {
  PlayNotificationOptions, Alarm, TransportState, GroupTransportState, ExtendedTransportState, ServiceEvents, SonosEvents, PatchAlarm, PlayTtsOptions, BrowseResponse, ZoneGroup, ZoneMember, PlayMode, Repeat,
} from './models';
import { StrongSonosEvents } from './models/strong-sonos-events';
import { EventsError } from './models/event-errors';
import AsyncHelper from './helpers/async-helper';
import MetadataHelper from './helpers/metadata-helper';
import { SmapiClient } from './musicservices/smapi-client';
import IpHelper from './helpers/ip-helper';
import JsonHelper from './helpers/json-helper';
import TtsHelper from './helpers/tts-helper';
import PlayModeHelper from './helpers/playmode-helper';
import DeviceDescription from './models/device-description';
import { SonosState } from './models/sonos-state';
import {
  PlayNotificationTwoOptions, PlayTtsTwoOptions,
} from './models/notificationQueue';
import SonosDeviceNotifications from './sonos-notification-two';
import XmlHelper from './helpers/xml-helper';

/**
 * Main class to control a single sonos device.
 *
 * @export
 * @class SonosDevice
 * @extends {SonosDeviceBase}
 */
export default class SonosDevice extends SonosDeviceBase {
  private name: string | undefined;

  private groupName: string | undefined;

  private coordinator: SonosDevice | undefined;

  /**
   * Creates an instance of SonosDevice.
   * @param {string} host the ip or host of the speaker you want to add
   * @param {number} [port=1400] the port (is always 1400)
   * @param {(string | undefined)} [uuid=undefined] the uuid of the speaker, is set by the SonosManager. like RINCON_macaddres01400, used in some commands
   * @param {(string | undefined)} [name=undefined] the name of the speaker, is set by the SonosManager by default
   * @param {({coordinator?: SonosDevice; name: string; managerEvents: EventEmitter} | undefined)} [groupConfig=undefined] groupConfig is used by the SonosManager to setup group change events.
   * @memberof SonosDevice
   */
  constructor(host: string, port = 1400, uuid: string | undefined = undefined, name: string | undefined = undefined, groupConfig: { coordinator?: SonosDevice; name: string; managerEvents: EventEmitter } | undefined = undefined) {
    super(host, port, uuid);
    this.name = name;
    if (groupConfig) {
      this.groupName = groupConfig.name;
      if (groupConfig.coordinator !== undefined && uuid !== groupConfig.coordinator.uuid) {
        this.coordinator = groupConfig.coordinator;
        this.handleCoordinatorSimpleStateEvent(this.coordinator.currentTransportState === TransportState.Playing ? TransportState.Playing : TransportState.Stopped);
      }
      if (uuid) {
        groupConfig.managerEvents.on(uuid, this.boundHandleGroupUpdate);
      }
    }

    if (IpHelper.IsIpv4(this.host) === false) {
      this.debug('Sonos devices don\'t like hostnames, resolve once is faster IpHelper.ResolveHostname(host)');
    }
  }

  /**
   * Preload some device data, should be called before accessing most properties of this class.
   *
   * @returns {Promise<boolean>} Either returns true or throws an error
   * @memberof SonosDevice
   */
  public async LoadDeviceData(): Promise<boolean> {
    this.zoneAttributes = await this.GetZoneAttributes();
    this.name = this.zoneAttributes.CurrentZoneName;
    this.volume = (await this.RenderingControlService.GetVolume({ InstanceID: 0, Channel: 'Master' })).CurrentVolume;
    this.muted = (await this.RenderingControlService.GetMute({ InstanceID: 0, Channel: 'Master' })).CurrentMute;
    return true;
  }

  /**
   * Returns true if this device has no coordinator, meaning it's the group coordinator.
   */
  public get IsCoordinator(): boolean {
    return this.coordinator === undefined;
  }

  // #region Added functionality
  /**
   * Add One track to the queue
   *
   * @param {string} trackUri
   * @param {number} [positionInQueue=0]
   * @param {boolean} [enqueueAsNext=true]
   * @returns {Promise<AddURIToQueueResponse>}
   * @memberof SonosDevice
   */
  public async AddUriToQueue(trackUri: string, positionInQueue = 0, enqueueAsNext = true): Promise<AddURIToQueueResponse> {
    const guessedMetaData = MetadataHelper.GuessMetaDataAndTrackUri(trackUri);

    return await this.AVTransportService.AddURIToQueue({
      InstanceID: 0,
      EnqueuedURI: guessedMetaData.trackUri,
      EnqueuedURIMetaData: guessedMetaData.metadata,
      DesiredFirstTrackNumberEnqueued: positionInQueue,
      EnqueueAsNext: enqueueAsNext,
    });
  }

  /**
   * Get a parsed list of all alarms.
   *
   * @returns {Promise<Alarm[]>}
   * @deprecated Will be removed in favor of Extended AlarmClockService
   * @memberof SonosDevice
   */
  public async AlarmList(): Promise<Alarm[]> {
    return await this.AlarmClockService.ListAndParseAlarms();
  }

  /**
   * Patch a single alarm. Only the ID and one property you want to change are required.
   *
   * @param {PatchAlarm} [options]
   * @param {number} options.ID The ID of the alarm to update
   * @param {string | undefined} options.StartLocalTime The time the alarm has to start 'hh:mm:ss'
   * @param {string | undefined} options.Duration The duration of the alarm 'hh:mm:ss'
   * @param {string | undefined} options.Recurrence What should the recurrence be ['DAILY','ONCE','WEEKDAYS']
   * @param {boolean | undefined} options.Enabled Should this alarm be enabled
   * @param {PlayMode | undefined} options.PlayMode What playmode should be used
   * @param {number | undefined} options.Volume The requested alarm volume
   * @deprecated Will be removed in favor of Extended AlarmClockService
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async AlarmPatch(options: PatchAlarm): Promise<boolean> {
    return await this.AlarmClockService.PatchAlarm(options);
  }

  /**
   * Execute any sonos command by name, see examples/commands.js
   *
   * @param {string} command Command you wish to execute, like 'Play' or 'AVTransportService.Pause'. CASE SENSITIVE!!!
   * @param {(string | unknown | number | undefined)} options If the function requires options specify them here. A json string is automatically parsed to an object (if possible).
   * @returns {Promise<unknown>}
   * @memberof SonosDevice
   */
  public ExecuteCommand(command: string, options?: string | unknown | number): Promise<unknown> {
    let service = '';
    let correctCommand = command;
    if (command.indexOf('.') > -1) {
      const split = command.split('.', 2);
      [service, correctCommand] = split;
    }
    const foundService = this.GetServiceByName(service);
    const objectToCallOn = typeof foundService !== 'undefined'
      ? foundService as unknown as { [key: string]: any }
      : this.executeCommandGetFunctions();

    const proto = Object.getPrototypeOf(objectToCallOn);
    const propertyDescriptions = Object.getOwnPropertyDescriptors(proto);
    const baseProto = Object.getPrototypeOf(proto);
    const basePropertyDescriptions = Object.getOwnPropertyDescriptors(baseProto);
    const allKeys = [...Object.keys(propertyDescriptions), ...Object.keys(basePropertyDescriptions)];
    const functionToCall = allKeys.find((key) => key.toLowerCase() === correctCommand.toLowerCase());

    if (typeof functionToCall === 'string' && typeof (objectToCallOn[functionToCall]) === 'function') {
      if (options === undefined) {
        return objectToCallOn[functionToCall]();
      }
      if (typeof (options) === 'string') {
        const parsedOptions = JsonHelper.TryParse(options);
        return objectToCallOn[functionToCall](parsedOptions);
      }
      // number or object options;
      return objectToCallOn[functionToCall](options);
    }
    throw new Error(`Command ${correctCommand} isn't a function`);
  }

  private executeCommandGetFunctions(): { [key: string]: any } {
    // This code looks weird, but is required to convince TypeScript this is actually what we want.
    return this as unknown as { [key: string]: any };
  }

  /**
   * Get the device description
   *
   * @returns {Promise<DeviceDescription>}
   * @memberof SonosDevice
   */
  public async GetDeviceDescription(): Promise<DeviceDescription> {
    const resp = await fetch(`http://${this.Host}:${this.port}/xml/device_description.xml`)
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw new Error(`Loading device description failed ${response.status} ${response.statusText}`);
      });
    const { root: { device } } = XmlHelper.ParseXml(resp) as { root: { device: any } };
    return {
      manufacturer: device.manufacturer,
      modelNumber: device.modelNumber,
      modelDescription: device.modelDescription,
      modelName: device.modelName,
      softwareVersion: device.softwareVersion,
      swGen: device.swGen,
      hardwareVersion: device.hardwareVersion,
      serialNumber: device.serialNum,
      udn: device.UDN,
      minCompatibleVersion: device.minCompatibleVersion,
      legacyCompatibleVersion: device.legacyCompatibleVersion,
      apiVersion: device.apiVersion,
      minApiVersion: device.minApiVersion,
      displayVersion: device.displayVersion,
      extraVersion: device.extraVersion,
      roomName: device.roomName,
      displayName: device.displayName,
      zoneType: device.zoneType,
      internalSpeakerSize: device.internalSpeakerSize,
      iconUrl: `http://${this.Host}:${this.port}${device.iconList.icon.url}`,
      feature1: device.feature1,
      feature2: device.feature2,
      feature3: device.feature3,
    } as DeviceDescription;
  }

  /**
   * Get your favorite radio shows, just a browse shortcut.
   *
   * @returns {Promise<BrowseResponse>}
   * @memberof SonosDevice
   */
  public async GetFavoriteRadioShows(): Promise<BrowseResponse> {
    return await this.ContentDirectoryService.BrowseParsedWithDefaults('R:0/1');
  }

  /**
   * Get your favorite radio stations, just a browse shortcut.
   *
   * @returns {Promise<BrowseResponse>}
   * @memberof SonosDevice
   */
  public async GetFavoriteRadioStations(): Promise<BrowseResponse> {
    return await this.ContentDirectoryService.BrowseParsedWithDefaults('R:0/0');
  }

  /**
   * Get your favorite songs, just a browse shortcut.
   *
   * @returns {Promise<BrowseResponse>}
   * @memberof SonosDevice
   */
  public async GetFavorites(): Promise<BrowseResponse> {
    return await this.ContentDirectoryService.BrowseParsedWithDefaults('FV:2');
  }

  /**
   * Get the current queue, just a browse shortcut.
   *
   * @returns {Promise<BrowseResponse>}
   * @memberof SonosDevice
   */
  public async GetQueue(): Promise<BrowseResponse> {
    return await this.ContentDirectoryService.BrowseParsedWithDefaults('Q:0');
  }

  /**
   * Join this device to an other group, if you know the coordinator uuid you can do .AVTransportService.SetAVTransportURI({InstanceID: 0, CurrentURI: `x-rincon:${uuid}`, CurrentURIMetaData: ''})
   *
   * @param {string} otherDevice The name of the other device, (to find the needed coordinator uuid)
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async JoinGroup(otherDevice: string): Promise<boolean> {
    this.debug('JoinGroup(%s)', otherDevice);
    const zones = await this.ZoneGroupTopologyService.GetParsedZoneGroupState();

    const groupToJoin = zones.find((z: ZoneGroup) => z.members.some((m) => m.name.toLowerCase() === otherDevice.toLowerCase()));
    if (groupToJoin === undefined) {
      throw new Error(`Player '${otherDevice}' isn't found!`);
    }

    if (groupToJoin.members.some((m: ZoneMember) => m.uuid === this.Uuid)) {
      return Promise.resolve(false); // Already in the group.
    }
    return await this.AVTransportService.SetAVTransportURI({ InstanceID: 0, CurrentURI: `x-rincon:${groupToJoin.coordinator.uuid}`, CurrentURIMetaData: '' });
  }

  public async LoadUuid(force = false): Promise<string> {
    if (!this.uuid.startsWith('RINCON') || force) {
      const attributes = await this.DevicePropertiesService.GetZoneInfo();
      this.uuid = `RINCON_${attributes.MACAddress.replace(/:/g, '')}0${this.port}`;
    }
    return this.uuid;
  }

  private deviceId?: string;

  /**
   * Create a client for a specific music service
   *
   * @param {number} id The id of the music service, see MusicServicesList
   * @param {string} options.key Cached authentication key
   * @param {string} options.authToken Cached authentication token
   * @returns {Promise<SmapiClient>}
   * @memberof SonosDevice
   */
  public async MusicServicesClient(serviceId: number, options: { key?: string; authToken?: string } = {}): Promise<SmapiClient> {
    if (this.deviceId === undefined) this.deviceId = (await this.SystemPropertiesService.GetString({ VariableName: 'R_TrialZPSerial' })).StringValue;
    const services = await this.MusicServicesService.ListAndParseAvailableServices(true);
    if (services === undefined) throw new Error('Music list could not be loaded');

    const service = services.find((s) => s.Id === serviceId);
    if (service === undefined) throw new Error('MusicService could not be found');

    // if (service.Policy.Auth !== 'Anonymous') throw new Error('Music service requires authentication, which isn\'t supported (yet)');
    let accountData: AccountData | undefined;
    if (service.Policy.Auth === 'AppLink' || service.Policy.Auth === 'DeviceLink') {
      accountData = await this.SystemPropertiesService.GetAccountData(serviceId);
    }

    return new SmapiClient({
      name: service.Name,
      auth: service.Policy.Auth,
      url: service.SecureUri || service.Uri,
      deviceId: this.deviceId,
      serviceId: service.Id,
      householdId: service.Policy.Auth === 'AppLink' || service.Policy.Auth === 'DeviceLink' ? (await this.DevicePropertiesService.GetHouseholdID()).CurrentHouseholdID : undefined,
      authToken: accountData?.AuthToken ?? options.authToken,
      key: accountData?.Key ?? options.key,
      saveNewAccount: async (serviceName, key, token) => {
        await this.SystemPropertiesService.SaveAccount(serviceName, key, token);
      },
    });
  }

  /**
   * Music services the user is logged-in to
   *
   * @returns {(Promise<Array<MusicService>>)}
   * @memberof SonosDevice
   */
  public async MusicServicesSubscribed(): Promise<Array<MusicService> | undefined> {
    const ids = await this.SystemPropertiesService.SavedAccounts();
    if (ids === undefined || ids.length === 0) {
      return undefined;
    }
    const list = await this.MusicServicesService.ListAndParseAvailableServices(true);
    return list.filter((m: MusicService) => ids.indexOf(m.Id) > -1);
  }

  /**
   * Get the state of the speaker, which can be reverted to with RestoreState
   */
  public async GetState(): Promise<SonosState> {
    if (this.muted === undefined) {
      this.muted = (await this.RenderingControlService.GetMute({ InstanceID: 0, Channel: 'Master' })).CurrentMute;
    }
    if (this.volume === undefined) {
      this.volume = (await this.RenderingControlService.GetVolume({ InstanceID: 0, Channel: 'Master' })).CurrentVolume;
    }
    return {
      mediaInfo: await this.AVTransportService.GetMediaInfo(),
      muted: this.Muted === true,
      positionInfo: await this.AVTransportService.GetPositionInfo(),
      transportState: this.CurrentTransportStateSimple ?? (await this.AVTransportService.GetTransportInfo()).CurrentTransportState as TransportState,
      volume: this.volume,
    };
  }

  /**
   * Restore to the state from before, used internally by the notification system.
   *
   * @param state The state of the speaker from 'GetState()'
   * @param delayBetweenCommands Sonos speakers cannot process commands fast after each other. use 50ms - 800ms for best results
   */
  public async RestoreState(state: SonosState, delayBetweenCommands: number | undefined = undefined): Promise<boolean> {
    if (this.Volume !== state.volume) {
      await this.SetVolume(state.volume);
      if (delayBetweenCommands !== undefined) await AsyncHelper.Delay(delayBetweenCommands);
    }

    if (this.Muted !== state.muted) {
      await this.RenderingControlService.SetMute({ InstanceID: 0, Channel: 'Master', DesiredMute: state.muted });
    }

    const isBroadcast = typeof state.mediaInfo.CurrentURIMetaData !== 'string' // Should not happen, is parsed in the service
                        && state.mediaInfo.CurrentURIMetaData?.UpnpClass === 'object.item.audioItem.audioBroadcast'; // This UpnpClass should for sure be skipped.

    await this.AVTransportService.SetAVTransportURI({ InstanceID: 0, CurrentURI: state.mediaInfo.CurrentURI, CurrentURIMetaData: state.mediaInfo.CurrentURIMetaData });
    if (delayBetweenCommands !== undefined) await AsyncHelper.Delay(delayBetweenCommands);

    if (state.positionInfo.Track > 1 && state.mediaInfo.NrTracks > 1) {
      this.debug('Selecting track %d', state.positionInfo.Track);
      await this.SeekTrack(state.positionInfo.Track)
        .catch((err) => {
          this.debug('Error selecting track, happens with some music services %o', err);
        });

      if (delayBetweenCommands !== undefined) await AsyncHelper.Delay(delayBetweenCommands);
    }

    if (state.positionInfo.RelTime && state.mediaInfo.MediaDuration !== '0:00:00' && !isBroadcast) {
      this.debug('Setting back time to %s', state.positionInfo.RelTime);
      await this.SeekPosition(state.positionInfo.RelTime)
        .catch((err) => {
          this.debug('Reverting back track time failed, happens for some music services (radio or stream). %o', err);
        });
      if (delayBetweenCommands !== undefined) await AsyncHelper.Delay(delayBetweenCommands);
    }

    if (state.transportState === TransportState.Playing || state.transportState === TransportState.Transitioning) {
      await this.AVTransportService.Play({ InstanceID: 0, Speed: '1' });
    }
    return true;
  }

  // Internal notification queue
  private notifications: PlayNotificationOptions[] = [];

  private playingNotification?: boolean;

  /**
   * Play some url, and revert back to what was playing before. Very useful for playing a notification or TTS sound.
   *
   * @param {PlayNotificationOptions} options The options
   * @param {string} [options.trackUri] The uri of the sound to play as notification, can be every supported sonos uri.
   * @param {string|Track} [options.metadata] The metadata of the track to play, will be guesses if undefined.
   * @param {number} [options.delayMs] Delay in ms between commands, for better notification playback stability. Use 100 to 800 for best results
   * @param {callback} [options.notificationFired] Specify a callback that is called when this notification has played.
   * @param {boolean} [options.onlyWhenPlaying] Only play a notification if currently playing music. You don't have to check if the user is home ;)
   * @param {number} [options.timeout] Number of seconds the notification should play, as a fallback if the event doesn't come through.
   * @param {number} [options.volume] Change the volume for the notification and revert afterwards.
   * @returns {Promise<true>} Returns when added to queue or (for the first) when all notifications have played.
   * @remarks The first notification will return when all notifications have played, notifications send in between will return when added to the queue.
   * Use 'notificationFired' in the request if you want to know when your specific notification has played.
   * @memberof SonosDevice
   */
  public async PlayNotification(options: PlayNotificationOptions): Promise<boolean> {
    this.debug('PlayNotification(%o)', options);

    if (options.delayMs !== undefined && (options.delayMs < 1 || options.delayMs > 4000)) {
      throw new Error('Delay (if specified) should be between 1 and 4000');
    }

    if (options.volume !== undefined && (options.volume < 1 || options.volume > 100)) {
      throw new Error('Volume needs to be between 1 and 100');
    }

    const playingNotification = this.playingNotification === true;
    this.playingNotification = true;

    // Generate metadata if needed
    if (options.metadata === undefined) {
      const metaOptions = options;
      const guessedMetaData = MetadataHelper.GuessMetaDataAndTrackUri(options.trackUri);
      metaOptions.metadata = guessedMetaData.metadata;
      metaOptions.trackUri = guessedMetaData.trackUri;
      this.notifications.push(metaOptions);
    } else {
      this.notifications.push(options);
    }

    if (playingNotification) {
      this.debug('Notification added to queue');
      return false;
    }

    const state = await this.GetState();
    this.debug('Current transport state is %s', state.transportState);

    // Play all notifications (if calls itself if notifications where added in between)
    const shouldRevert = await this.PlayNextNotification(state.transportState);

    if (shouldRevert) {
      // Revert everything back
      this.debug('Reverting everything back to normal');

      await this.RestoreState(state, options.delayMs).catch((reason) => {
        this.debug('Restoring state failed %s', reason);
      });
    }

    this.playingNotification = undefined;
    return shouldRevert;
  }

  /**
   * Download the url for the specified text, play as a notification and revert back to current track.
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
   * @param {number} [options.volume] Change the volume for the notification and revert afterwards.
   * @returns {Promise<boolean>} Returns when added to queue or (for the first) when all notifications have played.
   * @memberof SonosDevice
   */
  public async PlayTTS(options: PlayTtsOptions): Promise<boolean> {
    this.debug('PlayTTS(%o)', options);

    const notificationOptions = await TtsHelper.TtsOptionsToNotification(options);

    return await this.PlayNotification(notificationOptions);
  }

  private async PlayNextNotification(originalState: TransportState, havePlayed?: boolean): Promise<boolean> {
    let result = havePlayed === true;
    // Remove and returns first item from queue
    const notification = this.notifications.shift();
    if (notification === undefined) {
      return Promise.resolve(result);
    }

    if (notification.onlyWhenPlaying === true && !(originalState === TransportState.Playing || originalState === TransportState.Transitioning)) {
      this.debug('Skip notification, because of not playing %s', notification.trackUri);
      if (notification.notificationFired !== undefined) {
        notification.notificationFired(false);
      }
    } else {
      result = true;
      this.debug('Start notification playback uri %s', notification.trackUri);
      await this.AVTransportService.SetAVTransportURI({ InstanceID: 0, CurrentURI: notification.trackUri, CurrentURIMetaData: notification.metadata ?? '' })
        .catch((reason) => { this.debug('SetAVTransportURI failed', reason); });

      if (notification.volume !== undefined && notification.volume !== this.volume) {
        await this.SetVolume(notification.volume)
          .catch((reason) => { this.debug('Setting volume failed', reason); });

        if (notification.delayMs !== undefined) await AsyncHelper.Delay(notification.delayMs);
      }
      await this.AVTransportService.Play({ InstanceID: 0, Speed: '1' })
        .catch((err) => { this.debug('Play threw error, wrong url? %o', err); });

      // Wait for event (or timeout)
      await AsyncHelper.AsyncEvent<unknown>(this.Events, SonosEvents.PlaybackStopped, notification.timeout).catch((err) => this.debug(err));

      if (notification.notificationFired !== undefined) {
        notification.notificationFired(true);
      }
    }

    return this.PlayNextNotification(originalState, result);
  }

  // #region Notifications two
  private notificationsTwo?: SonosDeviceNotifications;

  /**
   * A second implementation of PlayNotification.
   *
   * @param {PlayNotificationOptions} options The options
   * @param {string} [options.trackUri] The uri of the sound to play as notification, can be every supported sonos uri.
   * @param {string|Track} [options.metadata] The metadata of the track to play, will be guesses if undefined.
   * @param {number} [options.delayMs] Delay in ms between commands, for better notification playback stability. Use 100 to 800 for best results
   * @param {boolean} [options.onlyWhenPlaying] Only play a notification if currently playing music. You don't have to check if the user is home ;)
   * @param {number} [options.timeout] Number of seconds the notification should play, as a fallback if the event doesn't come through.
   * @param {number} [options.volume] Change the volume for the notification and revert afterwards.
   * @param {boolean} [options.resolveAfterRevert]
   * @param {number} [options.defaultTimeout]
   * @param {number} [options.specificTimeout]
   * @param {boolean} [options.catchQueueErrors]
   *
   * @deprecated This is experimental, do not depend on this. (missing the jsdocs experimental descriptor)
   * @remarks This is just added to be able to test the two implementations next to each other. This will probably be removed in feature.
   */
  public async PlayNotificationTwo(options: PlayNotificationTwoOptions): Promise<boolean> {
    if (this.notificationsTwo === undefined) {
      this.notificationsTwo = new SonosDeviceNotifications(this.AVTransportService, this.RenderingControlService, this.Events);
    }
    return this.notificationsTwo.PlayNotificationTwo(options);
  }

  /**
   * Download the url for the specified text, play as a notification and revert back to current track.
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
   * @param {number} [options.volume] Change the volume for the notification and revert afterwards.
   * @param {boolean} [options.resolveAfterRevert]
   * @param {number} [options.defaultTimeout]
   * @param {number} [options.specificTimeout]
   * @param {boolean} [options.catchQueueErrors]
   * @deprecated TTS using experimental notification feature
   * @returns {Promise<boolean>} Returns when added to queue or (for the first) when all notifications have played.
   * @memberof SonosDevice
   */
  public async PlayTTSTwo(options: PlayTtsTwoOptions): Promise<boolean> {
    this.debug('PlayTTSTwo(%o)', options);

    const notificationOptions = await TtsHelper.TtsOptionsToNotification(options);

    return await this.PlayNotificationTwo({
      ...notificationOptions,
      catchQueueErrors: options.catchQueueErrors,
      resolveAfterRevert: options.resolveAfterRevert,
      defaultTimeout: options.defaultTimeout,
      specificTimeout: options.specificTimeout,
    });
  }

  // #endregion

  // #region Notification AudioClip
  /**
   * Play an audio clip through the native (local) AudioClip command
   *
   * @param {PlayNotificationOptions} options The options
   * @param {string} [options.trackUri] The uri of the sound to play as notification, can be every supported sonos uri.
   * @param {boolean} [options.onlyWhenPlaying] Only play a notification if currently playing music. You don't have to check if the user is home ;)
   * @param {number} [options.volume] Change the volume for the notification and revert afterwards.
   * @returns {Promise<true>} Returns true when the AudioClip is send to the speaker, false when stopped and onlyWhenPlaying === true
   * @remarks This is only supported on S2 speakers, see: https://developer.sonos.com/reference/control-api/audioclip/
   * @experimental This is experimental, do not depend on this.
   * @memberof SonosDevice
   */
  public async PlayNotificationAudioClip(options: PlayNotificationOptions): Promise<boolean> {
    this.debug('PlayNotificationAudioClip(%o)', options);
    if (options.onlyWhenPlaying === true && this.CurrentTransportStateSimple === TransportState.Stopped) {
      return false;
    }

    if (options.volume !== undefined && (options.volume < 1 || options.volume > 100)) {
      throw new Error('Volume needs to be between 1 and 100');
    }

    if (!this.uuid.startsWith('RINCON')) {
      await this.LoadUuid(true);
    }

    // Have no idea if this should be public
    // https://github.com/bencevans/node-sonos/issues/530#issuecomment-1430039043
    const apiKey = '123e4567-e89b-12d3-a456-426655440000';
    return new Promise<boolean>((resolve, reject) => {
      const ws = new WebSocket(`wss://${this.host}:1443/websocket/api`, 'v1.api.smartspeaker.audio', {
        headers: {
          'X-Sonos-Api-Key': apiKey,
        },
        // Ignore certificate errors
        rejectUnauthorized: false,
      });
      ws.on('error', (err) => {
        reject(err);
      });
      // On socket opened send a message, and close the socket
      ws.on('open', () => {
        ws.send(`[{"namespace":"audioClip:1","command":"loadAudioClip","playerId":"${this.uuid}","sessionId":null,"cmdId":null},{"name": "Sonos TS Notification", "appId": "io.svrooij.sonos-ts", "streamUrl": "${options.trackUri}", "volume": ${options.volume ?? this.volume ?? 25} }]`, (err) => {
          ws.close();
          if (err) {
            reject(err);
            return;
          }
          resolve(true);
        });
      });
    });
  }

  /**
   * PlayTTS, but with (experimental) local AudioClip method
   *
   * @param {PlayTtsOptions} options
   * @param {string} options.text Text to request a TTS file for.
   * @param {string} options.lang Language to request tts file for.
   * @param {string} [options.endpoint] TTS endpoint, see documentation, can also be set by environment variable 'SONOS_TTS_ENDPOINT'
   * @param {string} [options.gender] Supply gender, some languages support both genders.
   * @param {string} [options.name] Supply voice name, some services support several voices with different names.
   * @param {boolean} [options.onlyWhenPlaying] Only play a notification if currently playing music. You don't have to check if the user is home ;)
   * @param {number} [options.volume] Change the volume for the notification and revert afterwards.
   * @returns {Promise<boolean>} Returns when added to queue or (for the first) when all notifications have played.
   * @experimental This is experimental, do not depend on this.
   * @memberof SonosDevice
   */
  public async PlayTTSAudioClip(options: PlayTtsOptions): Promise<boolean> {
    this.debug('PlayTTSAudioClip(%o)', options);

    const notificationOptions = await TtsHelper.TtsOptionsToNotification(options);

    return await this.PlayNotificationAudioClip(notificationOptions);
  }

  // #endregion
  /**
   * Switch the playback to this url.
   *
   * @param {string} trackUri
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async SetAVTransportURI(trackUri: string): Promise<boolean> {
    const guessedMetaData = MetadataHelper.GuessMetaDataAndTrackUri(trackUri);
    return await this.AVTransportService.SetAVTransportURI({ InstanceID: 0, CurrentURI: guessedMetaData.trackUri, CurrentURIMetaData: guessedMetaData.metadata });
  }

  /**
   * Switch playback to line in (which will always be playing)
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async SwitchToLineIn(): Promise<boolean> {
    await this.LoadUuid();
    await this.AVTransportService
      .SetAVTransportURI({ InstanceID: 0, CurrentURI: `x-rincon-stream:${this.uuid}`, CurrentURIMetaData: '' });
    return await this.Play();
  }

  /**
   * Switch playback to the queue
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async SwitchToQueue(): Promise<boolean> {
    await this.LoadUuid();
    return await this.AVTransportService
      .SetAVTransportURI({ InstanceID: 0, CurrentURI: `x-rincon-queue:${this.uuid}#0`, CurrentURIMetaData: '' });
  }

  /**
   * Switch playback to TV Input (only on Playbar)
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async SwitchToTV(): Promise<boolean> {
    await this.LoadUuid();
    await this.AVTransportService
      .SetAVTransportURI({ InstanceID: 0, CurrentURI: `x-sonos-htastream:${this.uuid}:spdif`, CurrentURIMetaData: '' });
    return await this.Play();
  }

  /**
   * Toggle playback between paused and playing
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async TogglePlayback(): Promise<boolean> {
    // Load the Current state first, if not present (eg. not using events)
    const currentState = this.Coordinator.CurrentTransportStateSimple || (await this.Coordinator.AVTransportService.GetTransportInfo()).CurrentTransportState as TransportState;
    return currentState === TransportState.Playing || currentState === TransportState.Transitioning
      ? await this.Coordinator.Pause()
      : await this.Coordinator.Play();
  }
  // #endregion

  // #region Events
  private events?: TypedEmitter<StrongSonosEvents>;

  private isSubscribed = false;

  /**
   * Cancel all subscriptions and unsubscribe for events from this device.
   *
   * @memberof SonosDevice
   */
  public CancelEvents(): void {
    if (this.events !== undefined) {
      const eventNames = this.events.eventNames().filter((e) => e !== 'removeListener' && e !== 'newListener' && e !== SonosEvents.SubscriptionError) as (keyof StrongSonosEvents)[];
      eventNames.forEach((e) => {
        if (this.events !== undefined) this.events.removeAllListeners(e);
      });
    }
  }

  /**
   * Access to the sonos event emitter. All the possible events are in the SonosEvents enum.
   * Calling this will automatically subscribe for events from the device.
   *
   * @readonly
   * @type {EventEmitter}
   * @memberof SonosDevice
   */
  public get Events(): TypedEmitter<StrongSonosEvents> {
    if (this.events !== undefined) {
      return this.events;
    }

    // this.events = new EventEmitter() as TypedEmitter<StrongSonosEvents>; incorrect according to DeepSource
    this.events = new EventEmitter() as TypedEmitter<StrongSonosEvents>;
    this.events.on('removeListener', (eventName: string | symbol) => {
      this.debug('Listener removed for %s', eventName);
      if (eventName === SonosEvents.SubscriptionError) return;
      const events = this.Events.eventNames().filter((e) => e !== 'removeListener' && e !== 'newListener' && e !== SonosEvents.SubscriptionError);
      if (events.length === 0) {
        this.AVTransportService.Events.removeListener(ServiceEvents.ServiceEvent, this.boundHandleAvTransportEvent);
        this.AVTransportService.Events.removeListener(ServiceEvents.SubscriptionError, this.boundHandleEventErrorEvent);
        this.RenderingControlService.Events.removeListener(ServiceEvents.ServiceEvent, this.boundHandleRenderingControlEvent);
        this.RenderingControlService.Events.removeListener(ServiceEvents.SubscriptionError, this.boundHandleEventErrorEvent);
        this.coordinator?.events?.removeListener('simpleTransportState', this.boundHandleCoordinatorSimpleStateEvent);
        this.isSubscribed = false;
      }
    });
    this.events.on('newListener', (eventName: string | symbol) => {
      this.debug('Listener added for %s (isSubscribed: %o)', eventName, this.isSubscribed);
      if (eventName === SonosEvents.SubscriptionError) return;
      if (!this.isSubscribed) {
        this.isSubscribed = true;
        this.AVTransportService.Events.on(ServiceEvents.SubscriptionError, this.boundHandleEventErrorEvent);
        this.AVTransportService.Events.on(ServiceEvents.ServiceEvent, this.boundHandleAvTransportEvent);
        this.RenderingControlService.Events.on(ServiceEvents.SubscriptionError, this.boundHandleEventErrorEvent);
        this.RenderingControlService.Events.on(ServiceEvents.ServiceEvent, this.boundHandleRenderingControlEvent);
        if (this.coordinator !== undefined) {
          this.coordinator?.Events.on('simpleTransportState', this.boundHandleCoordinatorSimpleStateEvent);
          this.boundHandleCoordinatorSimpleStateEvent(this.coordinator.CurrentTransportStateSimple);
        }
      }
    });
    return this.events;
  }

  private boundHandleEventErrorEvent = this.handleEventErrorEvent.bind(this);

  private handleEventErrorEvent(err: EventsError): void {
    if (this.events !== undefined) {
      this.events.emit(SonosEvents.SubscriptionError, err);
    }
  }

  private boundHandleAvTransportEvent = this.handleAvTransportEvent.bind(this);

  private handleAvTransportEvent(data: AVTransportServiceEvent): void {
    this.Events.emit(SonosEvents.AVTransport, data);
    if (data.TransportState !== undefined && this.coordinator === undefined) {
      const newState = data.TransportState as TransportState;
      const newSimpleState = newState === TransportState.Paused || newState === TransportState.Stopped ? TransportState.Stopped : TransportState.Playing;
      this.debug('Received TransportState new State "%s" newSimpleState "%s"', newState, newSimpleState);
      if (newSimpleState !== this.CurrentTransportStateSimple) this.Events.emit(SonosEvents.CurrentTransportStateSimple, newSimpleState);

      if (this.currentTransportState !== newState) {
        this.currentTransportState = newState;
        this.Events.emit(SonosEvents.CurrentTransportState, newState);
        if (newState === TransportState.Stopped) this.Events.emit(SonosEvents.PlaybackStopped);
      }
    }

    if (data.CurrentTrackURI && this.currentTrackUri !== data.CurrentTrackURI) {
      this.currentTrackUri = data.CurrentTrackURI;
      this.Events.emit(SonosEvents.CurrentTrackUri, this.currentTrackUri ?? '');
    }

    if (data.CurrentTrackMetaData && typeof data.CurrentTrackMetaData !== 'string') this.Events.emit(SonosEvents.CurrentTrackMetadata, data.CurrentTrackMetaData);

    if (data.NextTrackURI && this.nextTrackUri !== data.NextTrackURI) {
      this.nextTrackUri = data.NextTrackURI;
      this.Events.emit(SonosEvents.NextTrackUri, this.nextTrackUri ?? '');
      if (data.NextTrackMetaData && typeof data.NextTrackMetaData !== 'string') this.Events.emit(SonosEvents.NextTrackMetadata, data.NextTrackMetaData);
    }

    if (data.EnqueuedTransportURI && this.enqueuedTransportUri !== data.EnqueuedTransportURI) {
      this.enqueuedTransportUri = data.EnqueuedTransportURI;
      this.Events.emit(SonosEvents.EnqueuedTransportUri, this.enqueuedTransportUri ?? '');
      if (data.EnqueuedTransportURIMetaData !== undefined && typeof data.EnqueuedTransportURIMetaData !== 'string') this.Events.emit(SonosEvents.EnqueuedTransportMetadata, data.EnqueuedTransportURIMetaData);
    }

    if (data.CurrentPlayMode) {
      this.currentPlayMode = data.CurrentPlayMode;
    }
  }

  private boundHandleRenderingControlEvent = this.handleRenderingControlEvent.bind(this);

  private handleRenderingControlEvent(data: RenderingControlServiceEvent): void {
    this.Events.emit(SonosEvents.RenderingControl, data);

    if (data.Volume && data.Volume.Master && this.volume !== data.Volume.Master) {
      this.volume = data.Volume.Master;
      this.Events.emit(SonosEvents.Volume, this.volume ?? 0);
    }

    if (data.Mute && this.muted !== data.Mute.Master) {
      this.muted = data.Mute.Master;
      this.Events.emit(SonosEvents.Mute, this.muted);
    }
  }

  private boundHandleCoordinatorSimpleStateEvent = this.handleCoordinatorSimpleStateEvent.bind(this);

  private handleCoordinatorSimpleStateEvent(state: TransportState | undefined): void {
    const newState = state === TransportState.Playing ? GroupTransportState.GroupPlaying : GroupTransportState.GroupStopped;
    this.events?.emit('transportState', newState);
    this.currentTransportState = newState;
  }
  // #endregion

  // #region Group stuff
  private boundHandleGroupUpdate = this.handleGroupUpdate.bind(this);

  private handleGroupUpdate(data: { coordinator: SonosDevice | undefined; name: string }): void {
    if (data.coordinator && data.coordinator?.uuid !== this.Uuid && (!this.coordinator || this.coordinator?.Uuid !== data.coordinator?.Uuid)) {
      this.debug('Coordinator changed for %s', this.uuid);
      this.coordinator?.events?.removeListener('simpleTransportState', this.boundHandleCoordinatorSimpleStateEvent);
      this.coordinator = data.coordinator;
      if (this.events !== undefined) {
        // this.boundHandleCoordinatorSimpleStateEvent(this.coordinator.CurrentTransportStateSimple);
        this.events.emit(SonosEvents.Coordinator, this.coordinator.uuid);
        this.coordinator?.Events.on('simpleTransportState', this.boundHandleCoordinatorSimpleStateEvent);
        setTimeout(() => {
          this.boundHandleCoordinatorSimpleStateEvent(this.coordinator?.CurrentTransportStateSimple);
        }, 50);
      }
    }
    if (this.coordinator && (data.coordinator === undefined || data.coordinator.uuid === this.uuid)) {
      this.debug('Coordinator removed for %s', this.uuid);
      this.coordinator?.events?.removeListener('simpleTransportState', this.boundHandleCoordinatorSimpleStateEvent);
      this.coordinator = undefined;
      if (this.events !== undefined) {
        this.events.emit(SonosEvents.Coordinator, this.uuid);
        this.currentTransportState = undefined;
        this.events.emit(SonosEvents.CurrentTransportState, TransportState.Stopped);
        this.events.emit(SonosEvents.CurrentTransportStateSimple, TransportState.Stopped);
      }
    }
    if (data.name && data.name !== this.groupName) {
      this.groupName = data.name;
      this.debug('Groupname changed for %s to %s', this.uuid, this.groupName);
      if (this.events !== undefined) {
        this.events.emit(SonosEvents.GroupName, this.groupName);
      }
    }
  }

  /**
   * Get the current coordinator for this group, or the device itself if if doesn't have a coordinator.
   *
   * @readonly
   * @type {SonosDevice}
   * @memberof SonosDevice
   */
  public get Coordinator(): SonosDevice {
    return this.coordinator || this;
  }

  /**
   * Get the GroupName, if device is created by the SonosManager.
   *
   * @readonly
   * @type {(string | undefined)}
   * @memberof SonosDevice
   */
  public get GroupName(): string | undefined {
    return this.groupName;
  }
  // #endregion

  // #region Properties
  private currentPlayMode?: PlayMode;

  /**
   * Current play mode, only set when subscribed to events.
   *
   * @readonly
   * @type {(string | undefined)}
   * @memberof SonosDevice
   */
  public get CurrentPlayMode(): PlayMode | undefined {
    return this.currentPlayMode;
  }

  private currentTrackUri?: string;

  /**
   * Current track uri, only set when subscribed to events.
   *
   * @readonly
   * @type {(string | undefined)}
   * @memberof SonosDevice
   */
  public get CurrentTrackUri(): string | undefined {
    return this.currentTrackUri;
  }

  private enqueuedTransportUri?: string;

  /**
   * Current EnqueuedTransportUri only set when listening to events
   *
   * @readonly
   * @type {(string | undefined)}
   * @memberof SonosDevice
   */
  public get EnqueuedTransportUri(): string | undefined {
    return this.enqueuedTransportUri;
  }

  private nextTrackUri?: string;

  /**
   * Next Track Uri only set when listening to events
   *
   * @readonly
   * @type {(string | undefined)}
   * @memberof SonosDevice
   */
  public get NextTrackUri(): string | undefined {
    return this.nextTrackUri;
  }

  private currentTransportState?: ExtendedTransportState;

  /**
   * Current transport state, only set when listening for events
   *
   * @readonly
   * @type {(TransportState | undefined)}
   * @memberof SonosDevice
   */
  public get CurrentTransportState(): ExtendedTransportState | undefined {
    return this.currentTransportState;
  }

  /**
   * Get the transportstate (from events) but with only two values TransportState.Stopped or TransportState.Playing
   *
   * @readonly
   * @type {(TransportState | undefined)}
   * @memberof SonosDevice
   */
  public get CurrentTransportStateSimple(): TransportState | undefined {
    const state = this.coordinator?.currentTransportState ?? this.currentTransportState;

    if (state !== undefined) {
      return state === TransportState.Playing || state === TransportState.Transitioning ? TransportState.Playing : TransportState.Stopped;
    }
    return undefined;
  }

  /**
   * The IP of the speaker
   *
   * @readonly
   * @type {string}
   * @memberof SonosDevice
   */
  public get Host(): string { return this.host; }

  private muted?: boolean;

  /**
   * Device muted, only set when subscribed for events.
   *
   * @readonly
   * @type {(boolean | undefined)}
   * @memberof SonosDevice
   */
  public get Muted(): boolean | undefined {
    return this.muted;
  }

  /**
   * Name of this player, set by manager or by calling LoadDeviceData()
   *
   * @readonly
   * @type {string}
   * @memberof SonosDevice
   */
  public get Name(): string {
    if (this.name !== undefined) return this.name;
    if (this.zoneAttributes === undefined) throw new Error('Zone attributes not loaded');
    return this.zoneAttributes.CurrentZoneName;
  }

  public get Port(): number { return this.port; }

  /**
   * UUID of the player, if set by the SonosManager or an guid otherwise.
   *
   * @readonly
   * @type {string}
   * @memberof SonosDevice
   */
  public get Uuid(): string { return this.uuid; }

  private volume?: number;

  /**
   * Current volume of the player, only set when subscribed for events.
   *
   * @readonly
   * @type {(number | undefined)}
   * @memberof SonosDevice
   */
  public get Volume(): number | undefined {
    return this.volume;
  }

  private zoneAttributes: GetZoneAttributesResponse | undefined;
  // #endregion

  // #region Shortcuts

  /**
   * Get nightmode status of playbar.
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async GetNightMode(): Promise<boolean> {
    return (await this.RenderingControlService.GetEQ({ InstanceID: 0, EQType: 'NightMode' })).CurrentValue === 1;
  }

  /**
   * Get repeat setting
   * @returns {Repeat} Repeat part of PlayMode
   */
  public async GetRepeat(): Promise<Repeat> {
    if (this.currentPlayMode === undefined) {
      this.currentPlayMode = (await this.AVTransportService.GetTransportSettings()).PlayMode;
    }

    return PlayModeHelper.ComputeRepeat(this.currentPlayMode);
  }

  /**
   * Get shuffle setting
   * @returns Shuffle part of PlayMode
   */
  public async GetShuffle(): Promise<boolean> {
    if (this.currentPlayMode === undefined) {
      this.currentPlayMode = (await this.AVTransportService.GetTransportSettings()).PlayMode;
    }

    return PlayModeHelper.ComputeShuffle(this.currentPlayMode);
  }

  /**
   * Get Speech Enhancement status of playbar
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async GetSpeechEnhancement(): Promise<boolean> {
    return (await this.RenderingControlService.GetEQ({ InstanceID: 0, EQType: 'DialogLevel' })).CurrentValue === 1;
  }

  /**
   * GetZoneAttributes shortcut to .DevicePropertiesService.GetZoneAttributes()
   *
   * @returns {Promise<GetZoneAttributesResponse>}
   * @memberof SonosDevice
   */
  public async GetZoneAttributes(): Promise<GetZoneAttributesResponse> {
    this.zoneAttributes = await this.DevicePropertiesService.GetZoneAttributes();
    return this.zoneAttributes;
  }

  /**
   * GetZoneGroupState() shortcut to .ZoneGroupTopologyService.GetParsedZoneGroupState()
   *
   * @returns {Promise<ZoneGroup[]>}
   * @memberof SonosDevice
   */
  public async GetZoneGroupState(): Promise<ZoneGroup[]> { return await this.ZoneGroupTopologyService.GetParsedZoneGroupState(); }

  /**
   * GetZoneInfo shortcut to .DevicePropertiesService.GetZoneInfo()
   *
   * @returns {Promise<GetZoneInfoResponse>}
   * @memberof SonosDevice
   */
  public async GetZoneInfo(): Promise<GetZoneInfoResponse> { return await this.DevicePropertiesService.GetZoneInfo(); }

  /**
   * Play next song, shortcut to .Coordinator.AVTransportService.Next()
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async Next(): Promise<boolean> { return await this.Coordinator.AVTransportService.Next(); }

  /**
   * Pause playback, shortcut to .Coordinator.AVTransportService.Pause()
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async Pause(): Promise<boolean> { return await this.Coordinator.AVTransportService.Pause(); }

  /**
   * Start playing, shortcut to .Coordinator.AVTransportService.Play({InstanceID: 0, Speed: '1'})
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async Play(): Promise<boolean> { return await this.Coordinator.AVTransportService.Play({ InstanceID: 0, Speed: '1' }); }

  /**
   * Play previous song, shortcut to .Coordinator.AVTransportService.Previous()
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async Previous(): Promise<boolean> { return await this.Coordinator.AVTransportService.Previous(); }

  /**
   * Seek position in the current track, shortcut to .Coordinator.AVTransportService.Seek({InstanceID: 0, Unit: 'REL_TIME', Target: trackTime})
   *
   * @param {string} trackTime
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async SeekPosition(trackTime: string): Promise<boolean> { return await this.Coordinator.AVTransportService.Seek({ InstanceID: 0, Unit: 'REL_TIME', Target: trackTime }); }

  /**
   * Go to other track in queue, shortcut to .Coordinator.AVTransportService.Seek({InstanceID: 0, Unit: 'TRACK_NR', Target: trackNr.toString()})
   *
   * @param {number} trackNr The track number to go to.
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async SeekTrack(trackNr: number): Promise<boolean> { return await this.Coordinator.AVTransportService.Seek({ InstanceID: 0, Unit: 'TRACK_NR', Target: trackNr.toString() }); }

  /**
   * Turn on/off night mode, on your playbar.
   * shortcut to .RenderingControlService.SetEQ({ InstanceID: 0, EQType: 'NightMode', DesiredValue: dialogLevel === true ? 1 : 0 })
   *
   * @param {boolean} nightmode
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async SetNightMode(nightmode: boolean): Promise<boolean> {
    return await this.RenderingControlService
      .SetEQ({ InstanceID: 0, EQType: 'NightMode', DesiredValue: nightmode === true ? 1 : 0 });
  }

  /**
   * Set relative group volume, shortcut to .Coordinator.GroupRenderingControlService.SetRelativeGroupVolume({ InstanceID: 0, Adjustment: volumeAdjustment })
   *
   * @param {number} volumeAdjustment the adjustment, positive or negative
   * @returns {Promise<number>}
   * @memberof SonosDevice
   */
  public async SetRelativeGroupVolume(volumeAdjustment: number): Promise<number> {
    return await this.Coordinator.GroupRenderingControlService.SetRelativeGroupVolume({ InstanceID: 0, Adjustment: volumeAdjustment })
      .then((response) => response.NewVolume);
  }

  /**
   * Set relative volume, shortcut to .RenderingControlService.SetRelativeVolume({ InstanceID: 0, Channel: 'Master', Adjustment: volumeAdjustment })
   *
   * @param {number} volumeAdjustment the adjustment, positive or negative
   * @returns {Promise<number>}
   * @memberof SonosDevice
   * @remarks Also saves the volume so it can be used by other methods that need the volume (and events aren't working)
   */
  public async SetRelativeVolume(volumeAdjustment: number): Promise<number> {
    return await this.RenderingControlService.SetRelativeVolume({ InstanceID: 0, Channel: 'Master', Adjustment: volumeAdjustment })
      .then((response) => {
        this.volume = response.NewVolume;
        return response.NewVolume;
      });
  }

  /**
   * Set PlayMode based on repeat only
   * @param repeat New Repeat setting
   */
  public async SetRepeat(repeat: Repeat): Promise<void> {
    const shuffle = await this.GetShuffle();
    await this.setPlayMode(shuffle, repeat);
  }

  /**
   * Set PlayMode based on shuffle only
   * @param shuffle Shuffle on or off
   */
  public async SetShuffle(shuffle: boolean): Promise<void> {
    const repeat = await this.GetRepeat();
    await this.setPlayMode(shuffle, repeat);
  }

  private async setPlayMode(shuffle: boolean, repeat: Repeat): Promise<void> {
    const newPlayMode = PlayModeHelper.ComputePlayMode(shuffle, repeat);
    await this.AVTransportService.SetPlayMode({ InstanceID: 0, NewPlayMode: newPlayMode });
    this.currentPlayMode = newPlayMode;
  }

  /**
   * Turn on/off speech enhancement, on your playbar,
   * shortcut to .RenderingControlService.SetEQ({ InstanceID: 0, EQType: 'DialogLevel', DesiredValue: dialogLevel === true ? 1 : 0 })
   *
   * @param {boolean} dialogLevel
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async SetSpeechEnhancement(dialogLevel: boolean): Promise<boolean> {
    return await this.RenderingControlService
      .SetEQ({ InstanceID: 0, EQType: 'DialogLevel', DesiredValue: dialogLevel === true ? 1 : 0 });
  }

  /**
   * Set the volume, shortcut to .RenderingControlService.SetVolume({InstanceID: 0, Channel: 'Master', DesiredVolume: volume});
   *
   * @param {number} volume new Volume (between 0 and 100)
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   * @remarks Also saves the volume so it can be used by other methods that need the volume (and events aren't working)
   */
  public async SetVolume(volume: number): Promise<boolean> {
    if (volume < 0 || volume > 100) throw new Error('Volume should be between 0 and 100');
    return await this.RenderingControlService
      .SetVolume({ InstanceID: 0, Channel: 'Master', DesiredVolume: volume })
      .then((result: boolean) => {
        if (result === true && this.volume !== volume) {
          this.volume = volume;
        }
        return result;
      });
  }

  /**
   * Stop playback, shortcut to .Coordinator.AVTransportService.Stop()
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async Stop(): Promise<boolean> { return await this.Coordinator.AVTransportService.Stop(); }
  // #endregion
}
