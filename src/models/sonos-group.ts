import { SonosDevice } from '../sonos-device'
import { ZoneGroup } from '../helpers/zone-helper'

export class SonosGroup {
  public readonly Coordinator: SonosDevice
  public readonly Members: ReadonlyArray<SonosDevice>
  public readonly Name: string
  
  constructor(zoneGroup: ZoneGroup) {
    this.Coordinator = new SonosDevice(zoneGroup.coordinator.host, zoneGroup.coordinator.port)
    this.Members = zoneGroup.members.map(m => new SonosDevice(m.host, m.port))
    this.Name = zoneGroup.name
  }  
}