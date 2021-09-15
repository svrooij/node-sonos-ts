const SonosDevice = require('../lib').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')

// sonos.TogglePlayback()
//   .then(success => console.log(success))
//   .catch(err => console.error(err))

// sonos.AVTransportService.GetPositionInfo()
//   .then(response => {
//     console.log(JSON.stringify(response, null, 2))
//   })
//   .catch(err => console.error(err))

// // sonos.AddUriToQueue('spotify:track:7dVjKRYCkszdHEHIBj9OMc')
// //  .then(success => console.log(success))
// //  .catch(err => console.error(err))

// sonos.SetAVTransportURI('x-sonosapi-stream:station_KISNFM?sid=162')
//   .then(success => {
//     return sonos.Play()
//   })
//   .catch(console.error)

sonos.AVTransportService.Play({ InstanceID: 0, Speed: '1' })
  .catch(err => {
    console.log('Sonos error', err)
  })
