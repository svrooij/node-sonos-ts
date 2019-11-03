const SonosDevice = require('../lib/sonos-device').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')
sonos.AVTransportService.GetPositionInfo()
  .then(info => {
    console.log(info)
  })
  .catch(err => {
    console.log(err)
  })
