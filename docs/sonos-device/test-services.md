## AVTransportService

Use this service like `sonosDevice.AVTransportService` and use one of the methods below to control the device.

### AddMultipleURIsToQueue

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **UpdateID** - *number*
- **NumberOfURIs** - *number*
- **EnqueuedURIs** - *string*
- **EnqueuedURIsMetaData** - *string | Track*
- **ContainerURI** - *string*
- **ContainerMetaData** - *string | Track*
- **DesiredFirstTrackNumberEnqueued** - *number*
- **EnqueueAsNext** - *boolean*

### AddURIToQueue

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **EnqueuedURI** - *string*
- **EnqueuedURIMetaData** - *string | Track*
- **DesiredFirstTrackNumberEnqueued** - *number*
- **EnqueueAsNext** - *boolean*

### AddURIToSavedQueue

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **ObjectID** - *string*
- **UpdateID** - *number*
- **EnqueuedURI** - *string*
- **EnqueuedURIMetaData** - *string | Track*
- **AddAtIndex** - *number*

### BackupQueue

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### BecomeCoordinatorOfStandaloneGroup

Leave the current group and revert to a single player.

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### BecomeGroupCoordinator

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **CurrentCoordinator** - *string*
- **CurrentGroupID** - *string*
- **OtherMembers** - *string*
- **TransportSettings** - *string*
- **CurrentURI** - *string*
- **CurrentURIMetaData** - *string | Track*
- **SleepTimerState** - *string*
- **AlarmState** - *string*
- **StreamRestartState** - *string*
- **CurrentQueueTrackList** - *string*
- **CurrentVLIState** - *string*

### BecomeGroupCoordinatorAndSource

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **CurrentCoordinator** - *string*
- **CurrentGroupID** - *string*
- **OtherMembers** - *string*
- **CurrentURI** - *string*
- **CurrentURIMetaData** - *string | Track*
- **SleepTimerState** - *string*
- **AlarmState** - *string*
- **StreamRestartState** - *string*
- **CurrentAVTTrackList** - *string*
- **CurrentQueueTrackList** - *string*
- **CurrentSourceState** - *string*
- **ResumePlayback** - *boolean*

### ChangeCoordinator

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **CurrentCoordinator** - *string*
- **NewCoordinator** - *string*
- **NewTransportSettings** - *string*
- **CurrentAVTransportURI** - *string*

### ChangeTransportSettings

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **NewTransportSettings** - *string*
- **CurrentAVTransportURI** - *string*

### ConfigureSleepTimer

Stop playing after set sleep timer

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **NewSleepTimerDuration** - *string* Time to stop after, as hh:mm:ss

### CreateSavedQueue

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **Title** - *string*
- **EnqueuedURI** - *string*
- **EnqueuedURIMetaData** - *string | Track*

### DelegateGroupCoordinationTo

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **NewCoordinator** - *string*
- **RejoinGroup** - *boolean*

### EndDirectControlSession

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### GetCrossfadeMode

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### GetCurrentTransportActions

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### GetDeviceCapabilities

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### GetMediaInfo

Get information about the current playing media (queue)

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### GetPositionInfo

Get information about current position (position in queue and Time in current song)

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### GetRemainingSleepTimerDuration

Get Time left on sleeptimer

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### GetRunningAlarmProperties

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### GetTransportInfo

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### GetTransportSettings

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### Next

Go to next song, not always supported

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### NotifyDeletedURI

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **DeletedURI** - *string*

### Pause

Pause playback

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### Play

Start playing the set TransportURI

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **Speed** - *string*

### Previous

Go to previous song, not always supported

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### RemoveAllTracksFromQueue

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### RemoveTrackFromQueue

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **ObjectID** - *string*
- **UpdateID** - *number*

### RemoveTrackRangeFromQueue

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **UpdateID** - *number*
- **StartingIndex** - *number*
- **NumberOfTracks** - *number*

### ReorderTracksInQueue

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **StartingIndex** - *number*
- **NumberOfTracks** - *number*
- **InsertBefore** - *number*
- **UpdateID** - *number*

### ReorderTracksInSavedQueue

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **ObjectID** - *string*
- **UpdateID** - *number*
- **TrackList** - *string*
- **NewPositionList** - *string*

