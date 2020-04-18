import SonosDevice from '../src/sonos-device'
import { expect }  from 'chai'

(process.env.SONOS_HOST ? describe : describe.skip)('SonosDevice - local', () => {
  it('Loads alarms correctly', async () => {
    const device = new SonosDevice(process.env.SONOS_HOST || '')
    const alarms = await device.AlarmList()
    expect(alarms).to.be.an('array');
    expect(alarms).to.have.length.greaterThan(1)
  })

  it('Joins a device by name', async () => {
    const device = new SonosDevice(process.env.SONOS_HOST || '')
    const result = await device.JoinGroup('Slaapkamer')
    await device.AVTransportService.BecomeCoordinatorOfStandaloneGroup();
    expect(result).to.be.eq(true);
  })
})
