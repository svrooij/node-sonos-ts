# Node Sonos (the typescript version)

[![Support me on Github][badge_sponsor]][link_sponsor]

A node library to control a sonos device, written in Typescript. See [here](#improvements-over-node-sonos) why I've build it while there already is a sonos library.

## Usage

To use the library just add it to your project. `npm install @svrooij/sonos`. And start using it.

You'll need to get the **SonosDevice** by one of the methods below, then explore all the services. All the services are generated from the sonos device discovery. So everything you can do with the Sonos Application on your mobile device or computer, you can do with this library.

```node
const SonosDevice = require('@svrooij/sonos').SonosDevice

const sonosDevice = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')
sonosDevice.AVTransportService.Play({InstanceID: 0, Speed: 1}) // Start playing
sonosDevice.AVTransportService.Pause() // Pause playing
sonosDevice.AVTransportService.Next() // Go to next song
sonosDevice.AVTransportService.Previous() // Go to previous song
```

### Exposed services

```node
const SonosDevice = require('@svrooij/sonos').SonosDevice

const sonosDevice = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')
sonosDevice.AVTransportService // -> Control the playback (play, pause, next, stop)
sonosDevice.AlarmClockService // -> Control your alarms
sonosDevice.AudioInService // -> ?
sonosDevice.ConnectionManagerService // => ?
sonosDevice.ContentDirectoryService // => Control your content??
sonosDevice.DevicePropertiesService // => Change your device properties (led, SterioPair, AutoPlay)
sonosDevice.GroupManagementService // => Manage your groups (what's the differance with ZoneGroupTopologyService)
sonosDevice.GroupRenderingControlService // => RenderingControlService for groups
sonosDevice.MusicServicesService // => All your music services
sonosDevice.QPlayService // => To authorize QPlay, needs explaining
sonosDevice.QueueService // => Queue management
sonosDevice.RenderingControlService // => Rendering service is for volume eg.
sonosDevice.SystemPropertiesService // => Manage connected accounts
sonosDevice.VirtualLineInService // => ?
sonosDevice.ZoneGroupTopologyService // Zone management, used by the SonosManager to get all the groups.
```

### SonosManager - Device discovery

This library has a **SonosManager** that resolves all your sonos groups for you. The recommended way to use it is by doing device discovery.

```node
const SonosManager = require('@svrooij/sonos').SonosManager
const manager = new SonosManager()
manager.InitializeWithDiscovery(10)
  .then(console.log)
  .then(() => {
    manager.Groups.forEach(g => console.log(g.Name))
  })
  .catch(console.error)
```

### SonosManager - Single IP

In some cases device discovery doesn't work (think docker or complex networks), you can also start the manager by submitting one know sonos IP.

```node
const SonosManager = require('@svrooij/sonos').SonosManager
const manager = new SonosManager()
manager.InitializeFromDevice(process.env.SONOS_HOST || '192.168.96.56')
  .then(console.log)
  .then(() => {
    manager.Groups.forEach(g => console.log(g.Name))
  })
  .catch(console.error)
```

### Advanced usage

This library also supports direct using it without the **SonosManager**.

```node
const SonosDevice = require('@svrooij/sonos').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')
sonos.LoadDeviceData()
  .then(success => {
    console.log(sonos.Name)
  })
  .catch(console.error)
```

## Improvements over [node-sonos](https://github.com/bencevans/node-sonos)

The original [node-sonos](https://github.com/bencevans/node-sonos) is started a long time ago, before async programming in node.
While it works great, it has some rough edges that are hard to solve.

This new library is build from the ground up using `node-fetch` for the requests and `fast-xml-parser` for the xml stuff.

One of the most important parts of this new library is the [**service-generator**](./src/generator/service-generator.js), it parses the `/xml/device_description.xml` file from the sonos device. And generates a strong typed service class for it. This means that we can support all the possible actions your sonos device has. And it also means that it will tell your which parameters it expects.

- [x] Strong typed (auto generated) client
- [x] Starting from auto discovery or one sonos host ip
- [x] Zone groups as a starting point (logical devices)
- [ ] Using the events even more
- [x] The sonos device will expose all the generated services, or an extended version of them.
- [x] The sonos device will contain extra features and shortcuts to services.

## Devloper section

This will contain usefull information if you want to fix a bug you've found in this library. You always start with cloning the repo and doing a `npm install` in the folder.

### (Re-)generate services

I've created a one-liner to regenerate all the generated services. `SONOS_HOST=192.168.x.x npm run gen-srv`.
This will parse the device properties and will create all the services in the `/src/services` folder. New services will have the **new-** filename prefix, and should be added in the **getFilenameForService** method.

### Compile the library

Because the library is written in typescript, you'll need to compile it before using it. Run `npm run build` to have the compiler generate the actual library in the `lib` folder.

## Big thanks to all the original contributors

Creating a library from scratch is quite hard, and I'm using a lot of stuff from the original library. That wouldn't exists without the [contributors](https://github.com/bencevans/node-sonos/graphs/contributors).

[badge_sponsor]: https://img.shields.io/badge/Sponsor-on%20Github-red
[link_sponsor]: https://github.com/sponsors/svrooij
