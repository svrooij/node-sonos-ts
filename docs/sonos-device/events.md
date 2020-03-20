---
layout: default
title: Events
parent: Sonos device
nav_order: 3
---

# Events

Sonos devices have a way to subscribe to **updates** of most device parameters. It works by sending a subscribe request to the device. The Sonos device will then start sending updates to the specified endpoint(s).

This library includes a **SonosEventListener** which you'll never have to call yourself, it's used internally. Each **service** has an `.Events` property exposing the EventEmitter for that service. If you subscribe to events of a service, it will automatically ask the sonos device to start sending updates for that service. If you stop listening, it will tell sonos to stop sending events.

If you subscribed to events of one service, or on the sonos device events. A small webservice is created automatically to receive the updates from sonos. This webservices is running on port 6329 by default, but can be changed (see below).

The **SonosDevice** also has an `.Events` property. Here you'll receive some specific events.

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const ServiceEvents = require('@svrooij/sonos').ServiceEvents
const SonosEvents = require('@svrooij/sonos').SonosEvents
const sonosDevice = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')

// SonosEvents
sonosDevice.Events.on(SonosEvents.CurrentTrackUri, uri => {
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

sonosDevice.AVTransportService.Events.on(ServiceEvents.Data, data => {
  console.log('AVTransport data %s', JSON.stringify(data, null, 2))
})
sonosDevice.RenderingControlService.Events.on(ServiceEvents.Data, data => {
  console.log('RenderingControl data %s', JSON.stringify(data, null, 2))
})
```

## Configuration

The **SonosEventListener** has some configuration options, which you'll need in specific network environments or docker sitiuations. You can configure the following environment variables.

- `SONOS_LISTENER_HOST` The hostname or ip of the device running the event listener. This is used as the callback host.
- `SONOS_LISTENER_INTERFACE` If the host isn't set, the first non-internal ip of this interface is used.
- `SONOS_LISTENER_PORT` The port the event listener should listen on. Also send to the device. `6329 = default`

If none of these environment variables are set it will just use the default port and the first found non-internal ip.
