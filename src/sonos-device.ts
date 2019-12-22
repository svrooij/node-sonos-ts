import { SonosDeviceBase } from './sonos-device-base'
import { GetZoneInfoResponse, GetZoneAttributesResponse, GetZoneGroupStateResponse, AddURIToQueueResponse } from './services'
import { PlayNotificationOptions, Alarm, TransportState, ServiceEvents, SonosEvents, PatchAlarm, PlayTtsOptions } from './models'
import { AsyncHelper } from './helpers/async-helper'
import { ZoneHelper } from './helpers/zone-helper'
import { EventEmitter } from 'events';
import { XmlHelper } from './helpers/xml-helper'
import { MetadataHelper } from './helpers/metadata-helper'
import { SmapiClient } from './musicservices/smapi-client'
import { JsonHelper } from './helpers/json-helper'
import { TtsHelper } from './helpers/tts-helper'

export class SonosDevice extends SonosDeviceBase {
  private name: string | undefined;
  private groupName: string | undefined;
  private coordinator: SonosDevice | undefined;

  constructor(host: string, port = 1400, uuid: string | undefined = undefined, name: string | undefined = undefined, groupConfig: {coordinator?: SonosDevice; name: string; managerEvents: EventEmitter} | undefined = undefined) {
    super(host, port, uuid);
    this.name = name;
    if(groupConfig) {
      this.groupName = groupConfig.name;
      if(groupConfig.coordinator !== undefined && uuid !== groupConfig.coordinator.uuid) {
        this.coordinator = groupConfig.coordinator;
      }
      if (uuid) {
        groupConfig.managerEvents.on(uuid, this._handleGroupUpdate)
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
    this.volume = await this.RenderingControlService.GetVolume({InstanceID: 0, Channel: 'Master'}).then(r => r.CurrentVolume)
    this.muted = await this.RenderingControlService.GetMute({InstanceID: 0, Channel: 'Master'}).then(m => m.CurrentMute)
    return true
  }

  //#region Added functionality
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

    return this.AVTransportService.AddURIToQueue({ 
      InstanceID: 0,
      EnqueuedURI: guessedMetaData.trackUri,
      EnqueuedURIMetaData: guessedMetaData.metedata,
      DesiredFirstTrackNumberEnqueued: positionInQueue,
      EnqueueAsNext: enqueueAsNext
    })
  }

  /**
   * Get a parsed list of all alarms.
   *
   * @returns {Promise<Alarm[]>}
   * @memberof SonosDevice
   */
  public async AlarmList(): Promise<Alarm[]> {
    return this.AlarmClockService.ListAlarms()
      .then(response => XmlHelper.DecodeAndParseXml(response.CurrentAlarmList, ''))
      .then(parsedList => {
        return Array.isArray(parsedList.Alarms.Alarm) ? parsedList.Alarms.Alarm : [parsedList.Alarms.Alarm]
      })
      .then((alarms: any[]) => {
        alarms.forEach(alarm => {
          alarm.Enabled = alarm.Enabled === '1'
          alarm.ID = parseInt(alarm.ID)
          alarm.IncludeLinkedZones = alarm.IncludeLinkedZones === '1'
          alarm.Volume = parseInt(alarm.Volume)
          // Alarm response has StartTime, but updates expect StartLocalTime, why??
          alarm.StartLocalTime = alarm.StartTime
          delete alarm.StartTime
          if(typeof alarm.ProgramMetaData === 'string')
            alarm.ProgramMetaData = MetadataHelper.ParseDIDLTrack(XmlHelper.DecodeAndParseXml(alarm.ProgramMetaData), this.host, this.port);
          alarm.ProgramURI = XmlHelper.DecodeTrackUri(alarm.ProgramURI)
        });
        return alarms;
      })
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
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async AlarmPatch(options: PatchAlarm): Promise<boolean> {
    this.debug('AlarmPatch(%o)', options)
    return this.AlarmList().then(alarms => {
      const alarm = alarms.find(a => a.ID === options.ID)
      if(alarm === undefined) throw new Error(`Alarm with ID ${options.ID} not found`)
      if(options.Duration !== undefined) alarm.Duration = options.Duration;
      if(options.Enabled !== undefined) alarm.Enabled = options.Enabled;
      if(options.PlayMode !== undefined) alarm.PlayMode = options.PlayMode;
      if(options.Recurrence !== undefined) alarm.Recurrence = options.Recurrence;
      if(options.StartLocalTime !== undefined) alarm.StartLocalTime = options.StartLocalTime;
      if(options.Volume !== undefined) alarm.Volume = options.Volume;

      return this.AlarmClockService.UpdateAlarm(alarm);
    })
  }

  /**
   * Execute any sonos command by name, see examples/commands.js
   *
   * @param {string} command Command you wish to execute, like 'Play' or 'AVTransportService.Pause'. CASE SENSITIVE!!!
   * @param {(string | object | number | undefined)} options If the function requires options specify them here. A json string is automaticly parsed to an object (if possible).
   * @returns {Promise<any>}
   * @memberof SonosDevice
   */
  public async ExecuteCommand(command: string, options: string | object | number | undefined): Promise<any> {
    let service = '';

    if(command.indexOf('.') > -1) {
      const split = command.split('.', 2);
      service = split[0];
      command = split[1];
    }

    const objectToCall: {[key: string]: Function} = service !== '' ? this.executeCommandGetService(service) || this.executeCommandGetFunctions() : this.executeCommandGetFunctions();

    if(typeof(objectToCall[command]) === 'function') {
      if(options === undefined) {
        return objectToCall[command]();
      } else if(typeof(options) === 'string') {
        const parsedOptions = JsonHelper.TryParse(options);
        return objectToCall[command](parsedOptions);
      } else { // number or object options;
        return objectToCall[command](options);
      }
    }
    throw new Error(`Command ${command} isn't a function`);
  }

  private executeCommandGetFunctions(): {[key: string]: Function} {
    // This code looks weird, but is required to convince TypeScript this is actually what we want.
    return this as unknown as {[key: string]: Function};
  }

  private executeCommandGetService(serviceName: string): {[key: string]: Function} | undefined {
    if(serviceName.indexOf('Service') === -1) // Name doesn't have 'Service' in it.
      return undefined;
    
    const serviceDictionary = this.executeCommandGetFunctions();
    if(serviceDictionary[serviceName]) return serviceDictionary[serviceName] as unknown as {[key: string]: Function};
    return undefined;
  }

  /**
   * Join this device to an other group, if you know the coordinator uuid you can do .AVTransportService.SetAVTransportURI({InstanceID: 0, CurrentURI: `x-rincon:${uuid}`, CurrentURIMetaData: ''})
   *
   * @param {string} otherDevice The name of the other device, (to find the needed coordinator uuid)
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async JoinGroup(otherDevice: string): Promise<boolean> {
    this.debug('JoinGroup(%s)', otherDevice)
    const zones = await this.ZoneGroupTopologyService.GetZoneGroupState().then(ZoneHelper.ParseZoneGroupStateResponse)

    const groupToJoin = zones.find(z => z.members.some(m => m.name.toLowerCase() === otherDevice.toLowerCase()))
    if(groupToJoin === undefined) throw new Error(`Player '${otherDevice}' isn't found!`)
    return this.AVTransportService.SetAVTransportURI({InstanceID: 0, CurrentURI: `x-rincon:${groupToJoin.coordinator.uuid}`, CurrentURIMetaData: ''})
  }

  private allMusicServices?: any[];
  public async MusicServicesList(): Promise<any[] | undefined> {
    if(this.allMusicServices === undefined) {
      return this.MusicServicesService.ListAvailableServices().then(resp => {
        const musicServiceList = XmlHelper.DecodeAndParseXml(resp.AvailableServiceDescriptorList, '')
        if(musicServiceList.Services && Array.isArray(musicServiceList.Services.Service) ){
          this.allMusicServices = musicServiceList.Services.Service;
          //this.debug('MusicList loaded %O', this.allMusicServices)
          return this.allMusicServices;
        }
        throw new Error('Music list could not be downloaded')
      })
    }
    return this.allMusicServices;
  }
  private deviceId?: string;
  public async MusicServicesClient(name: string): Promise<SmapiClient> {
    if(this.deviceId === undefined) this.deviceId = (await this.SystemPropertiesService.GetString({ VariableName: 'R_TrialZPSerial' })).StringValue;
    return this.MusicServicesList()
      .then(services => {
        if(services === undefined) throw new Error('Music list could not be loaded');
        const service = services.find(s => s.Name === name);
        if(service === undefined) throw new Error(`MusicService could not be found`);

        if(service.Policy.Auth !== 'Anonymous') throw new Error('Music service requires authentication, which isn\'t supported (yet)')

        return new SmapiClient({ name: name, url: service.SecureUri || service.Uri, deviceId: this.deviceId, serviceId: service.Id })
      });
  }

  /**
   * Play some url, and revert back to what was playing before. Very usefull for playing a notification or TTS sound.
   *
   * @param {PlayNotificationOptions} options The options
   * @returns {Promise<boolean>} Returns true is notification was played (and the state is set back to original)
   * @memberof SonosDevice
   */
  public async PlayNotification(options: PlayNotificationOptions): Promise<boolean> {
    this.debug('PlayNotification(%o)', options);

    const originalState = await this.AVTransportService.GetTransportInfo().then(info => info.CurrentTransportState as TransportState)
    this.debug('Current state is %s', originalState);
    if (options.onlyWhenPlaying === true && !(originalState === TransportState.Playing || originalState === TransportState.Transitioning)) {
      this.debug('Notification cancelled, player not playing')
      return false;
    }

    // Generate metadata if needed
    if(options.metadata === undefined){
      const guessedMetaData = MetadataHelper.GuessMetaDataAndTrackUri(options.trackUri);
      options.metadata = guessedMetaData.metedata;
      options.trackUri = guessedMetaData.trackUri;
    }

    // Original data to revert to
    const originalVolume = options.volume !== undefined ? await this.RenderingControlService.GetVolume({InstanceID: 0, Channel: 'Master'}).then(resp => resp.CurrentVolume) : undefined;
    const originalMediaInfo = await this.AVTransportService.GetMediaInfo();
    const originalPositionInfo = await this.AVTransportService.GetPositionInfo();

    // Start the notification
    await this.AVTransportService.SetAVTransportURI({InstanceID: 0, CurrentURI: options.trackUri, CurrentURIMetaData: options.metadata})
    if (options.volume !== undefined) {
      await this.RenderingControlService.SetVolume({InstanceID: 0, Channel: 'Master', DesiredVolume: options.volume})
    }
    await this.AVTransportService.Play({ InstanceID: 0, Speed: '1' }).catch(err => { this.debug('Play threw error, wrong url? %o', err); });

    // Wait for event (or timeout)
    await AsyncHelper.AsyncEvent<any>(this.Events, SonosEvents.PlaybackStopped, options.timeout).catch(err => this.debug('AsyncEvent timeout fired', err))

    // Revert everything back
    this.debug('Reverting everything back to normal')
    if (originalVolume !== undefined) await this.RenderingControlService.SetVolume({InstanceID: 0, Channel: 'Master', DesiredVolume: originalVolume})
    await this.AVTransportService.SetAVTransportURI({InstanceID: 0, CurrentURI: originalMediaInfo.CurrentURI, CurrentURIMetaData: originalMediaInfo.CurrentURIMetaData});

    if (originalPositionInfo.Track > 1 && originalMediaInfo.NrTracks > 1) {
      this.debug('Selecting track %d', originalPositionInfo.Track)
      await this.SeeKTrack(originalPositionInfo.Track)
        .catch(err => {
          this.debug('Error selecting track, happens with some music services %o', err)
        })
    }

    if (originalPositionInfo.RelTime && originalMediaInfo.MediaDuration !== '0:00:00') {
      this.debug('Setting back time to %s', originalPositionInfo.RelTime)
      await this.SeekPosition(originalPositionInfo.RelTime).catch(err => {
        this.debug('Reverting back track time failed, happens for some muic services (radio or stream). %o', err)
      })
    }

    if (originalState === TransportState.Playing || originalState === TransportState.Transitioning) {
      await this.AVTransportService.Play({ InstanceID: 0, Speed: '1' });
    }

    return true;

  }

  public async PlayTTS(options: PlayTtsOptions): Promise<boolean> {
    this.debug('PlayTTS(%o)', options);

    if(options.endpoint === undefined) {
      options.endpoint = process.env.SONOS_TTS_ENDPOINT;
      if (options.endpoint === undefined) throw new Error('No TTS Endpoint defined, check the documentation.')
    }
      
    if(options.text === '' || options.lang === '') {
      this.debug('Cancelling TTS, not all required parameters are set');
      return false;
    }

    const uri = await TtsHelper.GetTtsUriFromEndpoint(options.endpoint, options.text, options.lang, options.gender);

    return this.PlayNotification({ trackUri: uri, onlyWhenPlaying: options.onlyWhenPlaying, volume: options.volume, timeout: options.timeout || 120});
  }

  /**
   * Switch the playback to this url.
   *
   * @param {string} trackUri
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async SetAVTransportURI(trackUri: string): Promise<boolean> {
    const guessedMetaData = MetadataHelper.GuessMetaDataAndTrackUri(trackUri)
    return this.AVTransportService.SetAVTransportURI({ InstanceID: 0, CurrentURI: guessedMetaData.trackUri, CurrentURIMetaData: guessedMetaData.metedata });
  }

  /**
   * Switch playback to line in (which will always be playing)
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async SwitchToLineIn(): Promise<boolean> {
    return this.AVTransportService
      .SetAVTransportURI({ InstanceID: 0, CurrentURI: `x-rincon-stream:${this.uuid}0${this.port}`, CurrentURIMetaData: '' })
  }

  /**
   * Switch playback to the queue
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async SwitchToQueue(): Promise<boolean> {
    return this.AVTransportService
      .SetAVTransportURI({ InstanceID: 0, CurrentURI: `x-rincon-queue:${this.uuid}0${this.port}#0`, CurrentURIMetaData: '' })
  }

  /**
   * Switch playback to TV Input (only on Playbar)
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async SwitchToTV(): Promise<boolean> {
    return this.AVTransportService
      .SetAVTransportURI({ InstanceID: 0, CurrentURI: `x-sonos-htastream:${this.uuid}0${this.port}:spdiff`, CurrentURIMetaData: '' })
  }

  /**
   * Toggle playback between paused and playing
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async TogglePlayback(): Promise<boolean> {
    // Load the Current state first, if not present (eg. not using events)
    if(this.Coordinator.CurrentTransportStateSimple === undefined) {
      return this.Coordinator.AVTransportService.GetTransportInfo()
        .then(response => response.CurrentTransportState)
        .then(currentState => {
          return currentState === TransportState.Playing || currentState === TransportState.Transitioning ?
            this.AVTransportService.Pause() : 
            this.Coordinator.Play();
        })
    }
    // Return to correct promise based on current state.
    return this.Coordinator.CurrentTransportStateSimple === TransportState.Playing ?
      this.Coordinator.Pause() :
      this.Coordinator.Play();
  }
  //#endregion

  //#region Events 
  private events?: EventEmitter;
  private isSubscribed = false;
  public CancelEvents(): void {
    if(this.events !== undefined) {
      const eventNames = this.events.eventNames().filter(e => e !== 'removeListener' && e !== 'newListener')
      eventNames.forEach(e => {
        if(this.events !== undefined)
        this.events.removeAllListeners(e);
      })
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
  public get Events(): EventEmitter {
    if (this.events === undefined) {
      this.events = new EventEmitter();
      this.events.on('removeListener', () => {
        this.debug('Listener removed')
        const events = this.Events.eventNames().filter(e => e !== 'removeListener' && e !== 'newListener')
        if (events.length === 0) {
          this.AVTransportService.Events.removeListener(ServiceEvents.LastChange, this._handleAvTransportEvent)
          this.RenderingControlService.Events.removeListener(ServiceEvents.LastChange, this._handleRenderingControlEvent)
        }
      })
      this.events.on('newListener', () => {
        this.debug('Listener added')
        if (!this.isSubscribed) {
          this.isSubscribed = true;
          this.AVTransportService.Events.on(ServiceEvents.LastChange, this._handleAvTransportEvent)
          this.RenderingControlService.Events.on(ServiceEvents.LastChange, this._handleRenderingControlEvent)
        }
      })
    }
    return this.events;
  }

  private _handleAvTransportEvent = this.handleAvTransportEvent.bind(this)
  private handleAvTransportEvent(data: any): void {
    this.Events.emit(SonosEvents.AVTransport, data);
    if (data.TransportState !== undefined){
      const newState = data.TransportState as TransportState
      const newSimpleState = newState === TransportState.Paused || newState === TransportState.Stopped ? TransportState.Stopped : TransportState.Playing
      if(newSimpleState !== this.CurrentTransportStateSimple)
        this.Events.emit(SonosEvents.CurrentTransportStateSimple, newSimpleState);
      if(this.currentTransportState !== newState) {
        this.currentTransportState = newState;
        this.Events.emit(SonosEvents.CurrentTransportState, newState);
        if(newState === TransportState.Stopped) this.Events.emit(SonosEvents.PlaybackStopped)
      }
    }

    if (data.CurrentTrackURI && this.currentTrackUri !== data.CurrentTrackURI) {
      this.currentTrackUri = data.CurrentTrackURI
      this.Events.emit(SonosEvents.CurrentTrack, this.currentTrackUri);
      if(data.CurrentTrackMetaData) this.Events.emit(SonosEvents.CurrentTrackMetadata, data.CurrentTrackMetaData)
    }

    if (data.NextTrackURI && this.nextTrackUri !== data.NextTrackURI) {
      this.nextTrackUri = data.NextTrackURI
      this.Events.emit(SonosEvents.NextTrack, this.nextTrackUri);
      if(data.NextTrackMetaData) this.Events.emit(SonosEvents.NextTrackMetadata, data.NextTrackMetaData)
    }

    if (data.EnqueuedTransportURI && this.enqueuedTransportUri !== data.EnqueuedTransportURI) {
      this.enqueuedTransportUri = data.EnqueuedTransportURI
      this.Events.emit(SonosEvents.EnqueuedTransport, this.enqueuedTransportUri);
      if(data.EnqueuedTransportURIMetaData) this.Events.emit(SonosEvents.EnqueuedTransportMetadata, data.EnqueuedTransportURIMetaData)
    }
  }
  private _handleRenderingControlEvent = this.handleRenderingControlEvent.bind(this)
  private handleRenderingControlEvent(data: any): void {
    this.Events.emit(SonosEvents.RenderingControl, data);

    if (data.Volume && data.Volume[0]._val) {
      const newValue = parseInt(data.Volume[0]._val)
      if(this.volume !== newValue) {
        this.volume = newValue
        this.Events.emit(SonosEvents.Volume, this.volume)
      }
    }

    if (data.Mute && data.Mute[0]._val) {
      const newValue = parseInt(data.Mute[0]._val) === 1 ? true : false
      if(this.muted !== newValue) {
        this.muted = newValue
        this.Events.emit(SonosEvents.Mute, this.muted)
      }
    }
  }
    //#endregion

  //#region Group stuff
  private _handleGroupUpdate = this.handleGroupUpdate.bind(this)
  private handleGroupUpdate(data: { coordinator: SonosDevice | undefined; name: string}): void {
    if(data.coordinator && data.coordinator.uuid !== this.uuid && (!this.coordinator || this.coordinator.uuid !== data.coordinator.uuid)) {
      this.debug('Coordinator changed for %s', this.uuid)
      this.coordinator = data.coordinator;
      if(this.events !== undefined){
        this.events.emit(SonosEvents.Coordinator, this.coordinator.uuid);
      }
    }
    if(this.coordinator && (data.coordinator === undefined || data.coordinator.uuid === this.uuid)) {
      this.debug('Coordinator removed for %s', this.uuid)
      this.coordinator = undefined;
      if(this.events !== undefined){
        this.events.emit(SonosEvents.Coordinator, this.uuid);
      }
    }
    if(data.name && data.name !== this.groupName){
      this.groupName = data.name;
      this.debug('Groupname changed for %s to %s', this.uuid, this.groupName)
      if(this.events !== undefined){
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
  //#endregion
  
  //#region Properties
  private currentTrackUri?: string;
  public get CurrentTrackUri(): string | undefined {
    return this.currentTrackUri;
  }
  private enqueuedTransportUri?: string;
  public get EnqueuedTransportUri(): string | undefined {
    return this.enqueuedTransportUri;
  }
  private nextTrackUri?: string;
  public get NextTrackUri(): string | undefined {
    return this.nextTrackUri;
  }
  private currentTransportState?: TransportState;
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
    if(this.currentTransportState !== undefined) {
      return this.currentTransportState === TransportState.Playing || this.currentTransportState === TransportState.Transitioning ? TransportState.Playing : TransportState.Stopped;
    }
  }
  public get Host(): string { return this.host; }
  private muted?: boolean;
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
    if(this.name !== undefined) return this.name;
    if (this.zoneAttributes === undefined) throw new Error('Zone attributes not loaded')
    return this.zoneAttributes.CurrentZoneName
  }
  public get Port(): number { return this.port; }
  public get Uuid(): string {return this.uuid; }
  private volume?: number;
  public get Volume(): number | undefined {
    return this.volume;
  }
  private zoneAttributes: GetZoneAttributesResponse | undefined
  //#endregion

  //#region Shortcuts
  /**
   * GetZoneAttributes shortcut to .DevicePropertiesService.GetZoneAttributes()
   *
   * @returns {Promise<GetZoneAttributesResponse>}
   * @memberof SonosDevice
   */
  public GetZoneAttributes(): Promise<GetZoneAttributesResponse> {
    return this.DevicePropertiesService.GetZoneAttributes()
    .then(attr => {
      this.zoneAttributes = attr
      return attr;
    }) 
  }

  /**
   * GetZoneGroupState() shortcut to .ZoneGroupTopologyService.GetZoneGroupState()
   *
   * @returns {Promise<GetZoneGroupStateResponse>}
   * @memberof SonosDevice
   */
  public GetZoneGroupState(): Promise<GetZoneGroupStateResponse> { return this.ZoneGroupTopologyService.GetZoneGroupState() }

  /**
   * GetZoneInfo shortcut to .DevicePropertiesService.GetZoneInfo()
   *
   * @returns {Promise<GetZoneInfoResponse>}
   * @memberof SonosDevice
   */
  public GetZoneInfo(): Promise<GetZoneInfoResponse> { return this.DevicePropertiesService.GetZoneInfo() }
  
  /**
   * Play next song, shortcut to .Coordinator.AVTransportService.Next()
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public Next(): Promise<boolean> { return this.Coordinator.AVTransportService.Next() }

 /**
   * Pause playback, shortcut to .Coordinator.AVTransportService.Pause()
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public Pause(): Promise<boolean> { return this.Coordinator.AVTransportService.Pause() }

  /**
   * Start playing, shortcut to .Coordinator.AVTransportService.Play({InstanceID: 0, Speed: '1'})
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public Play(): Promise<boolean> { return this.Coordinator.AVTransportService.Play({InstanceID: 0, Speed: '1'}) }

  /**
   * Play previous song, shortcut to .Coordinator.AVTransportService.Previous()
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public Previous(): Promise<boolean> { return this.Coordinator.AVTransportService.Previous() }

  /**
   * Seek position in the current track, shortcut to .Coordinator.AVTransportService.Seek({InstanceID: 0, Unit: 'REL_TIME', Target: trackTime})
   *
   * @param {string} trackTime
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public SeekPosition(trackTime: string): Promise<boolean> { return this.Coordinator.AVTransportService.Seek({InstanceID: 0, Unit: 'REL_TIME', Target: trackTime})}

  /**
   * Go to other track in queue, shortcut to .Coordinator.AVTransportService.Seek({InstanceID: 0, Unit: 'TRACK_NR', Target: trackNr.toString()})
   *
   * @param {number} trackNr The track number to go to.
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public SeeKTrack(trackNr: number): Promise<boolean> { return this.Coordinator.AVTransportService.Seek({InstanceID: 0, Unit: 'TRACK_NR', Target: trackNr.toString()}) }

  /**
   * Stop playback, shortcut to .Coordinator.AVTransportService.Stop()
   *
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public Stop(): Promise<boolean> { return this.Coordinator.AVTransportService.Stop() }
  //#endregion
}
