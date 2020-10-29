---
layout: default
title: GroupRenderingControlService
parent: Services
grand_parent: Sonos device
---
# GroupRenderingControlService
{: .no_toc }

Volume related controls for groups. Group volume is the average volume of all players. Snapshot stores the volume ratio between players.

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

Get 1 for muted, 0 for un-muted

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentMute** | `boolean` |  |

**Remarks** Send to non-coordinator returns error code 701

### GetGroupVolume

Get the group volume.

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentVolume** | `number` |  |

**Remarks** Send to non-coordinator returns error code 701

### SetGroupMute

(Un-/)Mute the entire group

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **DesiredMute** | `boolean` | True for mute, false for un-mute |

**Remarks** Send to non-coordinator returns error code 701

### SetGroupVolume

Change group volume. Players volume will be changed proportionally based on last snapshot

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **DesiredVolume** | `number` | New volume between 0 and 100 |

**Remarks** Send to non-coordinator returns error code 701

### SetRelativeGroupVolume

Relatively change group volume - returns final group volume. Players volume will be changed proportionally based on last snapshot

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |
| **Adjustment** | `number` | Number between -100 and +100 |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **NewVolume** | `number` |  |

**Remarks** Send to non-coordinator returns error code 701

### SnapshotGroupVolume

Creates a new group volume snapshot,  the volume ratio between all players. It is used by SetGroupVolume and SetRelativeGroupVolume

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | Sonos only serves one Instance always set to 0 |

**Remarks** Send to non-coordinator returns error code 701

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
