---
layout: default
title: AVTransportService
parent: Services
grand_parent: Sonos device
---
# AVTransportService
{: .no_toc }

Service that controls stuff related to transport (play/pause/next/special urls)

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.AVTransportService.OneOfTheMethodsBelow({...})
```

All methods that require input expect an object with the specified parameters, even if it only requires one parameter.

1. TOC
{:toc}

---

### AddMultipleURIsToQueue

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **UpdateID** | `number` |  |
| **NumberOfURIs** | `number` |  |
| **EnqueuedURIs** | `string` |  |
| **EnqueuedURIsMetaData** | `string | Track` |  |
| **ContainerURI** | `string` |  |
| **ContainerMetaData** | `string | Track` |  |
| **DesiredFirstTrackNumberEnqueued** | `number` |  |
| **EnqueueAsNext** | `boolean` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **FirstTrackNumberEnqueued** | `number` |  |
| **NumTracksAdded** | `number` |  |
| **NewQueueLength** | `number` |  |
| **NewUpdateID** | `number` |  |

### AddURIToQueue

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **EnqueuedURI** | `string` |  |
| **EnqueuedURIMetaData** | `string | Track` |  |
| **DesiredFirstTrackNumberEnqueued** | `number` |  |
| **EnqueueAsNext** | `boolean` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **FirstTrackNumberEnqueued** | `number` |  |
| **NumTracksAdded** | `number` |  |
| **NewQueueLength** | `number` |  |

### AddURIToSavedQueue

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **ObjectID** | `string` |  |
| **UpdateID** | `number` |  |
| **EnqueuedURI** | `string` |  |
| **EnqueuedURIMetaData** | `string | Track` |  |
| **AddAtIndex** | `number` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **NumTracksAdded** | `number` |  |
| **NewQueueLength** | `number` |  |
| **NewUpdateID** | `number` |  |

### BackupQueue

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

### BecomeCoordinatorOfStandaloneGroup

Leave the current group and revert to a single player.

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **DelegatedGroupCoordinatorID** | `string` |  |
| **NewGroupID** | `string` |  |

### BecomeGroupCoordinator

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **CurrentCoordinator** | `string` |  |
| **CurrentGroupID** | `string` |  |
| **OtherMembers** | `string` |  |
| **TransportSettings** | `string` |  |
| **CurrentURI** | `string` |  |
| **CurrentURIMetaData** | `string | Track` |  |
| **SleepTimerState** | `string` |  |
| **AlarmState** | `string` |  |
| **StreamRestartState** | `string` |  |
| **CurrentQueueTrackList** | `string` |  |
| **CurrentVLIState** | `string` |  |

### BecomeGroupCoordinatorAndSource

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **CurrentCoordinator** | `string` |  |
| **CurrentGroupID** | `string` |  |
| **OtherMembers** | `string` |  |
| **CurrentURI** | `string` |  |
| **CurrentURIMetaData** | `string | Track` |  |
| **SleepTimerState** | `string` |  |
| **AlarmState** | `string` |  |
| **StreamRestartState** | `string` |  |
| **CurrentAVTTrackList** | `string` |  |
| **CurrentQueueTrackList** | `string` |  |
| **CurrentSourceState** | `string` |  |
| **ResumePlayback** | `boolean` |  |

### ChangeCoordinator

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **CurrentCoordinator** | `string` |  |
| **NewCoordinator** | `string` |  |
| **NewTransportSettings** | `string` |  |
| **CurrentAVTransportURI** | `string` |  |

### ChangeTransportSettings

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **NewTransportSettings** | `string` |  |
| **CurrentAVTransportURI** | `string` |  |

### ConfigureSleepTimer

Stop playing after set sleep timer

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **NewSleepTimerDuration** | `string` | Time to stop after, as hh:mm:ss |

### CreateSavedQueue

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Title** | `string` |  |
| **EnqueuedURI** | `string` |  |
| **EnqueuedURIMetaData** | `string | Track` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **NumTracksAdded** | `number` |  |
| **NewQueueLength** | `number` |  |
| **AssignedObjectID** | `string` |  |
| **NewUpdateID** | `number` |  |

### DelegateGroupCoordinationTo

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **NewCoordinator** | `string` |  |
| **RejoinGroup** | `boolean` |  |

### EndDirectControlSession

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

### GetCrossfadeMode

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CrossfadeMode** | `boolean` |  |

### GetCurrentTransportActions

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **Actions** | `string` |  |

### GetDeviceCapabilities

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **PlayMedia** | `string` |  |
| **RecMedia** | `string` |  |
| **RecQualityModes** | `string` |  |

### GetMediaInfo

Get information about the current playing media (queue)

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **NrTracks** | `number` |  |
| **MediaDuration** | `string` |  |
| **CurrentURI** | `string` |  |
| **CurrentURIMetaData** | `string | Track` |  |
| **NextURI** | `string` |  |
| **NextURIMetaData** | `string | Track` |  |
| **PlayMedium** | `string` |  |
| **RecordMedium** | `string` |  |
| **WriteStatus** | `string` |  |

### GetPositionInfo

Get information about current position (position in queue and Time in current song)

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **Track** | `number` |  |
| **TrackDuration** | `string` |  |
| **TrackMetaData** | `string | Track` |  |
| **TrackURI** | `string` |  |
| **RelTime** | `string` |  |
| **AbsTime** | `string` |  |
| **RelCount** | `number` |  |
| **AbsCount** | `number` |  |

### GetRemainingSleepTimerDuration

Get Time left on sleeptimer

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **RemainingSleepTimerDuration** | `string` |  |
| **CurrentSleepTimerGeneration** | `number` |  |

### GetRunningAlarmProperties

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **AlarmID** | `number` |  |
| **GroupID** | `string` |  |
| **LoggedStartTime** | `string` |  |

### GetTransportInfo

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentTransportState** | `string` |  |
| **CurrentTransportStatus** | `string` |  |
| **CurrentSpeed** | `string` |  |

### GetTransportSettings

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **PlayMode** | `PlayMode` |  |
| **RecQualityMode** | `string` |  |

### Next

Go to next song, not always supported

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

### NotifyDeletedURI

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **DeletedURI** | `string` |  |

### Pause

Pause playback

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

### Play

Start playing the set TransportURI

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Speed** | `string` |  |

### Previous

Go to previous song, not always supported

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

### RemoveAllTracksFromQueue

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

### RemoveTrackFromQueue

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **ObjectID** | `string` |  |
| **UpdateID** | `number` |  |

### RemoveTrackRangeFromQueue

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **UpdateID** | `number` |  |
| **StartingIndex** | `number` |  |
| **NumberOfTracks** | `number` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **NewUpdateID** | `number` |  |

### ReorderTracksInQueue

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **StartingIndex** | `number` |  |
| **NumberOfTracks** | `number` |  |
| **InsertBefore** | `number` |  |
| **UpdateID** | `number` |  |

### ReorderTracksInSavedQueue

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **ObjectID** | `string` |  |
| **UpdateID** | `number` |  |
| **TrackList** | `string` |  |
| **NewPositionList** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueLengthChange** | `number` |  |
| **NewQueueLength** | `number` |  |
| **NewUpdateID** | `number` |  |

### RunAlarm

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **AlarmID** | `number` |  |
| **LoggedStartTime** | `string` |  |
| **Duration** | `string` |  |
| **ProgramURI** | `string` |  |
| **ProgramMetaData** | `string | Track` |  |
| **PlayMode** | `PlayMode` |  |
| **Volume** | `number` |  |
| **IncludeLinkedZones** | `boolean` |  |

### SaveQueue

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Title** | `string` |  |
| **ObjectID** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **AssignedObjectID** | `string` |  |

### Seek

Seek track in queue, time delta or absolute time in song

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Unit** | `string` | What to seek |
| **Target** | `string` | number for track in queue, hh:mm:ss for absolute time in track |

### SetAVTransportURI

Set the transport URI, to a song, a stream, the queue and a lot more

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **CurrentURI** | `string` | The track URI |
| **CurrentURIMetaData** | `string | Track` | Track Metadata |

### SetCrossfadeMode

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **CrossfadeMode** | `boolean` |  |

### SetNextAVTransportURI

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **NextURI** | `string` |  |
| **NextURIMetaData** | `string | Track` |  |

### SetPlayMode

Set the PlayMode

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **NewPlayMode** | `PlayMode` | PlayMode |

### SnoozeAlarm

Snooze the current alarm for some time.

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Duration** | `string` | Snooze time as hh:mm:ss, 10 minutes = 00:10:00 |

### StartAutoplay

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **ProgramURI** | `string` |  |
| **ProgramMetaData** | `string | Track` |  |
| **Volume** | `number` |  |
| **IncludeLinkedZones** | `boolean` |  |
| **ResetVolumeAfter** | `boolean` |  |

### Stop

Stop playback

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

## AVTransportService event

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.AVTransportService.Events('serviceEvent', (data) => {
  console.log(data);
});
```

