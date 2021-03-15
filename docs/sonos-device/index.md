---
layout: default
title: Sonos device
nav_order: 3
has_children: true
permalink: /sonos-device
has_toc: false
---
# Sonos Device

At this point you should have an initialized **SonosDevice**.

```js
const SonosDevice = require('@svrooij/sonos').SonosDevice
const sonos = new SonosDevice('192.168.x.x')
```

Explore all the posibillities of the SonosDevice below.

## Methods

Check-out all the nice [methods](methods.html) we implemented.

## Notifications and Text-to-speech

You can also use our [notification and text-to-speech](notifications-and-tts.html) features.

## Events

We made it really easy to get [events](events.html) from the sonos speakers, so you'll always know what is playing and how loud.

## All services

Each Sonos devices exposes serveral [services](services/services.html) which are used to control everything, like you would with the sonos app.

![Awesome illustration from undraw.co](/assets/images/undraw_listening_1u79.svg)
