---
layout: default
title: VirtualLineInService
parent: Services
grand_parent: Sonos device
---
# VirtualLineInService
{: .no_toc }

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.VirtualLineInService.OneOfTheMethodsBelow({...})
```

All methods that require input expect an object with the specified parameters, even if it only requires one parameter.

1. TOC
{:toc}

---

### Next

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### Pause

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### Play

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **Speed** | `string` |  |

### Previous

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### SetVolume

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **DesiredVolume** | `number` |  |

### StartTransmission

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **CoordinatorID** | `string` |  |

### Stop

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### StopTransmission

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **CoordinatorID** | `string` |  |

