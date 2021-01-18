---
layout: default
title: Methods
parent: Sonos device
nav_order: 1
---

## Added functionality

These methods aren't possible with the generated services.

- **.AddUriToQueue('spotify:track:0GiWi4EkPduFWHQyhiKpRB')** - Add a track to be next track in the queue, [metadata](#metadata) is guessed.
- **.AlarmClockService.ListAndParseAlarms()** - List all your alarms
- **.AlarmClockService.PatchAlarm({ ID: 1, ... })** - Update some properties of one of your alarms.
- **.JoinGroup('Office')** - Join an other device by it's name. Will lookup the correct coordinator.
- **.PlayNotification({})** - Play a single url and revert back to previous music source (playlist/radiostream). See [notifications](https://svrooij.github.io/node-sonos-ts/sonos-device/notifications-and-tts.html#notifications)
- **.PlayTTS({})** - Generate mp3 based on text, play and revert back to previous music source. See [Text-to-Speech](https://svrooij.github.io/node-sonos-ts/sonos-device/notifications-and-tts.html#text-to-speech)
- **.SetAVTransportURI('spotify:track:0GiWi4EkPduFWHQyhiKpRB')** - Set playback to this url, [metadata](#metadata) is guessed. This doens't start playback all the time!
- **.SwitchToLineIn()** - Some devices have a line-in. Use this command to switch to it.
- **.SwitchToQueue()** - Switch to queue (after power-on or when playing a radiostream).
- **.SwitchToTV()** - On your playbar you can use this to switch to TV input.
- **.TogglePlayback()** - If playing or transitioning your playback is paused. If stopped or paused your playback is resumed.
- **.GetState()** - To get the current state of the speaker (can be serialized as json and saved to disk).
- **.RestoreState(state, delayMs)** - To restore the playback to the previous state.

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

You can also browse content, see [content.js](https://github.com/svrooij/node-sonos-ts/blob/master/examples/content.js), these are actually all shortcuts to the browse method.

- **.GetFavoriteRadioShows()** - Get your favorite radio shows
- **.GetFavoriteRadioStations()** - Get your favorite radio stations
- **.GetFavorites()** - Get your favorite songs
- **.GetQueue()** - Get the current queue.

## Metadata

This library can guess the required metadata for certain track uri's. This is done by the [MetadataHelper](https://github.com/svrooij/node-sonos-ts/blob/master/src/helpers/metadata-helper.ts). The "guessed" metadata is tested [here](https://github.com/svrooij/node-sonos-ts/blob/master/tests/helpers/metadata-helper.test.ts). If you want to extend this you'll need Wireshark. Set it up to monitor `port 1400`, execute the required action in the sonos app (on the same pc as wireshark) and look for `POST /MediaRenderer/AVTransport/Control`.

Currently supported url's for metadata guessing:

- `apple:album:1025210938` - Apple Music album (not in user's music library).
- `apple:libraryalbum:l.OIdA15a` - Apple Music album from user's music library.
- `apple:libraryplaylist:p.rQ5rCxE48W` - Apple Music playlist from user's music library.
- `apple:librarytrack:i.m3g9uLvzB7` - Apple Music track from user's music library.
- `apple:playlist:pl.cf589c8b40dc40cd9ddc2e61493d5efd` - Apple Music playlist (not in user's music library).
- `apple:track:1025212410` - Apple Music track (not in user's library).
- `deezer:album:123456` - A Deezer album by id
- `deezer:artistTopTracks:123456` - A Deezer artist top tracks
- `deezer:playlist:123456` - A Deezer playlist by id
- `deezer:track:123456` - A Deezer track by id
- `sonos:playlist:7` - A saved sonos playlist by number.
- `spotify:track:0GiWi4EkPduFWHQyhiKpRB` - Regular spotify track.
- `spotify:artistRadio:72qVrKXRp9GeFQOesj0Pmv` - Spotify artist radio (has to be added to queue).
- `spotify:artistTopTracks:72qVrKXRp9GeFQOesj0Pmv` - Spotify artist top tracks (has to be added to queue).
- `spotify:album:5c4y5oD0jCAVHJNusKpy4d` - Spotify album (has to be added to queue).
- `spotify:playlist:37i9dQZF1DXcx1szy2g67M` - Spotify playlist (has to be added to queue).
- `radio:s113577` - Tunein radio station.

This library will guess the metadata automatically for the following methods, but you can also use the **MetadataHelper**, yourself.

- `sonosDevice.AddUriToQueue(...)` - Adding track to queue.
- `sonosDevice.SetAVTransportURI(...)` - Switch transport (cannot be used to play 'containers' like playlists, albums, ...)
- `sonosDevice.PlayNotification({...})` - Play a songs as notification (no containers).
