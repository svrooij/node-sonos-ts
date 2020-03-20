const SonosManager = require('../lib').SonosManager
const SonosEvents = require('../lib/models/sonos-events').SonosEvents

const manager = new SonosManager()

// Switch on one of the following lines
// Do device discovery
// manager.InitializeWithDiscovery(10)
// Connect known device
manager.InitializeFromDevice(process.env.SONOS_HOST || '192.168.96.56')
  .then(console.log)
  .then(() => {
    manager.Devices.forEach(d => {
      console.log('Device %s (%s) is joined in %s', d.Name, d.uuid, d.GroupName)
      d.Events.on(SonosEvents.Coordinator, uuid => {
        console.log('Coordinator for %s changed to %s', d.Name, uuid)
      })
      d.Events.on(SonosEvents.GroupName, newName => {
        console.log('Groupname for %s changed to %s', d.Name, newName)
      })
      d.Events.on(SonosEvents.CurrentTrack, uri => {
        console.log('Current Track for %s %s', d.Name, uri)
      })
      d.Events.on(SonosEvents.CurrentTrackMetadata, metadata => {
        console.log('Current Track metadata for %s %s', d.Name, JSON.stringify(metadata, null, 2))
      })
      d.Events.on(SonosEvents.NextTrack, uri => {
        console.log('Next Track for %s %s', d.Name, uri)
      })
      d.Events.on(SonosEvents.NextTrackMetadata, metadata => {
        console.log('Next Track metadata for %s %s', d.Name, JSON.stringify(metadata, null, 2))
      })
      d.Events.on(SonosEvents.CurrentTransportState, state => {
        console.log('New state for %s %s', d.Name, state)
      })
      d.Events.on(SonosEvents.CurrentTransportStateSimple, state => {
        console.log('New simple state for %s %s', d.Name, state)
      })
    })
  })
  .catch(console.error)

process.on('SIGINT', () => {
  manager.Devices.forEach(d => {
    d.CancelEvents()
  })
  manager.CancelSubscription()
  setTimeout(() => {
    process.exit(0)
  }, 200)
})
