# Sonos (the typescript version)

[![Sonos typescript this library][badge_sonos-typescript]][link_sonos-typescript]
[![npm][badge_npm]][link_npm]
[![Sonos api documentation][badge_sonos-docs]][link_sonos-docs]
[![Sonos2mqtt][badge_sonos-mqtt]][link_sonos-mqtt]
[![Sonos cli][badge_sonos-cli]][link_sonos-cli]
[![Join us on Discord][badge_discord]][link_discord]
[![Support me on Github][badge_sponsor]][link_sponsor]

[![Run tests and publish][badge_build]][link_build]
[![github issues][badge_issues]][link_issues]
[![Coverage Status](https://coveralls.io/repos/github/svrooij/node-sonos-ts/badge.svg?branch=master)](https://coveralls.io/github/svrooij/node-sonos-ts?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](//github.com/semantic-release/semantic-release)

Typescript library to control your sonos speakers. Can be used in other typescript (or node) apps.

---
## Key features

- [x] Auto generated client (supporting all features the normal app does). [Sonos api documentation and generator](https://svrooij.io/sonos-api-docs/)
- [x] Auto discovery or one known device as starting point.
- [x] Support for logical devices (grouped speakers) from the start.
- [x] Access to all (generated) services.
- [x] Sonos device class with extra functionality.
- [x] Strongly typed service events.
- [x] Easier implemented [metadata generation](./src/helpers/metadata-helper.ts).

## Documentation

To use the library just add it to your project. `npm install @svrooij/sonos`. And start using it. This library isn't meant to be used by itself, as you see in the [examples](./examples) you still need to use node (or typescript).

See **[Documentation](https://svrooij.github.io/node-sonos-ts/getting-started.html)**

[![Sonos typescript this library][badge_sonos-typescript]][link_sonos-typescript] [![Join us on Discord][badge_discord]][link_discord]

If you need help using this library, [join us on discord][link_discord].

## Use Sonos manager (recommended)

This library is developed with Sonos groups in mind. We created a **SonosManager** to discover all known groups and keep track of changes to them.

```js
const SonosManager = require('@svrooij/sonos').SonosManager
const manager = new SonosManager()
manager.InitializeWithDiscovery(10)
  .then(console.log)
  .then(() => {
    manager.Devices.forEach(d => console.log('Device %s (%s) is joined in %s', d.Name, d.uuid, d.GroupName))
  })
  .catch(console.error)
```

In some network situations (or Docker usage) SSDP won't work, but you can also start the manager if you know one (static) IP of a single speaker.

```js
const SonosManager = require('@svrooij/sonos').SonosManager
const manager = new SonosManager()
manager.InitializeFromDevice(process.env.SONOS_HOST || '192.168.96.56')
  .then(console.log)
  .then(() => {
    manager.Devices.forEach(d => console.log('Device %s (%s) is joined in %s', d.Name, d.uuid, d.GroupName))
  })
  .catch(console.error)
```

### Single sonos speaker (no manager)

If you just want to control a single device and don't want to use the SonosManager, you can also create a instance of **SonosDevice**, but you'll be missing the group options.

```js
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

You can also set the endpoint with the `SONOS_TTS_ENDPOINT` environment variable, so you don't have to supply it every time. The default language can be set with the environment variable `SONOS_TTS_LANG`.

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

## Others using node-sonos-ts

|Name|Maintainer|Description|
|----|----------|----------|
|[sonos2mqtt](https://github.com/svrooij/sonos2mqtt)|[@svrooij](https://github.com/svrooij)|A bridge between sonos and mqtt, so you can control all your sonos devices right from your mqtt server|
|[sonos-cli](https://github.com/svrooij/sonos-cli)|[@svrooij](https://github.com/svrooij)|An experimental command line interface for your sonos devices.|

Also using this library, but not in the list? Send a PR.

## Contributing

[![Sonos api documentation][badge_sonos-docs]][link_sonos-docs]
[![Sonos2mqtt][badge_sonos-mqtt]][link_sonos-mqtt]
[![Sonos cli][badge_sonos-cli]][link_sonos-cli]
[![Sonos typescript this library][badge_sonos-typescript]][link_sonos-typescript]
[![Join us on Discord][badge_discord]][link_discord]

You can contribute in many ways. Asking good questions, solving bugs, sponsoring me on github. This library is build in my spare time, so don't be rude about it.

### Support new music service

If you're using a music service that currently isn't supported for metadata generation, you should check out the [metadata generator](./src/helpers/metadata-helper.ts).
It works by taking an url (which you can get by running the [get-position-info sample](./examples/get-position-info.js)). And generating a **Track** for it. Use the information out the console to get the right values.
The values you'll be looking for are `ProtocolInfo`, `TrackUri`, `UpnpClass`, `ItemID` and `ParentID`.

[![Support me on Github][badge_sponsor]][link_sponsor]

## Contributors ✨

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://svrooij.nl"><img src="https://avatars2.githubusercontent.com/u/1292510?v=4" width="100px;" alt=""/><br /><sub><b>Stephan van Rooij</b></sub></a><br /><a href="https://github.com/svrooij/node-sonos-ts/commits?author=svrooij" title="Code">💻</a> <a href="https://github.com/svrooij/node-sonos-ts/commits?author=svrooij" title="Documentation">📖</a> <a href="#ideas-svrooij" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-svrooij" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/cheanrod"><img src="https://avatars3.githubusercontent.com/u/35066927?v=4" width="100px;" alt=""/><br /><sub><b>Sven Werner</b></sub></a><br /><a href="https://github.com/svrooij/node-sonos-ts/commits?author=cheanrod" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/hklages"><img src="https://avatars3.githubusercontent.com/u/17273119?v=4" width="100px;" alt=""/><br /><sub><b>H. Klages</b></sub></a><br /><a href="https://github.com/svrooij/node-sonos-ts/commits?author=hklages" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind welcome!

## Developer section

This will contain usefull information if you want to fix a bug you've found in
this library. You always start with cloning the repo and doing a
`npm install`
in the folder. I like consistancy so everything is in a specific order :wink:.

### Running example code

This library has two VSCode launch configurations.

One for running the current open example, you can set breakpoints in the example
file and in the typescript code! Be sure to change the IP to your own in `.vscode/launch.json`,
so you don't have to edit all the example files.

And it has a launch configuration to run the current Mocha test file, be sure to
have a mocha test (in test folder) open.

### Service generator

Most of this library is generated by the [generator](https://github.com/svrooij/sonos-api-docs/tree/main/generator/sonos-docs). You can use the generator in your own project. Or just use the service file. I could use some help improving the code of the generator.


### Big thanks to all the original contributors

Creating a library from scratch is quite hard, and I'm using a lot of stuff from
[node-sonos](https://github.com/bencevans/node-sonos/). That wouldn't exists without the [contributors](https://github.com/bencevans/node-sonos/graphs/contributors).

[badge_build]: https://github.com/svrooij/node-sonos-ts/workflows/Run%20tests%20and%20publish/badge.svg
[badge_discord]: https://img.shields.io/discord/782374564054564875?style=flat-square
[badge_issues]: https://img.shields.io/github/issues/svrooij/node-sonos-ts?style=flat-square
[badge_npm]: https://img.shields.io/npm/v/@svrooij/sonos?style=flat-square
[badge_sonos-cli]: https://img.shields.io/badge/sonos-cli-blue?style=flat-square
[badge_sonos-docs]: https://img.shields.io/badge/sonos-api-blue?style=flat-square
[badge_sonos-mqtt]: https://img.shields.io/badge/sonos-mqtt-blue?style=flat-square
[badge_sonos-typescript]: https://img.shields.io/badge/sonos-typescript-blue?style=flat-square
[badge_sponsor]: https://img.shields.io/badge/Sponsor-on%20Github-red?style=flat-square

[link_build]: https://github.com/svrooij/node-sonos-ts/actions
[link_discord]: https://discord.gg/VMtG6Ft36J
[link_issues]: https://github.com/svrooij/node-sonos-ts/issues
[link_npm]: https://www.npmjs.com/package/@svrooij/sonos
[link_sonos-cli]: https://github.com/svrooij/sonos-cli
[link_sonos-docs]: https://svrooij.io/sonos-api-docs
[link_sonos-mqtt]: https://svrooij.io/sonos2mqtt
[link_sonos-typescript]: https://svrooij.io/node-sonos-ts
[link_sponsor]: https://github.com/sponsors/svrooij