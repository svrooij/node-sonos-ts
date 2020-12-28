import { TransportState } from './transport-state';
import { Track } from './track';
import { AVTransportServiceEvent, RenderingControlServiceEvent } from '../services/index';

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
