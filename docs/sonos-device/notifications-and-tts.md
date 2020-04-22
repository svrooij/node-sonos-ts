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

## Text to speech

A lot of people want to send text to sonos to use for notifications (or a welcome message in your B&B).
This library has support for text-to-speech but you'll need a text-to-speech endpoint.
To keep this library as clean as possible, the text-to-speech server is build in a seperate package.
See [node-sonos-tts-polly](https://github.com/svrooij/node-sonos-tts-polly) for a text-to-speech server that uses Amazon Polly for speech generation.

For my [sponsors][link_sponsor] I've setup a hosted version, so if you don't want to setup your own server, you know what to do.

The text-to-speech method executes the following:

1. Ask the TTS endpoint what the url of the supplied text is.
2. If the server doesn't have this file, it will generate the mp3 file on the fly.
3. The TTS endpoint returns the url of the mp3.
4. We call the `.PlayNotification({})` command above, with the tts url.

This way you don't have to worry about encoding the text so sonos understands it. Sonos will just get a regular url to the mp3 file with the spoken text.

You can also set the endpoint with the `SONOS_TTS_ENDPOINT` environment variable, so you don't have to supply it every time. The default language can be set with the environment variable `SONOS_TTS_LANG`.

The server I've build is based on Amazon Polly, but I invite eveybody to build their own if you want to support an other tts service.

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

[link_sponsor]: https://github.com/sponsors/svrooij
