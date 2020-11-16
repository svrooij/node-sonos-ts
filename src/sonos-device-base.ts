/**
 * Sonos base device with all services defined.
 *
 * Stephan van Rooij
 * https://svrooij.io/sonos-api-docs
 *
 * This file is generated, do not edit manually.
 */
import { Guid } from 'guid-typescript';
import debug, { Debugger } from 'debug';

import {
  AlarmClockService,
  AudioInService,
  AVTransportService,
  ConnectionManagerService,
  ContentDirectoryService,
  DevicePropertiesService,
  GroupManagementService,
  GroupRenderingControlService,
  HTControlService,
  MusicServicesService,
  QPlayService,
  QueueService,
  RenderingControlService,
  SystemPropertiesService,
  VirtualLineInService,
  ZoneGroupTopologyService,
} from './services';

/**
 * SonosDeviceBase is auto-generated to link to all available services of your Sonos Device
 *
 * @export
 * @class SonosDeviceBase
 */
export default class SonosDeviceBase {
  protected readonly host: string;

  protected readonly port: number;

  private debugger?: Debugger;

  protected get debug(): Debugger {
    if (this.debugger === undefined) {
      this.debugger = debug(`sonos:device:${this.host}`);
    }
    return this.debugger;
  }

  protected uuid: string;

  /**
   *Creates an instance of SonosDeviceBase.
   * @param {string} host The IP of the speaker
   * @param {number} [port=1400] The port, always 1400
   * @param {string} [uuid=Guid.create().toString()] The UUID of the speaker like RINCON_macaddres01400, used in some commands.
   * @memberof SonosDeviceBase
   */
  constructor(host: string, port = 1400, uuid: string = Guid.create().toString()) {
    this.host = host;
    this.port = port;
    this.uuid = uuid;
  }

  private alarmclockservice: AlarmClockService | undefined;

  /**
    * Control the sonos alarms
    * will be initialized on first use.
    *
    * @readonly
    * @type {AlarmClockService}
    * @memberof SonosDeviceBase
    */
  public get AlarmClockService(): AlarmClockService {
    if (this.alarmclockservice === undefined) this.alarmclockservice = new AlarmClockService(this.host, this.port, this.uuid);
    return this.alarmclockservice;
  }

  private audioinservice: AudioInService | undefined;

  public get AudioInService(): AudioInService {
    if (this.audioinservice === undefined) this.audioinservice = new AudioInService(this.host, this.port, this.uuid);
    return this.audioinservice;
  }

  private avtransportservice: AVTransportService | undefined;

  /**
    * Service that controls stuff related to transport (play/pause/next/special urls)
    * will be initialized on first use.
    *
    * @readonly
    * @type {AVTransportService}
    * @memberof SonosDeviceBase
    */
  public get AVTransportService(): AVTransportService {
    if (this.avtransportservice === undefined) this.avtransportservice = new AVTransportService(this.host, this.port, this.uuid);
    return this.avtransportservice;
  }

  private connectionmanagerservice: ConnectionManagerService | undefined;

  public get ConnectionManagerService(): ConnectionManagerService {
    if (this.connectionmanagerservice === undefined) this.connectionmanagerservice = new ConnectionManagerService(this.host, this.port, this.uuid);
    return this.connectionmanagerservice;
  }

  private contentdirectoryservice: ContentDirectoryService | undefined;

  /**
    * Browse for local content
    * will be initialized on first use.
    *
    * @readonly
    * @type {ContentDirectoryService}
    * @memberof SonosDeviceBase
    */
  public get ContentDirectoryService(): ContentDirectoryService {
    if (this.contentdirectoryservice === undefined) this.contentdirectoryservice = new ContentDirectoryService(this.host, this.port, this.uuid);
    return this.contentdirectoryservice;
  }

  private devicepropertiesservice: DevicePropertiesService | undefined;

  /**
    * Modify device properties, like led status and stereo pairs -
    * will be initialized on first use.
    *
    * @readonly
    * @type {DevicePropertiesService}
    * @memberof SonosDeviceBase
    */
  public get DevicePropertiesService(): DevicePropertiesService {
    if (this.devicepropertiesservice === undefined) this.devicepropertiesservice = new DevicePropertiesService(this.host, this.port, this.uuid);
    return this.devicepropertiesservice;
  }

  private groupmanagementservice: GroupManagementService | undefined;

  public get GroupManagementService(): GroupManagementService {
    if (this.groupmanagementservice === undefined) this.groupmanagementservice = new GroupManagementService(this.host, this.port, this.uuid);
    return this.groupmanagementservice;
  }

  private grouprenderingcontrolservice: GroupRenderingControlService | undefined;

  /**
    * Volume related controls for groups. Group volume is the average volume of all players. Snapshot stores the volume ratio between players.
    * will be initialized on first use.
    *
    * @readonly
    * @type {GroupRenderingControlService}
    * @memberof SonosDeviceBase
    */
  public get GroupRenderingControlService(): GroupRenderingControlService {
    if (this.grouprenderingcontrolservice === undefined) this.grouprenderingcontrolservice = new GroupRenderingControlService(this.host, this.port, this.uuid);
    return this.grouprenderingcontrolservice;
  }

  private htcontrolservice: HTControlService | undefined;

