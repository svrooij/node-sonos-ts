import { EventEmitter } from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import SonosDeviceBase from './sonos-device-base';
import {
  GetZoneInfoResponse, GetZoneAttributesResponse, GetZoneGroupStateResponse, AddURIToQueueResponse, AVTransportServiceEvent, RenderingControlServiceEvent,
} from './services';
import {
  PlayNotificationOptions, Alarm, TransportState, ServiceEvents, SonosEvents, PatchAlarm, PlayTtsOptions, BrowseResponse, PlayNotificationOptionsBase, StrongSonosEvents,
} from './models';
import { AsyncHelper } from './helpers/async-helper';
import XmlHelper from './helpers/xml-helper';
import MetadataHelper from './helpers/metadata-helper';
import { SmapiClient } from './musicservices/smapi-client';
import JsonHelper from './helpers/json-helper';
import TtsHelper from './helpers/tts-helper';

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
   * @param {(string | undefined)} [uuid=undefined] the uuid of the speaker, is set by the SonosManager by default
   * @param {(string | undefined)} [name=undefined] the name of the speaker, is set by the SonosManager by default
   * @param {({coordinator?: SonosDevice; name: string; managerEvents: EventEmitter} | undefined)} [groupConfig=undefined] groupConfig is used by the SonosManager to setup group change events.
   * @memberof SonosDevice
   */
  constructor(host: string, port = 1400, uuid: string | undefined = undefined, name: string | undefined = undefined, groupConfig: {coordinator?: SonosDevice; name: string; managerEvents: EventEmitter} | undefined = undefined) {
    super(host, port, uuid);
    this.name = name;
    if (groupConfig) {
      this.groupName = groupConfig.name;
      if (groupConfig.coordinator !== undefined && uuid !== groupConfig.coordinator.uuid) {
        this.coordinator = groupConfig.coordinator;
      }
      if (uuid) {
        groupConfig.managerEvents.on(uuid, this.handleGroupUpdate);
      }
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
   * @param {(string | object | number | undefined)} options If the function requires options specify them here. A json string is automaticly parsed to an object (if possible).
   * @returns {Promise<any>}
   * @memberof SonosDevice
   */
  public async ExecuteCommand(command: string, options?: string | object | number): Promise<any> {
    let service = '';
    let correctCommand = command;
    if (command.indexOf('.') > -1) {
      const split = command.split('.', 2);
      [service, correctCommand] = split;
    }

    const objectToCall: {[key: string]: Function} = service !== '' ? this.executeCommandGetService(service) || this.executeCommandGetFunctions() : this.executeCommandGetFunctions();
    if (objectToCall[correctCommand] === undefined) {
      correctCommand = Object.keys(objectToCall).find((k) => k.toLowerCase() === correctCommand.toLowerCase()) || correctCommand;
    }
    if (typeof (objectToCall[correctCommand]) === 'function') {
      if (options === undefined) {
        return objectToCall[correctCommand]();
      } if (typeof (options) === 'string') {
        const parsedOptions = JsonHelper.TryParse(options);
        return objectToCall[correctCommand](parsedOptions);
      } // number or object options;
      return objectToCall[correctCommand](options);
    }
    throw new Error(`Command ${correctCommand} isn't a function`);
  }

  private executeCommandGetFunctions(): {[key: string]: Function} {
    // This code looks weird, but is required to convince TypeScript this is actually what we want.
    return this as unknown as {[key: string]: Function};
  }

  private executeCommandGetService(serviceName: string): {[key: string]: Function} | undefined {
    if (serviceName.toLowerCase().indexOf('service') === -1) { // Name doesn't have 'Service' in it.
      return undefined;
    }

    const serviceDictionary = this.executeCommandGetFunctions();
    if (serviceDictionary[serviceName]) return serviceDictionary[serviceName] as unknown as {[key: string]: Function};
    // Do case insensitive lookup
    const checkedName = Object.keys(serviceDictionary).find((k) => k.toLowerCase() === serviceName.toLowerCase());
    if (checkedName !== undefined) return serviceDictionary[checkedName] as unknown as {[key: string]: Function};
    return undefined;
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

    const groupToJoin = zones.find((z) => z.members.some((m) => m.name.toLowerCase() === otherDevice.toLowerCase()));
    if (groupToJoin === undefined) {
      throw new Error(`Player '${otherDevice}' isn't found!`);
    }

    if (groupToJoin.members.some((m) => m.uuid === this.Uuid)) {
      return Promise.resolve(false); // Already in the group.
    }
    return await this.AVTransportService.SetAVTransportURI({ InstanceID: 0, CurrentURI: `x-rincon:${groupToJoin.coordinator.uuid}`, CurrentURIMetaData: '' });
  }

  private allMusicServices?: any[];

  /**
   * Load all available music services
   *
   * @returns {(Promise<any[] | undefined>)}
   * @memberof SonosDevice
   */
  public async MusicServicesList(): Promise<any[] | undefined> {
    if (this.allMusicServices === undefined) {
      const resp = await this.MusicServicesService.ListAvailableServices();
      const musicServiceList = XmlHelper.DecodeAndParseXml(resp.AvailableServiceDescriptorList, '');
      if (musicServiceList.Services && Array.isArray(musicServiceList.Services.Service)) {
        this.allMusicServices = musicServiceList.Services.Service;
        return this.allMusicServices;
      }
      throw new Error('Music list could not be downloaded');
    }
    return this.allMusicServices;
  }

  private deviceId?: string;

  /**
   * Create a client for a specific music serivce
   *
   * @param {string} name The name of the music service, see MusicServicesList
   * @returns {Promise<SmapiClient>}
   * @memberof SonosDevice
   */
  public async MusicServicesClient(name: string): Promise<SmapiClient> {
    if (this.deviceId === undefined) this.deviceId = (await this.SystemPropertiesService.GetString({ VariableName: 'R_TrialZPSerial' })).StringValue;
    const services = await this.MusicServicesList();
    if (services === undefined) throw new Error('Music list could not be loaded');

    const service = services.find((s) => s.Name === name);
    if (service === undefined) throw new Error('MusicService could not be found');

    if (service.Policy.Auth !== 'Anonymous') throw new Error('Music service requires authentication, which isn\'t supported (yet)');

    return new SmapiClient({
      name, url: service.SecureUri || service.Uri, deviceId: this.deviceId, serviceId: service.Id,
    });
  }

  /**
   * Play some url, and revert back to what was playing before. Very usefull for playing a notification or TTS sound.
   *
   * @param {PlayNotificationOptions} options The options
   * @param {string} options.trackUri The uri of the sound to play as notification, can be every supported sonos uri.
   * @param {string|Track} [options.metadata] The metadata of the track to play, will be guesses if undefined.
   * @param {number} [options.delayMs] Delay in ms between commands, for better notification playback stability
   * @param {boolean} [options.onlyWhenPlaying] Only play a notification if currently playing music. You don't have to check if the user is home ;)
   * @param {number} [options.timeout] Number of seconds the notification should play, as a fallback if the event doesn't come through.
   * @param {number} [options.volume] Change the volume for the notication and revert afterwards.
   * @returns {Promise<boolean>} Returns true is notification was played (and the state is set back to original)
   * @memberof SonosDevice
   */
  public async PlayNotification(options: PlayNotificationOptions): Promise<boolean> {
    this.debug('PlayNotification(%o)', options);

    if (options.delayMs !== undefined && (options.delayMs < 1 || options.delayMs > 4000)) {
      throw new Error('Delay (if specified) should be between 1 and 3000');
    }

    const originalState = (await this.AVTransportService.GetTransportInfo()).CurrentTransportState as TransportState;
    this.debug('Current state is %s', originalState);
    if (options.onlyWhenPlaying === true && !(originalState === TransportState.Playing || originalState === TransportState.Transitioning)) {
      this.debug('Notification cancelled, player not playing');
      return false;
    }

    const metaOptions = options;
    // Generate metadata if needed
    if (options.metadata === undefined) {
      const guessedMetaData = MetadataHelper.GuessMetaDataAndTrackUri(options.trackUri);
      metaOptions.metadata = guessedMetaData.metadata;
      metaOptions.trackUri = guessedMetaData.trackUri;
    }

    // Original data to revert to
    const originalVolume = options.volume !== undefined ? (await this.RenderingControlService.GetVolume({ InstanceID: 0, Channel: 'Master' })).CurrentVolume : undefined;
    const originalMediaInfo = await this.AVTransportService.GetMediaInfo();
    const originalPositionInfo = await this.AVTransportService.GetPositionInfo();

    // Start the notification
    await this.AVTransportService.SetAVTransportURI({ InstanceID: 0, CurrentURI: metaOptions.trackUri, CurrentURIMetaData: metaOptions.metadata ?? '' });
    if (options.volume !== undefined) {
      await this.RenderingControlService.SetVolume({ InstanceID: 0, Channel: 'Master', DesiredVolume: options.volume });
      if (options.delayMs !== undefined) await AsyncHelper.Delay(options.delayMs);
    }
    await this.AVTransportService.Play({ InstanceID: 0, Speed: '1' }).catch((err) => { this.debug('Play threw error, wrong url? %o', err); });

    // Wait for event (or timeout)
    await AsyncHelper.AsyncEvent<any>(this.Events, SonosEvents.PlaybackStopped, options.timeout).catch((err) => this.debug(err));

    // Revert everything back
    this.debug('Reverting everything back to normal');
    const isBroadcast = typeof originalMediaInfo.CurrentURIMetaData !== 'string' // Should not happen, is parsed in the service
                        && originalMediaInfo.CurrentURIMetaData.UpnpClass === 'object.item.audioItem.audioBroadcast'; // This UpnpClass should for sure be skipped.

    if (originalVolume !== undefined) {
      await this.RenderingControlService.SetVolume({ InstanceID: 0, Channel: 'Master', DesiredVolume: originalVolume });
      if (options.delayMs !== undefined) await AsyncHelper.Delay(options.delayMs);
    }

    await this.AVTransportService.SetAVTransportURI({ InstanceID: 0, CurrentURI: originalMediaInfo.CurrentURI, CurrentURIMetaData: originalMediaInfo.CurrentURIMetaData });
    if (options.delayMs !== undefined) await AsyncHelper.Delay(options.delayMs);

    if (originalPositionInfo.Track > 1 && originalMediaInfo.NrTracks > 1) {
      this.debug('Selecting track %d', originalPositionInfo.Track);
      await this.SeekTrack(originalPositionInfo.Track)
        .catch((err) => {
          this.debug('Error selecting track, happens with some music services %o', err);
        });
    }

    if (originalPositionInfo.RelTime && originalMediaInfo.MediaDuration !== '0:00:00' && !isBroadcast) {
      this.debug('Setting back time to %s', originalPositionInfo.RelTime);
      await this.SeekPosition(originalPositionInfo.RelTime)
        .catch((err) => {
          this.debug('Reverting back track time failed, happens for some music services (radio or stream). %o', err);
        });
    }

    if (originalState === TransportState.Playing || originalState === TransportState.Transitioning) {
      await this.AVTransportService.Play({ InstanceID: 0, Speed: '1' });
    }

    return true;
  }

  /**
   * Download the url for the specified text, play as a notification and revert back to current track.
   *
   * @param {PlayTtsOptions} options
   * @param {string} options.text Text to request a TTS file for.
   * @param {string} options.lang Language to request tts file for.
   * @param {string} [options.endpoint] TTS endpoint, see documentation, can also be set by environment variable 'SONOS_TTS_ENDPOINT'
   * @param {string} [options.gender] Supply gender, some languages support both genders.
   * @param {number} [options.delayMs] Delay in ms between commands, for better notification playback stability
   * @param {boolean} [options.onlyWhenPlaying] Only play a notification if currently playing music. You don't have to check if the user is home ;)
   * @param {number} [options.timeout] Number of seconds the notification should play, as a fallback if the event doesn't come through.
   * @param {number} [options.volume] Change the volume for the notication and revert afterwards.
   * @returns {Promise<boolean>} returns true if notification actually played
   * @memberof SonosDevice
   */
  public async PlayTTS(options: PlayTtsOptions): Promise<boolean> {
    this.debug('PlayTTS(%o)', options);

    const endpoint = options.endpoint ?? process.env.SONOS_TTS_ENDPOINT;
    if (endpoint === undefined) {
      throw new Error('No TTS Endpoint defined, check the documentation.');
    }

    const lang = options.lang || process.env.SONOS_TTS_LANG;
    if (lang === undefined || lang === '') {
      throw new Error('TTS Language is required.');
    }

    if (options.text === '' || options.lang === '') {
      this.debug('Cancelling TTS, not all required parameters are set');
      return false;
    }

    const uri = await TtsHelper.GetTtsUriFromEndpoint(endpoint, options.text, lang, options.gender);

    // Typescript way to convert objects, someone got a better way?
    const notificationOptions: PlayNotificationOptions = options as PlayNotificationOptionsBase as PlayNotificationOptions;
    notificationOptions.trackUri = uri;
    notificationOptions.timeout = notificationOptions.timeout ?? 120;

    return await this.PlayNotification(notificationOptions);
  }

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
    return await this.AVTransportService
      .SetAVTransportURI({ InstanceID: 0, CurrentURI: `x-rincon-stream:${this.uuid}0${this.port}`, CurrentURIMetaData: '' });
  }

  /**
   * Switch playback to the queue
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async SwitchToQueue(): Promise<boolean> {
    return await this.AVTransportService
      .SetAVTransportURI({ InstanceID: 0, CurrentURI: `x-rincon-queue:${this.uuid}0${this.port}#0`, CurrentURIMetaData: '' });
  }

  /**
   * Switch playback to TV Input (only on Playbar)
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async SwitchToTV(): Promise<boolean> {
    return await this.AVTransportService
      .SetAVTransportURI({ InstanceID: 0, CurrentURI: `x-sonos-htastream:${this.uuid}0${this.port}:spdiff`, CurrentURIMetaData: '' });
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
  private events?: StrictEventEmitter<EventEmitter, StrongSonosEvents>;

  private isSubscribed = false;

  /**
   * Cancel all subscriptions and unsubscribe for events from this device.
   *
   * @memberof SonosDevice
   */
  public CancelEvents(): void {
    if (this.events !== undefined) {
      const eventNames = this.events.eventNames().filter((e) => e !== 'removeListener' && e !== 'newListener');
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
  public get Events(): StrictEventEmitter<EventEmitter, StrongSonosEvents> {
    if (this.events === undefined) {
      this.events = new EventEmitter();
      this.events.on('removeListener', () => {
        this.debug('Listener removed');
        const events = this.Events.eventNames().filter((e) => e !== 'removeListener' && e !== 'newListener');
        if (events.length === 0) {
          this.AVTransportService.Events.removeListener(ServiceEvents.LastChange, this.boundHandleAvTransportEvent);
          this.RenderingControlService.Events.removeListener(ServiceEvents.LastChange, this.boundHandleRenderingControlEvent);
        }
      });
      this.events.on('newListener', () => {
        this.debug('Listener added');
        if (!this.isSubscribed) {
          this.isSubscribed = true;
          this.AVTransportService.Events.on(ServiceEvents.LastChange, this.boundHandleAvTransportEvent);
          this.RenderingControlService.Events.on(ServiceEvents.LastChange, this.boundHandleRenderingControlEvent);
        }
      });
    }
    return this.events;
  }

  private boundHandleAvTransportEvent = this.handleAvTransportEvent.bind(this);

  private handleAvTransportEvent(data: AVTransportServiceEvent): void {
    this.Events.emit(SonosEvents.AVTransport, data);
    if (data.TransportState !== undefined) {
      const newState = data.TransportState as TransportState;
      const newSimpleState = newState === TransportState.Paused || newState === TransportState.Stopped ? TransportState.Stopped : TransportState.Playing;
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

    if (data.CurrentTrackMetaData) this.Events.emit(SonosEvents.CurrentTrackMetadata, data.CurrentTrackMetaData);

    if (data.NextTrackURI && this.nextTrackUri !== data.NextTrackURI) {
      this.nextTrackUri = data.NextTrackURI;
      this.Events.emit(SonosEvents.NextTrackUri, this.nextTrackUri ?? '');
      if (data.NextTrackMetaData) this.Events.emit(SonosEvents.NextTrackMetadata, data.NextTrackMetaData);
    }

    if (data.EnqueuedTransportURI && this.enqueuedTransportUri !== data.EnqueuedTransportURI) {
      this.enqueuedTransportUri = data.EnqueuedTransportURI;
      this.Events.emit(SonosEvents.EnqueuedTransportUri, this.enqueuedTransportUri ?? '');
      if (data.EnqueuedTransportURIMetaData !== undefined) this.Events.emit(SonosEvents.EnqueuedTransportMetadata, data.EnqueuedTransportURIMetaData);
    }
  }

  private boundHandleRenderingControlEvent = this.handleRenderingControlEvent.bind(this);

  private handleRenderingControlEvent(data: RenderingControlServiceEvent): void {
    this.Events.emit(SonosEvents.RenderingControl, data);

    if (data.Volume && data.Volume.Master && this.volume !== data.Volume.Master) {
      this.volume = data.Volume.Master;
      this.Events.emit(SonosEvents.Volume, this.volume ?? 0);
    }

    if (data.Mute && data.Mute.Master && this.muted !== data.Mute.Master) {
      this.muted = data.Mute.Master;
      this.Events.emit(SonosEvents.Mute, this.muted);
    }
  }
  // #endregion

  // #region Group stuff
  private _handleGroupUpdate = this.handleGroupUpdate.bind(this);

  private handleGroupUpdate(data: { coordinator: SonosDevice | undefined; name: string}): void {
    if (data.coordinator && data.coordinator.uuid !== this.uuid && (!this.coordinator || this.coordinator.uuid !== data.coordinator.uuid)) {
      this.debug('Coordinator changed for %s', this.uuid);
      this.coordinator = data.coordinator;
      if (this.events !== undefined) {
        this.events.emit(SonosEvents.Coordinator, this.coordinator.uuid);
      }
    }
    if (this.coordinator && (data.coordinator === undefined || data.coordinator.uuid === this.uuid)) {
      this.debug('Coordinator removed for %s', this.uuid);
      this.coordinator = undefined;
      if (this.events !== undefined) {
        this.events.emit(SonosEvents.Coordinator, this.uuid);
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

  private currentTransportState?: TransportState;

  /**
   * Current transport state, only set when listening for events
   *
   * @readonly
   * @type {(TransportState | undefined)}
   * @memberof SonosDevice
   */
  public get CurrentTransportState(): TransportState | undefined {
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
    if (this.currentTransportState !== undefined) {
      return this.currentTransportState === TransportState.Playing || this.currentTransportState === TransportState.Transitioning ? TransportState.Playing : TransportState.Stopped;
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
   * GetZoneGroupState() shortcut to .ZoneGroupTopologyService.GetZoneGroupState()
   *
   * @returns {Promise<GetZoneGroupStateResponse>}
   * @memberof SonosDevice
   */
  public async GetZoneGroupState(): Promise<GetZoneGroupStateResponse> { return await this.ZoneGroupTopologyService.GetZoneGroupState(); }

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
   * Set relative volume, shortcut to .RenderingControlService.SetRelativeVolume({ InstanceID: 0, Channel: 'Master', Adjustment: volumeAdjustment })
   *
   * @param {number} volumeAdjustment the adjustment, positive or negative
   * @returns {Promise<number>}
   * @memberof SonosDevice
   */
  public async SetRelativeVolume(volumeAdjustment: number): Promise<number> {
    return (await this.RenderingControlService.SetRelativeVolume({ InstanceID: 0, Channel: 'Master', Adjustment: volumeAdjustment })).NewVolume;
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
   */
  public async SetVolume(volume: number): Promise<boolean> {
    if (volume < 0 || volume > 100) throw new Error('Volume should be between 0 and 100');
    return await this.RenderingControlService.SetVolume({ InstanceID: 0, Channel: 'Master', DesiredVolume: volume });
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
