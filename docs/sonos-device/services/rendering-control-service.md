---
layout: default
title: RenderingControlService
parent: Services
grand_parent: Sonos device
---
# RenderingControlService
{: .no_toc }

Volume related controls

The RenderingControlService is available on these models: `v1-S1` / `v1-S5` / `v1-S9`.

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.RenderingControlService.OneOfTheMethodsBelow({...})
```

All methods that require input expect an object with the specified parameters, even if it only requires one parameter.

1. TOC
{:toc}

---

### GetBass

Get bass level between -10 and 10

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentBass** | `number` |  |

### GetEQ

Get EQ value (see SetEQ) for different EQTypes - not supported by all devices (is TV related)

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **EQType** | `string` | EQ type such as DialogLevel, NightMode, SubGain |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentValue** | `number` |  |

### GetHeadphoneConnected

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentHeadphoneConnected** | `boolean` |  |

### GetLoudness

Get loudness 1 for on, 0 for off

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` | Master Allowed values: `Master` / `LF` / `RF` |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentLoudness** | `boolean` |  |

### GetMute

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` / `SpeakerOnly` |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentMute** | `boolean` |  |

### GetOutputFixed

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentFixed** | `boolean` |  |

### GetRoomCalibrationStatus

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **RoomCalibrationEnabled** | `boolean` |  |
| **RoomCalibrationAvailable** | `boolean` |  |

### GetSupportsOutputFixed

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentSupportsFixed** | `boolean` |  |

### GetTreble

Get treble between -10 and 10

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentTreble** | `number` |  |

### GetVolume

Get volume between 0 and 100

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` | Master Allowed values: `Master` / `LF` / `RF` |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentVolume** | `number` |  |

### GetVolumeDB

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentVolume** | `number` |  |

### GetVolumeDBRange

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **MinValue** | `number` |  |
| **MaxValue** | `number` |  |

### RampToVolume

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |
| **RampType** | `string` |  Allowed values: `SLEEP_TIMER_RAMP_TYPE` / `ALARM_RAMP_TYPE` / `AUTOPLAY_RAMP_TYPE` |
| **DesiredVolume** | `number` |  |
| **ResetVolumeAfter** | `boolean` |  |
| **ProgramURI** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **RampTime** | `number` |  |

### ResetBasicEQ

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **Bass** | `number` |  |
| **Treble** | `number` |  |
| **Loudness** | `boolean` |  |
| **LeftVolume** | `number` |  |
| **RightVolume** | `number` |  |

### ResetExtEQ

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **EQType** | `string` |  |

### RestoreVolumePriorToRamp

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |

### SetBass

Set bass level

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **DesiredBass** | `number` | between -10 and 10 |

### SetChannelMap

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **ChannelMap** | `string` |  |

### SetEQ

Set EQ value for different types - not supported by all devices (is TV related)

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **EQType** | `string` | DialogLevel, NightMode, SubGain |
| **DesiredValue** | `number` | DialogLevel and NightMode: 0 for off, 1 for on. SubGain between -10 and 10 |

### SetLoudness

Set loudness on / off

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |
| **DesiredLoudness** | `boolean` | true for on |

### SetMute

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` / `SpeakerOnly` |
| **DesiredMute** | `boolean` |  |

### SetOutputFixed

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **DesiredFixed** | `boolean` |  |

### SetRelativeVolume

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |
| **Adjustment** | `number` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **NewVolume** | `number` |  |

### SetRoomCalibrationStatus

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **RoomCalibrationEnabled** | `boolean` |  |

### SetRoomCalibrationX

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **CalibrationID** | `string` |  |
| **Coefficients** | `string` |  |
| **CalibrationMode** | `string` |  |

### SetTreble

Set treble level

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **DesiredTreble** | `number` | between -10 and 10 |

### SetVolume

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |
| **DesiredVolume** | `number` |  |

### SetVolumeDB

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |
| **DesiredVolume** | `number` |  |

## RenderingControlService event

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.RenderingControlService.Events('serviceEvent', (data) => {
  console.log(data);
});
```

The **RenderingControlService** emits events with these properties. Not all properties are emitted every time.

| parameter | type | possible values |
|:----------|:-----|:----------------|
| **AudioDelay** | `string` |  | 
| **AudioDelayLeftRear** | `string` |  | 
| **AudioDelayRightRear** | `string` |  | 
| **Bass** | `number` |  | 
| **DialogLevel** | `string` |  | 
| **EQValue** | `number` |  | 
| **HeadphoneConnected** | `boolean` |  | 
| **LastChange** | `string` |  | 
| **Loudness** | `boolean` |  | 
| **MusicSurroundLevel** | `string` |  | 
| **Mute** | `boolean` |  | 
| **NightMode** | `boolean` |  | 
| **OutputFixed** | `boolean` |  | 
| **PresetNameList** | `string` |  | 
| **RoomCalibrationAvailable** | `boolean` |  | 
| **RoomCalibrationCalibrationMode** | `string` |  | 
| **RoomCalibrationCoefficients** | `string` |  | 
| **RoomCalibrationEnabled** | `boolean` |  | 
| **RoomCalibrationID** | `string` |  | 
| **SpeakerSize** | `number` |  | 
| **SubCrossover** | `string` |  | 
| **SubEnabled** | `boolean` |  | 
| **SubGain** | `string` |  | 
| **SubPolarity** | `string` |  | 
| **SupportsOutputFixed** | `boolean` |  | 
| **SurroundEnabled** | `boolean` |  | 
| **SurroundLevel** | `string` |  | 
| **SurroundMode** | `string` |  | 
| **Treble** | `number` |  | 
| **Volume** | `number` |  | 
| **VolumeDB** | `number` |  | 

This file is automatically generated with [@svrooij/sonos-docs](https://github.com/svrooij/sonos-api-docs/tree/main/generator/sonos-docs), do not edit manually.
