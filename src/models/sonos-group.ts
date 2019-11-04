import { SonosDevice } from '../sonos-device'
import { ZoneGroup } from '../helpers/zone-helper'

export class SonosGroup {
  public readonly Coordinator: SonosDevice
  public readonly Members: ReadonlyArray<SonosDevice>
  public readonly Name: string
  
  constructor(zoneGroup: ZoneGroup) {
    this.Members = zoneGroup.members.map(m => new SonosDevice(m.host, m.port, m.uuid))
    this.Coordinator = this.Members.find(m => m.uuid === zoneGroup.coordinator.uuid) as SonosDevice
    this.Name = zoneGroup.name
  }  
}