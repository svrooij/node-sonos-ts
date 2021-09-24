# Sonos Typescript template

This folder contains the template files for [sonos-ts](://svrooij.io/node-sonos-ts/).

## Folder content

| File | Description | Remarks |
|:-----|:------------|:--------|
| [docs-index](./docs-index.hbs) | Documentation Index | |
| [docs-service](./docs-service.hbs) | Service documentation | |
| [service-export](./service-export.hbs) | Service export | Exporting all the services to be available for one import |
| [service](./service.hbs) | Single service | Strong type service template, see [details](#sonos-service) |
| [sonos-base](./sonos-base.hbs) | Sonos base device | To enable generating a single class **SonosDevice** with a generated base |
| [sonos-upnp-errors](./sonos-upnp-errors.hbs) | All errors | Default sonos UPNP errors |

## Sonos Service

The [service file](./service.hbs) uses some extra handlebarjs handlers to get it to generate the correct file.

Handlebars is used to generate the service but it doesn't support special `if` conditions, for instance to only add a piece of code when the variable is equal to something else. Since we want some pieces of code to only be added to specific services, the generator adds some special handlers.

- **are_equal** is used like `{{#if (are_equal variable_name value)}}` sample `{{#if (are_equal serviceName 'AlarmClockService')}}`
- **or** is used like `{{#if (or (are_equal name 'Volume') (are_equal name 'Mute'))}}`