### RunAlarm

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **AlarmID** - *number*
- **LoggedStartTime** - *string*
- **Duration** - *string*
- **ProgramURI** - *string*
- **ProgramMetaData** - *string | Track*
- **PlayMode** - *PlayMode*
- **Volume** - *number*
- **IncludeLinkedZones** - *boolean*

### SaveQueue

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **Title** - *string*
- **ObjectID** - *string*

### Seek

Seek track in queue, time delta or absolute time in song

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **Unit** - *string* What to seek
- **Target** - *string* number for track in queue, hh:mm:ss for absolute time in track

### SetAVTransportURI

Set the transport URI, to a song, a stream, the queue and a lot more

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **CurrentURI** - *string* The track URI
- **CurrentURIMetaData** - *string | Track*

### SetCrossfadeMode

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **CrossfadeMode** - *boolean*

### SetNextAVTransportURI

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **NextURI** - *string*
- **NextURIMetaData** - *string | Track*

### SetPlayMode

Set the PlayMode

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **NewPlayMode** - *PlayMode* PlayMode

### SnoozeAlarm

Snooze the current alarm for some time.

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **Duration** - *string* Snooze time as hh:mm:ss, 10 minutes = 00:10:00

### StartAutoplay

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **ProgramURI** - *string*
- **ProgramMetaData** - *string | Track*
- **Volume** - *number*
- **IncludeLinkedZones** - *boolean*
- **ResetVolumeAfter** - *boolean*

### Stop

Stop playback

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

## AlarmClockService

Use this service like `sonosDevice.AlarmClockService` and use one of the methods below to control the device.

### CreateAlarm

Create a single alarm, all properties are required

- **StartLocalTime** - *string* The starttime as hh:mm:ss
- **Duration** - *string* The duration as hh:mm:ss
- **Recurrence** - *string* Repeat this alarm on
- **Enabled** - *boolean* Alarm enabled after creation
- **RoomUUID** - *string* The UUID of the speaker you want this alarm for
- **ProgramURI** - *string* The sound uri
- **ProgramMetaData** - *string | Track* The sound metadata, can be empty string
- **PlayMode** - *string* Alarm playmode
- **Volume** - *number* Volume between 0 and 100
- **IncludeLinkedZones** - *boolean* Should grouped palyers also play the alarm?

### DestroyAlarm

Delete an alarm

- **ID** - *number* The Alarm ID, see ListAndParseAlarms

### GetDailyIndexRefreshTime

No parameters

### GetFormat

No parameters

### GetHouseholdTimeAtStamp

- **TimeStamp** - *string*

### GetTimeNow

No parameters

### GetTimeServer

No parameters

### GetTimeZone

No parameters

### GetTimeZoneAndRule

No parameters

### GetTimeZoneRule

- **Index** - *number*

### ListAlarms

Get the AlarmList as XML, use ListAndParseAlarms for parsed version

No parameters

### SetDailyIndexRefreshTime

- **DesiredDailyIndexRefreshTime** - *string*

### SetFormat

- **DesiredTimeFormat** - *string*
- **DesiredDateFormat** - *string*

### SetTimeNow

- **DesiredTime** - *string*
- **TimeZoneForDesiredTime** - *string*

### SetTimeServer

- **DesiredTimeServer** - *string*

### SetTimeZone

- **Index** - *number*
- **AutoAdjustDst** - *boolean*

### UpdateAlarm

Update an alarm, all parameters are required. Use PatchAlarm where you can update a single parameter

- **ID** - *number* The ID of the alarm see ListAndParseAlarms
- **StartLocalTime** - *string* The starttime as hh:mm:ss
- **Duration** - *string* The duration as hh:mm:ss
- **Recurrence** - *string* Repeat this alarm on
- **Enabled** - *boolean* Alarm enabled after creation
- **RoomUUID** - *string* The UUID of the speaker you want this alarm for
- **ProgramURI** - *string* The sound uri
- **ProgramMetaData** - *string | Track* The sound metadata, can be empty string
- **PlayMode** - *string* Alarm playmode
- **Volume** - *number* Volume between 0 and 100
- **IncludeLinkedZones** - *boolean* Should grouped palyers also play the alarm?

## AudioInService

Use this service like `sonosDevice.AudioInService` and use one of the methods below to control the device.

### GetAudioInputAttributes

No parameters

### GetLineInLevel

No parameters

### SelectAudio

- **ObjectID** - *string*

