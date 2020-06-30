# Sonos - service generator

This folder has all the ingredients to generate the TypeScript classes as used in [@svrooij/sonos](https://www.npmjs.com/package/@svrooij/sonos). It can also be used to generate strong typed sonos libraries for other languages.

This generator uses loads the device description, then uses some user-defined knowlage about the methods and the classes to generate the [discovered-services.json](discovered-services.json) file. So everybody can debug the generator (or use the discovery logic for some other platform/output).
With the **discovered-services** loaded, it will generate the [service index](../services/index.ts), all individual [services](../services/) and the [SonosDeviceBase](../sonos-device-base.ts). You shouldn't change these files manually, please change the generator (input) to generate the required result.

Folder content:

- `extensions/*` - This folder contains all user-defined extensions for the generated services. If a file with the same name as a [service](../services) filename exists, it is merged with the generated service. (Before changing take a look at the structure in the existing files).
- `templates/index.template.hbs` - Handlebar template to generate [services/index.ts](../services/index.ts).
- `templates/service.template.hbs` - Handlebar template to generate the individual [services](../services/).
- `templates/sonos-base.template.hbs` - Handlebar template to generate [sonos-device-base.ts](../sonos-device-base.ts).
- `discovered-services.json` - Intermediate output from the service generator. (should not be manually changed)
- `discovered-services.genX_XX.json` - Cached services from several models. (should not be manually changed)
- `documentation.json` - User-generated documentation about the available services.

## Documentation file

The **user-generated** [documentation file](documentation.json) has the following structure.

```json
{
  "AlarmClockService": {
    "Description": "Control the sonos alarms",
    "File": "alarm-clock.service.ts",
    "Methods": {
      "DestroyAlarm": {
        "Description": "Delete an alarm",
        "Params": {
          "ID": "The Alarm ID, see ListAndParseAlarms"
        }
      },
      "ListAlarms": {
        "Description": "Get the AlarmList as XML, use ListAndParseAlarms for parsed version"
      }
    },
    "EventProperties": {
      "Volume": {
        "Typescript": "ChannelValue<number>",
        "IsChannelValue": true
      }
    }
  }
}
```

|Property|Optional|Description|
|--------|--------|-----------|
|`{ServiceName}`| |The name of the service as set in the discovery document of the sonos speaker. (eg. `AlarmClockService`)|
|`File`| |The filename this service should be saved to, (to override some filenames)|
|`Description`|yes|The description of the service, input for JSDOC on Service.|
|`EventProperties`|yes|Change the type of the generated properties in the service event|
|`EventProperties.{PropertyName}`| |The property you want to change the type for|
|`EventProperties.{PropertyName}.Typescript`| |The new type for this property|
|`Methods.{method}`|yes|Document the methods in this service. Use the exact method name from the service documentation file.|
|`Methods.{method}.Description`|yes|The description of this method. JSDoc on method|
|`Methods.{method}.Params.{param}`|yes|The description of a single parameter. Use the exact parameter name from the service documentation file.|

## Running the generator

- `SONOS_HOST=192.168.x.x npm run gen-srv` in root of repository.
- `SONOS_HOST=192.168.x.x node service-generator.js --save-description --load-files --generate` in generator folder.
- **Debug generator** task in Visual Studio Code (be sure to change the sonos host in the [launch file](../../.vscode/launch.json)).

## Use generator in other project

You can either change the handlebar templates to you liking or use the [discovered-services.json](discovered-services.json) file as a source to create your own library.
