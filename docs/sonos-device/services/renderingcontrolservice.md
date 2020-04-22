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

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### GetEQ

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **EQType** | `string` |  |

### GetHeadphoneConnected

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### GetLoudness

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **Channel** | `string` |  |

### GetMute

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **Channel** | `string` |  |

### GetOutputFixed

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### GetRoomCalibrationStatus

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### GetSupportsOutputFixed

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### GetTreble

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### GetVolume

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **Channel** | `string` |  |

### GetVolumeDB

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **Channel** | `string` |  |

### GetVolumeDBRange

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **Channel** | `string` |  |

### RampToVolume

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **Channel** | `string` |  |
| **RampType** | `string` |  |
| **DesiredVolume** | `number` |  |
| **ResetVolumeAfter** | `boolean` |  |
| **ProgramURI** | `string` |  |

### ResetBasicEQ

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### ResetExtEQ

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **EQType** | `string` |  |

### RestoreVolumePriorToRamp

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **Channel** | `string` |  |

### SetBass

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **DesiredBass** | `number` |  |

### SetChannelMap

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **ChannelMap** | `string` |  |

### SetEQ

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **EQType** | `string` |  |
| **DesiredValue** | `number` |  |

### SetLoudness

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **Channel** | `string` |  |
| **DesiredLoudness** | `boolean` |  |

### SetMute

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **Channel** | `string` |  |
| **DesiredMute** | `boolean` |  |

### SetOutputFixed

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **DesiredFixed** | `boolean` |  |

### SetRelativeVolume

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **Channel** | `string` |  |
| **Adjustment** | `number` |  |

### SetRoomCalibrationStatus

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **RoomCalibrationEnabled** | `boolean` |  |

### SetRoomCalibrationX

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **CalibrationID** | `string` |  |
| **Coefficients** | `string` |  |
| **CalibrationMode** | `string` |  |

### SetTreble

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **DesiredTreble** | `number` |  |

### SetVolume

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **Channel** | `string` |  |
| **DesiredVolume** | `number` |  |

### SetVolumeDB

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
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
| **Mute** | `ChannelValue&lt;boolean&gt;` |
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
| **Volume** | `ChannelValue&lt;number&gt;` |
| **VolumeDB** | `number` |
