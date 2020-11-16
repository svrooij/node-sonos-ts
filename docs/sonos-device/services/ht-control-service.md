---
layout: default
title: HTControlService
parent: Services
grand_parent: Sonos device
---
# HTControlService
{: .no_toc }

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.HTControlService.OneOfTheMethodsBelow({...})
```

All methods that require input expect an object with the specified parameters, even if it only requires one parameter.

1. TOC
{:toc}

---

### CommitLearnedIRCodes

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **Name** | `string` |  |

### GetIRRepeaterState

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **CurrentIRRepeaterState** | `string` |  |

### GetLEDFeedbackState

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **LEDFeedbackState** | `string` |  |

### IdentifyIRRemote

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **Timeout** | `number` |  |

### IsRemoteConfigured

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **RemoteConfigured** | `boolean` |  |

### LearnIRCode

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **IRCode** | `string` |  |
| **Timeout** | `number` |  |

### SetIRRepeaterState

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **DesiredIRRepeaterState** | `string` |  |

### SetLEDFeedbackState

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **LEDFeedbackState** | `string` |  |

## HTControlService event

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.HTControlService.Events('serviceEvent', (data) => {
  console.log(data);
});
```

The **HTControlService** emits events with these properties. Not all properties are emitted everytime.

| parameter | type |
|:----------|:-----|
| **IRRepeaterState** | `string` |
| **LEDFeedbackState** | `string` |
| **RemoteConfigured** | `boolean` |
| **TOSLinkConnected** | `boolean` |