### SetAudioInputAttributes

- **DesiredName** - *string*
- **DesiredIcon** - *string*

### SetLineInLevel

- **DesiredLeftLineInLevel** - *number*
- **DesiredRightLineInLevel** - *number*

### StartTransmissionToGroup

- **CoordinatorID** - *string*

### StopTransmissionToGroup

- **CoordinatorID** - *string*

## ConnectionManagerService

Use this service like `sonosDevice.ConnectionManagerService` and use one of the methods below to control the device.

### GetCurrentConnectionIDs

No parameters

### GetCurrentConnectionInfo

- **ConnectionID** - *number*

### GetProtocolInfo

No parameters

## ContentDirectoryService

Use this service like `sonosDevice.ContentDirectoryService` and use one of the methods below to control the device.

### Browse

Browse for content, see BrowseParsed for a better experience.

- **ObjectID** - *string* The search query, ['A:ARTIST','A:ALBUMARTIST','A:ALBUM','A:GENRE','A:COMPOSER','A:TRACKS','A:PLAYLISTS'] with optionally ':search+query' behind it.
- **BrowseFlag** - *string* How to browse
- **Filter** - *string* Which fields should be returned '*' for all.
- **StartingIndex** - *number* Paging, where to start
- **RequestedCount** - *number* Paging, number of items
- **SortCriteria** - *string* Sort the results based on metadata fields. '+upnp:artist,+dc:title' for sorting on artist then on title.

### CreateObject

- **ContainerID** - *string*
- **Elements** - *string*

### DestroyObject

- **ObjectID** - *string*

### FindPrefix

- **ObjectID** - *string*
- **Prefix** - *string*

### GetAlbumArtistDisplayOption

No parameters

### GetAllPrefixLocations

- **ObjectID** - *string*

### GetBrowseable

No parameters

### GetLastIndexChange

No parameters

### GetSearchCapabilities

No parameters

### GetShareIndexInProgress

No parameters

### GetSortCapabilities

No parameters

### GetSystemUpdateID

No parameters

### RefreshShareIndex

- **AlbumArtistDisplayOption** - *string*

### RequestResort

- **SortOrder** - *string*

### SetBrowseable

- **Browseable** - *boolean*

### UpdateObject

- **ObjectID** - *string*
- **CurrentTagValue** - *string*
- **NewTagValue** - *string*

## DevicePropertiesService

Use this service like `sonosDevice.DevicePropertiesService` and use one of the methods below to control the device.

### AddBondedZones

- **ChannelMapSet** - *string*

### AddHTSatellite

- **HTSatChanMapSet** - *string*

### CreateStereoPair

- **ChannelMapSet** - *string*

### EnterConfigMode

- **Mode** - *string*
- **Options** - *string*

### ExitConfigMode

- **Options** - *string*

### GetAutoplayLinkedZones

- **Source** - *string*

### GetAutoplayRoomUUID

- **Source** - *string*

### GetAutoplayVolume

- **Source** - *string*

### GetButtonLockState

No parameters

### GetButtonState

No parameters

### GetHouseholdID

No parameters

### GetLEDState

No parameters

### GetUseAutoplayVolume

- **Source** - *string*

### GetZoneAttributes

No parameters

### GetZoneInfo

No parameters

### RemoveBondedZones

- **ChannelMapSet** - *string*
- **KeepGrouped** - *boolean*

### RemoveHTSatellite

- **SatRoomUUID** - *string*

### SeparateStereoPair

- **ChannelMapSet** - *string*

### SetAutoplayLinkedZones

- **IncludeLinkedZones** - *boolean*
- **Source** - *string*

### SetAutoplayRoomUUID

- **RoomUUID** - *string*
- **Source** - *string*

### SetAutoplayVolume

- **Volume** - *number*
- **Source** - *string*

### SetButtonLockState

- **DesiredButtonLockState** - *string*

### SetLEDState

- **DesiredLEDState** - *string*

### SetUseAutoplayVolume

- **UseVolume** - *boolean*
- **Source** - *string*

### SetZoneAttributes

- **DesiredZoneName** - *string*
- **DesiredIcon** - *string*
- **DesiredConfiguration** - *string*

## GroupManagementService

Use this service like `sonosDevice.GroupManagementService` and use one of the methods below to control the device.

### AddMember

- **MemberID** - *string*
- **BootSeq** - *number*

