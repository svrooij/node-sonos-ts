const SonosManager = require('../lib').SonosManager

const manager = new SonosManager()

// Connect known player
// manager.InitializeFromDevice(process.env.SONOS_HOST || '192.168.96.56')
//   .then(console.log)
//   .then(() => {
//     manager.Groups.forEach(g => console.log(g.Name))
//   })
//   .catch(console.error)

// Do device discovery
manager.InitializeWithDiscovery(10)
  .then(console.log)
  .then(() => {
    manager.Devices.forEach(d => console.log('Device %s (%s) is joined in %s', d.Name, d.uuid, d.GroupName))
  })
  .catch(console.error)
