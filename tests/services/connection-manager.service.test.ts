import { expect } from 'chai';
import { TestHelpers } from '../test-helpers';
import { ConnectionManagerService } from '../../src/services/connection-manager.service';

describe('ConnectionManagerService', () => {

  describe('GetCurrentConnectionIDs()', () => {
    it('works', async () => {
      const service = new ConnectionManagerService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaRenderer/ConnectionManager/Control', 'ConnectionManager',
        'GetCurrentConnectionIDs', undefined,
        '<CurrentConnectionIDs></CurrentConnectionIDs>');
      
      const result = await service.GetCurrentConnectionIDs();
      expect(result).to.have.nested.property('CurrentConnectionIDs');
    });
  });

  // Not working, no idea what the input should be
  describe.skip('GetCurrentConnectionIDs()', () => {
    it('works', async () => {
      const service = new ConnectionManagerService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaRenderer/ConnectionManager/Control', 'ConnectionManager',
        'GetCurrentConnectionIDs', undefined,
        '<CurrentConnectionIDs></CurrentConnectionIDs>');
      
      const result = await service.GetCurrentConnectionInfo({ConnectionID: 2 });
      expect(result).to.have.nested.property('CurrentConnectionIDs');
    });
  });

  describe('GetProtocolInfo()', () => {
    it('works', async () => {
      const service = new ConnectionManagerService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaRenderer/ConnectionManager/Control', 'ConnectionManager',
        'GetProtocolInfo', undefined,
        '<Source></Source><Sink>http-get:*:audio/mp3:*,x-file-cifs:*:audio/mp3:*,http-get:*:audio/mp4:*,x-file-cifs:*:audio/mp4:*,http-get:*:audio/x-m4a:*,x-file-cifs:*:audio/x-m4a:*,http-get:*:audio/mpeg:*,x-file-cifs:*:audio/mpeg:*,http-get:*:audio/mpegurl:*,x-file-cifs:*:audio/mpegurl:*,file:*:audio/mpegurl:*,http-get:*:audio/x-mpegurl:*,x-file-cifs:*:audio/x-mpegurl:*,http-get:*:application/x-mpegurl:*,x-file-cifs:*:application/x-mpegurl:*,http-get:*:application/vnd.apple.mpegurl:*,x-file-cifs:*:application/vnd.apple.mpegurl:*,http-get:*:audio/mpeg3:*,x-file-cifs:*:audio/mpeg3:*,http-get:*:audio/wav:*,x-file-cifs:*:audio/wav:*,http-get:*:audio/x-wav:*,x-file-cifs:*:audio/x-wav:*,http-get:*:audio/wma:*,x-file-cifs:*:audio/wma:*,http-get:*:audio/x-ms-wma:*,x-file-cifs:*:audio/x-ms-wma:*,http-get:*:audio/aiff:*,x-file-cifs:*:audio/aiff:*,http-get:*:audio/x-aiff:*,x-file-cifs:*:audio/x-aiff:*,http-get:*:audio/flac:*,x-file-cifs:*:audio/flac:*,http-get:*:application/ogg:*,x-file-cifs:*:application/ogg:*,http-get:*:audio/ogg:*,x-file-cifs:*:audio/ogg:*,http-get:*:audio/audible:*,x-file-cifs:*:audio/audible:*,sonos.com-mms:*:audio/x-ms-wma:*,sonos.com-http:*:audio/mp3:*,sonos.com-http:*:audio/mpeg:*,sonos.com-http:*:audio/mpeg3:*,sonos.com-http:*:audio/wma:*,sonos.com-http:*:audio/mp4:*,sonos.com-http:*:audio/x-m4a:*,sonos.com-http:*:audio/wav:*,sonos.com-http:*:audio/aiff:*,sonos.com-http:*:audio/flac:*,sonos.com-http:*:application/ogg:*,sonos.com-http:*:application/x-mpegURL:*,sonos.com-spotify:*:audio/x-spotify:*,sonos.com-rtrecent:*:audio/x-sonos-recent:*,x-rincon:*:*:*,x-rincon-mp3radio:*:*:*,x-rincon-playlist:*:*:*,x-rincon-queue:*:*:*,x-rincon-stream:*:*:*,x-sonosapi-stream:*:*:*,x-sonosapi-hls:*:*:*,x-sonosapi-hls-static:*:*:*,x-sonosapi-radio:*:audio/x-sonosapi-radio:*,x-rincon-cpcontainer:*:*:*,</Sink');
      
      const result = await service.GetProtocolInfo();
      expect(result).to.have.nested.property('Source');
      expect(result).to.have.nested.property('Sink');
    });
  });

  describe('Event parsing', () => {
    it('works', (done) => {
      process.env.SONOS_DISABLE_EVENTS = 'true'
      const service = new ConnectionManagerService(TestHelpers.testHost, 1400);
      service.Events.once('serviceEvent', (data) => {
        expect(data.CurrentConnectionIDs).to.be.undefined;
        expect(data.SourceProtocolInfo).to.be.undefined;
        expect(data.SinkProtocolInfo).to.contain('x-sonosapi-radio:*:audio/x-sonosapi-radio:*');
        done();
      })
      service.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><SourceProtocolInfo></SourceProtocolInfo></e:property><e:property><SinkProtocolInfo>http-get:*:audio/mp3:*,x-file-cifs:*:audio/mp3:*,http-get:*:audio/mp4:*,x-file-cifs:*:audio/mp4:*,http-get:*:audio/x-m4a:*,x-file-cifs:*:audio/x-m4a:*,http-get:*:audio/mpeg:*,x-file-cifs:*:audio/mpeg:*,http-get:*:audio/mpegurl:*,x-file-cifs:*:audio/mpegurl:*,file:*:audio/mpegurl:*,http-get:*:audio/x-mpegurl:*,x-file-cifs:*:audio/x-mpegurl:*,http…/ogg:*,sonos.com-http:*:application/x-mpegURL:*,sonos.com-spotify:*:audio/x-spotify:*,sonos.com-rtrecent:*:audio/x-sonos-recent:*,x-rincon:*:*:*,x-rincon-mp3radio:*:*:*,x-rincon-playlist:*:*:*,x-rincon-queue:*:*:*,x-rincon-stream:*:*:*,x-sonosapi-stream:*:*:*,x-sonosapi-hls:*:*:*,x-sonosapi-hls-static:*:*:*,x-sonosapi-radio:*:audio/x-sonosapi-radio:*,x-rincon-cpcontainer:*:*:*,</SinkProtocolInfo></e:property><e:property><CurrentConnectionIDs></CurrentConnectionIDs></e:property></e:propertyset>');
      delete process.env.SONOS_DISABLE_EVENTS
    }, 1)
  })
});
