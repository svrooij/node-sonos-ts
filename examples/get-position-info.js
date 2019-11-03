const SonosDevice = require('../lib').SonosDevice
const XmlHelper = require('../lib').XmlHelper

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')
sonos.AVTransportService.GetPositionInfo()
  .then(info => {
    console.log(info)
    console.log(XmlHelper.ParseDIDLTrack(XmlHelper.DecodeAndParseXml(info.TrackMetaData), sonos.host))
  })
  .catch(err => {
    console.log(err)
  })
