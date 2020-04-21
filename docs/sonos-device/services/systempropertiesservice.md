---
layout: default
title: SystemPropertiesService
parent: Services
grand_parent: Sonos device
---
# SystemPropertiesService
{: .no_toc }

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.SystemPropertiesService.OneOfTheMethodsBelow({...})
```

All methods that require input expect an object with the specified parameters, even if it only requires one parameter.

1. TOC
{:toc}

---

### AddAccountX

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |
| **AccountID** | `string` |  |
| **AccountPassword** | `string` |  |

### AddOAuthAccountX

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |
| **AccountToken** | `string` |  |
| **AccountKey** | `string` |  |
| **OAuthDeviceID** | `string` |  |
| **AuthorizationCode** | `string` |  |
| **RedirectURI** | `string` |  |
| **UserIdHashCode** | `string` |  |
| **AccountTier** | `number` |  |

### DoPostUpdateTasks

No parameters

### EditAccountMd

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |
| **AccountID** | `string` |  |
| **NewAccountMd** | `string` |  |

### EditAccountPasswordX

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |
| **AccountID** | `string` |  |
| **NewAccountPassword** | `string` |  |

### EnableRDM

| parameter | type | description |
|:----------|:-----|:------------|
| **RDMValue** | `boolean` |  |

### GetRDM

No parameters

### GetString

| parameter | type | description |
|:----------|:-----|:------------|
| **VariableName** | `string` |  |

### GetWebCode

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |

### ProvisionCredentialedTrialAccountX

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |
| **AccountID** | `string` |  |
| **AccountPassword** | `string` |  |

### RefreshAccountCredentialsX

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |
| **AccountUID** | `number` |  |
| **AccountToken** | `string` |  |
| **AccountKey** | `string` |  |

### Remove

| parameter | type | description |
|:----------|:-----|:------------|
| **VariableName** | `string` |  |

### RemoveAccount

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |
| **AccountID** | `string` |  |

### ReplaceAccountX

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountUDN** | `string` |  |
| **NewAccountID** | `string` |  |
| **NewAccountPassword** | `string` |  |
| **AccountToken** | `string` |  |
| **AccountKey** | `string` |  |
| **OAuthDeviceID** | `string` |  |

### ResetThirdPartyCredentials

No parameters

### SetAccountNicknameX

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountUDN** | `string` |  |
| **AccountNickname** | `string` |  |

### SetString

| parameter | type | description |
|:----------|:-----|:------------|
| **VariableName** | `string` |  |
| **StringValue** | `string` |  |

## SystemPropertiesService event

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.SystemPropertiesService.Events('serviceEvent', (data) => {
  console.log(data);
});
```

The **SystemPropertiesService** emits events with these properties. Not all properties are emitted everytime.

| parameter | type |
|:----------|:-----|
| **CustomerID** | `string` |
| **ThirdPartyHash** | `string` |
| **UpdateID** | `number` |
| **UpdateIDX** | `number` |
| **VoiceUpdateID** | `number` |
