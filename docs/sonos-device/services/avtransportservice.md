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

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **UpdateID** | `number` |  |
| **NumberOfURIs** | `number` |  |
| **EnqueuedURIs** | `string` |  |
| **EnqueuedURIsMetaData** | `string | Track` |  |
| **ContainerURI** | `string` |  |
| **ContainerMetaData** | `string | Track` |  |
| **DesiredFirstTrackNumberEnqueued** | `number` |  |
| **EnqueueAsNext** | `boolean` |  |

### AddURIToQueue

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **EnqueuedURI** | `string` |  |
| **EnqueuedURIMetaData** | `string | Track` |  |
| **DesiredFirstTrackNumberEnqueued** | `number` |  |
| **EnqueueAsNext** | `boolean` |  |

### AddURIToSavedQueue

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **ObjectID** | `string` |  |
| **UpdateID** | `number` |  |
| **EnqueuedURI** | `string` |  |
| **EnqueuedURIMetaData** | `string | Track` |  |
| **AddAtIndex** | `number` |  |

### BackupQueue

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### BecomeCoordinatorOfStandaloneGroup

Leave the current group and revert to a single player.

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### BecomeGroupCoordinator

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
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

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
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

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **CurrentCoordinator** | `string` |  |
| **NewCoordinator** | `string` |  |
| **NewTransportSettings** | `string` |  |
| **CurrentAVTransportURI** | `string` |  |

### ChangeTransportSettings

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **NewTransportSettings** | `string` |  |
| **CurrentAVTransportURI** | `string` |  |

### ConfigureSleepTimer

Stop playing after set sleep timer

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **NewSleepTimerDuration** | `string` | Time to stop after, as hh:mm:ss |

### CreateSavedQueue

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **Title** | `string` |  |
| **EnqueuedURI** | `string` |  |
| **EnqueuedURIMetaData** | `string | Track` |  |

### DelegateGroupCoordinationTo

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **NewCoordinator** | `string` |  |
| **RejoinGroup** | `boolean` |  |

### EndDirectControlSession

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### GetCrossfadeMode

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### GetCurrentTransportActions

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### GetDeviceCapabilities

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### GetMediaInfo

Get information about the current playing media (queue)

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### GetPositionInfo

Get information about current position (position in queue and Time in current song)

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### GetRemainingSleepTimerDuration

Get Time left on sleeptimer

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### GetRunningAlarmProperties

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### GetTransportInfo

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### GetTransportSettings

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### Next

Go to next song, not always supported

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### NotifyDeletedURI

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **DeletedURI** | `string` |  |

### Pause

Pause playback

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### Play

Start playing the set TransportURI

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **Speed** | `string` |  |

### Previous

Go to previous song, not always supported

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### RemoveAllTracksFromQueue

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### RemoveTrackFromQueue

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **ObjectID** | `string` |  |
| **UpdateID** | `number` |  |

### RemoveTrackRangeFromQueue

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **UpdateID** | `number` |  |
| **StartingIndex** | `number` |  |
| **NumberOfTracks** | `number` |  |

### ReorderTracksInQueue

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **StartingIndex** | `number` |  |
| **NumberOfTracks** | `number` |  |
| **InsertBefore** | `number` |  |
| **UpdateID** | `number` |  |

### ReorderTracksInSavedQueue

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **ObjectID** | `string` |  |
| **UpdateID** | `number` |  |
| **TrackList** | `string` |  |
| **NewPositionList** | `string` |  |

### RunAlarm

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **AlarmID** | `number` |  |
| **LoggedStartTime** | `string` |  |
| **Duration** | `string` |  |
| **ProgramURI** | `string` |  |
| **ProgramMetaData** | `string | Track` |  |
| **PlayMode** | `PlayMode` |  |
| **Volume** | `number` |  |
| **IncludeLinkedZones** | `boolean` |  |

### SaveQueue

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **Title** | `string` |  |
| **ObjectID** | `string` |  |

### Seek

Seek track in queue, time delta or absolute time in song

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **Unit** | `string` | What to seek |
| **Target** | `string` | number for track in queue, hh:mm:ss for absolute time in track |

### SetAVTransportURI

Set the transport URI, to a song, a stream, the queue and a lot more

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **CurrentURI** | `string` | The track URI |
| **CurrentURIMetaData** | `string | Track` | Track Metadata |

### SetCrossfadeMode

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **CrossfadeMode** | `boolean` |  |

### SetNextAVTransportURI

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **NextURI** | `string` |  |
| **NextURIMetaData** | `string | Track` |  |

### SetPlayMode

Set the PlayMode

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **NewPlayMode** | `PlayMode` | PlayMode |

### SnoozeAlarm

Snooze the current alarm for some time.

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **Duration** | `string` | Snooze time as hh:mm:ss, 10 minutes = 00:10:00 |

### StartAutoplay

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **ProgramURI** | `string` |  |
| **ProgramMetaData** | `string | Track` |  |
| **Volume** | `number` |  |
| **IncludeLinkedZones** | `boolean` |  |
| **ResetVolumeAfter** | `boolean` |  |

### Stop

Stop playback

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

