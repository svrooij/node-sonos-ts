const SonosDevice = require('../lib').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')

// // Turn on night mode
// sonos.RenderingControlService.SetEQ({ InstanceID: 0, EQType: 'NightMode', DesiredValue: 1 }).catch(console.error)

// // Turn on speech enhancement
// sonos.RenderingControlService.SetEQ({ InstanceID: 0, EQType: 'DialogLevel', DesiredValue: 1 }).catch(console.error)

// Night mode status
sonos.RenderingControlService.GetEQ({ InstanceID: 0, EQType: 'NightMode' }).then(resp => console.log(resp.CurrentValue))

// Speech enhancement status
sonos.RenderingControlService.GetEQ({ InstanceID: 0, EQType: 'DialogLevel' }).then(resp => console.log(resp.CurrentValue))
