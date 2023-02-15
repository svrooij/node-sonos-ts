const SonosDevice = require('../lib').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')

// Pre-start listening for events for more efficient handling.
sonos.Events.on('currentTrack', (track) => {
  console.log('TrackChanged %o', track);
});


// setTimeout(async () => {
//   // Add a second notification (by some other event)
//   await sonos.PlayNotificationAudioClip({
//     trackUri: 'https://cdn.smartersoft-group.com/various/someone-at-the-door.mp3', // Cached text-to-speech file.
//     onlyWhenPlaying: false, // make sure that it only plays when you're listening to music. So it won't play when you're sleeping.
//     volume: 20, // Set the volume for the notification (and revert back afterwards)
//   });
//   await sonos.PlayNotificationAudioClip({
//     trackUri: 'https://cdn.smartersoft-group.com/various/someone-at-the-door.mp3', // Cached text-to-speech file.
//     onlyWhenPlaying: false, // make sure that it only plays when you're listening to music. So it won't play when you're sleeping.
//     volume: 20, // Set the volume for the notification (and revert back afterwards)
//   });
// }, 500)

sonos.PlayNotificationAudioClip({
  trackUri: 'https://cdn.smartersoft-group.com/various/pull-bell-short.mp3', // Can be any uri sonos understands
  onlyWhenPlaying: false, // make sure that it only plays when you're listening to music. So it won't play when you're sleeping.
  volume: 80, // Set the volume for the notification (and revert back afterwards)
})
  .then(queued => {
    console.log('Queued notification %o', queued)
    
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    sonos.CancelEvents();
  });

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