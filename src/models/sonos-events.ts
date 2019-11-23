export enum ServiceEvents {
  Data = "service.data",
  LastChange = "service.lastchange",
}

export enum SonosEvents {
  /**
   * Unparsed events from the AVTransport service
   */
  AVTransport = "service.avtransport",
  CurrentTrack = "avtransport.CurrentTrackUri",
  CurrentTrackMetadata = "avtransport.CurrentTrackMetaData",
  NextTrack = "avtransport.NextTrackUri",
  NextTrackMetadata = "avtransport.NextTrackMetaData",
  /**
   * Changes in TransportState
   */
  CurrentTransportState = "avtransport.CurrentTransportState",
  /**
   * If the CurrentTransportState changed to STOPPED
   */
  PlaybackStopped = "avtransport.CurrentTransportState.STOPPED",
  /**
   * Unparsed events from the RenderingControl service
   */
  RenderingControl = "service.renderingcontrol",
  Mute = "renderingcontrol.mute",
  Volume = "renderingcontrol.volume",
  /**
   * This event is emitted if the coordinator of this device changed
   */
  Coordinator = "grouped.coordinator",
  /**
   * This event is emitted if the groupname changes.
   */
  GroupName = "grouped.groupname"
}