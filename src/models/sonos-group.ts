import SonosDevice from '../sonos-device';

import { ZoneGroup } from './zone-group';

export class SonosGroup {
  public readonly Coordinator: SonosDevice;

  public readonly Members: ReadonlyArray<SonosDevice>;

  public readonly Name: string;

  constructor(zoneGroup: ZoneGroup) {
    this.Members = zoneGroup.members.map((m) => new SonosDevice(m.host, m.port, m.uuid));
    this.Coordinator = this.Members.find((m) => m.Uuid === zoneGroup.coordinator.uuid) as SonosDevice;
    this.Name = zoneGroup.name;
  }
}
