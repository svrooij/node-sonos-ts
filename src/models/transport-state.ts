export enum TransportState {
  Stopped = 'STOPPED',
  Playing = 'PLAYING',
  Paused = 'PAUSED_PLAYBACK',
  Transitioning = 'TRANSITIONING'
}

export enum GroupTransportState {
  GroupStopped = 'GROUP_STOPPED',
  GroupPlaying = 'GROUP_PLAYING'
}

export type ExtendedTransportState = TransportState | GroupTransportState;
