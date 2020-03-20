---
layout: default
title: AudioInService
parent: Services
grand_parent: Sonos device
---
# AudioInService
{: .no_toc }

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.AudioInService.OneOfTheMethodsBelow({...})
```

All methods that require input expect an object with the specified parameters, even if it only requires one parameter.

1. TOC
{:toc}

---

### GetAudioInputAttributes

No parameters

### GetLineInLevel

No parameters

### SelectAudio

| parameter | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |

### SetAudioInputAttributes

| parameter | type | description |
|:----------|:-----|:------------|
| **DesiredName** | `string` |  |
| **DesiredIcon** | `string` |  |

### SetLineInLevel

| parameter | type | description |
|:----------|:-----|:------------|
| **DesiredLeftLineInLevel** | `number` |  |
| **DesiredRightLineInLevel** | `number` |  |

### StartTransmissionToGroup

| parameter | type | description |
|:----------|:-----|:------------|
| **CoordinatorID** | `string` |  |

### StopTransmissionToGroup

| parameter | type | description |
|:----------|:-----|:------------|
| **CoordinatorID** | `string` |  |

