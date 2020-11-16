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

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **StartLocalTime** | `string` | The start time as hh:mm:ss |
| **Duration** | `string` | The duration as hh:mm:ss |
| **Recurrence** | `string` | Repeat this alarm on |
| **Enabled** | `boolean` | Alarm enabled after creation |
| **RoomUUID** | `string` | The UUID of the speaker you want this alarm for |
| **ProgramURI** | `string` | The sound uri |
| **ProgramMetaData** | `string | Track` | The sound metadata, can be empty string |
| **PlayMode** | `string` | Alarm play mode |
| **Volume** | `number` | Volume between 0 and 100 |
| **IncludeLinkedZones** | `boolean` | Should grouped players also play the alarm? |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **AssignedID** | `number` |  |

### DestroyAlarm

Delete an alarm

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **ID** | `number` | The Alarm ID, see ListAndParseAlarms |

### GetDailyIndexRefreshTime

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentDailyIndexRefreshTime** | `string` |  |

### GetFormat

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentTimeFormat** | `string` |  |
| **CurrentDateFormat** | `string` |  |

### GetHouseholdTimeAtStamp

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **TimeStamp** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **HouseholdUTCTime** | `string` |  |

### GetTimeNow

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentUTCTime** | `string` |  |
| **CurrentLocalTime** | `string` |  |
| **CurrentTimeZone** | `string` |  |
| **CurrentTimeGeneration** | `number` |  |

### GetTimeServer

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentTimeServer** | `string` |  |

### GetTimeZone

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **Index** | `number` |  |
| **AutoAdjustDst** | `boolean` |  |

### GetTimeZoneAndRule

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **Index** | `number` |  |
| **AutoAdjustDst** | `boolean` |  |
| **CurrentTimeZone** | `string` |  |

### GetTimeZoneRule

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **Index** | `number` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **TimeZone** | `string` |  |

### ListAlarms

Get the AlarmList as XML, use ListAndParseAlarms for parsed version

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentAlarmList** | `string` |  |
| **CurrentAlarmListVersion** | `string` |  |

### SetDailyIndexRefreshTime

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **DesiredDailyIndexRefreshTime** | `string` |  |

### SetFormat

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **DesiredTimeFormat** | `string` |  |
| **DesiredDateFormat** | `string` |  |

### SetTimeNow

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **DesiredTime** | `string` |  |
| **TimeZoneForDesiredTime** | `string` |  |

### SetTimeServer

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **DesiredTimeServer** | `string` |  |

### SetTimeZone

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **Index** | `number` |  |
| **AutoAdjustDst** | `boolean` |  |

### UpdateAlarm

Update an alarm, all parameters are required. Use PatchAlarm where you can update a single parameter

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **ID** | `number` | The ID of the alarm see ListAndParseAlarms |
| **StartLocalTime** | `string` | The start time as hh:mm:ss |
| **Duration** | `string` | The duration as hh:mm:ss |
| **Recurrence** | `string` | Repeat this alarm on |
| **Enabled** | `boolean` | Alarm enabled after creation |
| **RoomUUID** | `string` | The UUID of the speaker you want this alarm for |
| **ProgramURI** | `string` | The sound uri |
| **ProgramMetaData** | `string | Track` | The sound metadata, can be empty string |
| **PlayMode** | `string` | Alarm play mode |
| **Volume** | `number` | Volume between 0 and 100 |
| **IncludeLinkedZones** | `boolean` | Should grouped players also play the alarm? |

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
