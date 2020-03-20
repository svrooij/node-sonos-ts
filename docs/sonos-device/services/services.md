---
layout: default
title: Services
parent: Sonos device
nav_order: 4
has_children: true
---

# Services
{: .no_toc }

Every action that is send to a Sonos speaker, is actually a SOAP request to one of the defined services. All these services are described in the device description. This library uses a [generator](//github.com/svrooij/node-sonos-ts/src/generator) to create a client service file for all these services based on that description.

All services that your Sonos speaker has can be used by this library.

You can do the same with this library as with the controller app.
