---
layout: default
title: ContentDirectory
parent: Services
grand_parent: Sonos device
---
# ContentDirectory service
{: .no_toc }

Browse for local content

The ContentDirectory service is available on these models: `v2-S1` / `v2-S13` / `v2-S14` / `v2-S18` / `v2-S21` / `v2-S27` / `v2-S3` / `v2-S6` / `v2-S9` / `v2-Sub`.

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.ContentDirectoryService.OneOfTheMethodsBelow({...})
```

All actions that require input expect an object with the specified parameters, even if it only requires one parameter.

1. TOC
{:toc}

---

### Browse

Browse for content: Music library (A), share(S:), Sonos playlists(SQ:), Sonos favorites(FV:2), radio stations(R:0/0), radio shows(R:0/1). Recommendation: Send one request, check the &#x60;TotalMatches&#x60; and - if necessary - do additional requests with higher &#x60;StartingIndex&#x60;. In case of duplicates only the first is returned! Example: albums with same title, even if artists are different

```js
const result = await sonos.ContentDirectoryService.Browse({ ObjectID:..., BrowseFlag:..., Filter:..., StartingIndex:..., RequestedCount:..., SortCriteria:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` | The search query, (`A:ARTIST` / `A:ALBUMARTIST` / `A:ALBUM` / `A:GENRE` / `A:COMPOSER` / `A:TRACKS` / `A:PLAYLISTS` / `S:` / `SQ:` / `FV:2` / `R:0/0` / `R:0/1`) with optionally `:search+query` behind it. |
| **BrowseFlag** | `string` | How to browse Allowed values: `BrowseMetadata` / `BrowseDirectChildren` |
| **Filter** | `string` | Which fields should be returned `*` for all. |
| **StartingIndex** | `number` | Paging, where to start, usually 0 |
| **RequestedCount** | `number` | Paging, number of items, maximum is 1,000. This parameter does NOT restrict the number of items being searched (filter) but only the number being returned.  |
| **SortCriteria** | `string` | Sort the results based on metadata fields. `+upnp:artist,+dc:title` for sorting on artist then on title. |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **Result** | `string` | Encoded DIDL-Lite XML. See remark (2) |
| **NumberReturned** | `number` |  |
| **TotalMatches** | `number` |  |
| **UpdateID** | `number` |  |

**Remarks** (1) If the title contains an apostrophe the returned uri will contain a `&apos;`. (2) Some libraries support a BrowseAndParse, so you don't have to parse the xml.

### CreateObject

```js
const result = await sonos.ContentDirectoryService.CreateObject({ ContainerID:..., Elements:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ContainerID** | `string` |  |
| **Elements** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |
| **Result** | `string` |  |

### DestroyObject

```js
const result = await sonos.ContentDirectoryService.DestroyObject({ ObjectID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### FindPrefix

```js
const result = await sonos.ContentDirectoryService.FindPrefix({ ObjectID:..., Prefix:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |
| **Prefix** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **StartingIndex** | `number` |  |
| **UpdateID** | `number` |  |

### GetAlbumArtistDisplayOption

```js
const result = await sonos.ContentDirectoryService.GetAlbumArtistDisplayOption();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **AlbumArtistDisplayOption** | `string` |  |

### GetAllPrefixLocations

```js
const result = await sonos.ContentDirectoryService.GetAllPrefixLocations({ ObjectID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **TotalPrefixes** | `number` |  |
| **PrefixAndIndexCSV** | `string` |  |
| **UpdateID** | `number` |  |

### GetBrowseable

```js
const result = await sonos.ContentDirectoryService.GetBrowseable();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **IsBrowseable** | `boolean` |  |

### GetLastIndexChange

```js
const result = await sonos.ContentDirectoryService.GetLastIndexChange();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **LastIndexChange** | `string` |  |

### GetSearchCapabilities

```js
const result = await sonos.ContentDirectoryService.GetSearchCapabilities();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **SearchCaps** | `string` |  |

### GetShareIndexInProgress

```js
const result = await sonos.ContentDirectoryService.GetShareIndexInProgress();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **IsIndexing** | `boolean` |  |

### GetSortCapabilities

```js
const result = await sonos.ContentDirectoryService.GetSortCapabilities();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **SortCaps** | `string` |  |

### GetSystemUpdateID

```js
const result = await sonos.ContentDirectoryService.GetSystemUpdateID();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **Id** | `number` |  |

### RefreshShareIndex

```js
const result = await sonos.ContentDirectoryService.RefreshShareIndex({ AlbumArtistDisplayOption:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **AlbumArtistDisplayOption** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### RequestResort

```js
const result = await sonos.ContentDirectoryService.RequestResort({ SortOrder:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **SortOrder** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetBrowseable

```js
const result = await sonos.ContentDirectoryService.SetBrowseable({ Browseable:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **Browseable** | `boolean` |  |

This actions returns a boolean whether or not the requests succeeded.

### UpdateObject

```js
const result = await sonos.ContentDirectoryService.UpdateObject({ ObjectID:..., CurrentTagValue:..., NewTagValue:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |
| **CurrentTagValue** | `string` |  |
| **NewTagValue** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

## ContentDirectoryService event

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.ContentDirectoryService.Events('serviceEvent', (data) => {
  console.log(data);
});
```

The **ContentDirectoryService** emits events with these properties. Not all properties are emitted every time.

| parameter | type | possible values |
|:----------|:-----|:----------------|
| **Browseable** | `boolean` |  | 
| **ContainerUpdateIDs** | `string` |  | 
| **FavoritePresetsUpdateID** | `string` |  | 
| **FavoritesUpdateID** | `string` |  | 
| **RadioFavoritesUpdateID** | `number` |  | 
| **RadioLocationUpdateID** | `number` |  | 
| **RecentlyPlayedUpdateID** | `string` |  | 
| **SavedQueuesUpdateID** | `string` |  | 
| **SearchCapabilities** | `string` |  | 
| **ShareIndexInProgress** | `boolean` |  | 
| **ShareIndexLastError** | `string` |  | 
| **ShareListUpdateID** | `string` |  | 
| **SortCapabilities** | `string` |  | 
| **SystemUpdateID** | `number` |  | 
| **UserRadioUpdateID** | `string` |  | 

This file is automatically generated with [@svrooij/sonos-docs](https://github.com/svrooij/sonos-api-docs/tree/main/generator/sonos-docs), do not edit manually.
