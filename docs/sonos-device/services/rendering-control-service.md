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

All actions that require input expect an object with the specified parameters, even if it only requires one parameter.

1. TOC
{:toc}

---

### GetBass

Get bass level between -10 and 10

```js
const result = await sonos.RenderingControlService.GetBass({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentBass** | `number` |  |

### GetEQ

Get EQ value (see SetEQ) for different EQTypes

```js
const result = await sonos.RenderingControlService.GetEQ({ InstanceID:..., EQType:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **EQType** | `string` | EQ type such as DialogLevel, NightMode, SubGain |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentValue** | `number` |  |

**Remarks** Not supported by all speakers, TV related

### GetHeadphoneConnected

```js
const result = await sonos.RenderingControlService.GetHeadphoneConnected({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentHeadphoneConnected** | `boolean` |  |

### GetLoudness

Whether or not Loudness is on

```js
const result = await sonos.RenderingControlService.GetLoudness({ InstanceID:..., Channel:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` | Master Allowed values: `Master` / `LF` / `RF` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentLoudness** | `boolean` |  |

### GetMute

```js
const result = await sonos.RenderingControlService.GetMute({ InstanceID:..., Channel:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` / `SpeakerOnly` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentMute** | `boolean` |  |

### GetOutputFixed

```js
const result = await sonos.RenderingControlService.GetOutputFixed({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentFixed** | `boolean` |  |

### GetRoomCalibrationStatus

```js
const result = await sonos.RenderingControlService.GetRoomCalibrationStatus({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **RoomCalibrationEnabled** | `boolean` |  |
| **RoomCalibrationAvailable** | `boolean` |  |

### GetSupportsOutputFixed

```js
const result = await sonos.RenderingControlService.GetSupportsOutputFixed({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentSupportsFixed** | `boolean` |  |

### GetTreble

Get treble, between -10 and 10

```js
const result = await sonos.RenderingControlService.GetTreble({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentTreble** | `number` |  |

### GetVolume

Get volume, between 0 and 100

```js
const result = await sonos.RenderingControlService.GetVolume({ InstanceID:..., Channel:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` | Master Allowed values: `Master` / `LF` / `RF` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentVolume** | `number` |  |

### GetVolumeDB

```js
const result = await sonos.RenderingControlService.GetVolumeDB({ InstanceID:..., Channel:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentVolume** | `number` |  |

### GetVolumeDBRange

```js
const result = await sonos.RenderingControlService.GetVolumeDBRange({ InstanceID:..., Channel:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **MinValue** | `number` |  |
| **MaxValue** | `number` |  |

### RampToVolume

```js
const result = await sonos.RenderingControlService.RampToVolume({ InstanceID:..., Channel:..., RampType:..., DesiredVolume:..., ResetVolumeAfter:..., ProgramURI:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |
| **RampType** | `string` |  Allowed values: `SLEEP_TIMER_RAMP_TYPE` / `ALARM_RAMP_TYPE` / `AUTOPLAY_RAMP_TYPE` |
| **DesiredVolume** | `number` |  |
| **ResetVolumeAfter** | `boolean` |  |
| **ProgramURI** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **RampTime** | `number` |  |

### ResetBasicEQ

```js
const result = await sonos.RenderingControlService.ResetBasicEQ({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **Bass** | `number` |  |
| **Treble** | `number` |  |
| **Loudness** | `boolean` |  |
| **LeftVolume** | `number` |  |
| **RightVolume** | `number` |  |

### ResetExtEQ

```js
const result = await sonos.RenderingControlService.ResetExtEQ({ InstanceID:..., EQType:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **EQType** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### RestoreVolumePriorToRamp

```js
const result = await sonos.RenderingControlService.RestoreVolumePriorToRamp({ InstanceID:..., Channel:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |

This actions returns a boolean whether or not the requests succeeded.

### SetBass

Set bass level

```js
const result = await sonos.RenderingControlService.SetBass({ InstanceID:..., DesiredBass:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **DesiredBass** | `number` | between -10 and 10 |

This actions returns a boolean whether or not the requests succeeded.

### SetChannelMap

```js
const result = await sonos.RenderingControlService.SetChannelMap({ InstanceID:..., ChannelMap:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **ChannelMap** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetEQ

Set EQ value for different types

```js
const result = await sonos.RenderingControlService.SetEQ({ InstanceID:..., EQType:..., DesiredValue:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **EQType** | `string` | DialogLevel, NightMode, SubGain |
| **DesiredValue** | `number` | DialogLevel and NightMode: 0 for off, 1 for on. SubGain between -10 and 10 |

This actions returns a boolean whether or not the requests succeeded.

**Remarks** Not supported by all speakers, TV related

### SetLoudness

Set loudness on / off

```js
const result = await sonos.RenderingControlService.SetLoudness({ InstanceID:..., Channel:..., DesiredLoudness:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |
| **DesiredLoudness** | `boolean` | true for on |

This actions returns a boolean whether or not the requests succeeded.

### SetMute

```js
const result = await sonos.RenderingControlService.SetMute({ InstanceID:..., Channel:..., DesiredMute:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` / `SpeakerOnly` |
| **DesiredMute** | `boolean` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetOutputFixed

```js
const result = await sonos.RenderingControlService.SetOutputFixed({ InstanceID:..., DesiredFixed:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **DesiredFixed** | `boolean` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetRelativeVolume

```js
const result = await sonos.RenderingControlService.SetRelativeVolume({ InstanceID:..., Channel:..., Adjustment:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |
| **Adjustment** | `number` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **NewVolume** | `number` |  |

### SetRoomCalibrationStatus

```js
const result = await sonos.RenderingControlService.SetRoomCalibrationStatus({ InstanceID:..., RoomCalibrationEnabled:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **RoomCalibrationEnabled** | `boolean` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetRoomCalibrationX

```js
const result = await sonos.RenderingControlService.SetRoomCalibrationX({ InstanceID:..., CalibrationID:..., Coefficients:..., CalibrationMode:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **CalibrationID** | `string` |  |
| **Coefficients** | `string` |  |
| **CalibrationMode** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetTreble

Set treble level

```js
const result = await sonos.RenderingControlService.SetTreble({ InstanceID:..., DesiredTreble:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **DesiredTreble** | `number` | between -10 and 10 |

This actions returns a boolean whether or not the requests succeeded.

### SetVolume

```js
const result = await sonos.RenderingControlService.SetVolume({ InstanceID:..., Channel:..., DesiredVolume:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |
| **DesiredVolume** | `number` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetVolumeDB

```js
const result = await sonos.RenderingControlService.SetVolumeDB({ InstanceID:..., Channel:..., DesiredVolume:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be 0 |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |
| **DesiredVolume** | `number` |  |

This actions returns a boolean whether or not the requests succeeded.

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
