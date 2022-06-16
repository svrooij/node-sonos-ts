---
layout: default
title: Queue
parent: Services
grand_parent: Sonos device
---
# Queue service
{: .no_toc }

Modify and browse queues

The Queue service is available on these models: `v1-S1` / `v1-S5` / `v1-S9` / `v2-S13` / `v2-S14` / `v2-S27` / `v2-S3` / `v2-S6` / `v2-Sub`.

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.QueueService.OneOfTheMethodsBelow({...})
```

All actions that require input expect an object with the specified parameters, even if it only requires one parameter.

1. TOC
{:toc}

---

### AddMultipleURIs

```js
const result = await sonos.QueueService.AddMultipleURIs({ QueueID:..., UpdateID:..., ContainerURI:..., ContainerMetaData:..., DesiredFirstTrackNumberEnqueued:..., EnqueueAsNext:..., NumberOfURIs:..., EnqueuedURIsAndMetaData:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **UpdateID** | `number` |  |
| **ContainerURI** | `string` |  |
| **ContainerMetaData** | `Track | string` |  |
| **DesiredFirstTrackNumberEnqueued** | `number` |  |
| **EnqueueAsNext** | `boolean` |  |
| **NumberOfURIs** | `number` |  |
| **EnqueuedURIsAndMetaData** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **FirstTrackNumberEnqueued** | `number` |  |
| **NumTracksAdded** | `number` |  |
| **NewQueueLength** | `number` |  |
| **NewUpdateID** | `number` |  |

### AddURI

```js
const result = await sonos.QueueService.AddURI({ QueueID:..., UpdateID:..., EnqueuedURI:..., EnqueuedURIMetaData:..., DesiredFirstTrackNumberEnqueued:..., EnqueueAsNext:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **UpdateID** | `number` |  |
| **EnqueuedURI** | `string` |  |
| **EnqueuedURIMetaData** | `Track | string` |  |
| **DesiredFirstTrackNumberEnqueued** | `number` |  |
| **EnqueueAsNext** | `boolean` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **FirstTrackNumberEnqueued** | `number` |  |
| **NumTracksAdded** | `number` |  |
| **NewQueueLength** | `number` |  |
| **NewUpdateID** | `number` |  |

### AttachQueue

```js
const result = await sonos.QueueService.AttachQueue({ QueueOwnerID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueOwnerID** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **QueueOwnerContext** | `string` |  |

### Backup

```js
const result = await sonos.QueueService.Backup();
```

This actions returns a boolean whether or not the requests succeeded.

### Browse

```js
const result = await sonos.QueueService.Browse({ QueueID:..., StartingIndex:..., RequestedCount:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **StartingIndex** | `number` |  |
| **RequestedCount** | `number` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **Result** | `string` |  |
| **NumberReturned** | `number` |  |
| **TotalMatches** | `number` |  |
| **UpdateID** | `number` |  |

### CreateQueue

```js
const result = await sonos.QueueService.CreateQueue({ QueueOwnerID:..., QueueOwnerContext:..., QueuePolicy:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueOwnerID** | `string` |  |
| **QueueOwnerContext** | `string` |  |
| **QueuePolicy** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |

### RemoveAllTracks

```js
const result = await sonos.QueueService.RemoveAllTracks({ QueueID:..., UpdateID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **UpdateID** | `number` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **NewUpdateID** | `number` |  |

### RemoveTrackRange

```js
const result = await sonos.QueueService.RemoveTrackRange({ QueueID:..., UpdateID:..., StartingIndex:..., NumberOfTracks:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **UpdateID** | `number` |  |
| **StartingIndex** | `number` |  |
| **NumberOfTracks** | `number` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **NewUpdateID** | `number` |  |

### ReorderTracks

```js
const result = await sonos.QueueService.ReorderTracks({ QueueID:..., StartingIndex:..., NumberOfTracks:..., InsertBefore:..., UpdateID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **StartingIndex** | `number` |  |
| **NumberOfTracks** | `number` |  |
| **InsertBefore** | `number` |  |
| **UpdateID** | `number` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **NewUpdateID** | `number` |  |

### ReplaceAllTracks

```js
const result = await sonos.QueueService.ReplaceAllTracks({ QueueID:..., UpdateID:..., ContainerURI:..., ContainerMetaData:..., CurrentTrackIndex:..., NewCurrentTrackIndices:..., NumberOfURIs:..., EnqueuedURIsAndMetaData:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **UpdateID** | `number` |  |
| **ContainerURI** | `string` |  |
| **ContainerMetaData** | `Track | string` |  |
| **CurrentTrackIndex** | `number` |  |
| **NewCurrentTrackIndices** | `string` |  |
| **NumberOfURIs** | `number` |  |
| **EnqueuedURIsAndMetaData** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **NewQueueLength** | `number` |  |
| **NewUpdateID** | `number` |  |

### SaveAsSonosPlaylist

```js
const result = await sonos.QueueService.SaveAsSonosPlaylist({ QueueID:..., Title:..., ObjectID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **Title** | `string` |  |
| **ObjectID** | `string` |  |

Output object:

| property | type | description |
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
