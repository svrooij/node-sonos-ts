const SonosManager = require('../lib/').SonosManager

const manager = new SonosManager();
manager.InitializeFromDevice(process.env.SONOS_HOST || '192.168.96.56', 1400)
  .then(result => {
    if(result) {
      manager.Devices.forEach(d => {
        console.log('Start listening for event from %s', d.Name);
        d.Events.on('groupname', name => {
          console.log('Device %s has a new group name %s', d.Name, name);
        });
      })
    }
  })

process.on('SIGINT', () => {
  console.log('Hold-on cancelling all subscriptions')
  manager.Devices.forEach(d => d.CancelEvents());
  manager.CancelSubscription();

  setTimeout(() => {
    process.exit(0)
  }, 300)
})
