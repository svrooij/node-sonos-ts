# Node Sonos (the typescript version)

[![Support me on Github][badge_sponsor]][link_sponsor]
[![npm][badge_npm]][link_npm]
[![travis][badge_travis]][link_travis]
[![github issues][badge_issues]][link_issues]
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A node library to control a sonos device, written in Typescript. See [here](#improvements-over-node-sonos) why I've build it while there already is a sonos library written in node.

## Usage

To use the library just add it to your project. `npm install @svrooij/sonos`. And start using it. This library isn't meant to be used by itself, as you see in the [examples](./examples) you still need to use node (or typescript).

You'll need to get the [**SonosDevice**](https://svrooij.github.io/node-sonos-ts/classes/_sonos_device_.sonosdevice.html) by one of the [methods below](#sonosmanager-and-logical-devices), and start using the extra [functionality](#extra-functionality), the [shortcuts](#shortcuts) or the [exposed services](#exposed-services). There also is an [Eventlistener](#events) that allows you to subscribe to all the events your sonos sends out. This library allows you to do **everything** you can do with the Sonos application (except search external [music services](./src/musicservices) :cry:).

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

### Extra functionality

I also implemented extra functionatity for each player. (mostly combining calls):

- **.AddUriToQueue('spotify:track:0GiWi4EkPduFWHQyhiKpRB')** - Add a track to be next track in the queue, metadata is guessed :musical_note:.
- **.AlarmList()** - List all your alarms :alarm_clock:
- **.AlarmPatch({ ID: 1, ... })** - Update some properties of one of your alarms :clock330:.
- **.JoinGroup('Office')** - Join an other device by it's name. Will lookup the correct coordinator :speaker:.
- **.PlayNotification({})** - Play a single url and revert back to previous music source (playlist/radiostream) :bell:. See [play-notification.js](./examples/play-notification.js)
- **.PlayTTS({})** - Generate mp3 based on text, play and revert back to previous music source :mega:. See [Text-to-Speech](#text-to-speech)
- **.SetAVTransportURI('spotify:track:0GiWi4EkPduFWHQyhiKpRB')** - Set playback to this url, metadata is guessed :musical_note:. This doens't start playback all the time!
- **.SwitchToLineIn()** - Some devices have a line-in. Use this command to switch to it :microphone:.
- **.SwitchToQueue()** - Switch to queue (after power-on or when playing a radiostream).
- **.SwitchToTV()** - On your playbar you can use this to switch to TV input :tv:.
- **.TogglePlayback()** - If playing or transitioning your playback is paused :arrow_forward:. If stopped or paused your playback is resumed.

You can also browse content, see [content.js](./examples/content.js)

- **.Browse({...})** - Browse local content.
- **.BrowseWithDefaults({...})** - Browse local content by only specifying the ObjectID, the rest will be set to default.
- **.GetFavoriteRadioShows({...})** - Get your favorite radio shows
- **.GetFavoriteRadioStations({...})** - Get your favorite radio stations
- **.GetFavorites({...})** - Get your favorite songs
- **.GetQueue({...})** - Get the current queue

### Shortcuts

Each **Sonos Device** has the following shortcuts (things you could also do by using one of the exposed services):

- **.GetNightMode()** - Get NightMode status (playbar)
- **.GetSpeechEnhancement()** - Get Speech enhancement status (playbar)
- **.GetZoneGroupState()** - Get current group info.
- **.GetZoneInfo()** - Get info about current player.
- **.Play()** - Start playing *.
- **.Pause()** - Pause playing *.
- **.Next()** - Go to next song (when playing the queue) *.
- **.Previous()** - Go to previous song (when playing the queue) *.
- **.SetNightMode(desiredState)** - Turn on/off nightmode on your playbar.
- **.SetRelativeVolume(adjustment)** - Change the volume relative to current.
- **.SetSpeechEnhancement(desiredState)** - Turn on/off speech enhancement on your playbar.
- **.SetVolume(newVolume)** - Change the volume.
- **.Stop()** - Stop playing (most of the time it's better to pause playback) *.
- **.SeekPosition('0:03:01')** - Go to other postion in track *.
- **.SeekTrack(3)** - Go to other track in the queue *.

These operations (marked with `*`) are send to the coordinator if the device is created by the **SonosManager**. So you can send **.Next()** to each device in a group and it will be send to the correct device.

### Exposed services

Your sonos device has several *services* defined in it's *device description* (available at `http://sonos_ip:1400/xml/device_description.xml`). This library uses a [generator](./src/generator/service-generator.js) to automatically generate all the services my sonos device has. All these services are exposed in the **SonosDevice**:

- **.AVTransportService** - Control the playback (play, pause, next, stop).
- **.AlarmClockService** - Control your alarms.
- **.AudioInService** - ?
- **.ConnectionManagerService** - ?
- **.ContentDirectoryService** - Control your content?
- **.DevicePropertiesService** - Change your device properties (led, StereoPair, AutoPlay).
- **.GroupManagementService** - Manage your groups (what's the differance with ZoneGroupTopologyService?).
- **.GroupRenderingControlService** - RenderingControlService for groups.
- **.MusicServicesService** - All your music services.
- **.QPlayService** - To authorize QPlay, needs explaining.
- **.QueueService** - Queue management
- **.RenderingControlService** - Control rendering (eg. volume)
- **.SystemPropertiesService** - Manage connected accounts
- **.VirtualLineInService** - ?
- **.ZoneGroupTopologyService** - Zone management, mostly used under the covers by [SonosManager](./src/sonos-manager.ts)

### Commands

This library also has a command parser, so every listed command can also be executed if you only know the string name (eg. user input :wink:)

```JavaScript
const SonosDevice = require('../lib').SonosDevice
const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')
// Send Play command to AVTransportService (with auto json parsing)
sonos.ExecuteCommand('AVTransportService.Play', '{"InstanceID": 0, "Speed": "1" }').catch(console.error)
// Send Play command to AVTransportService
sonos.ExecuteCommand('AVTransportService.Play', { InstanceID: 0, Speed: '1' }).catch(console.error)
// Send Pause command to AVTransportService (no parameters)
sonos.ExecuteCommand('AVTransportService.Pause').catch(console.error)
// Execute toggle playback
sonos.ExecuteCommand('TogglePlayback').catch(console.error)
// Non-existing command
sonos.ExecuteCommand('SendSomeLove').catch(console.error)
```

## SonosManager and logical devices

This library has a [**SonosManager**](https://svrooij.github.io/node-sonos-ts/classes/_sonos_manager_.sonosmanager.html) that resolves all your sonos groups for you. It also manages group updates. Every **SonosDevice** created by this manager has some extra properties that can be used by your application. These properties will automatically be updated on changes.

- **.Coordinator** - Point to the devices' group coordinator (or to itself when it's the coordinator).
- **.GroupName** - The name of the group this device is in. eg 'Kitchen + 2'

### SonosManager - Device discovery

You can discover all the devices in the current network using device discovery

```JavaScript
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

### Control a single known device

This library also supports direct using it without the **SonosManager**. The group updates need the manager, so you're missing some features!

```JavaScript
const SonosDevice = require('@svrooij/sonos').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')
sonos.LoadDeviceData()
  .then(success => {
    console.log(sonos.Name)
  })
  .catch(console.error)
```

## Text to speech

A lot of people want to send text to sonos to use for notifications (or a welcome message in your B&B). This library has support for text-to-speech but you'll need a text-to-speech endpoint. To keep this library as clean as possible, the text-to-speech server is build in a seperate package. See [node-sonos-tts-polly](https://github.com/svrooij/node-sonos-tts-polly) for a text-to-speech server that uses Amazon Polly for speech generation.

For my [sponsors](link_sponsor) I've setup a hosted version, so if you don't want to setup your own server, you know what to do.

The text-to-speech works as following:

1. Request the TTS endpoint what the url of the supplied text is.
2. If the server doesn't have this file, it will generate the mp3 file on the fly.
3. The TTS endpoint returns the url of the mp3.
4. We call the regular `.PlayNotification({})` command, with the tts url.

You can also set the endpoint with the `SONOS_TTS_ENDPOINT` environment variable, so you don't have to supply it every time.

The server I've build is based on Amazon Polly, but I invite eveybody to build their own if you want to support an other tts service.

```JavaScript
const SonosDevice = require('../lib').SonosDevice
const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')
sonos.PlayTTS({ text: 'Someone at the front-door', lang: 'en-US', gender: 'male', volume: 50, endpoint: 'https://your.tts.endpoint/api/generate' })
  .then(played => {
    console.log('Played notification %o', played)
    // Timeout to allow event subscriptions to cancel.
    setTimeout(() => {
      process.exit(0)
    }, 500)
  })
```

## Events

Sonos devices have a way to subscribe to **updates** of most device parameters. It works by sending a subscribe request to the device. The Sonos device will then start sending updates to the specified endpoint(s).

This library includes a **SonosEventListener** which you'll never have to call yourself :wink:. Each **service** has an `.Events` property exposing the EventEmitter for that service. If you subscribe to events of a service, it will automatically ask the sonos device to start sending updates for that service. If you stop listening, it will tell sonos to stop sending events.

If you subscribed to events of one service, or on the sonos device events. A small webservice is created automatically to receive the updates from sonos. This webservices is running on port 6329 by default, but can be changed (see below).

The **SonosDevice** also has an `.Events` property. Here you'll receive some specific events.

```JavaScript
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

## Others using node-sonos-ts

|Name|Maintainer|Description|
|----|----------|----------|
|[sonos2mqtt](https://github.com/svrooij/sonos2mqtt)|[@svrooij](https://github.com/svrooij)|A bridge between sonos and mqtt, so you can control all your sonos devices right from your mqtt server|
|[sonos-cli](https://github.com/svrooij/sonos-cli)|[@svrooij](https://github.com/svrooij)|An experimental command line interface for your sonos devices.|

Also using this library, but not in the list? Send a PR.

## Debugging

This library makes use of [node debug](https://www.npmjs.com/package/debug), if you want to see debug logs you can set the `DEBUG` environment variable to one of the following values.
If you run the examples with the VSCode debug task, this variable is set to `sonos:*` so you should see all the logs.

- `DEBUG=sonos:*` -> See all debug logs.
- `DEBUG=sonos:device` -> See all debug logs from the SonosDevice class.
- `DEBUG=sonos:service:*` -> See all debug logs for all the various services (this is where most of the magic happens).
- `DEBUG=sonos:service:[service_name]` -> See all debug logs for a specific service.
- `DEBUG=sonos:service:*:[ip]` -> See all debug logs for all the various services for a single device (this is where most of the magic happens).
- `DEBUG=sonos:metadata` -> See all debug logs for the metadata helper.

## Contributing

You can contribute in many ways. Asking good questions, solving bugs, sponsoring me on github. This library is build in my spare time, so don't be rude about it.

If you're using a music service that currently isn't supported for metadata generation, you should check out the [metadata generator](./src/helpers/metadata-helper.ts).
It works by taking an url (which you can get by running the [get-position-info sample](./examples/get-position-info.js)). And generating a **Track** for it. Use the information out the console to get the right values.
The values you'll be looking for are `ProtocolInfo`, `TrackUri`, `UpnpClass`, `ItemID` and `ParentID`

[![Support me on Github][badge_sponsor]][link_sponsor]

## Developer section

This will contain usefull information if you want to fix a bug you've found in this library. You always start with cloning the repo and doing a `npm install` in the folder. I like consistancy so everything is in a specific order :wink:.

### Running example code

This library has two VSCode launch configurations.

One for running the current open example, you can set breakpoints in the example file and in the typescript code! Be sure to change the IP to your own in `.vscode/launch.json`, so you don't have to edit all the example files.

And it has a launch configuration to run the current Mocha test file, be sure to have a mocha test (in test folder) open.

### (Re-)generate services

I've created a one-liner to regenerate all the generated services. `SONOS_HOST=192.168.x.x npm run gen-srv`.
This will parse the device properties and will (re)create all the services in the `/src/services` folder. New services will have the **new-** filename prefix, and should be added in the **getFilenameForService** method.

### Compile the library

Because the library is written in typescript, you'll need to compile it before using it. Run `npm run build` to have the compiler generate the actual library in the `lib` folder.

## Improvements over [node-sonos](https://github.com/bencevans/node-sonos)

The original [node-sonos](https://github.com/bencevans/node-sonos) is started a long time ago, before async programming in node. Which I'm a contributor as well.
Some design decisions cannot be fixed without breaking compatibility with all the applications using it. For instance the `.play()` function serves multiple purposes, starting playback and switching urls. A lot of applications depend on it, and they would all break if I would remove support for it.

This new library is build from the ground up using `node-fetch` for the requests and `fast-xml-parser` for the xml stuff.

One of the most important parts of this new library is the [**service-generator**](./src/generator/service-generator.js), it parses the `/xml/device_description.xml` file from the sonos device. And generates a strong typed service class for it. This means that this library will support everything the sonos controller can do.
And it also means that it will tell your which parameters it expects.

- [x] Strong typed (auto generated) client
- [x] Starting from auto discovery or one sonos host ip
- [x] Zone groups as a starting point (logical devices)
- [x] All events parsed and some custom properties
- [x] The sonos device will expose all the generated services, or an extended version of them.
- [x] The sonos device will contain extra features and shortcuts to services.
- [x] Easier implementing [metadata generation](./src/helpers/metadata-helper.ts) for new services.

### Big thanks to all the original contributors

Creating a library from scratch is quite hard, and I'm using a lot of stuff from the original library. That wouldn't exists without the [contributors](https://github.com/bencevans/node-sonos/graphs/contributors).

[badge_sponsor]: https://img.shields.io/badge/Sponsor-on%20Github-red
[badge_issues]: https://img.shields.io/github/issues/svrooij/node-sonos-ts
[badge_npm]: https://img.shields.io/npm/v/@svrooij/sonos
[badge_travis]: https://img.shields.io/travis/svrooij/node-sonos-ts

[link_sponsor]: https://github.com/sponsors/svrooij
[link_issues]: https://github.com/svrooij/node-sonos-ts/issues
[link_npm]: https://www.npmjs.com/package/@svrooij/sonos
[link_travis]: https://travis-ci.org/svrooij/node-sonos-ts