The **AVTransportService** emits events with these properties. Not all properties are emitted everytime.

| parameter | type |
|:----------|:-----|
| **AVTransportURI** | `string` |
| **AVTransportURIMetaData** | `Track` |
| **AbsoluteCounterPosition** | `number` |
| **AbsoluteTimePosition** | `string` |
| **AlarmIDRunning** | `number` |
| **AlarmLoggedStartTime** | `string` |
| **AlarmRunning** | `boolean` |
| **CurrentCrossfadeMode** | `boolean` |
| **CurrentMediaDuration** | `string` |
| **CurrentPlayMode** | `PlayMode` |
| **CurrentRecordQualityMode** | `string` |
| **CurrentSection** | `number` |
| **CurrentTrack** | `number` |
| **CurrentTrackDuration** | `string` |
| **CurrentTrackMetaData** | `Track` |
| **CurrentTrackURI** | `string` |
| **CurrentTransportActions** | `string` |
| **CurrentValidPlayModes** | `string` |
| **DirectControlAccountID** | `string` |
| **DirectControlClientID** | `string` |
| **DirectControlIsSuspended** | `boolean` |
| **EnqueuedTransportURI** | `string` |
| **EnqueuedTransportURIMetaData** | `Track` |
| **LastChange** | `string` |
| **MuseSessions** | `string` |
| **NextAVTransportURI** | `string` |
| **NextAVTransportURIMetaData** | `Track` |
| **NextTrackMetaData** | `Track` |
| **NextTrackURI** | `string` |
| **NumberOfTracks** | `number` |
| **PlaybackStorageMedium** | `string` |
| **PossiblePlaybackStorageMedia** | `string` |
| **PossibleRecordQualityModes** | `string` |
| **PossibleRecordStorageMedia** | `string` |
| **QueueUpdateID** | `number` |
| **RecordMediumWriteStatus** | `string` |
| **RecordStorageMedium** | `string` |
| **RelativeCounterPosition** | `number` |
| **RelativeTimePosition** | `string` |
| **RestartPending** | `boolean` |
| **SleepTimerGeneration** | `number` |
| **SnoozeRunning** | `boolean` |
| **TransportErrorDescription** | `string` |
| **TransportErrorHttpCode** | `string` |
| **TransportErrorHttpHeaders** | `string` |
| **TransportErrorURI** | `string` |
| **TransportPlaySpeed** | `string` |
| **TransportState** | `string` |
| **TransportStatus** | `string` |
