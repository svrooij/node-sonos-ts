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

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` | The search query, ['A:ARTIST','A:ALBUMARTIST','A:ALBUM','A:GENRE','A:COMPOSER','A:TRACKS','A:PLAYLISTS'] with optionally ':search+query' behind it. |
| **BrowseFlag** | `string` | How to browse |
| **Filter** | `string` | Which fields should be returned '*' for all. |
| **StartingIndex** | `number` | Paging, where to start |
| **RequestedCount** | `number` | Paging, number of items |
| **SortCriteria** | `string` | Sort the results based on metadata fields. '+upnp:artist,+dc:title' for sorting on artist then on title. |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **Result** | `string` |  |
| **NumberReturned** | `number` |  |
| **TotalMatches** | `number` |  |
| **UpdateID** | `number` |  |

### CreateObject

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **ContainerID** | `string` |  |
| **Elements** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |
| **Result** | `string` |  |

### DestroyObject

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |

### FindPrefix

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |
| **Prefix** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **StartingIndex** | `number` |  |
| **UpdateID** | `number` |  |

### GetAlbumArtistDisplayOption

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **AlbumArtistDisplayOption** | `string` |  |

### GetAllPrefixLocations

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **TotalPrefixes** | `number` |  |
| **PrefixAndIndexCSV** | `string` |  |
| **UpdateID** | `number` |  |

### GetBrowseable

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **IsBrowseable** | `boolean` |  |

### GetLastIndexChange

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **LastIndexChange** | `string` |  |

### GetSearchCapabilities

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **SearchCaps** | `string` |  |

### GetShareIndexInProgress

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **IsIndexing** | `boolean` |  |

### GetSortCapabilities

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **SortCaps** | `string` |  |

### GetSystemUpdateID

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **Id** | `number` |  |

### RefreshShareIndex

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **AlbumArtistDisplayOption** | `string` |  |

### RequestResort

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **SortOrder** | `string` |  |

### SetBrowseable

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **Browseable** | `boolean` |  |

### UpdateObject

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |
| **CurrentTagValue** | `string` |  |
| **NewTagValue** | `string` |  |

## ContentDirectoryService event

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.ContentDirectoryService.Events('serviceEvent', (data) => {
  console.log(data);
});
```

The **ContentDirectoryService** emits events with these properties. Not all properties are emitted everytime.

| parameter | type |
|:----------|:-----|
| **Browseable** | `boolean` |
| **ContainerUpdateIDs** | `string` |
| **FavoritePresetsUpdateID** | `string` |
| **FavoritesUpdateID** | `string` |
| **RadioFavoritesUpdateID** | `number` |
| **RadioLocationUpdateID** | `number` |
| **RecentlyPlayedUpdateID** | `string` |
| **SavedQueuesUpdateID** | `string` |
| **SearchCapabilities** | `string` |
| **ShareIndexInProgress** | `boolean` |
| **ShareIndexLastError** | `string` |
| **ShareListUpdateID** | `string` |
| **SortCapabilities** | `string` |
| **SystemUpdateID** | `number` |
| **UserRadioUpdateID** | `string` |
