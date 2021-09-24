---
layout: default
title: Getting started
nav_order: 2
---

# Getting started
{: .no_toc }

Using this library is really easy.

1. TOC
{:toc}

---

## Add the library to your project

`npm install --save @svrooij/sonos`

## Use Sonos manager

This library is developed with Sonos groups in mind. We created a **SonosManager** to discover all known groups and keep track of changes to them.

```js
const SonosManager = require('@svrooij/sonos').SonosManager
const manager = new SonosManager()
manager.InitializeWithDiscovery(10)
  .then(console.log)
  .then(() => {
    manager.Devices.forEach(d => console.log('Device %s (%s) is joined in %s', d.Name, d.uuid, d.GroupName))
  })
  .catch(console.error)
```

In some network situations (or Docker usage) SSDP won't work, but you can also start the manager if you know one (static) IP of a single speaker.

```js
const SonosManager = require('@svrooij/sonos').SonosManager
const manager = new SonosManager()
manager.InitializeFromDevice(process.env.SONOS_HOST || '192.168.96.56')
  .then(console.log)
  .then(() => {
    manager.Devices.forEach(d => console.log('Device %s (%s) is joined in %s', d.Name, d.uuid, d.GroupName))
  })
  .catch(console.error)
```

### or control single device

If you just want to control a single device and don't want to use the SonosManager, you can also create a instance of **SonosDevice**, but you'll be missing the group options.

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')
sonos.LoadDeviceData()
  .then(success => {
    console.log(sonos.Name)
  })
  .catch(console.error)
```

## Debugging issues

This library uses the [debug](https://www.npmjs.com/package/debug) library. If you want a lot more information about what is happening you can turn on all debug messages by setting the environment variable `DEBUG` to `sonos:*`.

All logging information might be a bit overkill, it you set `DEBUG` to `sonos:eventListener` you will only receive log information from the event listener.

| Debug setting | What is logged |
|---------------|----------------|
| `sonos:*` | Everything is logged to the console |
| `sonos:eventListener` | Messages about the event listener |
| `sonos:metadata` | Messages about the MetaDataHelper |
| `sonos:service:*` | All services logs will be emitted |
| `sonos:service:{serviceName}:*` | All logs about a specific service will be emitted |
| `sonos:service:{serviceName}:{ip}` | All messages for a specific service for a specific speaker. |

Check out the debug library for more configuration options. You can also combine several instructions with a `,` or just remove a specif event with `-` in front.
