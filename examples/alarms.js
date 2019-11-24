const SonosDevice = require('../lib').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')
sonos.AlarmList()
  .then(alarms => {
    alarms.forEach(alarm => {
      console.log('Alarm %d  %s is %s', alarm.ID, alarm.StartLocalTime, alarm.Enabled === 1 ? 'enabled' : 'disabled')
    })
  })
  .catch(err => {
    console.log(err)
  })

// sonos.AlarmPatch({ ID: 1711, Enabled: false })
//   .then(result => console.log(result))
//   .catch(err => {
//     console.error(err)
//   })
