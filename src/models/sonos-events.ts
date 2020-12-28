export enum SonosEvents {
  /**
   * Unparsed events from the AVTransport service
   */
  AVTransport = 'avtransport',
  CurrentTrackUri = 'currentTrackUri',
  CurrentTrackMetadata = 'currentTrack',
  EnqueuedTransportUri = 'enqueuedTransportUri',
  EnqueuedTransportMetadata = 'enqueuedTransport',
  NextTrackUri = 'nextTrackUri',
  NextTrackMetadata = 'nextTrack',
  /**
   * Changes in TransportState
   */
  CurrentTransportState = 'transportState',
  CurrentTransportStateSimple = 'simpleTransportState',
  /**
   * If the CurrentTransportState changed to STOPPED
   */
  PlaybackStopped = 'playbackStopped',
  /**
   * Unparsed events from the RenderingControl service
   */
  RenderingControl = 'renderingcontrol',
  Mute = 'muted',
  Volume = 'volume',
  /**
   * This event is emitted if the coordinator of this device changed
   */
  Coordinator = 'coordinator',
  /**
   * This event is emitted if the groupname changes.
   */
  GroupName = 'groupname'
}
