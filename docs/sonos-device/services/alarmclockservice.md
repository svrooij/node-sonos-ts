---
layout: default
title: AlarmClockService
parent: Services
grand_parent: Sonos device
---
# AlarmClockService
{: .no_toc }

Control the sonos alarms

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.AlarmClockService.OneOfTheMethodsBelow({...})
```

All methods that require input expect an object with the specified parameters, even if it only requires one parameter.

1. TOC
{:toc}

---

### CreateAlarm

Create a single alarm, all properties are required

| parameter | type | description |
|:----------|:-----|:------------|
| **StartLocalTime** | `string` | The starttime as hh:mm:ss |
| **Duration** | `string` | The duration as hh:mm:ss |
| **Recurrence** | `string` | Repeat this alarm on |
| **Enabled** | `boolean` | Alarm enabled after creation |
| **RoomUUID** | `string` | The UUID of the speaker you want this alarm for |
| **ProgramURI** | `string` | The sound uri |
| **ProgramMetaData** | `string | Track` | The sound metadata, can be empty string |
| **PlayMode** | `string` | Alarm playmode |
| **Volume** | `number` | Volume between 0 and 100 |
| **IncludeLinkedZones** | `boolean` | Should grouped palyers also play the alarm? |

### DestroyAlarm

Delete an alarm

| parameter | type | description |
|:----------|:-----|:------------|
| **ID** | `number` | The Alarm ID, see ListAndParseAlarms |

### GetDailyIndexRefreshTime

No parameters

### GetFormat

No parameters

### GetHouseholdTimeAtStamp

| parameter | type | description |
|:----------|:-----|:------------|
| **TimeStamp** | `string` |  |

### GetTimeNow

No parameters

### GetTimeServer

No parameters

### GetTimeZone

No parameters

### GetTimeZoneAndRule

No parameters

### GetTimeZoneRule

| parameter | type | description |
|:----------|:-----|:------------|
| **Index** | `number` |  |

### ListAlarms

Get the AlarmList as XML, use ListAndParseAlarms for parsed version

No parameters

### SetDailyIndexRefreshTime

| parameter | type | description |
|:----------|:-----|:------------|
| **DesiredDailyIndexRefreshTime** | `string` |  |

### SetFormat

| parameter | type | description |
|:----------|:-----|:------------|
| **DesiredTimeFormat** | `string` |  |
| **DesiredDateFormat** | `string` |  |

### SetTimeNow

| parameter | type | description |
|:----------|:-----|:------------|
| **DesiredTime** | `string` |  |
| **TimeZoneForDesiredTime** | `string` |  |

### SetTimeServer

| parameter | type | description |
|:----------|:-----|:------------|
| **DesiredTimeServer** | `string` |  |

### SetTimeZone

| parameter | type | description |
|:----------|:-----|:------------|
| **Index** | `number` |  |
| **AutoAdjustDst** | `boolean` |  |

### UpdateAlarm

Update an alarm, all parameters are required. Use PatchAlarm where you can update a single parameter

| parameter | type | description |
|:----------|:-----|:------------|
| **ID** | `number` | The ID of the alarm see ListAndParseAlarms |
| **StartLocalTime** | `string` | The starttime as hh:mm:ss |
| **Duration** | `string` | The duration as hh:mm:ss |
| **Recurrence** | `string` | Repeat this alarm on |
| **Enabled** | `boolean` | Alarm enabled after creation |
| **RoomUUID** | `string` | The UUID of the speaker you want this alarm for |
| **ProgramURI** | `string` | The sound uri |
| **ProgramMetaData** | `string | Track` | The sound metadata, can be empty string |
| **PlayMode** | `string` | Alarm playmode |
| **Volume** | `number` | Volume between 0 and 100 |
| **IncludeLinkedZones** | `boolean` | Should grouped palyers also play the alarm? |

## AlarmClockService event

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.AlarmClockService.Events('serviceEvent', (data) => {
  console.log(data);
});
```

The **AlarmClockService** emits events with these properties. Not all properties are emitted everytime.

| parameter | type |
|:----------|:-----|
| **AlarmListVersion** | `string` |
| **DailyIndexRefreshTime** | `string` |
| **DateFormat** | `string` |
| **TimeFormat** | `string` |
| **TimeGeneration** | `number` |
| **TimeServer** | `string` |
| **TimeZone** | `string` |
