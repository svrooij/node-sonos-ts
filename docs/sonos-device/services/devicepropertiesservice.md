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

## DevicePropertiesService event

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.DevicePropertiesService.Events('serviceEvent', (data) => {
  console.log(data);
});
```

The **DevicePropertiesService** emits events with these properties. Not all properties are emitted everytime.

| parameter | type |
|:----------|:-----|
| **AirPlayEnabled** | `boolean` |
| **AutoplayIncludeLinkedZones** | `boolean` |
| **AutoplayRoomUUID** | `string` |
| **AutoplaySource** | `string` |
| **AutoplayUseVolume** | `boolean` |
| **AutoplayVolume** | `number` |
| **AvailableRoomCalibration** | `string` |
| **BehindWifiExtender** | `number` |
| **ButtonLockState** | `string` |
| **ChannelFreq** | `number` |
| **ChannelMapSet** | `string` |
| **ConfigMode** | `string` |
| **Configuration** | `string` |
| **CopyrightInfo** | `string` |
| **DisplaySoftwareVersion** | `string` |
| **ExtraInfo** | `string` |
| **Flags** | `number` |
| **HTAudioIn** | `number` |
| **HTBondedZoneCommitState** | `number` |
| **HTFreq** | `number` |
| **HTSatChanMapSet** | `string` |
| **HardwareVersion** | `string` |
| **HasConfiguredSSID** | `boolean` |
| **HdmiCecAvailable** | `boolean` |
| **HouseholdID** | `string` |
| **IPAddress** | `string` |
| **Icon** | `string` |
| **Invisible** | `boolean` |
| **IsIdle** | `boolean` |
| **IsZoneBridge** | `boolean` |
| **KeepGrouped** | `boolean` |
| **LEDState** | `string` |
| **LastChangedPlayState** | `string` |
| **MACAddress** | `string` |
| **MicEnabled** | `number` |
| **MoreInfo** | `string` |
| **Orientation** | `number` |
| **RoomCalibrationState** | `number` |
| **SatRoomUUID** | `string` |
| **SecureRegState** | `number` |
| **SerialNumber** | `string` |
| **SettingsReplicationState** | `string` |
| **SoftwareVersion** | `string` |
| **SupportsAudioClip** | `boolean` |
| **SupportsAudioIn** | `boolean` |
| **TVConfigurationError** | `boolean` |
| **VoiceConfigState** | `number` |
| **WifiEnabled** | `boolean` |
| **WirelessLeafOnly** | `boolean` |
| **WirelessMode** | `number` |
| **ZoneName** | `string` |
