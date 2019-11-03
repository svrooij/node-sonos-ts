const SonosManager = require('../lib').SonosManager

const manager = new SonosManager()
manager.InitializeFromDevice(process.env.SONOS_HOST || '192.168.96.56')
  .then(console.log)
  .then(() => {
    manager.Groups.forEach(g => console.log(g.Name))
  })
  .catch(console.error)
