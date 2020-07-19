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

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentMute** | `boolean` |  |

### GetGroupVolume

Get the average group volume

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentVolume** | `number` |  |

### SetGroupMute

(Un-/)Mute the entire group

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **DesiredMute** | `boolean` | True for mute, false for unmute |

### SetGroupVolume

Change group volume, players will be changed proportionally

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **DesiredVolume** | `number` | New volume |

### SetRelativeGroupVolume

Relativly change group volume

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Adjustment** | `number` | number between -100 / +100 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **NewVolume** | `number` |  |

### SnapshotGroupVolume

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

## GroupRenderingControlService event

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.GroupRenderingControlService.Events('serviceEvent', (data) => {
  console.log(data);
});
```

The **GroupRenderingControlService** emits events with these properties. Not all properties are emitted everytime.

| parameter | type |
|:----------|:-----|
| **GroupMute** | `boolean` |
| **GroupVolume** | `number` |
| **GroupVolumeChangeable** | `boolean` |
