---
layout: default
title: Methods
parent: Sonos device
nav_order: 1
---

## Added functionality

These methods aren't possible with the generated services.

- **.AddUriToQueue('spotify:track:0GiWi4EkPduFWHQyhiKpRB')** - Add a track to be next track in the queue, metadata is guessed.
- **.AlarmClockService.ListAndParseAlarms()** - List all your alarms
- **.AlarmClockService.PatchAlarm({ ID: 1, ... })** - Update some properties of one of your alarms.
- **.JoinGroup('Office')** - Join an other device by it's name. Will lookup the correct coordinator.
- **.PlayNotification({})** - Play a single url and revert back to previous music source (playlist/radiostream). See [play-notification.js](./examples/play-notification.js)
- **.PlayTTS({})** - Generate mp3 based on text, play and revert back to previous music source. See [Text-to-Speech](#text-to-speech)
- **.SetAVTransportURI('spotify:track:0GiWi4EkPduFWHQyhiKpRB')** - Set playback to this url, metadata is guessed. This doens't start playback all the time!
- **.SwitchToLineIn()** - Some devices have a line-in. Use this command to switch to it.
- **.SwitchToQueue()** - Switch to queue (after power-on or when playing a radiostream).
- **.SwitchToTV()** - On your playbar you can use this to switch to TV input.
- **.TogglePlayback()** - If playing or transitioning your playback is paused. If stopped or paused your playback is resumed.

---

## Shortcuts

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

---

## Content

You can also browse content, see [content.js](./examples/content.js), these are actually all shortcuts to the browse method.

- **.GetFavoriteRadioShows()** - Get your favorite radio shows
- **.GetFavoriteRadioStations()** - Get your favorite radio stations
- **.GetFavorites()** - Get your favorite songs
- **.GetQueue()** - Get the current queue.
