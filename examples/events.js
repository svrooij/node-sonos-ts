const SonosDevice = require('../lib/sonos-device').SonosDevice
const ServiceEvents = require('../lib/models/sonos-events').ServiceEvents

const kantoor = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56', 1400, 'RINCON_000Esecret1400')

kantoor.AlarmClockService.Events.on(ServiceEvents.Data, data => {
  console.log('AlarmClock data %s', JSON.stringify(data))
})

// kantoor.ZoneGroupTopologyService.Events.on('data', data => {
//   console.log('ZoneGroupTopology data %s', JSON.stringify(data))
// })

// kantoor.ZoneGroupTopologyService.Events.on('lastchange', data => {
//   console.log('ZoneGroupTopology lastchange %s', JSON.stringify(data))
// })

kantoor.AVTransportService.Events.on(ServiceEvents.LastChange, data => {
  console.log('AVTransport lastchange %s', JSON.stringify(data, null, 2))
})

kantoor.RenderingControlService.Events.on(ServiceEvents.LastChange, data => {
  console.log('RenderingControl lastchange %s', JSON.stringify(data, null, 2))
})

process.on('SIGINT', () => {
  console.log('Hold-on cancelling all subscriptions')
  kantoor.AVTransportService.Events.removeAllListeners(ServiceEvents.LastChange)
  kantoor.RenderingControlService.Events.removeAllListeners(ServiceEvents.LastChange)
  setTimeout(() => {
    process.exit(0)
  }, 1000)
})
