/*
  This is an example for the PlayNotificationTwo Variant (which is experimental).
  NotificationTwo has a different handling in regards to playing multiple notifications queued.

  Running this example you'll hear multiple notification beeing played after each other
  and afterwards Sonos reverts to previous track and volume.

  As seen below it doesn't matter if you queue up all notifications at once, or add some items to the queue while it is
  already in the middle of it.
*/

const SonosDevice = require('../lib').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')

// Pre-start listening for events for more efficient handling.
sonos.Events.on('currentTrack', (track) => {
  console.log('TrackChanged %o', track);
});

function playNotification(trackUri, durationInMs) {
  const specificTimeout = Math.ceil(durationInMs / 1000) + 5;
  const options = {
    catchQueueErrors: true,
    trackUri: trackUri,
    delayMs: 750,
    onlyWhenPlaying: false,
    resolveAfterRevert: false,
    volume: 40,
    specificTimeout: specificTimeout,
    notificationFired: (played) => {
     console.log(
          `Sonos Notification ("${trackUri}") was${played ? '' : "n't"} played (duration: "${specificTimeout}")`,
      );
    },
  };
  sonos.PlayNotificationTwo(options);
}

playNotification('https://cdn.smartersoft-group.com/various/someone-at-the-door.mp3', 2000);
playNotification('https://cdn.smartersoft-group.com/various/pull-bell-short.mp3', 2500);
setTimeout(() => {
  playNotification('https://cdn.smartersoft-group.com/various/someone-at-the-door.mp3', 2000);
}, 1000);
setTimeout(() => {
  playNotification('https://cdn.smartersoft-group.com/various/pull-bell-short.mp3', 2500);
}, 2500);
setTimeout(() => {
  process.exit();
}, 30000);
