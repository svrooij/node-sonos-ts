---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: Home
nav_order: 1
permalink: /
---

# Sonos (typescript / node)

[![Support me on Github][badge_sponsor]][link_sponsor]
[![npm][badge_npm]][link_npm]
[![Coverage Status](https://coveralls.io/repos/github/svrooij/node-sonos-ts/badge.svg?branch=master)](https://coveralls.io/github/svrooij/node-sonos-ts?branch=master)
[![Run tests and publish][badge_build]][link_build]
[![github issues][badge_issues]][link_issues]
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](//github.com/semantic-release/semantic-release)

[![Sonos api documentation][badge_sonos-docs]][link_sonos-docs]
[![Sonos2mqtt][badge_sonos-mqtt]][link_sonos-mqtt]
[![Sonos cli][badge_sonos-cli]][link_sonos-cli]
[![Sonos typescript this library][badge_sonos-typescript]][link_sonos-typescript]

Typescript library to control your sonos speakers. Can be used in other typescript (or node) apps.

This library is in no way connected to [Sonos](//en.wikipedia.org/wiki/Sonos).

## Key features

- [x] Auto generated client (supporting all features the normal app does). [Sonos api documentation and generator](https://svrooij.io/sonos-api-docs/)
- [x] Auto discovery or one known device as starting point.
- [x] Support for logical devices (grouped speakers) from the start.
- [x] Access to all (generated) services.
- [x] Sonos device class with extra functionality.
- [x] Strongly typed service events.
- [x] Easier implemented [metadata generation](./src/helpers/metadata-helper.ts).

## Get Started

To use the library just add it to your project. `npm install @svrooij/sonos`. And start using it. This library isn't meant to be used by itself, as you see in the [examples](./examples) you still need to use node (or typescript).

See **[Documentation](https://svrooij.github.io/node-sonos-ts/getting-started.html)**

[![Sonos typescript this library][badge_sonos-typescript]][link_sonos-typescript]

## Packages using node-sonos-ts

|Name|Maintainer|Description|
|----|----------|----------|
|[sonos2mqtt](https://svrooij.github.io/sonos2mqtt)|[@svrooij](//github.com/svrooij)|A bridge between sonos and mqtt, so you can control all your sonos devices right from your mqtt server|
|[sonos-cli](//github.com/svrooij/sonos-cli)|[@svrooij](//github.com/svrooij)|An experimental command line interface for your sonos devices.|

Also using this library, but not in the list? Send a PR.

## Additional packages

|Name|Maintainer|Description|
|----|----------|----------|
|[sonos-tts-polly](//github.com/svrooij/node-sonos-tts-polly)|[@svrooij](//github.com/svrooij)|Amazon polly [text-to-speech server](https://static.svrooij.nl/node-sonos-ts/sonos-device/notifications-and-tts.html#text-to-speech)|

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

[badge_sponsor]: https://img.shields.io/badge/Sponsor-on%20Github-red?style=flat-square
[badge_issues]: https://img.shields.io/github/issues/svrooij/node-sonos-ts?style=flat-square
[badge_npm]: https://img.shields.io/npm/v/@svrooij/sonos?style=flat-square
[badge_build]: https://github.com/svrooij/node-sonos-ts/workflows/Run%20tests%20and%20publish/badge.svg
[badge_sonos-docs]: https://img.shields.io/badge/sonos-api-blue?style=flat-square
[badge_sonos-cli]: https://img.shields.io/badge/sonos-cli-blue?style=flat-square
[badge_sonos-mqtt]: https://img.shields.io/badge/sonos-mqtt-blue?style=flat-square
[badge_sonos-typescript]: https://img.shields.io/badge/sonos-typescript-blue?style=flat-square

[link_sponsor]: https://github.com/sponsors/svrooij
[link_issues]: https://github.com/svrooij/node-sonos-ts/issues
[link_npm]: https://www.npmjs.com/package/@svrooij/sonos
[link_build]: https://github.com/svrooij/node-sonos-ts/actions
[link_sonos-docs]: https://svrooij.io/sonos-api-docs
[link_sonos-cli]: https://github.com/svrooij/sonos-cli
[link_sonos-mqtt]: https://svrooij.io/sonos2mqtt
[link_sonos-typescript]: https://svrooij.io/node-sonos-ts
