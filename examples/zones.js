const SonosDevice = require('../lib').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')

sonos.JoinGroup('keuken')
  .then(console.log)
  .catch(console.error)
