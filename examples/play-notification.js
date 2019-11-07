const SonosDevice = require('../lib').SonosDevice
const PlayNotificationOptions = require('../lib').PlayNotificationOptions

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')

sonos.PlayNotification(
  new PlayNotificationOptions('https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-the-sound-pack-tree/tspt_pull_bell_02_065.mp3?_=1', false, undefined, undefined, 4))
  .then(played => {
    console.log('Played notification %o', played)
    setTimeout(() => {
      process.exit(0)
    }, 2000)
  })

// sonos.SeeKTrack(5)
//   .then(console.log)
//   .catch(console.error)
