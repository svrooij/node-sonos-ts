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
  CdUdn?: string;
  /**
   * Pre-encoded DIDL-Lite metadata (`r:resMD`) for the underlying playable resource, only
   * present on some favorites. Use this as CurrentURIMetaData instead of the favorite's own
   * UpnpClass, which describes the favorite entry itself and isn't valid for playback.
   */
  ResMD?: string;
}
