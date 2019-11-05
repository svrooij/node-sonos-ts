// This file exports responses that where not unique over all services.
// The interfaces in this file are manually removed from the service-generator.

export interface BrowseResponse {
  Result: string;
  NumberReturned: number;
  TotalMatches: number;
  UpdateID: number;
}

export interface Track {
  Artist?: string;
  Title?: string;
  Album?: string;
  AlbumArtUri?: string;
  UpnpClass?: string;
  Duration?: string;
  ItemId?: string;
  ParentId?: string;
  TrackUri?: string;
  ProtocolInfo?: string;
}

export { SonosGroup } from './sonos-group'
export { SonosDeviceDescription } from './sonos-device-description'