---
layout: default
title: RenderingControlService
parent: Services
grand_parent: Sonos device
---
# RenderingControlService
{: .no_toc }

Volume related controls

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
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentBass** | `number` |  |

### GetEQ

Get EQ value (see SetEQ) for different EQTypes - not supported by all devices (is TV related)

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **EQType** | `string` | EQ type such as DialogLevel, NightMode, SubGain |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentValue** | `number` |  |

### GetHeadphoneConnected

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentHeadphoneConnected** | `boolean` |  |

### GetLoudness

Get loudness 1 for on, 0 for off

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Channel** | `string` | Master |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentLoudness** | `boolean` |  |

### GetMute

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Channel** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentMute** | `boolean` |  |

### GetOutputFixed

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentFixed** | `boolean` |  |

### GetRoomCalibrationStatus

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **RoomCalibrationEnabled** | `boolean` |  |
| **RoomCalibrationAvailable** | `boolean` |  |

### GetSupportsOutputFixed

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentSupportsFixed** | `boolean` |  |

### GetTreble

Get treble between -10 and 10

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentTreble** | `number` |  |

### GetVolume

Get volume between 0 and 100

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Channel** | `string` | Master |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentVolume** | `number` |  |

### GetVolumeDB

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Channel** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentVolume** | `number` |  |

### GetVolumeDBRange

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Channel** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **MinValue** | `number` |  |
| **MaxValue** | `number` |  |

### RampToVolume

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Channel** | `string` |  |
| **RampType** | `string` |  |
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
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

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
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **EQType** | `string` |  |

### RestoreVolumePriorToRamp

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Channel** | `string` |  |

### SetBass

Set bass level

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **DesiredBass** | `number` | between -10 and 10 |

### SetChannelMap

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **ChannelMap** | `string` |  |

### SetEQ

Set EQ value for different types - not supported by all devices (is TV related)

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **EQType** | `string` | DialogLevel, NightMode, SubGain |
| **DesiredValue** | `number` | DialogLevel and NightMode: 0 for off, 1 for on. SubGain between -10 and 10 |

### SetLoudness

Set loudness on / off

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Channel** | `string` |  |
| **DesiredLoudness** | `boolean` | true for on |

### SetMute

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Channel** | `string` |  |
| **DesiredMute** | `boolean` |  |

### SetOutputFixed

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **DesiredFixed** | `boolean` |  |

### SetRelativeVolume

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Channel** | `string` |  |
| **Adjustment** | `number` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **NewVolume** | `number` |  |

### SetRoomCalibrationStatus

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **RoomCalibrationEnabled** | `boolean` |  |

### SetRoomCalibrationX

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **CalibrationID** | `string` |  |
| **Coefficients** | `string` |  |
| **CalibrationMode** | `string` |  |

### SetTreble

Set treble level

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **DesiredTreble** | `number` | between -10 and 10 |

### SetVolume

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Channel** | `string` |  |
| **DesiredVolume** | `number` |  |

### SetVolumeDB

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Channel** | `string` |  |
| **DesiredVolume** | `number` |  |

## RenderingControlService event

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.RenderingControlService.Events('serviceEvent', (data) => {
  console.log(data);
});
```

The **RenderingControlService** emits events with these properties. Not all properties are emitted everytime.

| parameter | type |
|:----------|:-----|
| **AudioDelay** | `string` |
| **AudioDelayLeftRear** | `string` |
| **AudioDelayRightRear** | `string` |
| **Bass** | `number` |
| **DialogLevel** | `string` |
| **EQValue** | `number` |
| **HeadphoneConnected** | `boolean` |
| **LastChange** | `string` |
| **Loudness** | `boolean` |
| **MusicSurroundLevel** | `string` |
| **Mute** | `ChannelValue<boolean>` |
| **NightMode** | `boolean` |
| **OutputFixed** | `boolean` |
| **PresetNameList** | `string` |
| **RoomCalibrationAvailable** | `boolean` |
| **RoomCalibrationCalibrationMode** | `string` |
| **RoomCalibrationCoefficients** | `string` |
| **RoomCalibrationEnabled** | `boolean` |
| **RoomCalibrationID** | `string` |
| **SpeakerSize** | `number` |
| **SubCrossover** | `string` |
| **SubEnabled** | `boolean` |
| **SubGain** | `string` |
| **SubPolarity** | `string` |
| **SupportsOutputFixed** | `boolean` |
| **SurroundEnabled** | `boolean` |
| **SurroundLevel** | `string` |
| **SurroundMode** | `string` |
| **Treble** | `number` |
| **Volume** | `ChannelValue<number>` |
| **VolumeDB** | `number` |
