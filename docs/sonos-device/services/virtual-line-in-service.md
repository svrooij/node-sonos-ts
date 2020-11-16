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

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

### Pause

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

### Play

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Speed** | `string` |  |

### Previous

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

### SetVolume

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **DesiredVolume** | `number` |  |

### StartTransmission

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **CoordinatorID** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentTransportSettings** | `string` |  |

### Stop

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

### StopTransmission

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **CoordinatorID** | `string` |  |

## VirtualLineInService event

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.VirtualLineInService.Events('serviceEvent', (data) => {
  console.log(data);
});
```

The **VirtualLineInService** emits events with these properties. Not all properties are emitted everytime.

| parameter | type |
|:----------|:-----|
| **AVTransportURIMetaData** | `Track` |
| **CurrentTrackMetaData** | `Track` |
| **CurrentTransportActions** | `string` |
| **EnqueuedTransportURIMetaData** | `Track` |
| **LastChange** | `string` |
