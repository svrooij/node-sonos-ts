const SonosDevice = require('../lib').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')

// Send Play command to AVTransportService (with auto json parsing)
sonos.ExecuteCommand('AVTransportService.Play', '{"InstanceID": 0, "Speed": "1" }').catch(console.error)

// Send Play command to AVTransportService
sonos.ExecuteCommand('AVTransportService.Play', { InstanceID: 0, Speed: '1' }).catch(console.error)

// Send Pause command to AVTransportService (no parameters)
sonos.ExecuteCommand('AVTransportService.Pause').catch(console.error)

// Execute toggle playback
sonos.ExecuteCommand('TogglePlayback').catch(console.error)
