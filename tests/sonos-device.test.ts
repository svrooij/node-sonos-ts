import { SonosDevice } from '../src/sonos-device'
import { expect }  from 'chai'
import 'mocha';

(process.env.SONOS_HOST ? describe : describe.skip)('SonosDevice - local', function () {
  it('Loads alarms correctly', async function() {
    const device = new SonosDevice(process.env.SONOS_HOST || '')
    const alarms = await device.AlarmList()
    expect(alarms).to.be.an('array');
    expect(alarms).to.have.length.greaterThan(1)
  })

  it('Joins a device by name', async function() {
    const device = new SonosDevice(process.env.SONOS_HOST || '')
    const result = await device.JoinGroup('Slaapkamer')
    expect(result).to.be.eq(true);
    await device.AVTransportService.BecomeCoordinatorOfStandaloneGroup();
  })

})