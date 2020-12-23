import { expect } from 'chai';

import { TestHelpers } from '../test-helpers';
import { MusicServicesService } from '../../src/services/music-services.service';

describe('MusicServicesService', () => {
  describe('GetSessionId', () => {
    it('sends correct request', async () => {
      TestHelpers.mockRequest('/MusicServices/Control',
        '"urn:schemas-upnp-org:service:MusicServices:1#GetSessionId"',
        '<u:GetSessionId xmlns:u="urn:schemas-upnp-org:service:MusicServices:1"><ServiceId>10</ServiceId><Username>testuser</Username></u:GetSessionId>',
        'GetSessionIdResponse',
        'MusicServices',
        '<SessionId>38</SessionsId>');

      const service = new MusicServicesService(TestHelpers.testHost, 1400);

      const result = await service.GetSessionId({ ServiceId: 10, Username: 'testuser' });
      expect(result).to.be.an('object');
      expect(result).to.have.property('SessionId', 38);
    });
  });

  describe('ListAndParseAvailableServices', () => {
    it('parses correctly and caching works', async () => {
      TestHelpers.mockMusicServicesListResponse();

      const service = new MusicServicesService(TestHelpers.testHost, 1400);

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
    });
  });

  describe('UpdateAvailableServices', () => {
    it('sends correct request', async () => {
      TestHelpers.mockRequest('/MusicServices/Control',
        '"urn:schemas-upnp-org:service:MusicServices:1#UpdateAvailableServices"',
        '<u:UpdateAvailableServices xmlns:u="urn:schemas-upnp-org:service:MusicServices:1"></u:UpdateAvailableServices>',
        'UpdateAvailableServicesResponse',
        'MusicServices');

      const service = new MusicServicesService(TestHelpers.testHost, 1400);

      const result = await service.UpdateAvailableServices();
      expect(result).to.be.true;
    });
  });
});
