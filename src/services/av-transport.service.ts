/**
 * Sonos AVTransport service
 *
 * Stephan van Rooij
 * https://svrooij.io
 *
 * This file is generated, do not edit manually. https://sonos.svrooij.io/
 */
import BaseService from './base-service';
import { SonosUpnpError } from '../models/sonos-upnp-error';
import SonosUpnpErrors from './sonos-upnp-errors';
import {
  PlayMode, Track,
} from '../models';

/**
 * Service that controls stuff related to transport (play/pause/next/special URLs)
 *
 * @export
 * @class AVTransportService
 * @extends {BaseService}
 */
export class AVTransportService extends BaseService<AVTransportServiceEvent> {
  readonly serviceNane: string = 'AVTransport';

  readonly controlUrl: string = '/MediaRenderer/AVTransport/Control';

  readonly eventSubUrl: string = '/MediaRenderer/AVTransport/Event';

  readonly scpUrl: string = '/xml/AVTransport1.xml';

  /**
   * Default errors and service specific errors
   *
   * @type {SonosUpnpError[]}
   * @remarks See https://svrooij.io/sonos-api-docs/#manual-documentation-file
   */
  readonly errors: SonosUpnpError[] = [
    ...SonosUpnpErrors.defaultErrors,
    { code: 701, description: 'Transition not available' },
    { code: 702, description: 'No content' },
    { code: 703, description: 'Read error' },
    { code: 704, description: 'Format not supported for playback' },
    { code: 705, description: 'Transport is locked' },
    { code: 706, description: 'Write error' },
    { code: 707, description: 'Media protected or not writeable' },
    { code: 708, description: 'Format not supported for recording' },
    { code: 709, description: 'Media is full' },
    { code: 710, description: 'Seek mode not supported' },
    { code: 711, description: 'Illegal seek target' },
    { code: 712, description: 'Play mode not supported' },
    { code: 713, description: 'Record quality not supported' },
    { code: 714, description: 'Illegal MIME-Type' },
    { code: 715, description: 'Content busy' },
    { code: 716, description: 'Resource not found' },
    { code: 717, description: 'Play speed not supported' },
    { code: 718, description: 'Invalid InstanceID' },
    { code: 737, description: 'No dns configured' },
    { code: 738, description: 'Bad domain' },
    { code: 739, description: 'Server error' },
    { code: 800, description: 'Command not supported or not a coordinator' },
  ];

  // #region actions
  AddMultipleURIsToQueue(input: { InstanceID: number; UpdateID: number; NumberOfURIs: number; EnqueuedURIs: string; EnqueuedURIsMetaData: Track | string; ContainerURI: string; ContainerMetaData: Track | string; DesiredFirstTrackNumberEnqueued: number; EnqueueAsNext: boolean }):
  Promise<AddMultipleURIsToQueueResponse> { return this.SoapRequestWithBody<typeof input, AddMultipleURIsToQueueResponse>('AddMultipleURIsToQueue', input); }

  /**
   * Adds songs to the SONOS queue
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {string} input.EnqueuedURI
   * @param {Track | string} input.EnqueuedURIMetaData
   * @param {number} input.DesiredFirstTrackNumberEnqueued - use `0` to add at the end or `1` to insert at the beginning
   * @param {boolean} input.EnqueueAsNext
   * @remarks In NORMAL play mode the songs are added prior to the specified `DesiredFirstTrackNumberEnqueued`.
   */
  AddURIToQueue(input: { InstanceID: number; EnqueuedURI: string; EnqueuedURIMetaData: Track | string; DesiredFirstTrackNumberEnqueued: number; EnqueueAsNext: boolean }):
  Promise<AddURIToQueueResponse> { return this.SoapRequestWithBody<typeof input, AddURIToQueueResponse>('AddURIToQueue', input); }

  AddURIToSavedQueue(input: { InstanceID: number; ObjectID: string; UpdateID: number; EnqueuedURI: string; EnqueuedURIMetaData: Track | string; AddAtIndex: number }):
  Promise<AddURIToSavedQueueResponse> { return this.SoapRequestWithBody<typeof input, AddURIToSavedQueueResponse>('AddURIToSavedQueue', input); }

