---
layout: default
title: QueueService
parent: Services
grand_parent: Sonos device
---
# QueueService
{: .no_toc }

Modify and browse queues

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.QueueService.OneOfTheMethodsBelow({...})
```

All methods that require input expect an object with the specified parameters, even if it only requires one parameter.

1. TOC
{:toc}

---

### AddMultipleURIs

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **UpdateID** | `number` |  |
| **ContainerURI** | `string` |  |
| **ContainerMetaData** | `string | Track` |  |
| **DesiredFirstTrackNumberEnqueued** | `number` |  |
| **EnqueueAsNext** | `boolean` |  |
| **NumberOfURIs** | `number` |  |
| **EnqueuedURIsAndMetaData** | `string` |  |

### AddURI

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **UpdateID** | `number` |  |
| **EnqueuedURI** | `string` |  |
| **EnqueuedURIMetaData** | `string | Track` |  |
| **DesiredFirstTrackNumberEnqueued** | `number` |  |
| **EnqueueAsNext** | `boolean` |  |

### AttachQueue

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueOwnerID** | `string` |  |

### Backup

No parameters

### Browse

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **StartingIndex** | `number` |  |
| **RequestedCount** | `number` |  |

### CreateQueue

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueOwnerID** | `string` |  |
| **QueueOwnerContext** | `string` |  |
| **QueuePolicy** | `string` |  |

### RemoveAllTracks

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **UpdateID** | `number` |  |

### RemoveTrackRange

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **UpdateID** | `number` |  |
| **StartingIndex** | `number` |  |
| **NumberOfTracks** | `number` |  |

### ReorderTracks

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **StartingIndex** | `number` |  |
| **NumberOfTracks** | `number` |  |
| **InsertBefore** | `number` |  |
| **UpdateID** | `number` |  |

### ReplaceAllTracks

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **UpdateID** | `number` |  |
| **ContainerURI** | `string` |  |
| **ContainerMetaData** | `string | Track` |  |
| **CurrentTrackIndex** | `number` |  |
| **NewCurrentTrackIndices** | `string` |  |
| **NumberOfURIs** | `number` |  |
| **EnqueuedURIsAndMetaData** | `string` |  |

### SaveAsSonosPlaylist

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **Title** | `string` |  |
| **ObjectID** | `string` |  |

## QueueService event

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.QueueService.Events('serviceEvent', (data) => {
  console.log(data);
});
```

The **QueueService** emits events with these properties. Not all properties are emitted everytime.

| parameter | type |
|:----------|:-----|
| **Curated** | `boolean` |
| **LastChange** | `string` |
| **UpdateID** | `number` |
