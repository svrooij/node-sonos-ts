import { expect }  from 'chai'

import { TestHelpers } from '../test-helpers'
import { AlarmClockService } from '../../src/services/alarm-clock.service'

describe('AlarmClockService', () => {
  describe('GetTimeZone', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/AlarmClock/Control',
        '"urn:schemas-upnp-org:service:AlarmClock:1#GetTimeZone"',
        '<u:GetTimeZone xmlns:u="urn:schemas-upnp-org:service:AlarmClock:1"></u:GetTimeZone>',
        'GetTimeZoneResponse',
        'AlarmClock',
        '<AutoAdjustDst>1</AutoAdjustDst><Index>27</Index>'
      );

      var service = new AlarmClockService(TestHelpers.testHost, 1400)
      // var service = new AlarmClockService('192.168.96.56', 1400)

      var result = await service.GetTimeZone();
      expect(result).to.have.nested.property('AutoAdjustDst', 1)
      expect(result).to.have.nested.property('Index', 27)

    })
  })
})

