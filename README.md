# Node Sonos (the typescript version)

[![Support me on Github][badge_sponsor]][link_sponsor]
[![npm][badge_npm]][link_npm]
[![Run tests and publish][badge_build]][link_build]
[![github issues][badge_issues]][link_issues]
[![Coverage Status](https://coveralls.io/repos/github/svrooij/node-sonos-ts/badge.svg?branch=master)](https://coveralls.io/github/svrooij/node-sonos-ts?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A node library to control a sonos device, written in Typescript. See [here](#improvements-over-node-sonos) why I've build it while there already is a sonos library written in node.

## Key features

- [x] Auto [generated](./src/generator), strongly typed Sonos client.
- [x] Auto discovery or one know device as starting point.
- [x] Support for logical devices (grouped speakers) from the start.
- [x] Access to all (generated) services.
- [x] Sonos device class with extra functionality.
- [x] Strongly typed service events.
- [x] Strongly typed extra events.
- [x] Easier implementing [metadata generation](./src/helpers/metadata-helper.ts).

## Usage

To use the library just add it to your project. `npm install @svrooij/sonos`. And start using it. This library isn't meant to be used by itself, as you see in the [examples](./examples) you still need to use node (or typescript).

See **[Documentation](https://svrooij.github.io/node-sonos-ts/getting-started.html)**

[![Documentation](./img/book.png)](https://svrooij.github.io/node-sonos-ts/getting-started.html)

## Use Sonos manager

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

## or control single device

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

## Documentation

See what else you can do with this library in the [documentation](https://svrooij.github.io/node-sonos-ts/sonos-device)

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

You can contribute in many ways. Asking good questions, solving bugs, sponsoring me on github. This library is build in my spare time, so don't be rude about it.

If you're using a music service that currently isn't supported for metadata generation, you should check out the [metadata generator](./src/helpers/metadata-helper.ts).
It works by taking an url (which you can get by running the [get-position-info sample](./examples/get-position-info.js)). And generating a **Track** for it. Use the information out the console to get the right values.
The values you'll be looking for are `ProtocolInfo`, `TrackUri`, `UpnpClass`, `ItemID` and `ParentID`.

Currently I'm also looking for a way to add documentation to the automatic generated services, so if you got any ideas, be sure to let me know.

[![Support me on Github][badge_sponsor]][link_sponsor]

## Contributors ✨

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://svrooij.nl"><img src="https://avatars2.githubusercontent.com/u/1292510?v=4" width="100px;" alt=""/><br /><sub><b>Stephan van Rooij</b></sub></a><br /><a href="https://github.com/svrooij/node-sonos-ts/commits?author=svrooij" title="Code">💻</a> <a href="https://github.com/svrooij/node-sonos-ts/commits?author=svrooij" title="Documentation">📖</a> <a href="#ideas-svrooij" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-svrooij" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/cheanrod"><img src="https://avatars3.githubusercontent.com/u/35066927?v=4" width="100px;" alt=""/><br /><sub><b>Sven Werner</b></sub></a><br /><a href="https://github.com/svrooij/node-sonos-ts/commits?author=cheanrod" title="Code">💻</a></td>
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

I've created a one-liner to regenerate all the generated services.
`SONOS_HOST=192.168.x.x npm run gen-srv`.

You can also checkout the documentation on the awesome [service generator](./src/generator/).
This can also be used as a source to generate a client for some other language.

## Improvements over [node-sonos](https://github.com/bencevans/node-sonos)

The original [node-sonos](https://github.com/bencevans/node-sonos) is started a
long time ago, before async programming in node, which I'm a contributor as well.
Some design decisions cannot be fixed without breaking compatibility with all
the applications using it. For instance the `.play()` function serves multiple
purposes, starting playback and switching urls. A lot of applications depend on it,
and they would all break if I would remove support for it.

This new library is build from the ground up using `node-fetch` for the requests
and `fast-xml-parser` for the xml stuff.

One of the most important parts of this new library is the [**service-generator**](./src/generator/),
it parses the `/xml/device_description.xml` file from the sonos device.
And generates a strong typed service class for it.
This means that this library will support everything the sonos controller can do.
And it also means that it will tell your which parameters it expects.

### Big thanks to all the original contributors

Creating a library from scratch is quite hard, and I'm using a lot of stuff from
the original library. That wouldn't exists without the [contributors](https://github.com/bencevans/node-sonos/graphs/contributors).

[badge_sponsor]: https://img.shields.io/badge/Sponsor-on%20Github-red
[badge_issues]: https://img.shields.io/github/issues/svrooij/node-sonos-ts
[badge_npm]: https://img.shields.io/npm/v/@svrooij/sonos
[badge_build]: https://github.com/svrooij/node-sonos-ts/workflows/Run%20tests%20and%20publish/badge.svg

[link_sponsor]: https://github.com/sponsors/svrooij
[link_issues]: https://github.com/svrooij/node-sonos-ts/issues
[link_npm]: https://www.npmjs.com/package/@svrooij/sonos
[link_build]: https://github.com/svrooij/node-sonos-ts/actions
