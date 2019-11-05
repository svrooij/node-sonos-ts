const SonosDevice = require('../lib/sonos-device').SonosDevice

const kantoor = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56', 1400, 'RINCON_000Esecret1400')

// kantoor.AlarmClockService.Events.on('data', data => {
//   console.log('AlarmClock data %s', JSON.stringify(data))
// })

kantoor.ZoneGroupTopologyService.Events.on('data', data => {
  console.log('ZoneGroupTopology data %s', JSON.stringify(data))
})

kantoor.ZoneGroupTopologyService.Events.on('lastchange', data => {
  console.log('ZoneGroupTopology lastchange %s', JSON.stringify(data))
})

// kantoor.AVTransportService.Events.on('lastchange', data => {
//   console.log('AVTransport lastchange %s', JSON.stringify(data))
// })

process.on('SIGINT', () => {
  console.log('Hold-on cancelling all subscriptions')
  process.exit(0)
})

kantoor.AVTransportService.GetMediaInfo().then(info => {
  console.log(info)
})

kantoor.AVTransportService.GetPositionInfo().then(info => {
  console.log(info)
})
