import { SonosDeviceBase } from './sonos-device-base'
import { GetZoneInfoResponse, GetZoneAttributesResponse, GetZoneGroupStateResponse } from './services' 
export class SonosDevice extends SonosDeviceBase {

  /**
   * Preload some device data, should be called before accessing most properties of this class.
   *
   * @returns {Promise<boolean>} Either returns true or throws an error
   * @memberof SonosDevice
   */
  public async LoadDeviceData(): Promise<boolean> {
    this.zoneAttributes = await this.GetZoneAttributes()
    return true
  }

  // ---------- Properties ---------------------
  private zoneAttributes: GetZoneAttributesResponse | undefined
  /**
   * Name of this player, call 'LoadDeviceData()' first.
   *
   * @readonly
   * @type {string}
   * @memberof SonosDevice
   */
  public get Name(): string {
    if (this.zoneAttributes === undefined) throw new Error('Zone attributes not loaded')
    return this.zoneAttributes.CurrentZoneName
  }

  // ---------- Shortcuts ----------------------
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
}
