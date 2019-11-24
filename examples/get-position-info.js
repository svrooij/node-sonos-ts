const SonosDevice = require('../lib').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')
sonos.AVTransportService.GetPositionInfo()
  .then(info => {
    console.log(JSON.stringify(info, null, 2))
  })
  .catch(err => {
    console.log(err)
  })

// sonos.AVTransportService.Next().catch(console.error)
