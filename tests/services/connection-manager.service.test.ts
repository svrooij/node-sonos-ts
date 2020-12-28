import { expect } from 'chai';
import { TestHelpers } from '../test-helpers';
import { ConnectionManagerService } from '../../src/services/connection-manager.service';

describe('ConnectionManagerService', () => {
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
