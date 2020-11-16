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

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |
| **AccountID** | `string` |  |
| **AccountPassword** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountUDN** | `string` |  |

### AddOAuthAccountX

Input:

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

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountUDN** | `string` |  |
| **AccountNickname** | `string` |  |

### DoPostUpdateTasks

No input parameters

### EditAccountMd

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |
| **AccountID** | `string` |  |
| **NewAccountMd** | `string` |  |

### EditAccountPasswordX

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |
| **AccountID** | `string` |  |
| **NewAccountPassword** | `string` |  |

### EnableRDM

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **RDMValue** | `boolean` |  |

### GetRDM

No input parameters

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **RDMValue** | `boolean` |  |

### GetString

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **VariableName** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **StringValue** | `string` |  |

### GetWebCode

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **WebCode** | `string` |  |

### ProvisionCredentialedTrialAccountX

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |
| **AccountID** | `string` |  |
| **AccountPassword** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **IsExpired** | `boolean` |  |
| **AccountUDN** | `string` |  |

### RefreshAccountCredentialsX

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |
| **AccountUID** | `number` |  |
| **AccountToken** | `string` |  |
| **AccountKey** | `string` |  |

### Remove

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **VariableName** | `string` |  |

### RemoveAccount

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |
| **AccountID** | `string` |  |

### ReplaceAccountX

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountUDN** | `string` |  |
| **NewAccountID** | `string` |  |
| **NewAccountPassword** | `string` |  |
| **AccountToken** | `string` |  |
| **AccountKey** | `string` |  |
| **OAuthDeviceID** | `string` |  |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **NewAccountUDN** | `string` |  |

### ResetThirdPartyCredentials

No input parameters

### SetAccountNicknameX

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **AccountUDN** | `string` |  |
| **AccountNickname** | `string` |  |

### SetString

Input:

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
