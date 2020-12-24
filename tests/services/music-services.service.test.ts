import { expect } from 'chai';

import { TestHelpers } from '../test-helpers';
import { MusicServicesService } from '../../src/services/music-services.service';
import { ServiceEvents } from '../../src/models';
import nock from 'nock';

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
    it('does cache the list', async () => {
      const scope = TestHelpers.mockMusicServicesListResponse();

      const service = new MusicServicesService(TestHelpers.testHost, 1400);

      const result = await service.ListAndParseAvailableServices(true);
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(70);

      const musicService = result[0];
      expect(musicService).to.be.an('object');
      expect(musicService).to.have.property('Id', 38);
      expect(musicService).to.have.property('Name', '7digital');
      expect(musicService).to.have.nested.property('Policy.PollInterval', 30);
      scope.done();
      nock.cleanAll(); // Remove all current items.
      const cachedResult = await service.ListAndParseAvailableServices(true);
      expect(cachedResult).to.be.an('array');
      expect(cachedResult).to.have.lengthOf(70);
    });
  });

  describe('ListAndParseAvailableServices', () => {
    it('skips cache if disabled', async () => {
      const scope = TestHelpers.mockMusicServicesListResponse();

      const service = new MusicServicesService(TestHelpers.testHost, 1400);

      const result = await service.ListAndParseAvailableServices();
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(70);

      scope.done();
      nock.cleanAll(); // Remove all current items.
      try {
        await service.ListAndParseAvailableServices(false);
      } catch (error) {
        expect(error).to.have.property('code', 'ECONNREFUSED');
        return;
      }

      // It should not get here
      expect(false).to.be.true;
    });
  });

  describe('ListAndParseAvailableServices', () => {
    it('new copy if cache = false', async () => {
      const scope = TestHelpers.mockMusicServicesListResponse();

      const service = new MusicServicesService(TestHelpers.testHost, 1400);

      const result = await service.ListAndParseAvailableServices(true);
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(70);

      scope.done();
      nock.cleanAll(); // Remove all current items.
      try {
        await service.ListAndParseAvailableServices();
      } catch (error) {
        expect(error).to.have.property('code', 'ECONNREFUSED');
        return;
      }

      // It should not get here
      expect(false).to.be.true;
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

  describe('Event parsing', () => {
    it('works', (done) => {
      process.env.SONOS_DISABLE_EVENTS = 'true'
      const service = new MusicServicesService(TestHelpers.testHost, 1400);
      service.Events.once(ServiceEvents.Data, (data) => {
        expect(data.ServiceListVersion).to.be.equal('RINCON_xxx01400:990');
        done();
      })
      service.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><ServiceListVersion>RINCON_xxx01400:990</ServiceListVersion></e:property></e:propertyset>');
      delete process.env.SONOS_DISABLE_EVENTS
    }, 1)
  })
});
