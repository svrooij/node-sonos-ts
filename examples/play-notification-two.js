/*
  This is an example for the PlayNotificationTwo Variant (which is experimental).
  NotificationTwo has a different handling in regards to playing multiple notifications queued.

  Running this example you'll hear multiple notification being played after each other
  and afterwards Sonos reverts to previous track and volume.

  As seen below it doesn't matter if you queue up all notifications at once, or add some items to the queue while it is
  already in the middle of it.
*/

const SonosDevice = require('../lib').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.178.41')

// Pre-start listening for events for more efficient handling.
sonos.Events.on('currentTrack', (track) => {
  console.log('TrackChanged %o', track);
});

function playNotification(trackUri, durationInMs, resolveCB) {
  const specificTimeout = Math.ceil(durationInMs / 1000) + 5;
  const options = {
    catchQueueErrors: true,
    trackUri: trackUri,
    delayMs: 750,
    onlyWhenPlaying: false,
    resolveAfterRevert: false,
    volume: 40,
    specificTimeout: specificTimeout
  };
  sonos.PlayNotificationTwo(options).then((played) => {resolveCB(played);});
}

playNotification(
    'https://cdn.smartersoft-group.com/various/someone-at-the-door.mp3',
    2000,
    (played) => {
      console.log(
          `Notification 1 was${played ? '' : "n't"} played`,
      );
    }
);
// sonos.PlayTTSTwo({
//   catchQueueErrors: true,
//   text: 'Hallo',
//   delayMs: 750,
//   specificTimeout: 10000
// });
playNotification(
    'https://cdn.smartersoft-group.com/various/pull-bell-short.mp3',
    2500,
    (played) => {
      console.log(
          `Notification 2 was${played ? '' : "n't"} played`,
      );
    });
setTimeout(() => {
  playNotification(
      'https://cdn.smartersoft-group.com/various/someone-at-the-door.mp3',
      2000,
      (played) => {
        console.log(
            `Notification 3 was${played ? '' : "n't"} played`,
        );
      });
}, 1000);
setTimeout(() => {
  playNotification(
      'https://cdn.smartersoft-group.com/various/pull-bell-short.mp3',
      2500,
      (played) => {
        console.log(
            `Notification 4 was${played ? '' : "n't"} played`,
        );
      });
}, 2500);
setTimeout(() => {
  process.exit();
}, 30000);
