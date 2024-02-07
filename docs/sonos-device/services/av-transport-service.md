---
layout: default
title: AVTransport
parent: Services
grand_parent: Sonos device
---
# AVTransport service
{: .no_toc }

Service that controls stuff related to transport (play/pause/next/special urls)

The AVTransport service is available on these models: `v2-S1` / `v2-S13` / `v2-S14` / `v2-S18` / `v2-S21` / `v2-S27` / `v2-S3` / `v2-S33` / `v2-S38` / `v2-S6` / `v2-S9` / `v2-Sub`.

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.AVTransportService.OneOfTheMethodsBelow({...})
```

All actions that require input expect an object with the specified parameters, even if it only requires one parameter.

1. TOC
{:toc}

---

### AddMultipleURIsToQueue

```js
const result = await sonos.AVTransportService.AddMultipleURIsToQueue({ InstanceID:..., UpdateID:..., NumberOfURIs:..., EnqueuedURIs:..., EnqueuedURIsMetaData:..., ContainerURI:..., ContainerMetaData:..., DesiredFirstTrackNumberEnqueued:..., EnqueueAsNext:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **UpdateID** | `number` |  |
| **NumberOfURIs** | `number` |  |
| **EnqueuedURIs** | `string` |  |
| **EnqueuedURIsMetaData** | `Track | string` |  |
| **ContainerURI** | `string` |  |
| **ContainerMetaData** | `Track | string` |  |
| **DesiredFirstTrackNumberEnqueued** | `number` |  |
| **EnqueueAsNext** | `boolean` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **FirstTrackNumberEnqueued** | `number` |  |
| **NumTracksAdded** | `number` |  |
| **NewQueueLength** | `number` |  |
| **NewUpdateID** | `number` |  |

### AddURIToQueue

Adds songs to the SONOS queue

```js
const result = await sonos.AVTransportService.AddURIToQueue({ InstanceID:..., EnqueuedURI:..., EnqueuedURIMetaData:..., DesiredFirstTrackNumberEnqueued:..., EnqueueAsNext:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **EnqueuedURI** | `string` |  |
| **EnqueuedURIMetaData** | `Track | string` |  |
| **DesiredFirstTrackNumberEnqueued** | `number` | use `0` to add at the end or `1` to insert at the beginning |
| **EnqueueAsNext** | `boolean` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **FirstTrackNumberEnqueued** | `number` |  |
| **NumTracksAdded** | `number` |  |
| **NewQueueLength** | `number` |  |

**Remarks** In NORMAL play mode the songs are added prior to the specified `DesiredFirstTrackNumberEnqueued`.

### AddURIToSavedQueue

```js
const result = await sonos.AVTransportService.AddURIToSavedQueue({ InstanceID:..., ObjectID:..., UpdateID:..., EnqueuedURI:..., EnqueuedURIMetaData:..., AddAtIndex:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **ObjectID** | `string` |  |
| **UpdateID** | `number` |  |
| **EnqueuedURI** | `string` |  |
| **EnqueuedURIMetaData** | `Track | string` |  |
| **AddAtIndex** | `number` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **NumTracksAdded** | `number` |  |
| **NewQueueLength** | `number` |  |
| **NewUpdateID** | `number` |  |

### BackupQueue

```js
const result = await sonos.AVTransportService.BackupQueue({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

This actions returns a boolean whether or not the requests succeeded.

### BecomeCoordinatorOfStandaloneGroup

Leave the current group and revert to a single player.

```js
const result = await sonos.AVTransportService.BecomeCoordinatorOfStandaloneGroup({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **DelegatedGroupCoordinatorID** | `string` |  |
| **NewGroupID** | `string` |  |

### BecomeGroupCoordinator

```js
const result = await sonos.AVTransportService.BecomeGroupCoordinator({ InstanceID:..., CurrentCoordinator:..., CurrentGroupID:..., OtherMembers:..., TransportSettings:..., CurrentURI:..., CurrentURIMetaData:..., SleepTimerState:..., AlarmState:..., StreamRestartState:..., CurrentQueueTrackList:..., CurrentVLIState:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **CurrentCoordinator** | `string` |  |
| **CurrentGroupID** | `string` |  |
| **OtherMembers** | `string` |  |
| **TransportSettings** | `string` |  |
| **CurrentURI** | `string` |  |
| **CurrentURIMetaData** | `Track | string` |  |
| **SleepTimerState** | `string` |  |
| **AlarmState** | `string` |  |
| **StreamRestartState** | `string` |  |
| **CurrentQueueTrackList** | `string` |  |
| **CurrentVLIState** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### BecomeGroupCoordinatorAndSource

```js
const result = await sonos.AVTransportService.BecomeGroupCoordinatorAndSource({ InstanceID:..., CurrentCoordinator:..., CurrentGroupID:..., OtherMembers:..., CurrentURI:..., CurrentURIMetaData:..., SleepTimerState:..., AlarmState:..., StreamRestartState:..., CurrentAVTTrackList:..., CurrentQueueTrackList:..., CurrentSourceState:..., ResumePlayback:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **CurrentCoordinator** | `string` |  |
| **CurrentGroupID** | `string` |  |
| **OtherMembers** | `string` |  |
| **CurrentURI** | `string` |  |
| **CurrentURIMetaData** | `Track | string` |  |
| **SleepTimerState** | `string` |  |
| **AlarmState** | `string` |  |
| **StreamRestartState** | `string` |  |
| **CurrentAVTTrackList** | `string` |  |
| **CurrentQueueTrackList** | `string` |  |
| **CurrentSourceState** | `string` |  |
| **ResumePlayback** | `boolean` |  |

This actions returns a boolean whether or not the requests succeeded.

### ChangeCoordinator

```js
const result = await sonos.AVTransportService.ChangeCoordinator({ InstanceID:..., CurrentCoordinator:..., NewCoordinator:..., NewTransportSettings:..., CurrentAVTransportURI:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **CurrentCoordinator** | `string` |  |
| **NewCoordinator** | `string` |  |
| **NewTransportSettings** | `string` |  |
| **CurrentAVTransportURI** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### ChangeTransportSettings

```js
const result = await sonos.AVTransportService.ChangeTransportSettings({ InstanceID:..., NewTransportSettings:..., CurrentAVTransportURI:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **NewTransportSettings** | `string` |  |
| **CurrentAVTransportURI** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### ConfigureSleepTimer

Stop playing after set sleep timer or cancel

```js
const result = await sonos.AVTransportService.ConfigureSleepTimer({ InstanceID:..., NewSleepTimerDuration:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **NewSleepTimerDuration** | `string` | Time to stop after, as `hh:mm:ss` or empty string to cancel |

This actions returns a boolean whether or not the requests succeeded.

**Remarks** Send to non-coordinator returns error code 800

### CreateSavedQueue

```js
const result = await sonos.AVTransportService.CreateSavedQueue({ InstanceID:..., Title:..., EnqueuedURI:..., EnqueuedURIMetaData:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **Title** | `string` |  |
| **EnqueuedURI** | `string` |  |
| **EnqueuedURIMetaData** | `Track | string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **NumTracksAdded** | `number` |  |
| **NewQueueLength** | `number` |  |
| **AssignedObjectID** | `string` |  |
| **NewUpdateID** | `number` |  |

### DelegateGroupCoordinationTo

Delegates the coordinator role to another player in the same group

```js
const result = await sonos.AVTransportService.DelegateGroupCoordinationTo({ InstanceID:..., NewCoordinator:..., RejoinGroup:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **NewCoordinator** | `string` | uuid of the new coordinator - must be in same group |
| **RejoinGroup** | `boolean` | Should former coordinator rejoin the group? |

This actions returns a boolean whether or not the requests succeeded.

**Remarks** Send to non-coordinator has no results - should be avoided.

### EndDirectControlSession

```js
const result = await sonos.AVTransportService.EndDirectControlSession({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

This actions returns a boolean whether or not the requests succeeded.

### GetCrossfadeMode

Get crossfade mode

```js
const result = await sonos.AVTransportService.GetCrossfadeMode({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CrossfadeMode** | `boolean` |  |

**Remarks** Send to non-coordinator may return wrong value as only the coordinator value in a group

### GetCurrentTransportActions

Get current transport actions such as Set, Stop, Pause, Play, X_DLNA_SeekTime, Next, X_DLNA_SeekTrackNr

```js
const result = await sonos.AVTransportService.GetCurrentTransportActions({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **Actions** | `string` |  |

**Remarks** Send to non-coordinator returns only `Start` and `Stop` since it cannot control the stream.

### GetDeviceCapabilities

```js
const result = await sonos.AVTransportService.GetDeviceCapabilities({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **PlayMedia** | `string` |  |
| **RecMedia** | `string` |  |
| **RecQualityModes** | `string` |  |

### GetMediaInfo

Get information about the current playing media (queue)

```js
const result = await sonos.AVTransportService.GetMediaInfo({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **NrTracks** | `number` |  |
| **MediaDuration** | `string` |  |
| **CurrentURI** | `string` |  |
| **CurrentURIMetaData** | `Track | string` |  |
| **NextURI** | `string` |  |
| **NextURIMetaData** | `Track | string` |  |
| **PlayMedium** | `string` |  Possible values: `NONE` / `NETWORK` |
| **RecordMedium** | `string` |  Possible values: `NONE` |
| **WriteStatus** | `string` |  |

### GetPositionInfo

Get information about current position (position in queue and time in current song)

```js
const result = await sonos.AVTransportService.GetPositionInfo({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **Track** | `number` |  |
| **TrackDuration** | `string` |  |
| **TrackMetaData** | `Track | string` |  |
| **TrackURI** | `string` |  |
| **RelTime** | `string` |  |
| **AbsTime** | `string` |  |
| **RelCount** | `number` |  |
| **AbsCount** | `number` |  |

### GetRemainingSleepTimerDuration

Get time left on sleeptimer.

```js
const result = await sonos.AVTransportService.GetRemainingSleepTimerDuration({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **RemainingSleepTimerDuration** | `string` | Format hh:mm:ss or empty string if not set |
| **CurrentSleepTimerGeneration** | `number` |  |

**Remarks** Send to non-coordinator returns error code 800

### GetRunningAlarmProperties

```js
const result = await sonos.AVTransportService.GetRunningAlarmProperties({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **AlarmID** | `number` |  |
| **GroupID** | `string` |  |
| **LoggedStartTime** | `string` |  |

### GetTransportInfo

Get current transport status, speed and state such as PLAYING, STOPPED, PLAYING, PAUSED_PLAYBACK, TRANSITIONING, NO_MEDIA_PRESENT

```js
const result = await sonos.AVTransportService.GetTransportInfo({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentTransportState** | `string` |  Possible values: `STOPPED` / `PLAYING` / `PAUSED_PLAYBACK` / `TRANSITIONING` |
| **CurrentTransportStatus** | `string` |  |
| **CurrentSpeed** | `string` |  Possible values: `1` |

**Remarks** Send to non-coordinator always returns PLAYING

### GetTransportSettings

Get transport settings

```js
const result = await sonos.AVTransportService.GetTransportSettings({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **PlayMode** | `PlayMode` |  Possible values: `NORMAL` / `REPEAT_ALL` / `REPEAT_ONE` / `SHUFFLE_NOREPEAT` / `SHUFFLE` / `SHUFFLE_REPEAT_ONE` |
| **RecQualityMode** | `string` |  |

**Remarks** Send to non-coordinator returns the settings of it's queue

### Next

Go to next song

```js
const result = await sonos.AVTransportService.Next({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

This actions returns a boolean whether or not the requests succeeded.

**Remarks** Possibly not supported at the moment see GetCurrentTransportActions

### NotifyDeletedURI

```js
const result = await sonos.AVTransportService.NotifyDeletedURI({ InstanceID:..., DeletedURI:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **DeletedURI** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### Pause

Pause playback

```js
const result = await sonos.AVTransportService.Pause({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

This actions returns a boolean whether or not the requests succeeded.

### Play

Start playing the set TransportURI

```js
const result = await sonos.AVTransportService.Play({ InstanceID:..., Speed:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **Speed** | `string` | Play speed usually 1, can be a fraction of 1 Allowed values: `1` |

This actions returns a boolean whether or not the requests succeeded.

### Previous

Go to previous song

```js
const result = await sonos.AVTransportService.Previous({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

This actions returns a boolean whether or not the requests succeeded.

**Remarks** Possibly not supported at the moment see GetCurrentTransportActions

### RemoveAllTracksFromQueue

Flushes the SONOS queue.

```js
const result = await sonos.AVTransportService.RemoveAllTracksFromQueue({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

This actions returns a boolean whether or not the requests succeeded.

**Remarks** If queue is already empty it throw error 804. Send to non-coordinator returns error code 800.

### RemoveTrackFromQueue

```js
const result = await sonos.AVTransportService.RemoveTrackFromQueue({ InstanceID:..., ObjectID:..., UpdateID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **ObjectID** | `string` |  |
| **UpdateID** | `number` |  |

This actions returns a boolean whether or not the requests succeeded.

### RemoveTrackRangeFromQueue

Removes the specified range of songs from the SONOS queue.

```js
const result = await sonos.AVTransportService.RemoveTrackRangeFromQueue({ InstanceID:..., UpdateID:..., StartingIndex:..., NumberOfTracks:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **UpdateID** | `number` | Leave blank |
| **StartingIndex** | `number` | between 1 and queue-length |
| **NumberOfTracks** | `number` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **NewUpdateID** | `number` |  |

### ReorderTracksInQueue

```js
const result = await sonos.AVTransportService.ReorderTracksInQueue({ InstanceID:..., StartingIndex:..., NumberOfTracks:..., InsertBefore:..., UpdateID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **StartingIndex** | `number` |  |
| **NumberOfTracks** | `number` |  |
| **InsertBefore** | `number` |  |
| **UpdateID** | `number` |  |

This actions returns a boolean whether or not the requests succeeded.

### ReorderTracksInSavedQueue

```js
const result = await sonos.AVTransportService.ReorderTracksInSavedQueue({ InstanceID:..., ObjectID:..., UpdateID:..., TrackList:..., NewPositionList:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **ObjectID** | `string` |  |
| **UpdateID** | `number` |  |
| **TrackList** | `string` |  |
| **NewPositionList** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueLengthChange** | `number` |  |
| **NewQueueLength** | `number` |  |
| **NewUpdateID** | `number` |  |

### RunAlarm

```js
const result = await sonos.AVTransportService.RunAlarm({ InstanceID:..., AlarmID:..., LoggedStartTime:..., Duration:..., ProgramURI:..., ProgramMetaData:..., PlayMode:..., Volume:..., IncludeLinkedZones:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **AlarmID** | `number` |  |
| **LoggedStartTime** | `string` |  |
| **Duration** | `string` |  |
| **ProgramURI** | `string` |  |
| **ProgramMetaData** | `Track | string` |  |
| **PlayMode** | `PlayMode` |  Allowed values: `NORMAL` / `REPEAT_ALL` / `REPEAT_ONE` / `SHUFFLE_NOREPEAT` / `SHUFFLE` / `SHUFFLE_REPEAT_ONE` |
| **Volume** | `number` |  |
| **IncludeLinkedZones** | `boolean` |  |

This actions returns a boolean whether or not the requests succeeded.

### SaveQueue

Saves the current SONOS queue as a SONOS playlist and outputs objectID

```js
const result = await sonos.AVTransportService.SaveQueue({ InstanceID:..., Title:..., ObjectID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **Title** | `string` | SONOS playlist title |
| **ObjectID** | `string` | Leave blank |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **AssignedObjectID** | `string` |  |

**Remarks** Send to non-coordinator returns error code 800

### Seek

Seek track in queue, time delta or absolute time in song

```js
const result = await sonos.AVTransportService.Seek({ InstanceID:..., Unit:..., Target:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **Unit** | `string` | What to seek Allowed values: `TRACK_NR` / `REL_TIME` / `TIME_DELTA` |
| **Target** | `string` | Position of track in queue (start at 1) or `hh:mm:ss` for `REL_TIME` or `+/-hh:mm:ss` for `TIME_DELTA` |

This actions returns a boolean whether or not the requests succeeded.

**Remarks** Returns error code 701 in case that content does not support Seek or send to non-coordinator

### SetAVTransportURI

Set the transport URI to a song, a stream, the queue, another player-rincon and a lot more

```js
const result = await sonos.AVTransportService.SetAVTransportURI({ InstanceID:..., CurrentURI:..., CurrentURIMetaData:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **CurrentURI** | `string` | The new TransportURI - its a special SONOS format |
| **CurrentURIMetaData** | `Track | string` | Track Metadata, see MetadataHelper.GuessTrack to guess based on track uri |

This actions returns a boolean whether or not the requests succeeded.

**Remarks** If set to another player RINCON, the player is grouped with that one.

### SetCrossfadeMode

Set crossfade mode

```js
const result = await sonos.AVTransportService.SetCrossfadeMode({ InstanceID:..., CrossfadeMode:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **CrossfadeMode** | `boolean` |  |

This actions returns a boolean whether or not the requests succeeded.

**Remarks** Send to non-coordinator returns error code 800. Same for content, which does not support crossfade mode.

### SetNextAVTransportURI

```js
const result = await sonos.AVTransportService.SetNextAVTransportURI({ InstanceID:..., NextURI:..., NextURIMetaData:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **NextURI** | `string` |  |
| **NextURIMetaData** | `Track | string` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetPlayMode

Set the PlayMode

```js
const result = await sonos.AVTransportService.SetPlayMode({ InstanceID:..., NewPlayMode:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **NewPlayMode** | `PlayMode` | New playmode Allowed values: `NORMAL` / `REPEAT_ALL` / `REPEAT_ONE` / `SHUFFLE_NOREPEAT` / `SHUFFLE` / `SHUFFLE_REPEAT_ONE` |

This actions returns a boolean whether or not the requests succeeded.

**Remarks** Send to non-coordinator returns error code 712. If SONOS queue is not activated returns error code 712.

### SnoozeAlarm

Snooze the current alarm for some time.

```js
const result = await sonos.AVTransportService.SnoozeAlarm({ InstanceID:..., Duration:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **Duration** | `string` | Snooze time as `hh:mm:ss`, 10 minutes = 00:10:00 |

This actions returns a boolean whether or not the requests succeeded.

### StartAutoplay

```js
const result = await sonos.AVTransportService.StartAutoplay({ InstanceID:..., ProgramURI:..., ProgramMetaData:..., Volume:..., IncludeLinkedZones:..., ResetVolumeAfter:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **ProgramURI** | `string` |  |
| **ProgramMetaData** | `Track | string` |  |
| **Volume** | `number` |  |
| **IncludeLinkedZones** | `boolean` |  |
| **ResetVolumeAfter** | `boolean` |  |

This actions returns a boolean whether or not the requests succeeded.

### Stop

Stop playback

```js
const result = await sonos.AVTransportService.Stop({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

This actions returns a boolean whether or not the requests succeeded.

## AVTransportService event

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.AVTransportService.Events('serviceEvent', (data) => {
  console.log(data);
});
```

The **AVTransportService** emits events with these properties. Not all properties are emitted every time.

| parameter | type | possible values |
|:----------|:-----|:----------------|
| **AbsoluteCounterPosition** | `number` |  | 
| **AbsoluteTimePosition** | `string` |  | 
| **AlarmIDRunning** | `number` |  | 
| **AlarmLoggedStartTime** | `string` |  | 
| **AlarmRunning** | `boolean` |  | 
| **AVTransportURI** | `string` |  | 
| **AVTransportURIMetaData** | `Track | string` |  | 
| **CurrentCrossfadeMode** | `boolean` |  | 
| **CurrentMediaDuration** | `string` |  | 
| **CurrentPlayMode** | `PlayMode` | `NORMAL` / `REPEAT_ALL` / `REPEAT_ONE` / `SHUFFLE_NOREPEAT` / `SHUFFLE` / `SHUFFLE_REPEAT_ONE` | 
| **CurrentRecordQualityMode** | `string` |  | 
| **CurrentSection** | `number` |  | 
| **CurrentTrack** | `number` |  | 
| **CurrentTrackDuration** | `string` |  | 
| **CurrentTrackMetaData** | `Track | string` |  | 
| **CurrentTrackURI** | `string` |  | 
| **CurrentTransportActions** | `string` |  | 
| **CurrentValidPlayModes** | `string` |  | 
| **DirectControlAccountID** | `string` |  | 
| **DirectControlClientID** | `string` |  | 
| **DirectControlIsSuspended** | `boolean` |  | 
| **EnqueuedTransportURI** | `string` |  | 
| **EnqueuedTransportURIMetaData** | `Track | string` |  | 
| **LastChange** | `string` |  | 
| **MuseSessions** | `string` |  | 
| **NextAVTransportURI** | `string` |  | 
| **NextAVTransportURIMetaData** | `Track | string` |  | 
| **NextTrackMetaData** | `Track | string` |  | 
| **NextTrackURI** | `string` |  | 
| **NumberOfTracks** | `number` |  | 
| **PlaybackStorageMedium** | `string` | `NONE` / `NETWORK` | 
| **PossiblePlaybackStorageMedia** | `string` |  | 
| **PossibleRecordQualityModes** | `string` |  | 
| **PossibleRecordStorageMedia** | `string` |  | 
| **QueueUpdateID** | `number` |  | 
| **RecordMediumWriteStatus** | `string` |  | 
| **RecordStorageMedium** | `string` | `NONE` | 
| **RelativeCounterPosition** | `number` |  | 
| **RelativeTimePosition** | `string` |  | 
| **RestartPending** | `boolean` |  | 
| **SleepTimerGeneration** | `number` |  | 
| **SnoozeRunning** | `boolean` |  | 
| **TransportErrorDescription** | `string` |  | 
| **TransportErrorHttpCode** | `string` |  | 
| **TransportErrorHttpHeaders** | `string` |  | 
| **TransportErrorURI** | `string` |  | 
| **TransportPlaySpeed** | `string` | `1` | 
| **TransportState** | `string` | `STOPPED` / `PLAYING` / `PAUSED_PLAYBACK` / `TRANSITIONING` | 
| **TransportStatus** | `string` |  | 

This file is automatically generated with [@svrooij/sonos-docs](https://github.com/svrooij/sonos-api-docs/tree/main/generator/sonos-docs), do not edit manually.