### RemoveMember

- **MemberID** - *string*

### ReportTrackBufferingResult

- **MemberID** - *string*
- **ResultCode** - *number*

### SetSourceAreaIds

- **DesiredSourceAreaIds** - *string*

## GroupRenderingControlService

Use this service like `sonosDevice.GroupRenderingControlService` and use one of the methods below to control the device.

### GetGroupMute

Get if the group is muted

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### GetGroupVolume

Get the average group volume

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### SetGroupMute

(Un-/)Mute the entire group

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **DesiredMute** - *boolean* True for mute, false for unmute

### SetGroupVolume

Change group volume, players will be changed proportionally

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **DesiredVolume** - *number* New volume

### SetRelativeGroupVolume

Relativly change group volume

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **Adjustment** - *number* number between -100 / +100

### SnapshotGroupVolume

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

## MusicServicesService

Use this service like `sonosDevice.MusicServicesService` and use one of the methods below to control the device.

### GetSessionId

- **ServiceId** - *number*
- **Username** - *string*

### ListAvailableServices

No parameters

### UpdateAvailableServices

No parameters

## QPlayService

Use this service like `sonosDevice.QPlayService` and use one of the methods below to control the device.

### QPlayAuth

- **Seed** - *string*

## QueueService

Use this service like `sonosDevice.QueueService` and use one of the methods below to control the device.

### AddMultipleURIs

- **QueueID** - *number*
- **UpdateID** - *number*
- **ContainerURI** - *string*
- **ContainerMetaData** - *string | Track*
- **DesiredFirstTrackNumberEnqueued** - *number*
- **EnqueueAsNext** - *boolean*
- **NumberOfURIs** - *number*
- **EnqueuedURIsAndMetaData** - *string*

### AddURI

- **QueueID** - *number*
- **UpdateID** - *number*
- **EnqueuedURI** - *string*
- **EnqueuedURIMetaData** - *string | Track*
- **DesiredFirstTrackNumberEnqueued** - *number*
- **EnqueueAsNext** - *boolean*

### AttachQueue

- **QueueOwnerID** - *string*

### Backup

No parameters

### Browse

- **QueueID** - *number*
- **StartingIndex** - *number*
- **RequestedCount** - *number*

### CreateQueue

- **QueueOwnerID** - *string*
- **QueueOwnerContext** - *string*
- **QueuePolicy** - *string*

### RemoveAllTracks

- **QueueID** - *number*
- **UpdateID** - *number*

### RemoveTrackRange

- **QueueID** - *number*
- **UpdateID** - *number*
- **StartingIndex** - *number*
- **NumberOfTracks** - *number*

### ReorderTracks

- **QueueID** - *number*
- **StartingIndex** - *number*
- **NumberOfTracks** - *number*
- **InsertBefore** - *number*
- **UpdateID** - *number*

### ReplaceAllTracks

- **QueueID** - *number*
- **UpdateID** - *number*
- **ContainerURI** - *string*
- **ContainerMetaData** - *string | Track*
- **CurrentTrackIndex** - *number*
- **NewCurrentTrackIndices** - *string*
- **NumberOfURIs** - *number*
- **EnqueuedURIsAndMetaData** - *string*

### SaveAsSonosPlaylist

- **QueueID** - *number*
- **Title** - *string*
- **ObjectID** - *string*

## RenderingControlService

Use this service like `sonosDevice.RenderingControlService` and use one of the methods below to control the device.

### GetBass

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### GetEQ

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **EQType** - *string*

### GetHeadphoneConnected

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### GetLoudness

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **Channel** - *string*

### GetMute

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **Channel** - *string*

### GetOutputFixed

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### GetRoomCalibrationStatus

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### GetSupportsOutputFixed

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### GetTreble

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### GetVolume

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **Channel** - *string*

### GetVolumeDB

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **Channel** - *string*

### GetVolumeDBRange

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **Channel** - *string*

### RampToVolume

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **Channel** - *string*
- **RampType** - *string*
- **DesiredVolume** - *number*
- **ResetVolumeAfter** - *boolean*
- **ProgramURI** - *string*

### ResetBasicEQ

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### ResetExtEQ

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **EQType** - *string*

### RestoreVolumePriorToRamp

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **Channel** - *string*

### SetBass

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **DesiredBass** - *number*

