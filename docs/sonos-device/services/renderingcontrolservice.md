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

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentBass** | `number` |  |

### GetEQ

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **EQType** | `string` |  |

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

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Channel** | `string` |  |

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

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentTreble** | `number` |  |

### GetVolume

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Channel** | `string` |  |

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

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **DesiredBass** | `number` |  |

### SetChannelMap

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **ChannelMap** | `string` |  |

### SetEQ

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **EQType** | `string` |  |
| **DesiredValue** | `number` |  |

### SetLoudness

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Channel** | `string` |  |
| **DesiredLoudness** | `boolean` |  |

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

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **DesiredTreble** | `number` |  |

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
