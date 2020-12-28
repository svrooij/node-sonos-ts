const SonosDevice = require('../lib').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')

// Pre-start listening for events for more efficient handling.
sonos.Events.on('volume', (vol) => {
  console.log('new volume %o', vol);
});

setTimeout(async () => {
  // Add a second notification (by some other event)
  sonos.PlayNotification({
    trackUri: 'https://cdn.smartersoft-group.com/various/someone-at-the-door.mp3', // Cached text-to-speech file.
    onlyWhenPlaying: false, // make sure that it only plays when you're listening to music. So it won't play when you're sleeping.
    timeout: 10, // If the events don't work (to see when it stops playing) or if you turned on a stream, it will revert back after this amount of seconds.
    volume: 16, // Set the volume for the notification (and revert back afterwards)
    delayMs: 100 // Pause between commands in ms, (when sonos fails to play notification often).
  })
}, 500)

sonos.PlayNotification({
  trackUri: 'https://cdn.smartersoft-group.com/various/pull-bell-short.mp3', // Can be any uri sonos understands
  // trackUri: 'https://cdn.smartersoft-group.com/various/someone-at-the-door.mp3', // Cached text-to-speech file.
  onlyWhenPlaying: false, // make sure that it only plays when you're listening to music. So it won't play when you're sleeping.
  timeout: 10, // If the events don't work (to see when it stops playing) or if you turned on a stream, it will revert back after this amount of seconds.
  volume: 15, // Set the volume for the notification (and revert back afterwards)
  delayMs: 100 // Pause between commands in ms, (when sonos fails to play notification often).
})
  .then(played => {
    console.log('Played notification(s) %o', played)
    sonos.CancelEvents();
    setTimeout(() => {
      process.exit(0)
    }, 1000)
  })
  .catch(console.error)

// If you have a TTS endpoint, you can do text-to-speech
// PlayTTS() will just call a server to generate the TTS mp3 file and then call PlayNotification().

// sonos.PlayTTS({ text: 'Someone at the front-door', lang: 'en-US', gender: 'male', volume: 50 })
//   .then(played => {
//     console.log('Played notification %o', played)
//     setTimeout(() => {
//       process.exit(0)
//     }, 2000)
//   })
//   .catch(console.error)