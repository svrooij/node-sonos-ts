---
layout: default
title: ContentDirectoryService
parent: Services
grand_parent: Sonos device
---
# ContentDirectoryService
{: .no_toc }

Browse for local content

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.ContentDirectoryService.OneOfTheMethodsBelow({...})
```

All methods that require input expect an object with the specified parameters, even if it only requires one parameter.

1. TOC
{:toc}

---

### Browse

Browse for content, see BrowseParsed for a better experience.

| parameter | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` | The search query, ['A:ARTIST','A:ALBUMARTIST','A:ALBUM','A:GENRE','A:COMPOSER','A:TRACKS','A:PLAYLISTS'] with optionally ':search+query' behind it. |
| **BrowseFlag** | `string` | How to browse |
| **Filter** | `string` | Which fields should be returned '*' for all. |
| **StartingIndex** | `number` | Paging, where to start |
| **RequestedCount** | `number` | Paging, number of items |
| **SortCriteria** | `string` | Sort the results based on metadata fields. '+upnp:artist,+dc:title' for sorting on artist then on title. |

### CreateObject

| parameter | type | description |
|:----------|:-----|:------------|
| **ContainerID** | `string` |  |
| **Elements** | `string` |  |

### DestroyObject

| parameter | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |

### FindPrefix

| parameter | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |
| **Prefix** | `string` |  |

### GetAlbumArtistDisplayOption

No parameters

### GetAllPrefixLocations

| parameter | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |

### GetBrowseable

No parameters

### GetLastIndexChange

No parameters

### GetSearchCapabilities

No parameters

### GetShareIndexInProgress

No parameters

### GetSortCapabilities

No parameters

### GetSystemUpdateID

No parameters

### RefreshShareIndex

| parameter | type | description |
|:----------|:-----|:------------|
| **AlbumArtistDisplayOption** | `string` |  |

### RequestResort

| parameter | type | description |
|:----------|:-----|:------------|
| **SortOrder** | `string` |  |

### SetBrowseable

| parameter | type | description |
|:----------|:-----|:------------|
| **Browseable** | `boolean` |  |

### UpdateObject

| parameter | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |
| **CurrentTagValue** | `string` |  |
| **NewTagValue** | `string` |  |

