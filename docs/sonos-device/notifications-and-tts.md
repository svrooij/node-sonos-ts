---
layout: default
title: Notifications and TTS
parent: Sonos device
nav_order: 2
---
# Notifications

You can send notification sounds to the sonos speaker with this nice command.
It will do the following things:

1. Get the current state
2. Check if it is currently playing, and cancel if not playing and you specified `onlyWhenPlaying: true`.
3. Play the sound
4. Wait for playback to stop (or the timeout to expire)
5. Restore all previously fetched status (Track, queue, volume,...)

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')

sonos.PlayNotification({
    trackUri: 'https://cdn.smartersoft-group.com/various/pull-bell-short.mp3', // Can be any uri sonos understands
    // trackUri: 'https://cdn.smartersoft-group.com/various/someone-at-the-door.mp3', // Cached text-to-speech file.
    onlyWhenPlaying: false, // make sure that it only plays when you're listening to music. So it won't play when you're sleeping.
    timeout: 10, // If the events don't work (to see when it stops playing) or if you turned on a stream, it will revert back after this amount of seconds.
    volume: 15, // Set the volume for the notification (and revert back afterwards)
    delayMs: 700 // Pause between commands in ms, (when sonos fails to play sort notification sounds).
  })
  .then(played => {
    console.log('Played notification %o', played)
  })
```

## Notifications with AudioClip

Sonos has a [native](https://developer.sonos.com/reference/control-api/audioclip/) way to play an audio clip through the music, this used to be cloud only functionality. Until [Thomas discovered](https://github.com/bencevans/node-sonos/issues/530#issuecomment-1430039043) it was also available on the local network. We now have experimental support for this audio clip endpoint, which only works on speakers that are compatible with the S2 app, and we are probably going to replace the custom build version with the native version.

The native AudioClip does not pause the music, the clip is played over it, not having to revert back to the original music because it is not replaced. Sample code available in [examples](https://github.com/svrooij/node-sonos-ts/tree/master/examples)

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')

sonos.PlayNotificationAudioClip({
    trackUri: 'https://cdn.smartersoft-group.com/various/pull-bell-short.mp3', // Can be any uri sonos understands
    // trackUri: 'https://cdn.smartersoft-group.com/various/someone-at-the-door.mp3', // Cached text-to-speech file.
    onlyWhenPlaying: false, // make sure that it only plays when you're listening to music. So it won't play when you're sleeping.
    volume: 15, // Set the volume for the notification (and revert back afterwards)
  })
  .then(queued => {
    console.log('Queued notification %o', queued)
  })
```

## Text to speech

A lot of people want to send text to sonos to use for notifications (or a welcome message in your B&B).
This library has support for text-to-speech but you'll need a text-to-speech endpoint.
To keep this library as clean as possible, the text-to-speech server is build in a separate package.
See [node-sonos-tts-polly](https://github.com/svrooij/node-sonos-tts-polly) for a text-to-speech server that uses Amazon Polly for speech generation.

For my [sponsors][link_sponsor] I've setup a hosted version, so if you don't want to setup your own server, you know what to do.

The text-to-speech method executes the following:

1. Ask the TTS endpoint what the url of the supplied text is.
2. If the server doesn't have this file, it will generate the mp3 file on the fly.
3. The TTS endpoint returns the url of the mp3.
4. We call the `.PlayNotification({})` command above, with the tts url.

This way you don't have to worry about encoding the text so sonos understands it. Sonos will just get a regular url to the mp3 file with the spoken text.

You can also set the endpoint with the `SONOS_TTS_ENDPOINT` environment variable, so you don't have to supply it every time. The default language can be set with the environment variable `SONOS_TTS_LANG`.
We have support for **neural** language engines. Pick a voice that supports it and set the `engine` to `neural` or set the `SONOS_TTS_ENGINE` environment variable to `neural`.

The server I've build is based on Amazon Polly, but I invite everybody to build their own if you want to support another tts service.

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')
sonos.PlayTTSAudioClip({
    text: 'Someone at the front-door',
    lang: 'en-US',
    gender: 'male',
    volume: 50,
    endpoint: 'https://your.tts.endpoint/api/generate'
  })
  .then(queued => {
    console.log('Queued notification %o', queued)
  })
```

### TTS AudioClip

Text to speech but with the AudioClip endpoint, see [Notifications with Audio Clip](#notifications-with-audioclip) for differences.

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')
sonos.PlayTTS({
    text: 'Someone at the front-door',
    lang: 'en-US',
    gender: 'male',
    volume: 50,
    endpoint: 'https://your.tts.endpoint/api/generate'
  })
  .then(played => {
    console.log('Played notification %o', played)
    // Timeout to allow event subscriptions to cancel.
    setTimeout(() => {
      process.exit(0)
    }, 500)
  })
```


## Notifications on all speakers

If you use the **SonosManager** (the recommended way to use this library), you can also play a notification on all groups by sending the same command to the SonosManager instead of the individual speaker.
You can also use the manager for text-to-speech, `manager.PlayTTS(..)`

```js
const SonosManager = require('../lib').SonosManager
const manager = new SonosManager()

// Do device discovery
// manager.InitializeWithDiscovery(10)
// Connect known device
manager.InitializeFromDevice(process.env.SONOS_HOST || '192.168.96.56')
  .then(console.log)
  .then(() => {
    return manager.PlayNotification({
      trackUri: 'https://cdn.smartersoft-group.com/various/pull-bell-short.mp3', // Can be any uri sonos understands
      // trackUri: 'https://cdn.smartersoft-group.com/various/someone-at-the-door.mp3', // Cached text-to-speech file.
      onlyWhenPlaying: true, // make sure that it only plays when you're listening to music. So it won't play when you're sleeping.
      timeout: 10, // If the events don't work (to see when it stops playing) or if you turned on a stream, it will revert back after this amount of seconds.
      volume: 15, // Set the volume for the notification (and revert back afterwards)
      delayMs: 700 // Pause between commands in ms, (when sonos fails to play notification often).
    })
  })
  .catch(console.error)
```

[link_sponsor]: https://github.com/sponsors/svrooij