### SetChannelMap

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **ChannelMap** - *string*

### SetEQ

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **EQType** - *string*
- **DesiredValue** - *number*

### SetLoudness

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **Channel** - *string*
- **DesiredLoudness** - *boolean*

### SetMute

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **Channel** - *string*
- **DesiredMute** - *boolean*

### SetOutputFixed

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **DesiredFixed** - *boolean*

### SetRelativeVolume

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **Channel** - *string*
- **Adjustment** - *number*

### SetRoomCalibrationStatus

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **RoomCalibrationEnabled** - *boolean*

### SetRoomCalibrationX

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **CalibrationID** - *string*
- **Coefficients** - *string*
- **CalibrationMode** - *string*

### SetTreble

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **DesiredTreble** - *number*

### SetVolume

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **Channel** - *string*
- **DesiredVolume** - *number*

### SetVolumeDB

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **Channel** - *string*
- **DesiredVolume** - *number*

## SystemPropertiesService

Use this service like `sonosDevice.SystemPropertiesService` and use one of the methods below to control the device.

### AddAccountX

- **AccountType** - *number*
- **AccountID** - *string*
- **AccountPassword** - *string*

### AddOAuthAccountX

- **AccountType** - *number*
- **AccountToken** - *string*
- **AccountKey** - *string*
- **OAuthDeviceID** - *string*
- **AuthorizationCode** - *string*
- **RedirectURI** - *string*
- **UserIdHashCode** - *string*
- **AccountTier** - *number*

### DoPostUpdateTasks

No parameters

### EditAccountMd

- **AccountType** - *number*
- **AccountID** - *string*
- **NewAccountMd** - *string*

### EditAccountPasswordX

- **AccountType** - *number*
- **AccountID** - *string*
- **NewAccountPassword** - *string*

### EnableRDM

- **RDMValue** - *boolean*

### GetRDM

No parameters

### GetString

- **VariableName** - *string*

### GetWebCode

- **AccountType** - *number*

### ProvisionCredentialedTrialAccountX

- **AccountType** - *number*
- **AccountID** - *string*
- **AccountPassword** - *string*

### RefreshAccountCredentialsX

- **AccountType** - *number*
- **AccountUID** - *number*
- **AccountToken** - *string*
- **AccountKey** - *string*

### Remove

- **VariableName** - *string*

### RemoveAccount

- **AccountType** - *number*
- **AccountID** - *string*

### ReplaceAccountX

- **AccountUDN** - *string*
- **NewAccountID** - *string*
- **NewAccountPassword** - *string*
- **AccountToken** - *string*
- **AccountKey** - *string*
- **OAuthDeviceID** - *string*

### ResetThirdPartyCredentials

No parameters

### SetAccountNicknameX

- **AccountUDN** - *string*
- **AccountNickname** - *string*

### SetString

- **VariableName** - *string*
- **StringValue** - *string*

## VirtualLineInService

Use this service like `sonosDevice.VirtualLineInService` and use one of the methods below to control the device.

### Next

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### Pause

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### Play

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **Speed** - *string*

### Previous

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### SetVolume

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **DesiredVolume** - *number*

### StartTransmission

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **CoordinatorID** - *string*

### Stop

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0

### StopTransmission

- **InstanceID** - *number* InstanceID meaning unknown, just set to 0
- **CoordinatorID** - *string*

## ZoneGroupTopologyService

Use this service like `sonosDevice.ZoneGroupTopologyService` and use one of the methods below to control the device.

### BeginSoftwareUpdate

- **UpdateURL** - *string*
- **Flags** - *number*
- **ExtraOptions** - *string*

### CheckForUpdate

- **UpdateType** - *string*
- **CachedOnly** - *boolean*
- **Version** - *string*

### GetZoneGroupAttributes

Get information about the current Zone

No parameters

### GetZoneGroupState

Get all the Sonos groups, (as XML), see GetParsedZoneGroupState

No parameters

### RegisterMobileDevice

- **MobileDeviceName** - *string*
- **MobileDeviceUDN** - *string*
- **MobileIPAndPort** - *string*

### ReportAlarmStartedRunning

No parameters

### ReportUnresponsiveDevice

- **DeviceUUID** - *string*
- **DesiredAction** - *string*

### SubmitDiagnostics

- **IncludeControllers** - *boolean*
- **Type** - *string*

