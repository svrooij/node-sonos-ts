const SonosDevice = require('../lib/sonos-device').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')
sonos.LoadDeviceData()
  .then(success => {
    console.log(sonos.Name)
  })
  .catch(console.error)

sonos.DevicePropertiesService.GetZoneAttributes()
  .then(properties => {
    console.log(properties)
  })
  .catch(console.error)
