const SonosDevice = require('../lib').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')

// sonos.GetQueue()
//   .then(resp => {
//     console.log(resp)
//   })
//   .catch(console.error)

// Search for artist eminem
sonos.BrowseWithDefaults('A:ARTIST:eminem')
  .then(async resp => {
    // You will now have the artist reference in the ItemId, this can be used to do a new call.
    if (resp.NumberReturned > 0) {
      return sonos.BrowseWithDefaults(resp.Result[0].ItemId)
    }
    return resp
  })
  .then(resp => {
    console.log(resp)
  })
  .catch(console.error)
