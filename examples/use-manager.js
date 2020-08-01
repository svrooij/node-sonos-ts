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
      console.log('Device %s (%s) is joined in %s', d.Name, d.Uuid, d.GroupName)
      d.Events.on(SonosEvents.Coordinator, uuid => {
        console.log('Coordinator for %s changed to %s', d.Name, Uuid)
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
    return manager.PlayNotification({
      trackUri: 'https://cdn.smartersoft-group.com/various/pull-bell-short.mp3', // Can be any uri sonos understands
      // trackUri: 'https://cdn.smartersoft-group.com/various/someone-at-the-door.mp3', // Cached text-to-speech file.
      onlyWhenPlaying: true, // make sure that it only plays when you're listening to music. So it won't play when you're sleeping.
      timeout: 10, // If the events don't work (to see when it stops playing) or if you turned on a stream, it will revert back after this amount of seconds.
      volume: 15, // Set the volume for the notification (and revert back afterwards)
      delayMs: 700 // Pause between commands in ms, (when sonos fails to play notification often).
    })
  })
  .catch(console.error)

manager.onNewDevice((device) => {
  console.log('New device found %s %s', device.Name, device.Uuid);
})

process.on('SIGINT', () => {
  manager.Devices.forEach(d => {
    d.CancelEvents()
  })
  manager.CancelSubscription()
  setTimeout(() => {
    process.exit(0)
  }, 200)
})
