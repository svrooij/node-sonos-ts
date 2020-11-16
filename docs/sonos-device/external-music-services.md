---
layout: default
title: External music services
nav_order: 4
---

# External music services

Sonos has support for a lot of external music services. Check [here](https://svrooij.io/sonos-api-docs/music-services.html#current-music-services) for a complete list.

A lot of music services require you to login, which wasn't possible until recently.

## Login to external music service

First you'll have to load a list of all available services. Make sure you check-out [getting started](../getting-started.html) on how to get an instance of **SonosDevice**. Starting from the SonosDevice is **higly recommended**, since it get all the needed data from the device and also auto-saves the account credentials.

```js
// Load all music services
const musicServices = await sonosDevice.MusicServicesService.ListAndParseAvailableServices(true);

// Pick your music service (eg. 9 for spotify)
const serviceId = 9;
const spotify = await sonosDevice.MusicServicesClient(serviceId);

// Login (only required once)
// 1. Get login link (for 'AppLink'or 'DeviceLink')
const deviceLink = await spotify.GetLoginLink();
// 2. Visit {deviceLink.regUrl} (and enter the {deviceLink.linkCode}, can skip sometimes)
// 3. Call GetDeviceAuthToken with the linkCode from step 1 (your app can do this multiple times, sonos does this every x seconds for 7 minutes)
const credentials = await spotify.GetDeviceAuthToken(deviceLink.linkCode);
// Because your took the music client form the sonos device, it is setup to save the credentials automatically.
```

The [wizard](https://github.com/svrooij/node-sonos-ts/blob/master/examples/music-services-login.js) in the examples folder can help you login to your favorite service.

## Browse external music service

After you logged-in once for a service, you can load all the services that the user is signed-in to, and start browsing. (Not all services support browsing, but just try it out with your music service). The `GetMetadata` action with id = `root` is used to browse for the root list of a music service.

Starting from `root` you can browse until you reach songs or playlists.

```js
// Get a list of all music services subscribed
const musicServices = await sonosDevice.MusicServicesSubscribed();

// or load all music services
const musicServices = await sonosDevice.MusicServicesService.ListAndParseAvailableServices(true);

// Select your music service
const serviceId = 9; // spotify
const musicService = await sonosDevice.MusicServicesClient(serviceId);

// Browse the root of the music service
const results = await musicService.GetMetadata({ id: 'root', index: 0, count: 10 });
```

An example can be found [here](https://github.com/svrooij/node-sonos-ts/blob/master/examples/music-services.js).

## Search external music service

Some services also support searching for songs or artists, just check it out if this is the case for your music service.

```js
// Select your music service
const serviceId = 9; // spotify
const musicService = await sonosDevice.MusicServicesClient(serviceId);

// Search for artist Guus
const result = await client.Search({ id: 'artist', term: 'Guus', index: 0, count: 10});
```

## Official app

According to the [official docs](https://developer.sonos.com/build/content-service-add-features/add-authentication/add-browser-authentication/) the application is responsible for adding the account to the speakers. I don't know how to do this, so you can only use the above steps to browse the external music service.

You'll still need the official app to add the music service to the sonos speakers as well, for it to be able to play the music from the external service. You only have to do it once and then you can use your own application (this library).