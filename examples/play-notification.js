const SonosDevice = require('../lib').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')

sonos.PlayNotification({
  trackUri: 'https://cdn.smartersoft-group.com/various/pull-bell-short.mp3', // Can be any uri sonos understands
  onlyWhenPlaying: true, // make sure that it only plays when you're listening to music. So it won't play when you're sleeping.
  timeout: 10, // If the events don't work (to see when it stops playing) or if you turned on a stream, it will revert back after this amount of seconds.
  volume: 15 }) // Set the volume for the notification (and revert back afterwards)
  .then(played => {
    console.log('Played notification %o', played)
    setTimeout(() => {
      process.exit(0)
    }, 2000)
  })
