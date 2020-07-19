---
layout: default
title: MusicServicesService
parent: Services
grand_parent: Sonos device
---
# MusicServicesService
{: .no_toc }

External music services

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.MusicServicesService.OneOfTheMethodsBelow({...})
```

All methods that require input expect an object with the specified parameters, even if it only requires one parameter.

1. TOC
{:toc}

---

### GetSessionId

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **ServiceId** | `number` |  |
| **Username** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **SessionId** | `string` |  |

### ListAvailableServices

Load music service list (xml), see ListAndParseAvailableServices() for parsed version.

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **AvailableServiceDescriptorList** | `string` |  |
| **AvailableServiceTypeList** | `string` |  |
| **AvailableServiceListVersion** | `string` |  |

### UpdateAvailableServices

No input parameters

## MusicServicesService event

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.MusicServicesService.Events('serviceEvent', (data) => {
  console.log(data);
});
```

The **MusicServicesService** emits events with these properties. Not all properties are emitted everytime.

| parameter | type |
|:----------|:-----|
| **ServiceId** | `number` |
| **ServiceListVersion** | `string` |
| **SessionId** | `string` |
| **Username** | `string` |
