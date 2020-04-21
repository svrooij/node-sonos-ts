---
layout: default
title: ZoneGroupTopologyService
parent: Services
grand_parent: Sonos device
---
# ZoneGroupTopologyService
{: .no_toc }

Zone config stuff, eg getting all the configured sonos zones.

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.ZoneGroupTopologyService.OneOfTheMethodsBelow({...})
```

All methods that require input expect an object with the specified parameters, even if it only requires one parameter.

1. TOC
{:toc}

---

### BeginSoftwareUpdate

| parameter | type | description |
|:----------|:-----|:------------|
| **UpdateURL** | `string` |  |
| **Flags** | `number` |  |
| **ExtraOptions** | `string` |  |

### CheckForUpdate

| parameter | type | description |
|:----------|:-----|:------------|
| **UpdateType** | `string` |  |
| **CachedOnly** | `boolean` |  |
| **Version** | `string` |  |

### GetZoneGroupAttributes

Get information about the current Zone

No parameters

### GetZoneGroupState

Get all the Sonos groups, (as XML), see GetParsedZoneGroupState

No parameters

### RegisterMobileDevice

| parameter | type | description |
|:----------|:-----|:------------|
| **MobileDeviceName** | `string` |  |
| **MobileDeviceUDN** | `string` |  |
| **MobileIPAndPort** | `string` |  |

### ReportAlarmStartedRunning

No parameters

### ReportUnresponsiveDevice

| parameter | type | description |
|:----------|:-----|:------------|
| **DeviceUUID** | `string` |  |
| **DesiredAction** | `string` |  |

### SubmitDiagnostics

| parameter | type | description |
|:----------|:-----|:------------|
| **IncludeControllers** | `boolean` |  |
| **Type** | `string` |  |

## ZoneGroupTopologyService event

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.ZoneGroupTopologyService.Events('serviceEvent', (data) => {
  console.log(data);
});
```

The **ZoneGroupTopologyService** emits events with these properties. Not all properties are emitted everytime.

| parameter | type |
|:----------|:-----|
| **AlarmRunSequence** | `string` |
| **AreasUpdateID** | `string` |
| **AvailableSoftwareUpdate** | `any` |
| **DiagnosticID** | `number` |
| **MuseHouseholdId** | `string` |
| **NetsettingsUpdateID** | `string` |
| **SourceAreasUpdateID** | `string` |
| **ThirdPartyMediaServersX** | `string` |
| **ZoneGroupID** | `string` |
| **ZoneGroupName** | `string` |
| **ZoneGroupState** | `Array&lt;ZoneGroup&gt;` |
| **ZonePlayerUUIDsInGroup** | `string` |
