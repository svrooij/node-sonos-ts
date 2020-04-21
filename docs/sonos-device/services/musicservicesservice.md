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

| parameter | type | description |
|:----------|:-----|:------------|
| **ServiceId** | `number` |  |
| **Username** | `string` |  |

### ListAvailableServices

Load music service list (xml), see ListAndParseAvailableServices() for parsed version.

No parameters

### UpdateAvailableServices

No parameters

