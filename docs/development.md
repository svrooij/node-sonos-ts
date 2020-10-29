---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: Development
nav_order: 10
permalink: /development
---

# Development
{: .no_toc }

This library is hosted on [Github](https://github.com/svrooij/node-sonos-ts), contributions are more then welcome.

1. TOC
{:toc}

---

## Fork library

You should start by creating a [fork](https://github.com/svrooij/node-sonos-ts/fork). Or if you already had a fork sync the fork:

```shell
# Add the remote, call it "upstream": (only once)
git remote add upstream https://github.com/svrooij/node-sonos-ts.git

# Fetch all the branches of that remote into remote-tracking branches,
# such as upstream/master:
git fetch upstream

# Make sure that you're on your master branch:
git checkout master

# Rewrite your master branch so that any commits of yours that
# aren't already in upstream/master are replayed on top of that
# other branch:
git rebase upstream/master
```

## Compile the library

Before you can use this library is has to be compiled.

`npm run install && npm run build`

## Run the tests

After changing somehting you should run the tests (as they are automatically run before your PR is accepted). Important code should be covered by tests, and is uploaded to [Coveralls.io](https://coveralls.io/github/svrooij/node-sonos-ts)

`npm run test`

or (to test against your actual device)

`SONOS_HOST=192.168.x.x npm run test`

## Debugging

This library has several VSCode tasks defined, be sure to change your sonos host in the `.vscode/launch.json` file. If you open an example file and press **F5** the example is run and you can set breakpoints in the sample code and in the TypeScript code.

You can also debug the service generator of the tests.

This library makes use of [node debug](https://www.npmjs.com/package/debug), if you want to see debug logs you can set the `DEBUG` environment variable to one of the following values.
If you run the examples with the VSCode debug task, this variable is set to `sonos:*` so you should see all the logs.

|Environment variable|What will log|
|--------------------|-------------|
|`DEBUG=sonos:*`|See all debug logs.|
|`DEBUG=sonos:device`|See all debug logs from the SonosDevice class.|
|`DEBUG=sonos:service:*`|See all debug logs for all the various services (this is where most of the magic happens).|
|`DEBUG=sonos:service:[service_name]`|See all debug logs for a specific service.|
|`DEBUG=sonos:service:*:[ip]`|See all debug logs for all the various services for a single device (this is where most of the magic happens).|
|`DEBUG=sonos:metadata`|See all debug logs for the metadata helper.|

## Repository content

- **docs/** These documentations
- **examples/** Several examples on how to use this library.
- **img/** Some static images used in the library
- **src/generator/** The client generator (written in node). It's used to generate all the services and the base device.
- **src/helpers/** Some usefull typesscript class, used everywhere in the library.
- **src/helpers/metadata-helper.ts** This class will generate (actually guess) the needed metadata. Easily extended.
- **src/models/** Hand-crafted models used by the library.
- **src/services/** All automatic generated services.
- **src/services/base-service.ts** Base service class, where all the generated services depend opon. This is where most of the magic happens.
- **src/index.ts** Just an index to expose all classes that need to be exposed.
- **src/sonos-device-base.ts** Generated SonosDeviceBase, to expose all the services in the derived class.
- **src/sonos-device-discovery.ts** Async device discovery (by using SSDP, multicast)
- **src/sonos-device.ts** SonosDevice class, this is the main entry point to control devices.
- **src/sonos-event-listener.ts** Event listener, used for logical devices and for all sonos events.
- **src/sonos-manager.ts** SonosManager class, logical devices.
- **tests/..** - All the tests, using the Jest framework.

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
