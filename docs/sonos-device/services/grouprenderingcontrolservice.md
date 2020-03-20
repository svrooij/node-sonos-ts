---
layout: default
title: GroupRenderingControlService
parent: Services
grand_parent: Sonos device
---
# GroupRenderingControlService
{: .no_toc }

Volume related controls for groups

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.GroupRenderingControlService.OneOfTheMethodsBelow({...})
```

All methods that require input expect an object with the specified parameters, even if it only requires one parameter.

1. TOC
{:toc}

---

### GetGroupMute

Get if the group is muted

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### GetGroupVolume

Get the average group volume

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

### SetGroupMute

(Un-/)Mute the entire group

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **DesiredMute** | `boolean` | True for mute, false for unmute |

### SetGroupVolume

Change group volume, players will be changed proportionally

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **DesiredVolume** | `number` | New volume |

### SetRelativeGroupVolume

Relativly change group volume

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |
| **Adjustment** | `number` | number between -100 / +100 |

### SnapshotGroupVolume

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID meaning unknown, just set to 0 |

