# Node Sonos (the typescript version)

[![Support me on Github][badge_sponsor]][link_sponsor]

A node library to control a sonos device, written in Typescript. See [here](#improvements-over-node-sonos) why I've build it while there already is a sonos library.

## Usage

To use the library just add it to your project. `npm install @svrooij/sonos`. And start using it.

You'll need to get the **SonosDevice** by one of the methods below, then explore all the services. All the services are generated from the sonos device discovery. So everything you can do with the Sonos Application on your mobile device or computer, you can do with this library.

```node
const SonosDevice = require('@svrooij/sonos').SonosDevice

// Using the SonosManager to get the devices is recommended, see below.
const sonosDevice = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')
// Shortcut functions.
sonosDevice.Play() // Start playing
sonosDevice.Pause() // Pause playing
sonosDevice.Next() // Go to next song
sonosDevice.Previous() // Go to previous song
sonosDevice.Stop() // Stop playback
sonosDevice.SeekPosition('0:02:01') // Change position in track.
sonosDevice.SeekTrack(5) // Jump to other track in the queue.
// Added functionality
sonosDevice.PlayNotification(new PlayNotificationOptions(....)) // Play a single url and revert back to playlist/radiostream.
sonosDevice.JoinGroup('Office') // Join a group by other device name.
```

### Exposed services

```node
const SonosDevice = require('@svrooij/sonos').SonosDevice
// Using the SonosManager to get the devices is recommended, see below.
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

## SonosManager and logical devices

This library has a **SonosManager** that resolves all your sonos groups for you. It also manages group updates. Every **SonosDevice** created by this manager has some extra properties that can be used by your application. These properties will automatically be updated on changes.

```node
device.Coordinator // this will always point to the correct coordinator (or the current device if it doesn't have a coordinator.)
device.GroupName // this will always have the group name in it. Like 'Kitchen + 2'
```

### SonosManager - Device discovery

You can discover all the devices in the current network using device discovery

```node
const SonosManager = require('@svrooij/sonos').SonosManager
const manager = new SonosManager()
manager.InitializeWithDiscovery(10)
  .then(console.log)
  .then(() => {
    manager.Devices.forEach(d => console.log('Device %s (%s) is joined in %s', d.Name, d.uuid, d.GroupName))
  })
  .catch(console.error)
```

### SonosManager - Single IP

In some cases device discovery doesn't work (think docker or complex networks), you can also start the manager by submitting one known sonos IP.

```node
const SonosManager = require('@svrooij/sonos').SonosManager
const manager = new SonosManager()
manager.InitializeFromDevice(process.env.SONOS_HOST || '192.168.96.56')
  .then(console.log)
  .then(() => {
    manager.Devices.forEach(d => console.log('Device %s (%s) is joined in %s', d.Name, d.uuid, d.GroupName))
  })
  .catch(console.error)
```

### Advanced usage

This library also supports direct using it without the **SonosManager**. The group stuff won't work this way!

```node
const SonosDevice = require('@svrooij/sonos').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')
sonos.LoadDeviceData()
  .then(success => {
    console.log(sonos.Name)
  })
  .catch(console.error)
```

## Events

Sonos devices have a way to subscribe to **updates** of most device parameters. It works by sending a subscribe request to the device. The Sonos device will then start sending updates to the specified endpoint(s).

This library includes a **SonosEventListener** which you'll never have to call yourself :wink:. Each **service** has an `.Events` property exposing the EventEmitter for that service. If you subscribe to events of a service, it will automatically ask the sonos device to start sending updates for that service. If you stop listening, it will tell sonos to stop sending events.

If you subscribed to events of one service, or on the sonos device events. A small webservice is created automatically to receive the updates from sonos. This webservices is running on port 6329 by default, but can be changed (see below).

The **SonosDevice** also has an `.Events` property. Here you'll receive some specific events.

```node
const SonosDevice = require('@svrooij/sonos').SonosDevice
const ServiceEvents = require('@svrooij/sonos').ServiceEvents
const SonosEvents = require('@svrooij/sonos').SonosEvents
const sonosDevice = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')

// SonosEvents
sonosDevice.Events.on(SonosEvents.CurrentTrack, uri => {
  console.log('Current track changed %s', uri)
})

sonosDevice.Events.on(SonosEvents.CurrentTrackMetadata, data => {
  console.log('Current track metadata %s', JSON.stringify(data))
})

sonosDevice.Events.on(SonosEvents.Volume, volume => {
  console.log('New volume %d', volume)
})

// Events from Services
sonosDevice.AlarmClockService.Events.on(ServiceEvents.Data, data => {
  console.log('AlarmClock data %s', JSON.stringify(data))
})

sonosDevice.AVTransportService.Events.on(ServiceEvents.LastChange, data => {
  console.log('AVTransport lastchange %s', JSON.stringify(data, null, 2))
})
sonosDevice.RenderingControlService.Events.on(ServiceEvents.LastChange, data => {
  console.log('RenderingControl lastchange %s', JSON.stringify(data, null, 2))
})
```

The **SonosEventListener** has some configuration options, which you'll need in specific network environments or docker sitiuations. You can configure the following environment variables.

- `SONOS_LISTENER_HOST` The hostname or ip of the device running the event listener. This is used as the callback host.
- `SONOS_LISTENER_INTERFACE` If the host isn't set, the first non-internal ip of this interface is used.
- `SONOS_LISTENER_PORT` The port the event listener should listen on. Also send to the device. `6329 = default`

If none of these environment variables are set it will just use the default port and the first found non-internal ip.

## Improvements over [node-sonos](https://github.com/bencevans/node-sonos)

The original [node-sonos](https://github.com/bencevans/node-sonos) is started a long time ago, before async programming in node.
While it works great, it has some rough edges that are hard to solve.

This new library is build from the ground up using `node-fetch` for the requests and `fast-xml-parser` for the xml stuff.

One of the most important parts of this new library is the [**service-generator**](./src/generator/service-generator.js), it parses the `/xml/device_description.xml` file from the sonos device. And generates a strong typed service class for it. This means that we can support all the possible actions your sonos device has. And it also means that it will tell your which parameters it expects.

- [x] Strong typed (auto generated) client
- [x] Starting from auto discovery or one sonos host ip
- [x] Zone groups as a starting point (logical devices)
- [x] All events parsed and some custom properties
- [x] The sonos device will expose all the generated services, or an extended version of them.
- [x] The sonos device will contain extra features and shortcuts to services.

## Developer section

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
