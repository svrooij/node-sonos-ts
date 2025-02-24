

import { TestHelpers } from '../test-helpers';
import { MusicServicesService } from '../../services/music-services.service.extension';
import { ServiceEvents } from '../../models';
import nock from 'nock';

describe('MusicServicesService', () => {
  describe('GetSessionId', () => {
    it('sends correct request', async () => {
      TestHelpers.mockRequest('/MusicServices/Control',
        '"urn:schemas-upnp-org:service:MusicServices:1#GetSessionId"',
        '<u:GetSessionId xmlns:u="urn:schemas-upnp-org:service:MusicServices:1"><ServiceId>10</ServiceId><Username>testuser</Username></u:GetSessionId>',
        'GetSessionIdResponse',
        'MusicServices',
        '<SessionId>38</SessionId>');

      const service = new MusicServicesService(TestHelpers.testHost, 1400);

      const result = await service.GetSessionId({ ServiceId: 10, Username: 'testuser' });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('SessionId', 38);
    });
  });

  describe('ListAndParseAvailableServices', () => {
    it('does cache the list', async () => {
      const scope = TestHelpers.mockMusicServicesListResponse();

      const service = new MusicServicesService(TestHelpers.testHost, 1400);

      const result = await service.ListAndParseAvailableServices(true);
      expect(result).toBeDefined();
      expect(result).toHaveLength(70)

      const musicService = result[0];
      expect(musicService).toBeDefined();
      expect(musicService).toHaveProperty('Id', 38);
      expect(musicService).toHaveProperty('Name', '7digital');
      expect(musicService).toHaveProperty('Policy.PollInterval', 30);
      scope.done();
      nock.cleanAll(); // Remove all current items.
      const cachedResult = await service.ListAndParseAvailableServices(true);
      expect(cachedResult).toBeDefined();
      expect(cachedResult).toHaveLength(70)
    });
  });

  describe('ListAndParseAvailableServices', () => {
    it('skips cache if disabled', async () => {
      const scope = TestHelpers.mockMusicServicesListResponse();

      const service = new MusicServicesService(TestHelpers.testHost, 1400);

      const result = await service.ListAndParseAvailableServices();
      expect(result).toBeDefined();
      expect(result).toHaveLength(70)

      scope.done();
      //nock.cleanAll(); // Remove all current items.
      try {
        await service.ListAndParseAvailableServices(false);
      } catch  {
        expect(true).toBeTruthy();
        return;
      }

      // It should not get here
      expect(false).toBeTruthy();
    });
  });

  describe('ListAndParseAvailableServices', () => {
    it('new copy if cache = false', async () => {
      const scope = TestHelpers.mockMusicServicesListResponse();

      const service = new MusicServicesService(TestHelpers.testHost, 1400);

      const result = await service.ListAndParseAvailableServices(true);
      expect(result).toBeDefined();
      expect(result).toHaveLength(70)

      scope.done();
      //nock.cleanAll(); // Remove all current items.
      try {
        await service.ListAndParseAvailableServices();
      } catch {
        expect(true).toBeTruthy();
        return;
      }

      // It should not get here
      expect(false).toBeTruthy();
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
      expect(result).toBeTruthy();
    });
  });

  describe('Event parsing', () => {
    it('works', (done) => {
      process.env.SONOS_DISABLE_EVENTS = 'true'
      const service = new MusicServicesService(TestHelpers.testHost, 1400);
      service.Events.once(ServiceEvents.ServiceEvent, (data) => {
        expect(data.ServiceListVersion).toEqual('RINCON_xxx01400:990');
        done();
      })
      service.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><ServiceListVersion>RINCON_xxx01400:990</ServiceListVersion></e:property></e:propertyset>');
      delete process.env.SONOS_DISABLE_EVENTS
    }, 1000)
  })
});
