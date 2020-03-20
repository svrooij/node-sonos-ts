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

## or control single device

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