  BackupQueue(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('BackupQueue', input); }

  /**
   * Leave the current group and revert to a single player.
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   */
  BecomeCoordinatorOfStandaloneGroup(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<BecomeCoordinatorOfStandaloneGroupResponse> { return this.SoapRequestWithBody<typeof input, BecomeCoordinatorOfStandaloneGroupResponse>('BecomeCoordinatorOfStandaloneGroup', input); }

  BecomeGroupCoordinator(input: { InstanceID: number; CurrentCoordinator: string; CurrentGroupID: string; OtherMembers: string; TransportSettings: string; CurrentURI: string; CurrentURIMetaData: Track | string; SleepTimerState: string; AlarmState: string; StreamRestartState: string; CurrentQueueTrackList: string; CurrentVLIState: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('BecomeGroupCoordinator', input); }

  BecomeGroupCoordinatorAndSource(input: { InstanceID: number; CurrentCoordinator: string; CurrentGroupID: string; OtherMembers: string; CurrentURI: string; CurrentURIMetaData: Track | string; SleepTimerState: string; AlarmState: string; StreamRestartState: string; CurrentAVTTrackList: string; CurrentQueueTrackList: string; CurrentSourceState: string; ResumePlayback: boolean }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('BecomeGroupCoordinatorAndSource', input); }

  ChangeCoordinator(input: { InstanceID: number; CurrentCoordinator: string; NewCoordinator: string; NewTransportSettings: string; CurrentAVTransportURI: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('ChangeCoordinator', input); }

  ChangeTransportSettings(input: { InstanceID: number; NewTransportSettings: string; CurrentAVTransportURI: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('ChangeTransportSettings', input); }

  /**
   * Stop playing after set sleep timer or cancel
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {string} input.NewSleepTimerDuration - Time to stop after, as `hh:mm:ss` or empty string to cancel
   * @remarks Send to non-coordinator returns error code 800
   */
  ConfigureSleepTimer(input: { InstanceID: number; NewSleepTimerDuration: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('ConfigureSleepTimer', input); }

  CreateSavedQueue(input: { InstanceID: number; Title: string; EnqueuedURI: string; EnqueuedURIMetaData: Track | string }):
  Promise<CreateSavedQueueResponse> { return this.SoapRequestWithBody<typeof input, CreateSavedQueueResponse>('CreateSavedQueue', input); }

  /**
   * Delegates the coordinator role to another player in the same group
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {string} input.NewCoordinator - uuid of the new coordinator - must be in same group
   * @param {boolean} input.RejoinGroup - Should former coordinator rejoin the group?
   * @remarks Send to non-coordinator has no results - should be avoided.
   */
  DelegateGroupCoordinationTo(input: { InstanceID: number; NewCoordinator: string; RejoinGroup: boolean }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('DelegateGroupCoordinationTo', input); }

  EndDirectControlSession(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('EndDirectControlSession', input); }

  /**
   * Get crossfade mode
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @remarks Send to non-coordinator may return wrong value as only the coordinator value in a group
   */
  GetCrossfadeMode(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<GetCrossfadeModeResponse> { return this.SoapRequestWithBody<typeof input, GetCrossfadeModeResponse>('GetCrossfadeMode', input); }

  /**
   * Get current transport actions such as Set, Stop, Pause, Play, X_DLNA_SeekTime, Next, X_DLNA_SeekTrackNr
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @remarks Send to non-coordinator returns only `Start` and `Stop` since it cannot control the stream.
   */
  GetCurrentTransportActions(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<GetCurrentTransportActionsResponse> { return this.SoapRequestWithBody<typeof input, GetCurrentTransportActionsResponse>('GetCurrentTransportActions', input); }

  GetDeviceCapabilities(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<GetDeviceCapabilitiesResponse> { return this.SoapRequestWithBody<typeof input, GetDeviceCapabilitiesResponse>('GetDeviceCapabilities', input); }

  /**
   * Get information about the current playing media (queue)
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   */
  GetMediaInfo(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<GetMediaInfoResponse> { return this.SoapRequestWithBody<typeof input, GetMediaInfoResponse>('GetMediaInfo', input); }

  /**
   * Get information about current position (position in queue and time in current song)
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   */
  GetPositionInfo(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<GetPositionInfoResponse> { return this.SoapRequestWithBody<typeof input, GetPositionInfoResponse>('GetPositionInfo', input); }

  /**
   * Get time left on sleeptimer.
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @remarks Send to non-coordinator returns error code 800
   */
  GetRemainingSleepTimerDuration(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<GetRemainingSleepTimerDurationResponse> { return this.SoapRequestWithBody<typeof input, GetRemainingSleepTimerDurationResponse>('GetRemainingSleepTimerDuration', input); }

  GetRunningAlarmProperties(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<GetRunningAlarmPropertiesResponse> { return this.SoapRequestWithBody<typeof input, GetRunningAlarmPropertiesResponse>('GetRunningAlarmProperties', input); }

  /**
   * Get current transport status, speed and state such as PLAYING, STOPPED, PLAYING, PAUSED_PLAYBACK, TRANSITIONING, NO_MEDIA_PRESENT
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @remarks Send to non-coordinator always returns PLAYING
   */
  GetTransportInfo(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<GetTransportInfoResponse> { return this.SoapRequestWithBody<typeof input, GetTransportInfoResponse>('GetTransportInfo', input); }

  /**
   * Get transport settings
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @remarks Send to non-coordinator returns the settings of it's queue
   */
  GetTransportSettings(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<GetTransportSettingsResponse> { return this.SoapRequestWithBody<typeof input, GetTransportSettingsResponse>('GetTransportSettings', input); }

  /**
   * Go to next song
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @remarks Possibly not supported at the moment see GetCurrentTransportActions
   */
  Next(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('Next', input); }

  NotifyDeletedURI(input: { InstanceID: number; DeletedURI: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('NotifyDeletedURI', input); }

  /**
   * Pause playback
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   */
  Pause(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('Pause', input); }

  /**
   * Start playing the set TransportURI
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {string} input.Speed - Play speed usually 1, can be a fraction of 1 [ '1' ]
   */
  Play(input: { InstanceID: number; Speed: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('Play', input); }

  /**
   * Go to previous song
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @remarks Possibly not supported at the moment see GetCurrentTransportActions
   */
  Previous(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('Previous', input); }

  /**
   * Flushes the SONOS queue.
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @remarks If queue is already empty it throw error 804. Send to non-coordinator returns error code 800.
   */
  RemoveAllTracksFromQueue(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('RemoveAllTracksFromQueue', input); }

  RemoveTrackFromQueue(input: { InstanceID: number; ObjectID: string; UpdateID: number }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('RemoveTrackFromQueue', input); }

  /**
   * Removes the specified range of songs from the SONOS queue.
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {number} input.UpdateID - Leave blank
   * @param {number} input.StartingIndex - between 1 and queue-length
   * @param {number} input.NumberOfTracks
   */
  RemoveTrackRangeFromQueue(input: { InstanceID: number; UpdateID: number; StartingIndex: number; NumberOfTracks: number }):
  Promise<RemoveTrackRangeFromQueueResponse> { return this.SoapRequestWithBody<typeof input, RemoveTrackRangeFromQueueResponse>('RemoveTrackRangeFromQueue', input); }

  ReorderTracksInQueue(input: { InstanceID: number; StartingIndex: number; NumberOfTracks: number; InsertBefore: number; UpdateID: number }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('ReorderTracksInQueue', input); }

  ReorderTracksInSavedQueue(input: { InstanceID: number; ObjectID: string; UpdateID: number; TrackList: string; NewPositionList: string }):
  Promise<ReorderTracksInSavedQueueResponse> { return this.SoapRequestWithBody<typeof input, ReorderTracksInSavedQueueResponse>('ReorderTracksInSavedQueue', input); }

  RunAlarm(input: { InstanceID: number; AlarmID: number; LoggedStartTime: string; Duration: string; ProgramURI: string; ProgramMetaData: Track | string; PlayMode: PlayMode; Volume: number; IncludeLinkedZones: boolean }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('RunAlarm', input); }

  /**
   * Saves the current SONOS queue as a SONOS playlist and outputs objectID
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {string} input.Title - SONOS playlist title
   * @param {string} input.ObjectID - Leave blank
   * @remarks Send to non-coordinator returns error code 800
   */
  SaveQueue(input: { InstanceID: number; Title: string; ObjectID: string }):
  Promise<SaveQueueResponse> { return this.SoapRequestWithBody<typeof input, SaveQueueResponse>('SaveQueue', input); }

  /**
   * Seek track in queue, time delta or absolute time in song
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {string} input.Unit - What to seek [ 'TRACK_NR' / 'REL_TIME' / 'TIME_DELTA' ]
   * @param {string} input.Target - Position of track in queue (start at 1) or `hh:mm:ss` for `REL_TIME` or `+/-hh:mm:ss` for `TIME_DELTA`
   * @remarks Returns error code 701 in case that content does not support Seek or send to non-coordinator
   */
  Seek(input: { InstanceID: number; Unit: string; Target: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('Seek', input); }

  /**
   * Set the transport URI to a song, a stream, the queue, another player-rincon and a lot more
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {string} input.CurrentURI - The new TransportURI - its a special SONOS format
   * @param {Track | string} input.CurrentURIMetaData - Track Metadata, see MetadataHelper.GuessTrack to guess based on track uri
   * @remarks If set to another player RINCON, the player is grouped with that one.
   */
  SetAVTransportURI(input: { InstanceID: number; CurrentURI: string; CurrentURIMetaData: Track | string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetAVTransportURI', input); }

  /**
   * Set crossfade mode
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {boolean} input.CrossfadeMode
   * @remarks Send to non-coordinator returns error code 800. Same for content, which does not support crossfade mode.
   */
  SetCrossfadeMode(input: { InstanceID: number; CrossfadeMode: boolean }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetCrossfadeMode', input); }

  SetNextAVTransportURI(input: { InstanceID: number; NextURI: string; NextURIMetaData: Track | string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetNextAVTransportURI', input); }

  /**
   * Set the PlayMode
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {PlayMode} input.NewPlayMode - New playmode [ 'NORMAL' / 'REPEAT_ALL' / 'REPEAT_ONE' / 'SHUFFLE_NOREPEAT' / 'SHUFFLE' / 'SHUFFLE_REPEAT_ONE' ]
   * @remarks Send to non-coordinator returns error code 712. If SONOS queue is not activated returns error code 712.
   */
  SetPlayMode(input: { InstanceID: number; NewPlayMode: PlayMode }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetPlayMode', input); }

  /**
   * Snooze the current alarm for some time.
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   * @param {string} input.Duration - Snooze time as `hh:mm:ss`, 10 minutes = 00:10:00
   */
  SnoozeAlarm(input: { InstanceID: number; Duration: string }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SnoozeAlarm', input); }

  StartAutoplay(input: { InstanceID: number; ProgramURI: string; ProgramMetaData: Track | string; Volume: number; IncludeLinkedZones: boolean; ResetVolumeAfter: boolean }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('StartAutoplay', input); }

  /**
   * Stop playback
   *
   * @param {number} input.InstanceID - InstanceID should always be `0`
   */
  Stop(input: { InstanceID: number } = { InstanceID: 0 }):
  Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('Stop', input); }
  // #endregion

  protected responseProperties(): { [key: string]: string } {
    return {
      FirstTrackNumberEnqueued: 'number',
      NumTracksAdded: 'number',
      NewQueueLength: 'number',
      NewUpdateID: 'number',
      DelegatedGroupCoordinatorID: 'string',
      NewGroupID: 'string',
      AssignedObjectID: 'string',
      CrossfadeMode: 'boolean',
      Actions: 'string',
      PlayMedia: 'string',
      RecMedia: 'string',
      RecQualityModes: 'string',
      NrTracks: 'number',
      MediaDuration: 'string',
      CurrentURI: 'string',
      CurrentURIMetaData: 'Track | string',
      NextURI: 'string',
      NextURIMetaData: 'Track | string',
      PlayMedium: 'string',
      RecordMedium: 'string',
      WriteStatus: 'string',
      Track: 'number',
      TrackDuration: 'string',
      TrackMetaData: 'Track | string',
      TrackURI: 'string',
      RelTime: 'string',
      AbsTime: 'string',
      RelCount: 'number',
      AbsCount: 'number',
      RemainingSleepTimerDuration: 'string',
      CurrentSleepTimerGeneration: 'number',
      AlarmID: 'number',
      GroupID: 'string',
      LoggedStartTime: 'string',
      CurrentTransportState: 'string',
      CurrentTransportStatus: 'string',
      CurrentSpeed: 'string',
      PlayMode: 'PlayMode',
      RecQualityMode: 'string',
      QueueLengthChange: 'number',
    };
  }

  // Event properties from service description.
  protected eventProperties(): { [key: string]: string } {
    return {
      AbsoluteCounterPosition: 'number',
      AbsoluteTimePosition: 'string',
      AlarmIDRunning: 'number',
      AlarmLoggedStartTime: 'string',
      AlarmRunning: 'boolean',
      AVTransportURI: 'string',
      AVTransportURIMetaData: 'Track | string',
      CurrentCrossfadeMode: 'boolean',
      CurrentMediaDuration: 'string',
      CurrentPlayMode: 'PlayMode',
      CurrentRecordQualityMode: 'string',
      CurrentSection: 'number',
      CurrentTrack: 'number',
      CurrentTrackDuration: 'string',
      CurrentTrackMetaData: 'Track | string',
      CurrentTrackURI: 'string',
      CurrentTransportActions: 'string',
      CurrentValidPlayModes: 'string',
      DirectControlAccountID: 'string',
      DirectControlClientID: 'string',
      DirectControlIsSuspended: 'boolean',
      EnqueuedTransportURI: 'string',
      EnqueuedTransportURIMetaData: 'Track | string',
      LastChange: 'string',
      MuseSessions: 'string',
      NextAVTransportURI: 'string',
      NextAVTransportURIMetaData: 'Track | string',
      NextTrackMetaData: 'Track | string',
      NextTrackURI: 'string',
      NumberOfTracks: 'number',
      PlaybackStorageMedium: 'string',
      PossiblePlaybackStorageMedia: 'string',
      PossibleRecordQualityModes: 'string',
      PossibleRecordStorageMedia: 'string',
      QueueUpdateID: 'number',
      RecordMediumWriteStatus: 'string',
      RecordStorageMedium: 'string',
      RelativeCounterPosition: 'number',
      RelativeTimePosition: 'string',
      RestartPending: 'boolean',
      SleepTimerGeneration: 'number',
      SnoozeRunning: 'boolean',
      TransportErrorDescription: 'string',
      TransportErrorHttpCode: 'string',
      TransportErrorHttpHeaders: 'string',
      TransportErrorURI: 'string',
      TransportPlaySpeed: 'string',
      TransportState: 'string',
      TransportStatus: 'string',
    };
  }
}

// Generated responses
export interface AddMultipleURIsToQueueResponse {
  FirstTrackNumberEnqueued: number;
  NumTracksAdded: number;
  NewQueueLength: number;
  NewUpdateID: number;
}

export interface AddURIToQueueResponse {
  FirstTrackNumberEnqueued: number;
  NumTracksAdded: number;
  NewQueueLength: number;
}

export interface AddURIToSavedQueueResponse {
  NumTracksAdded: number;
  NewQueueLength: number;
  NewUpdateID: number;
}

export interface BecomeCoordinatorOfStandaloneGroupResponse {
  DelegatedGroupCoordinatorID: string;
  NewGroupID: string;
}

export interface CreateSavedQueueResponse {
  NumTracksAdded: number;
  NewQueueLength: number;
  AssignedObjectID: string;
  NewUpdateID: number;
}

export interface GetCrossfadeModeResponse {
  CrossfadeMode: boolean;
}

export interface GetCurrentTransportActionsResponse {
  Actions: string;
}

export interface GetDeviceCapabilitiesResponse {
  PlayMedia: string;
  RecMedia: string;
  RecQualityModes: string;
}

export interface GetMediaInfoResponse {
  NrTracks: number;
  MediaDuration: string;
  CurrentURI: string;
  CurrentURIMetaData: Track | string;
  NextURI: string;
  NextURIMetaData: Track | string;
  PlayMedium: string;
  RecordMedium: string;
  WriteStatus: string;
}

export interface GetPositionInfoResponse {
  Track: number;
  TrackDuration: string;
  TrackMetaData: Track | string;
  TrackURI: string;
  RelTime: string;
  AbsTime: string;
  RelCount: number;
  AbsCount: number;
}

export interface GetRemainingSleepTimerDurationResponse {
  RemainingSleepTimerDuration: string;
  CurrentSleepTimerGeneration: number;
}

export interface GetRunningAlarmPropertiesResponse {
  AlarmID: number;
  GroupID: string;
  LoggedStartTime: string;
}

export interface GetTransportInfoResponse {
  CurrentTransportState: string;
  CurrentTransportStatus: string;
  CurrentSpeed: string;
}

export interface GetTransportSettingsResponse {
  PlayMode: PlayMode;
  RecQualityMode: string;
}

export interface RemoveTrackRangeFromQueueResponse {
  NewUpdateID: number;
}

export interface ReorderTracksInSavedQueueResponse {
  QueueLengthChange: number;
  NewQueueLength: number;
  NewUpdateID: number;
}

export interface SaveQueueResponse {
  AssignedObjectID: string;
}

// Strong type event
export interface AVTransportServiceEvent {
  AbsoluteCounterPosition?: number;
  AbsoluteTimePosition?: string;
  AlarmIDRunning?: number;
  AlarmLoggedStartTime?: string;
  AlarmRunning?: boolean;
  AVTransportURI?: string;
  AVTransportURIMetaData?: Track | string;
  CurrentCrossfadeMode?: boolean;
  CurrentMediaDuration?: string;
  CurrentPlayMode?: PlayMode;
  CurrentRecordQualityMode?: string;
  CurrentSection?: number;
  CurrentTrack?: number;
  CurrentTrackDuration?: string;
  CurrentTrackMetaData?: Track | string;
  CurrentTrackURI?: string;
  CurrentTransportActions?: string;
  CurrentValidPlayModes?: string;
  DirectControlAccountID?: string;
  DirectControlClientID?: string;
  DirectControlIsSuspended?: boolean;
  EnqueuedTransportURI?: string;
  EnqueuedTransportURIMetaData?: Track | string;
  LastChange?: string;
  MuseSessions?: string;
  NextAVTransportURI?: string;
  NextAVTransportURIMetaData?: Track | string;
  NextTrackMetaData?: Track | string;
  NextTrackURI?: string;
  NumberOfTracks?: number;
  PlaybackStorageMedium?: string;
  PossiblePlaybackStorageMedia?: string;
  PossibleRecordQualityModes?: string;
  PossibleRecordStorageMedia?: string;
  QueueUpdateID?: number;
  RecordMediumWriteStatus?: string;
  RecordStorageMedium?: string;
  RelativeCounterPosition?: number;
  RelativeTimePosition?: string;
  RestartPending?: boolean;
  SleepTimerGeneration?: number;
  SnoozeRunning?: boolean;
  TransportErrorDescription?: string;
  TransportErrorHttpCode?: string;
  TransportErrorHttpHeaders?: string;
  TransportErrorURI?: string;
  TransportPlaySpeed?: string;
  TransportState?: string;
  TransportStatus?: string;
}
