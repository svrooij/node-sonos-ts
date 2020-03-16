import { TransportState } from "./transport-state";
import { Track } from "./track";
import { AVTransportServiceEvent, RenderingControlServiceEvent } from "../services";

export enum ServiceEvents {
  Data = "serviceEvent",
  LastChange = "serviceEvent",
  Unprocessed = "rawEvent"
}

export enum SonosEvents {
  /**
   * Unparsed events from the AVTransport service
   */
  AVTransport = "avtransport",
  CurrentTrackUri = "currentTrackUri",
  CurrentTrackMetadata = "currentTrack",
  EnqueuedTransportUri = "enqueuedTransportUri",
  EnqueuedTransportMetadata = "enqueuedTransport",
  NextTrackUri = "nextTrackUri",
  NextTrackMetadata = "nextTrack",
  /**
   * Changes in TransportState
   */
  CurrentTransportState = "transportState",
  CurrentTransportStateSimple = "simpleTransportState",
  /**
   * If the CurrentTransportState changed to STOPPED
   */
  PlaybackStopped = "playbackStopped",
  /**
   * Unparsed events from the RenderingControl service
   */
  RenderingControl = "renderingcontrol",
  Mute = "muted",
  Volume = "volume",
  /**
   * This event is emitted if the coordinator of this device changed
   */
  Coordinator = "coordinator",
  /**
   * This event is emitted if the groupname changes.
   */
  GroupName = "groupname"
}


export interface StrongSonosEvents {
  avtransport: (data: AVTransportServiceEvent) => void;
  currentTrack: (track: Track) => void;
  currentTrackUri: (trachUri: string) => void;
  enqueuedTransport: (track: Track) => void;
  enqueuedTransportUri: (transportUri: string) => void;
  nextTrack: (track: Track) => void;
  nextTrackUri: (trackUri: string) => void;
  transportState: (state: TransportState) => void;
  simpleTransportState: (state: TransportState) => void;
  playbackStopped: void;

  renderingcontrol: (data: RenderingControlServiceEvent) => void;
  muted: (muted: boolean) => void;
  volume: (volume: number) => void;

  coordinator: (uuid: string) => void;
  groupname: (name: string) => void;

  // For internal use to unsubscribe on last user.
  removeListener: void;
  newListener: void;
}