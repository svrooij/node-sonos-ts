---
layout: default
title: SystemPropertiesService
parent: Services
grand_parent: Sonos device
---
# SystemPropertiesService
{: .no_toc }

Manage system-wide settings, mainly account stuff.

The SystemPropertiesService is available on these models: `v1-S1` / `v1-S5` / `v1-S9`.

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

Get a saved string.

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **VariableName** | `string` | The key for this variable |

Output:

| parameter | type | description |
|:----------|:-----|:------------|
| **StringValue** | `string` |  |

**Remarks** Strings are saved in the system with SetString, every speaker should send the same data. Will error when not existing

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

Remove a saved string

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **VariableName** | `string` | The key for this variable |

**Remarks** Not sure what happens if you call this with a VariableName that doesn&#x27;t exists.

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

Save a string in the system

Input:

| parameter | type | description |
|:----------|:-----|:------------|
| **VariableName** | `string` | The key for this variable, use something unique |
| **StringValue** | `string` |  |

**Remarks** Strings are saved in the system, retrieve values with GetString.

## SystemPropertiesService event

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
sonos.SystemPropertiesService.Events('serviceEvent', (data) => {
  console.log(data);
});
```

The **SystemPropertiesService** emits events with these properties. Not all properties are emitted every time.

| parameter | type | possible values |
|:----------|:-----|:----------------|
| **CustomerID** | `string` |  | 
| **ThirdPartyHash** | `string` |  | 
| **UpdateID** | `number` |  | 
| **UpdateIDX** | `number` |  | 
| **VoiceUpdateID** | `number` |  | 

This file is automatically generated with [@svrooij/sonos-docs](https://github.com/svrooij/sonos-api-docs/tree/main/generator/sonos-docs), do not edit manually.
