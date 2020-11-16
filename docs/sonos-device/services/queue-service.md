---
layout: default
title: QueueService
parent: Services
grand_parent: Sonos device
---
# QueueService
{: .no_toc }

Modify and browse queues

The QueueService is available on these models: `v1-S1` / `v1-S5` / `v1-S9`.

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

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **UpdateID** | `number` |  |
| **ContainerURI** | `string` |  |
| **ContainerMetaData** | `Track | string` |  |
| **DesiredFirstTrackNumberEnqueued** | `number` |  |
| **EnqueueAsNext** | `boolean` |  |
| **NumberOfURIs** | `number` |  |
| **EnqueuedURIsAndMetaData** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **FirstTrackNumberEnqueued** | `number` |  |
| **NumTracksAdded** | `number` |  |
| **NewQueueLength** | `number` |  |
| **NewUpdateID** | `number` |  |

### AddURI

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **UpdateID** | `number` |  |
| **EnqueuedURI** | `string` |  |
| **EnqueuedURIMetaData** | `Track | string` |  |
| **DesiredFirstTrackNumberEnqueued** | `number` |  |
| **EnqueueAsNext** | `boolean` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **FirstTrackNumberEnqueued** | `number` |  |
| **NumTracksAdded** | `number` |  |
| **NewQueueLength** | `number` |  |
| **NewUpdateID** | `number` |  |

### AttachQueue

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueOwnerID** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **QueueOwnerContext** | `string` |  |

### Backup

No input parameters

### Browse

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **StartingIndex** | `number` |  |
| **RequestedCount** | `number` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **Result** | `string` |  |
| **NumberReturned** | `number` |  |
| **TotalMatches** | `number` |  |
| **UpdateID** | `number` |  |

### CreateQueue

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueOwnerID** | `string` |  |
| **QueueOwnerContext** | `string` |  |
| **QueuePolicy** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |

### RemoveAllTracks

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **UpdateID** | `number` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **NewUpdateID** | `number` |  |

### RemoveTrackRange

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **UpdateID** | `number` |  |
| **StartingIndex** | `number` |  |
| **NumberOfTracks** | `number` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **NewUpdateID** | `number` |  |

### ReorderTracks

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **StartingIndex** | `number` |  |
| **NumberOfTracks** | `number` |  |
| **InsertBefore** | `number` |  |
| **UpdateID** | `number` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **NewUpdateID** | `number` |  |

### ReplaceAllTracks

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **UpdateID** | `number` |  |
| **ContainerURI** | `string` |  |
| **ContainerMetaData** | `Track | string` |  |
| **CurrentTrackIndex** | `number` |  |
| **NewCurrentTrackIndices** | `string` |  |
| **NumberOfURIs** | `number` |  |
| **EnqueuedURIsAndMetaData** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **NewQueueLength** | `number` |  |
| **NewUpdateID** | `number` |  |

### SaveAsSonosPlaylist

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **Title** | `string` |  |
| **ObjectID** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **AssignedObjectID** | `string` |  |

## QueueService event

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.QueueService.Events('serviceEvent', (data) => {
  console.log(data);
});
```

The **QueueService** emits events with these properties. Not all properties are emitted every time.

| parameter | type | possible values |
|:----------|:-----|:----------------|
| **Curated** | `boolean` |  | 
| **LastChange** | `string` |  | 
| **UpdateID** | `number` |  | 

This file is automatically generated with [@svrooij/sonos-docs](https://github.com/svrooij/sonos-api-docs/tree/main/generator/sonos-docs), do not edit manually.
