# Sonos device

You'll need to get an instance of the **SonosDevice** by one of the following methods.

## Sonos Manager

This library has SonosManager, it does auto discovery and allows you to use all the group features. It uses an event handler to track all the changes in groups.

```JavaScript
const SonosManager = require('@svrooij/sonos').SonosManager
const manager = new SonosManager()
manager.InitializeWithDiscovery(10) // Search for all devices in your network, for max 10 seconds.
  .then(console.log)
  .then(() => {
    manager.Devices.forEach(d => console.log('Device %s (%s) is joined in %s', d.Name, d.uuid, d.GroupName))
  })
  .catch(console.error)
```

Auto-discovery might not always work. If your sonos speakers are in a differant network or you're using docker for your app. You can still use the manager but you have to set an IP of one of the players.

```JavaScript
const SonosManager = require('@svrooij/sonos').SonosManager
const manager = new SonosManager()
manager.InitializeFromDevice(process.env.SONOS_HOST || '192.168.96.56')
  .then(console.log)
  .then(() => {
    manager.Devices.forEach(d => console.log('Device %s (%s) is joined in %s', d.Name, d.uuid, d.GroupName))
  })
  .catch(console.error)
```

## Single device

If you don't need the manager you can also initialize a single speaker.

```JavaScript
const SonosDevice = require('@svrooij/sonos').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')
sonos.LoadDeviceData()
  .then(success => {
    console.log(sonos.Name)
  })
  .catch(console.error)
```
