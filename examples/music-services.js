const SonosDevice = require('../lib').SonosDevice
const XmlHelper = require('../lib').XmlHelper

const SmapiClient = require('../lib').SmapiClient

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')

// sonos.SystemPropertiesService.GetRDM().then(resp => {
//   console.log('RDM %j', resp.RDMValue)
// }).catch(console.error)

// Get the Device ID
// sonos.SystemPropertiesService.GetString({ VariableName: 'R_TrialZPSerial' }).then(resp => {
//   console.log('GetString R_TrialZPSerial %s', resp.StringValue)
// }).catch(console.error)

// sonos.SystemPropertiesService.GetString({ VariableName: 'HiddenPreloadSvcs' }).then(resp => {
//   console.log('GetString HiddenPreloadSvcs %s', resp.StringValue)
// }).catch(console.error)

// sonos.SystemPropertiesService.GetString({ VariableName: 'UMTracking' }).then(resp => {
//   console.log('GetString UMTracking %s', resp.StringValue)
// }).catch(console.error)

// sonos.SystemPropertiesService.GetString({ VariableName: 'R_CustomerID' }).then(resp => {
//   console.log('GetString R_CustomerID %s', resp.StringValue)
// }).catch(console.error)

// sonos.MusicServicesService.GetSessionId({ ServiceId: 254, Username: '' }).then(resp => {
//   console.log(resp.SessionId)
// }).catch(console.error)

sonos.MusicServicesList().then(services => {
  // var annonymous = services.filter(s => s.Policy.Auth === 'Anonymous')
  // console.log(JSON.stringify(annonymous, null, 2))
  services.forEach(s => {
    var cap = parseInt(s.Capabilities)
    console.log('%s%s\t%s\t%s\t%s', s.Id.padEnd(5, ' '), s.Name.padEnd(20, ' '), s.Policy.Auth.padEnd(9, ' '), s.Capabilities.toString().padStart(9, ' '), cap.toString(2).padStart(25, ' '))
  })
}).catch(console.error)

// sonos.MusicServicesClient('NRK Radio')
//   .then(musicClient => {
//     return musicClient.Search({ id: 'A:STATION', term: 'P1', index: 0, count: 10 })
//   })
//   .then(searchResult => {
//     console.log(JSON.stringify(searchResult, null, 2))
//     return sonos.SetAVTransportURI(searchResult.mediaMetadata[0].trackUri).then(success => sonos.Play())
//   })
//   .catch(console.error)

// sonos.MusicServicesClient('radioPup')
//   .then(musicClient => {
//     return musicClient.Search({ id: 'A:STATION', term: 'KISS FM To', index: 0, count: 10 })
//   })
//   .then(searchResult => {
//     console.log(JSON.stringify(searchResult, null, 2))
//     return sonos.SetAVTransportURI(searchResult.mediaMetadata[0].trackUri).then(success => sonos.Play())
//   })
//   .catch(console.error)

// const client = new SmapiClient({ name: 'radioPup', url: 'https://sonos.townsquaremedia.com/index.php', deviceId: '00-0E-58-64-4C-BC:A' })
// client.Search({ id: 'A:STATION', term: 'Tod', index: 0, count: 5 }).then(resp => {
//   console.log(JSON.stringify(resp, null, 2))
// }).catch(console.error)

// client.GetMediaUri({ id: 'station_TSM_CHRISTMAS' }).then(resp => {
//   console.log(JSON.stringify(resp, null, 2))
// }).catch(console.error)

// client.GetMediaMetadata({ id: 'station_TSM_CHRISTMAS' }).then(resp => {
//   console.log(JSON.stringify(resp, null, 2))
// }).catch(console.error)

// soap.createClientAsync('http://developer-assets.ws.sonos.com/files/Sonoswsdl-1.19.4-20190411.142401-3.wsdl', undefined, 'http://psapi.nrk.no/sonos/sonos.svc').then(music => {
//   console.log('Got client')
//   music.searchAsync({ search: 'bla', count: 10, index: 0 }).then(resp => {
//     console.log(resp)
//   }).catch(console.error)
// })
