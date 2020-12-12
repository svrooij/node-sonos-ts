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

## Configuration

The **SonosEventListener** has some configuration options, which you'll need in specific network environments or docker sitiuations. You can configure the following environment variables.

If you have multiple (virtual) network interfaces in your system, use `SONOS_LISTENER_INTERFACE` to set the name of the interface where it should pick the first non-loopback IP address in the subscription request to the sonos speaker. This interface should be reachable from the sonos speakers, since the sonos speaker will do an http request to this host.

Use the following options to set a static endpoint. Setting an interface is the preferred method.

- `SONOS_LISTENER_HOST` The IP that should be used by sonos to send the events to. Defaults to the first IP found of the first interface (or set interface).
- `SONOS_LISTENER_PORT` The port the event listener should listen on. `6329 = default`

The callback url that is send to the sonos speakers is `http://{SONOS_LISTENER_HOST}:{SONOS_LISTENER_PORT}/sonos/{speakerUUID}/{serviceName}`

### Expert settings

If you run your app behind an (nginx) reverse proxy, the event endpoint is probably different then the endpoint off the app. To set a specific endpoint you can use the `SONOS_LISTENER_PROXY` setting. This has to be set to `http://anything.you.like:port` and will override the callback url above, `/sonos/{speakerUUID}/{serviceName}` is appended automatically.

You just have to make sure the reverse proxy forwards the message to the correct endpoint, also forward the request headers because they are used to find the correct service subscription.

## Example

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

## How it works

Using the events for a service or the **SonosDevice** works by just adding a listener to the EventEmitter.

1. If this is the first listener for this EventEmitter, it will signal the service to subscribe for events from this service.
2. If there isn't a subscription for that service, it will automatically create a new subscription for that service. The callback endpoint is fetched from the SonosEventListener.
3. The subscription is registered at the SonosEventListener (Subscription Id from the speaker and the requesting service).
4. If the SonosEventListener wasn't started before, it will start to listen on the defined port (`6329` is the default).
5. The SonosEventListener receives all the events (which are just http calls with xml data), it will the lookup the service matching the Subscription Id.
6. The service receives the raw event (`ParseEvent` method), parses the XML, cleans the event and emits it on it's own EventEmitter.
7. If you remove all listeners from the EventEmitter, the service automatically sends an unsubscribe message to the speaker.

Check out [this sample](https://github.com/svrooij/node-sonos-ts/blob/master/examples/events.js) for a working sample on events.

## Event listener status

The event listener got 2 extra endpoints, a `/health` endpoint which will just respond with status code 200 if the listener is still running. There also is a `/status` endpoint, this will give some information about the event listener. 

The status endpoint is very handy if it looks you aren't receiving any events. It will show you the generated callback url. If that url isn't reachable from the network where the sonos speaker is in, you need to tweak your listener configuration.

