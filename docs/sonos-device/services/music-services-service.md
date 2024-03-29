---
layout: default
title: MusicServices
parent: Services
grand_parent: Sonos device
---
# MusicServices service
{: .no_toc }

Access to external music services, like Spotify or Youtube Music

The MusicServices service is available on these models: `v1-S1` / `v1-S5` / `v1-S9` / `v2-S13` / `v2-S14` / `v2-S27` / `v2-S3` / `v2-S6` / `v2-Sub`.

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.MusicServicesService.OneOfTheMethodsBelow({...})
```

All actions that require input expect an object with the specified parameters, even if it only requires one parameter.

1. TOC
{:toc}

---

### GetSessionId

```js
const result = await sonos.MusicServicesService.GetSessionId({ ServiceId:..., Username:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ServiceId** | `number` |  |
| **Username** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **SessionId** | `string` |  |

### ListAvailableServices

Load music service list as xml

```js
const result = await sonos.MusicServicesService.ListAvailableServices();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **AvailableServiceDescriptorList** | `string` |  |
| **AvailableServiceTypeList** | `string` |  |
| **AvailableServiceListVersion** | `string` |  |

**Remarks** Some libraries also support ListAndParseAvailableServices

### UpdateAvailableServices

```js
const result = await sonos.MusicServicesService.UpdateAvailableServices();
```

This actions returns a boolean whether or not the requests succeeded.

## MusicServicesService event

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.MusicServicesService.Events('serviceEvent', (data) => {
  console.log(data);
});
```

The **MusicServicesService** emits events with these properties. Not all properties are emitted every time.

| parameter | type | possible values |
|:----------|:-----|:----------------|
| **ServiceId** | `number` |  | 
| **ServiceListVersion** | `string` |  | 
| **SessionId** | `string` |  | 
| **Username** | `string` |  | 

This file is automatically generated with [@svrooij/sonos-docs](https://github.com/svrooij/sonos-api-docs/tree/main/generator/sonos-docs), do not edit manually.
