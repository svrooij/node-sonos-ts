const SonosDevice = require('../lib').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')
sonos.AlarmClockService.ListAndParseAlarms()
  .then(alarms => {
    alarms.forEach(alarm => {
      console.log('Alarm %d  %s is %s', alarm.ID, alarm.StartLocalTime, alarm.Enabled ? 'enabled' : 'disabled')
    })
  })
  .catch(err => {
    console.log(err)
  })

// sonos.AlarmClockService.PatchAlarm({ ID: 1711, Enabled: false })
//   .then(result => console.log(result))
//   .catch(err => {
//     console.error(err)
//   })
