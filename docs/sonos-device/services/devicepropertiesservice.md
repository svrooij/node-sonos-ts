---
layout: default
title: DevicePropertiesService
parent: Services
grand_parent: Sonos device
---
# DevicePropertiesService
{: .no_toc }

Modify device properties, like led status and stereo pairs

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.DevicePropertiesService.OneOfTheMethodsBelow({...})
```

All methods that require input expect an object with the specified parameters, even if it only requires one parameter.

1. TOC
{:toc}

---

### AddBondedZones

| parameter | type | description |
|:----------|:-----|:------------|
| **ChannelMapSet** | `string` |  |

### AddHTSatellite

| parameter | type | description |
|:----------|:-----|:------------|
| **HTSatChanMapSet** | `string` |  |

### CreateStereoPair

| parameter | type | description |
|:----------|:-----|:------------|
| **ChannelMapSet** | `string` |  |

### EnterConfigMode

| parameter | type | description |
|:----------|:-----|:------------|
| **Mode** | `string` |  |
| **Options** | `string` |  |

### ExitConfigMode

| parameter | type | description |
|:----------|:-----|:------------|
| **Options** | `string` |  |

### GetAutoplayLinkedZones

| parameter | type | description |
|:----------|:-----|:------------|
| **Source** | `string` |  |

### GetAutoplayRoomUUID

| parameter | type | description |
|:----------|:-----|:------------|
| **Source** | `string` |  |

### GetAutoplayVolume

| parameter | type | description |
|:----------|:-----|:------------|
| **Source** | `string` |  |

### GetButtonLockState

No parameters

### GetButtonState

No parameters

### GetHouseholdID

No parameters

### GetLEDState

No parameters

### GetUseAutoplayVolume

| parameter | type | description |
|:----------|:-----|:------------|
| **Source** | `string` |  |

### GetZoneAttributes

No parameters

### GetZoneInfo

No parameters

### RemoveBondedZones

| parameter | type | description |
|:----------|:-----|:------------|
| **ChannelMapSet** | `string` |  |
| **KeepGrouped** | `boolean` |  |

### RemoveHTSatellite

| parameter | type | description |
|:----------|:-----|:------------|
| **SatRoomUUID** | `string` |  |

### SeparateStereoPair

| parameter | type | description |
|:----------|:-----|:------------|
| **ChannelMapSet** | `string` |  |

### SetAutoplayLinkedZones

| parameter | type | description |
|:----------|:-----|:------------|
| **IncludeLinkedZones** | `boolean` |  |
| **Source** | `string` |  |

### SetAutoplayRoomUUID

| parameter | type | description |
|:----------|:-----|:------------|
| **RoomUUID** | `string` |  |
| **Source** | `string` |  |

### SetAutoplayVolume

| parameter | type | description |
|:----------|:-----|:------------|
| **Volume** | `number` |  |
| **Source** | `string` |  |

### SetButtonLockState

| parameter | type | description |
|:----------|:-----|:------------|
| **DesiredButtonLockState** | `string` |  |

### SetLEDState

| parameter | type | description |
|:----------|:-----|:------------|
| **DesiredLEDState** | `string` |  |

### SetUseAutoplayVolume

| parameter | type | description |
|:----------|:-----|:------------|
| **UseVolume** | `boolean` |  |
| **Source** | `string` |  |

### SetZoneAttributes

| parameter | type | description |
|:----------|:-----|:------------|
| **DesiredZoneName** | `string` |  |
| **DesiredIcon** | `string` |  |
| **DesiredConfiguration** | `string` |  |

