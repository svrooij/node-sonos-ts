// Auto-generated on Sun Nov 03 2019 16:33:10 GMT+0100 (Central European Standard Time)
import { BaseService } from './base-service';

export class AVTransportService extends BaseService {
  readonly serviceNane: string = 'AVTransport';
  readonly controlUrl: string = '/MediaRenderer/AVTransport/Control';  
  readonly eventSubUrl: string = '/MediaRenderer/AVTransport/Event';
  readonly scpUrl: string = '/xml/AVTransport1.xml';
  

  // Actions
  AddMultipleURIsToQueue(input: { InstanceID: number, UpdateID: number, NumberOfURIs: number, EnqueuedURIs: string, EnqueuedURIsMetaData: string, ContainerURI: string, ContainerMetaData: string, DesiredFirstTrackNumberEnqueued: number, EnqueueAsNext: boolean }): Promise<AddMultipleURIsToQueueResponse> { return this.SoapRequestWithBody<typeof input, AddMultipleURIsToQueueResponse>('AddMultipleURIsToQueue', input); }
  AddURIToQueue(input: { InstanceID: number, EnqueuedURI: string, EnqueuedURIMetaData: string, DesiredFirstTrackNumberEnqueued: number, EnqueueAsNext: boolean }): Promise<AddURIToQueueResponse> { return this.SoapRequestWithBody<typeof input, AddURIToQueueResponse>('AddURIToQueue', input); }
  AddURIToSavedQueue(input: { InstanceID: number, ObjectID: string, UpdateID: number, EnqueuedURI: string, EnqueuedURIMetaData: string, AddAtIndex: number }): Promise<AddURIToSavedQueueResponse> { return this.SoapRequestWithBody<typeof input, AddURIToSavedQueueResponse>('AddURIToSavedQueue', input); }
  BackupQueue(input: { InstanceID: number } = { InstanceID: 0 }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('BackupQueue', input); }
  BecomeCoordinatorOfStandaloneGroup(input: { InstanceID: number } = { InstanceID: 0 }): Promise<BecomeCoordinatorOfStandaloneGroupResponse> { return this.SoapRequestWithBody<typeof input, BecomeCoordinatorOfStandaloneGroupResponse>('BecomeCoordinatorOfStandaloneGroup', input); }
  BecomeGroupCoordinator(input: { InstanceID: number, CurrentCoordinator: string, CurrentGroupID: string, OtherMembers: string, TransportSettings: string, CurrentURI: string, CurrentURIMetaData: string, SleepTimerState: string, AlarmState: string, StreamRestartState: string, CurrentQueueTrackList: string, CurrentVLIState: string }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('BecomeGroupCoordinator', input); }
  BecomeGroupCoordinatorAndSource(input: { InstanceID: number, CurrentCoordinator: string, CurrentGroupID: string, OtherMembers: string, CurrentURI: string, CurrentURIMetaData: string, SleepTimerState: string, AlarmState: string, StreamRestartState: string, CurrentAVTTrackList: string, CurrentQueueTrackList: string, CurrentSourceState: string, ResumePlayback: boolean }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('BecomeGroupCoordinatorAndSource', input); }
  ChangeCoordinator(input: { InstanceID: number, CurrentCoordinator: string, NewCoordinator: string, NewTransportSettings: string, CurrentAVTransportURI: string }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('ChangeCoordinator', input); }
  ChangeTransportSettings(input: { InstanceID: number, NewTransportSettings: string, CurrentAVTransportURI: string }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('ChangeTransportSettings', input); }
  ConfigureSleepTimer(input: { InstanceID: number, NewSleepTimerDuration: string }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('ConfigureSleepTimer', input); }
  CreateSavedQueue(input: { InstanceID: number, Title: string, EnqueuedURI: string, EnqueuedURIMetaData: string }): Promise<CreateSavedQueueResponse> { return this.SoapRequestWithBody<typeof input, CreateSavedQueueResponse>('CreateSavedQueue', input); }
  DelegateGroupCoordinationTo(input: { InstanceID: number, NewCoordinator: string, RejoinGroup: boolean }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('DelegateGroupCoordinationTo', input); }
  EndDirectControlSession(input: { InstanceID: number } = { InstanceID: 0 }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('EndDirectControlSession', input); }
  GetCrossfadeMode(input: { InstanceID: number } = { InstanceID: 0 }): Promise<GetCrossfadeModeResponse> { return this.SoapRequestWithBody<typeof input, GetCrossfadeModeResponse>('GetCrossfadeMode', input); }
  GetCurrentTransportActions(input: { InstanceID: number } = { InstanceID: 0 }): Promise<GetCurrentTransportActionsResponse> { return this.SoapRequestWithBody<typeof input, GetCurrentTransportActionsResponse>('GetCurrentTransportActions', input); }
  GetDeviceCapabilities(input: { InstanceID: number } = { InstanceID: 0 }): Promise<GetDeviceCapabilitiesResponse> { return this.SoapRequestWithBody<typeof input, GetDeviceCapabilitiesResponse>('GetDeviceCapabilities', input); }
  GetMediaInfo(input: { InstanceID: number } = { InstanceID: 0 }): Promise<GetMediaInfoResponse> { return this.SoapRequestWithBody<typeof input, GetMediaInfoResponse>('GetMediaInfo', input); }
  GetPositionInfo(input: { InstanceID: number } = { InstanceID: 0 }): Promise<GetPositionInfoResponse> { return this.SoapRequestWithBody<typeof input, GetPositionInfoResponse>('GetPositionInfo', input); }
  GetRemainingSleepTimerDuration(input: { InstanceID: number } = { InstanceID: 0 }): Promise<GetRemainingSleepTimerDurationResponse> { return this.SoapRequestWithBody<typeof input, GetRemainingSleepTimerDurationResponse>('GetRemainingSleepTimerDuration', input); }
  GetRunningAlarmProperties(input: { InstanceID: number } = { InstanceID: 0 }): Promise<GetRunningAlarmPropertiesResponse> { return this.SoapRequestWithBody<typeof input, GetRunningAlarmPropertiesResponse>('GetRunningAlarmProperties', input); }
  GetTransportInfo(input: { InstanceID: number } = { InstanceID: 0 }): Promise<GetTransportInfoResponse> { return this.SoapRequestWithBody<typeof input, GetTransportInfoResponse>('GetTransportInfo', input); }
  GetTransportSettings(input: { InstanceID: number } = { InstanceID: 0 }): Promise<GetTransportSettingsResponse> { return this.SoapRequestWithBody<typeof input, GetTransportSettingsResponse>('GetTransportSettings', input); }
  Next(input: { InstanceID: number } = { InstanceID: 0 }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('Next', input); }
  NotifyDeletedURI(input: { InstanceID: number, DeletedURI: string }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('NotifyDeletedURI', input); }
  Pause(input: { InstanceID: number } = { InstanceID: 0 }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('Pause', input); }
  Play(input: { InstanceID: number, Speed: string }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('Play', input); }
  Previous(input: { InstanceID: number } = { InstanceID: 0 }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('Previous', input); }
  RemoveAllTracksFromQueue(input: { InstanceID: number } = { InstanceID: 0 }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('RemoveAllTracksFromQueue', input); }
  RemoveTrackFromQueue(input: { InstanceID: number, ObjectID: string, UpdateID: number }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('RemoveTrackFromQueue', input); }
  RemoveTrackRangeFromQueue(input: { InstanceID: number, UpdateID: number, StartingIndex: number, NumberOfTracks: number }): Promise<RemoveTrackRangeFromQueueResponse> { return this.SoapRequestWithBody<typeof input, RemoveTrackRangeFromQueueResponse>('RemoveTrackRangeFromQueue', input); }
  ReorderTracksInQueue(input: { InstanceID: number, StartingIndex: number, NumberOfTracks: number, InsertBefore: number, UpdateID: number }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('ReorderTracksInQueue', input); }
  ReorderTracksInSavedQueue(input: { InstanceID: number, ObjectID: string, UpdateID: number, TrackList: string, NewPositionList: string }): Promise<ReorderTracksInSavedQueueResponse> { return this.SoapRequestWithBody<typeof input, ReorderTracksInSavedQueueResponse>('ReorderTracksInSavedQueue', input); }
  RunAlarm(input: { InstanceID: number, AlarmID: number, LoggedStartTime: string, Duration: string, ProgramURI: string, ProgramMetaData: string, PlayMode: string, Volume: number, IncludeLinkedZones: boolean }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('RunAlarm', input); }
  SaveQueue(input: { InstanceID: number, Title: string, ObjectID: string }): Promise<SaveQueueResponse> { return this.SoapRequestWithBody<typeof input, SaveQueueResponse>('SaveQueue', input); }
  Seek(input: { InstanceID: number, Unit: string, Target: string }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('Seek', input); }
  SetAVTransportURI(input: { InstanceID: number, CurrentURI: string, CurrentURIMetaData: string }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetAVTransportURI', input); }
  SetCrossfadeMode(input: { InstanceID: number, CrossfadeMode: boolean }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetCrossfadeMode', input); }
  SetNextAVTransportURI(input: { InstanceID: number, NextURI: string, NextURIMetaData: string }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetNextAVTransportURI', input); }
  SetPlayMode(input: { InstanceID: number, NewPlayMode: string }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SetPlayMode', input); }
  SnoozeAlarm(input: { InstanceID: number, Duration: string }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('SnoozeAlarm', input); }
  StartAutoplay(input: { InstanceID: number, ProgramURI: string, ProgramMetaData: string, Volume: number, IncludeLinkedZones: boolean, ResetVolumeAfter: boolean }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('StartAutoplay', input); }
  Stop(input: { InstanceID: number } = { InstanceID: 0 }): Promise<boolean> { return this.SoapRequestWithBodyNoResponse<typeof input>('Stop', input); }
}

// Response classes
export interface AddMultipleURIsToQueueResponse {
  FirstTrackNumberEnqueued: number,
  NumTracksAdded: number,
  NewQueueLength: number,
  NewUpdateID: number
}

export interface AddURIToQueueResponse {
  FirstTrackNumberEnqueued: number,
  NumTracksAdded: number,
  NewQueueLength: number
}

export interface AddURIToSavedQueueResponse {
  NumTracksAdded: number,
  NewQueueLength: number,
  NewUpdateID: number
}

export interface BecomeCoordinatorOfStandaloneGroupResponse {
  DelegatedGroupCoordinatorID: string,
  NewGroupID: string
}

export interface CreateSavedQueueResponse {
  NumTracksAdded: number,
  NewQueueLength: number,
  AssignedObjectID: string,
  NewUpdateID: number
}

export interface GetCrossfadeModeResponse {
  CrossfadeMode: boolean
}

export interface GetCurrentTransportActionsResponse {
  Actions: string
}

export interface GetDeviceCapabilitiesResponse {
  PlayMedia: string,
  RecMedia: string,
  RecQualityModes: string
}

export interface GetMediaInfoResponse {
  NrTracks: number,
  MediaDuration: string,
  CurrentURI: string,
  CurrentURIMetaData: string,
  NextURI: string,
  NextURIMetaData: string,
  PlayMedium: string,
  RecordMedium: string,
  WriteStatus: string
}

export interface GetPositionInfoResponse {
  Track: number,
  TrackDuration: string,
  TrackMetaData: string,
  TrackURI: string,
  RelTime: string,
  AbsTime: string,
  RelCount: number,
  AbsCount: number
}

export interface GetRemainingSleepTimerDurationResponse {
  RemainingSleepTimerDuration: string,
  CurrentSleepTimerGeneration: number
}

export interface GetRunningAlarmPropertiesResponse {
  AlarmID: number,
  GroupID: string,
  LoggedStartTime: string
}

export interface GetTransportInfoResponse {
  CurrentTransportState: string,
  CurrentTransportStatus: string,
  CurrentSpeed: string
}

export interface GetTransportSettingsResponse {
  PlayMode: string,
  RecQualityMode: string
}

export interface RemoveTrackRangeFromQueueResponse {
  NewUpdateID: number
}

export interface ReorderTracksInSavedQueueResponse {
  QueueLengthChange: number,
  NewQueueLength: number,
  NewUpdateID: number
}

export interface SaveQueueResponse {
  AssignedObjectID: string
}
