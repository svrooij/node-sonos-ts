import { expect }  from 'chai'
import nock from 'nock'

import { TestHelpers } from '../test-helpers'
import { MusicServicesService } from '../../src/services/music-services.service'

describe('MusicServicesService', () => {
  describe('ListAndParseAvailableServices', () => {
    it('parses correctly and caching works', async () => {
      TestHelpers.mockSoapRequestWithFile('/MusicServices/Control',
        '"urn:schemas-upnp-org:service:MusicServices:1#ListAvailableServices"',
        '<u:ListAvailableServices xmlns:u="urn:schemas-upnp-org:service:MusicServices:1"></u:ListAvailableServices>',
        'ListAvailableServicesResponse',
        'MusicServices',
        ['services', 'responses', 'music-services.ListAvailableServices.xml']
      );

      const service = new MusicServicesService(TestHelpers.testHost, 1400)

      const result = await service.ListAndParseAvailableServices(true);
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(70);

      const musicService = result[0];
      expect(musicService).to.be.an('object');
      expect(musicService).to.have.property('Id', 38);
      expect(musicService).to.have.property('Name', '7digital');
      expect(musicService).to.have.nested.property('Policy.PollInterval', 30);

      const cachedResult = await service.ListAndParseAvailableServices(true);
      expect(cachedResult).to.be.an('array');
      expect(cachedResult).to.have.lengthOf(70);
    })
  })
})

