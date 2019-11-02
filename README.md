# Node Sonos (the typescript version)

[![Support me on Github][badge_sponsor]][link_sponsor]

A node library to control a sonos device, written in Typescript.

## Improvements over [node-sonos](https://github.com/bencevans/node-sonos)

The original [node-sonos](https://github.com/bencevans/node-sonos) is started a long time ago, before async programming in node.
While it works great, it has some rough edges that are hard to solve.

This new library is build from the ground up using `node-fetch` for the requests and `fast-xml-parser` for the xml stuff.

One of the most important parts of this new library is the [**service-generator**](./src/generator/service-generator.js), it parses the `/xml/device_description.xml` file from the sonos device. And generates a strong typed service class for it. This means that we can support all the possible actions your sonos device has. And it also means that it will tell your which parameters it expects.

- [x] Strong typed (auto generated) client
- [ ] Starting from auto discovery or one sonos host ip
- [ ] Zone groups as a starting point (logical devices)
- [ ] Using the events even more
- [ ] The sonos device will expose all the generated services, or an extended version of them.
- [ ] The sonos device will contain extra features and shortcuts to services.

## Devloper section

This will contain usefull information if you want to fix a bug you've found in this library. You always start with cloning the repo and doing a `npm install` in the folder.

### (Re-)generate services

I've created a one-liner to regenerate all the generated services. `SONOS_HOST=192.168.x.x npm run gen-srv`.
This will parse the device properties and will create all the services in the `/src/services` folder. New services will have the **new-** filename prefix, and should be added in the **getFilenameForService** method.

### Compile the library

Because the library is written in typescript, you'll need to compile it before using it. Run `npm run build` to have the compiler generate the actual library in the `lib` folder.

## Big thanks to all the original contributors

Creating a library from scratch is quite hard, and I'm using a lot of stuff from the original library. That wouldn't exists without the [contributors](https://github.com/bencevans/node-sonos/graphs/contributors).

[badge_sponsor]: https://img.shields.io/badge/Sponsor-on%20Github-red
[link_sponsor]: https://github.com/sponsors/svrooij
