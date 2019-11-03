// Auto-generated on Sun Nov 03 2019 16:33:10 GMT+0100 (Central European Standard Time)
import { AVTransportService, AlarmClockService, AudioInService, ConnectionManagerService, ContentDirectoryService, DevicePropertiesService, GroupManagementService, GroupRenderingControlService, MusicServicesService, QPlayService, QueueService, RenderingControlService, SystemPropertiesService, VirtualLineInService, ZoneGroupTopologyService } from './services'

export class SonosDeviceBase {
  protected readonly host: string;
  protected readonly port: number;
  constructor(host: string, port: number = 1400) {
    this.host = host;
    this.port = port;
  }

  private avtransportservice: AVTransportService | undefined;
  public get AVTransportService(): AVTransportService {
    if (this.avtransportservice === undefined) this.avtransportservice = new AVTransportService(this.host, this.port);
    return this.avtransportservice;
  }

  private alarmclockservice: AlarmClockService | undefined;
  public get AlarmClockService(): AlarmClockService {
    if (this.alarmclockservice === undefined) this.alarmclockservice = new AlarmClockService(this.host, this.port);
    return this.alarmclockservice;
  }

  private audioinservice: AudioInService | undefined;
  public get AudioInService(): AudioInService {
    if (this.audioinservice === undefined) this.audioinservice = new AudioInService(this.host, this.port);
    return this.audioinservice;
  }

  private connectionmanagerservice: ConnectionManagerService | undefined;
  public get ConnectionManagerService(): ConnectionManagerService {
    if (this.connectionmanagerservice === undefined) this.connectionmanagerservice = new ConnectionManagerService(this.host, this.port);
    return this.connectionmanagerservice;
  }

  private contentdirectoryservice: ContentDirectoryService | undefined;
  public get ContentDirectoryService(): ContentDirectoryService {
    if (this.contentdirectoryservice === undefined) this.contentdirectoryservice = new ContentDirectoryService(this.host, this.port);
    return this.contentdirectoryservice;
  }

  private devicepropertiesservice: DevicePropertiesService | undefined;
  public get DevicePropertiesService(): DevicePropertiesService {
    if (this.devicepropertiesservice === undefined) this.devicepropertiesservice = new DevicePropertiesService(this.host, this.port);
    return this.devicepropertiesservice;
  }

  private groupmanagementservice: GroupManagementService | undefined;
  public get GroupManagementService(): GroupManagementService {
    if (this.groupmanagementservice === undefined) this.groupmanagementservice = new GroupManagementService(this.host, this.port);
    return this.groupmanagementservice;
  }

  private grouprenderingcontrolservice: GroupRenderingControlService | undefined;
  public get GroupRenderingControlService(): GroupRenderingControlService {
    if (this.grouprenderingcontrolservice === undefined) this.grouprenderingcontrolservice = new GroupRenderingControlService(this.host, this.port);
    return this.grouprenderingcontrolservice;
  }

  private musicservicesservice: MusicServicesService | undefined;
  public get MusicServicesService(): MusicServicesService {
    if (this.musicservicesservice === undefined) this.musicservicesservice = new MusicServicesService(this.host, this.port);
    return this.musicservicesservice;
  }

  private qplayservice: QPlayService | undefined;
  public get QPlayService(): QPlayService {
    if (this.qplayservice === undefined) this.qplayservice = new QPlayService(this.host, this.port);
    return this.qplayservice;
  }

  private queueservice: QueueService | undefined;
  public get QueueService(): QueueService {
    if (this.queueservice === undefined) this.queueservice = new QueueService(this.host, this.port);
    return this.queueservice;
  }

  private renderingcontrolservice: RenderingControlService | undefined;
  public get RenderingControlService(): RenderingControlService {
    if (this.renderingcontrolservice === undefined) this.renderingcontrolservice = new RenderingControlService(this.host, this.port);
    return this.renderingcontrolservice;
  }

  private systempropertiesservice: SystemPropertiesService | undefined;
  public get SystemPropertiesService(): SystemPropertiesService {
    if (this.systempropertiesservice === undefined) this.systempropertiesservice = new SystemPropertiesService(this.host, this.port);
    return this.systempropertiesservice;
  }

  private virtuallineinservice: VirtualLineInService | undefined;
  public get VirtualLineInService(): VirtualLineInService {
    if (this.virtuallineinservice === undefined) this.virtuallineinservice = new VirtualLineInService(this.host, this.port);
    return this.virtuallineinservice;
  }

  private zonegrouptopologyservice: ZoneGroupTopologyService | undefined;
  public get ZoneGroupTopologyService(): ZoneGroupTopologyService {
    if (this.zonegrouptopologyservice === undefined) this.zonegrouptopologyservice = new ZoneGroupTopologyService(this.host, this.port);
    return this.zonegrouptopologyservice;
  }
}
