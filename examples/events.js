const SonosDevice = require('../lib/').SonosDevice
const ServiceEvents = require('../lib/models/sonos-events').ServiceEvents

const kantoor = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56', 1400, 'RINCON_000Esecret1400')

kantoor.AlarmClockService.Events.on(ServiceEvents.Data, data => {
  console.log('AlarmClock data %s', JSON.stringify(data))
})

kantoor.ZoneGroupTopologyService.Events.on(ServiceEvents.Data, data => {
  console.log('ZoneGroupTopology data %s', JSON.stringify(data))
})

kantoor.AVTransportService.Events.on(ServiceEvents.Data, data => {
  console.log('AVTransport lastchange %s', JSON.stringify(data, null, 2))
})

kantoor.RenderingControlService.Events.on(ServiceEvents.Data, data => {
  console.log('RenderingControl lastchange %s', JSON.stringify(data, null, 2))
})

setInterval(async () => {
  const result = await kantoor.RefreshEventSubscriptions();
  console.log('Succesfully refreshed the events %s', result)
}, 300 * 1000)

process.on('SIGINT', () => {
  console.log('Hold-on cancelling all subscriptions')
  kantoor.AlarmClockService.Events.removeAllListeners(ServiceEvents.Data)
  kantoor.AVTransportService.Events.removeAllListeners(ServiceEvents.Data)
  kantoor.RenderingControlService.Events.removeAllListeners(ServiceEvents.Data)
  kantoor.ZoneGroupTopologyService.Events.removeAllListeners(ServiceEvents.Data)

  setTimeout(() => {
    process.exit(0)
  }, 1000)
})
