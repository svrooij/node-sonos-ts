const SonosDevice = require('../lib').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')
sonos.RenderingControlService.GetMute({ InstanceID: 0, Channel: 'Master' })
  .then(data => {
    console.log('Device muted', data);
  })
  .catch(err => {
    console.log(err)
  })
