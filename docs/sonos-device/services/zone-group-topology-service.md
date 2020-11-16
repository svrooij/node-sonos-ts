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

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **UpdateURL** | `string` |  |
| **Flags** | `number` |  |
| **ExtraOptions** | `string` |  |

### CheckForUpdate

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **UpdateType** | `string` |  |
| **CachedOnly** | `boolean` |  |
| **Version** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **UpdateItem** | `string` |  |

### GetZoneGroupAttributes

Get information about the current Zone

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentZoneGroupName** | `string` |  |
| **CurrentZoneGroupID** | `string` |  |
| **CurrentZonePlayerUUIDsInGroup** | `string` |  |
| **CurrentMuseHouseholdId** | `string` |  |

### GetZoneGroupState

Get all the Sonos groups, (as XML), see GetParsedZoneGroupState

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **ZoneGroupState** | `string` |  |

### RegisterMobileDevice

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **MobileDeviceName** | `string` |  |
| **MobileDeviceUDN** | `string` |  |
| **MobileIPAndPort** | `string` |  |

### ReportAlarmStartedRunning

No input parameters

### ReportUnresponsiveDevice

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **DeviceUUID** | `string` |  |
| **DesiredAction** | `string` |  |

### SubmitDiagnostics

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **IncludeControllers** | `boolean` |  |
| **Type** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **DiagnosticID** | `number` |  |

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
| **ZoneGroupState** | `Array<ZoneGroup>` |
| **ZonePlayerUUIDsInGroup** | `string` |
