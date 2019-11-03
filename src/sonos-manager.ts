import { ZoneGroupTopologyService } from './services'
import { SonosDevice, SonosDeviceDiscovery, ZoneHelper } from './'
import { SonosGroup } from './models'
export class SonosManager {
  private devices: SonosDevice[] = [];
  private groups: SonosGroup[] = [];
  private zoneService: ZoneGroupTopologyService | undefined

  public InitializeFromDevice(host: string, port = 1400): Promise<boolean> {
    this.zoneService = new ZoneGroupTopologyService(host, port);
    return this.LoadAllGroups()
  }

  public InitializeWithDiscovery(timeoutInSeconds: 10): Promise<boolean> {
    const deviceDiscovery = new SonosDeviceDiscovery();
    return deviceDiscovery
      .SearchOne(timeoutInSeconds)
      .then(player => {
        this.zoneService = new ZoneGroupTopologyService(player.host, player.port);
        return this.LoadAllGroups();
      })
  }

  private LoadAllGroups(): Promise<boolean> {
    if (this.zoneService === undefined) throw new Error('Manager is\'t initialized')
    return this.zoneService.GetZoneGroupState()
      .then(zoneGroupResponse => {
        return ZoneHelper.ParseZoneGroupStateResponse(zoneGroupResponse)
      })
      .then(groups => {
        this.groups = groups.map(g => new SonosGroup(g))
        this.devices.length = 0
        this.groups.forEach(g => g.Members.forEach(m => this.devices.push(m)))
        return true
      })
  }

  public get Groups(): SonosGroup[] {
    if (this.groups.length === 0) throw new Error('No Groups available!')
    return this.groups;
  }

  public get Devices(): SonosDevice[] {
    if (this.devices.length === 0) throw new Error('No Devices available!')
    return this.devices;
  }
}