  public get HTControlService(): HTControlService {
    if (this.htcontrolservice === undefined) this.htcontrolservice = new HTControlService(this.host, this.port, this.uuid);
    return this.htcontrolservice;
  }

  private musicservicesservice: MusicServicesService | undefined;

  /**
    * External music services
    * will be initialized on first use.
    *
    * @readonly
    * @type {MusicServicesService}
    * @memberof SonosDeviceBase
    */
  public get MusicServicesService(): MusicServicesService {
    if (this.musicservicesservice === undefined) this.musicservicesservice = new MusicServicesService(this.host, this.port, this.uuid);
    return this.musicservicesservice;
  }

  private qplayservice: QPlayService | undefined;

  public get QPlayService(): QPlayService {
    if (this.qplayservice === undefined) this.qplayservice = new QPlayService(this.host, this.port, this.uuid);
    return this.qplayservice;
  }

  private queueservice: QueueService | undefined;

  /**
    * Modify and browse queues
    * will be initialized on first use.
    *
    * @readonly
    * @type {QueueService}
    * @memberof SonosDeviceBase
    */
  public get QueueService(): QueueService {
    if (this.queueservice === undefined) this.queueservice = new QueueService(this.host, this.port, this.uuid);
    return this.queueservice;
  }

  private renderingcontrolservice: RenderingControlService | undefined;

  /**
    * Volume related controls
    * will be initialized on first use.
    *
    * @readonly
    * @type {RenderingControlService}
    * @memberof SonosDeviceBase
    */
  public get RenderingControlService(): RenderingControlService {
    if (this.renderingcontrolservice === undefined) this.renderingcontrolservice = new RenderingControlService(this.host, this.port, this.uuid);
    return this.renderingcontrolservice;
  }

  private systempropertiesservice: SystemPropertiesService | undefined;

  /**
    * Manage system-wide settings, mainly account stuff.
    * will be initialized on first use.
    *
    * @readonly
    * @type {SystemPropertiesService}
    * @memberof SonosDeviceBase
    */
  public get SystemPropertiesService(): SystemPropertiesService {
    if (this.systempropertiesservice === undefined) this.systempropertiesservice = new SystemPropertiesService(this.host, this.port, this.uuid);
    return this.systempropertiesservice;
  }

  private virtuallineinservice: VirtualLineInService | undefined;

  public get VirtualLineInService(): VirtualLineInService {
    if (this.virtuallineinservice === undefined) this.virtuallineinservice = new VirtualLineInService(this.host, this.port, this.uuid);
    return this.virtuallineinservice;
  }

  private zonegrouptopologyservice: ZoneGroupTopologyService | undefined;

  /**
    * Zone config stuff, eg getting all the configured sonos zones.
    * will be initialized on first use.
    *
    * @readonly
    * @type {ZoneGroupTopologyService}
    * @memberof SonosDeviceBase
    */
  public get ZoneGroupTopologyService(): ZoneGroupTopologyService {
    if (this.zonegrouptopologyservice === undefined) this.zonegrouptopologyservice = new ZoneGroupTopologyService(this.host, this.port, this.uuid);
    return this.zonegrouptopologyservice;
  }

  /**
   * Refresh all service event subscriptions, if you were already subscribed.
   *
   * @returns {Promise<boolean>} returns true if at least one service subscription is refreshed.
   * @memberof SonosDeviceBase
   */
  public async RefreshEventSubscriptions(): Promise<boolean> {
    let result = false;
    if (this.alarmclockservice !== undefined) result = await this.alarmclockservice.CheckEventListener() || result;
    if (this.audioinservice !== undefined) result = await this.audioinservice.CheckEventListener() || result;
    if (this.avtransportservice !== undefined) result = await this.avtransportservice.CheckEventListener() || result;
    if (this.connectionmanagerservice !== undefined) result = await this.connectionmanagerservice.CheckEventListener() || result;
    if (this.contentdirectoryservice !== undefined) result = await this.contentdirectoryservice.CheckEventListener() || result;
    if (this.devicepropertiesservice !== undefined) result = await this.devicepropertiesservice.CheckEventListener() || result;
    if (this.groupmanagementservice !== undefined) result = await this.groupmanagementservice.CheckEventListener() || result;
    if (this.grouprenderingcontrolservice !== undefined) result = await this.grouprenderingcontrolservice.CheckEventListener() || result;
    if (this.htcontrolservice !== undefined) result = await this.htcontrolservice.CheckEventListener() || result;
    if (this.musicservicesservice !== undefined) result = await this.musicservicesservice.CheckEventListener() || result;
    if (this.qplayservice !== undefined) result = await this.qplayservice.CheckEventListener() || result;
    if (this.queueservice !== undefined) result = await this.queueservice.CheckEventListener() || result;
    if (this.renderingcontrolservice !== undefined) result = await this.renderingcontrolservice.CheckEventListener() || result;
    if (this.systempropertiesservice !== undefined) result = await this.systempropertiesservice.CheckEventListener() || result;
    if (this.virtuallineinservice !== undefined) result = await this.virtuallineinservice.CheckEventListener() || result;
    if (this.zonegrouptopologyservice !== undefined) result = await this.zonegrouptopologyservice.CheckEventListener() || result;
    return result;
  }
}
