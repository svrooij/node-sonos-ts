---
layout: default
title: ConnectionManagerService
parent: Services
grand_parent: Sonos device
---
# ConnectionManagerService
{: .no_toc }

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.ConnectionManagerService.OneOfTheMethodsBelow({...})
```

All methods that require input expect an object with the specified parameters, even if it only requires one parameter.

1. TOC
{:toc}

---

### GetCurrentConnectionIDs

No parameters

### GetCurrentConnectionInfo

| parameter | type | description |
|:----------|:-----|:------------|
| **ConnectionID** | `number` |  |

### GetProtocolInfo

No parameters

