import { expect } from 'chai';
import { TestHelpers } from '../test-helpers';
import { PlayMode } from '../../src/models';
import { AVTransportService } from '../../src/services/av-transport.service';

describe('AVTransportService', () => {
  describe('AddURIToQueue', () => {
    it('parses response', async () => {
      const track = 'http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3';
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"',
        '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>http://livingears.com/music/SceneNotHeard/091909/Do%20You%20Mind%20Kyla.mp3</EnqueuedURI><EnqueueAsNext>1</EnqueueAsNext><EnqueuedURIMetaData></EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued></u:AddURIToQueue>',
        'AddURIToQueueResponse',
        'AVTransport',
        '<FirstTrackNumberEnqueued>1</FirstTrackNumberEnqueued><NewQueueLength>1</NewQueueLength><NumTracksAdded>1</NumTracksAdded>');

      const service = new AVTransportService(TestHelpers.testHost, 1400);

      const result = await service.AddURIToQueue({
        InstanceID: 0,
        EnqueuedURI: track,
        EnqueueAsNext: true,
        EnqueuedURIMetaData: '',
        DesiredFirstTrackNumberEnqueued: 0,
      });
      expect(result).to.have.nested.property('FirstTrackNumberEnqueued', 1);
      expect(result).to.have.nested.property('NewQueueLength', 1);
      expect(result).to.have.nested.property('NumTracksAdded', 1);
    });
  });

  describe('BackupQueue', () => {
    it('executes correct request', async () => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'BackupQueue',
        '<InstanceID>0</InstanceID>',
        ''
      );
      const service = new AVTransportService(TestHelpers.testHost);
      const result = await service.BackupQueue();
      expect(result).to.be.true;
    });
  });

  describe('GetCrossfadeMode', () => {
    it('executes correct request', async () => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'GetCrossfadeMode',
        '<InstanceID>0</InstanceID>',
        '<CrossfadeMode>1</CrossfadeMode>'
      );
      const service = new AVTransportService(TestHelpers.testHost);
      const result = await service.GetCrossfadeMode();
      expect(result.CrossfadeMode).to.be.true;
    });
  });

  describe('GetCurrentTransportActions', () => {
    it('executes correct request', async (done) => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'GetCurrentTransportActions',
        '<InstanceID>0</InstanceID>',
        '<Actions>Set, Play</Actions>'
      );
      const service = new AVTransportService(TestHelpers.testHost);
      const result = await service.GetCurrentTransportActions();
      expect(result.Actions).to.contain('Play');
      done();
    });
  });

  describe('GetDeviceCapabilities', () => {
    it('executes correct request', async (done) => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'GetDeviceCapabilities',
        '<InstanceID>0</InstanceID>',
        '<PlayMedia>NONE, NETWORK</PlayMedia><RecMedia>NOT_IMPLEMENTED</RecMedia><RecQualityModes>NOT_IMPLEMENTED</RecQualityModes>'
      );
      const service = new AVTransportService(TestHelpers.testHost);
      const result = await service.GetDeviceCapabilities();
      expect(result.PlayMedia).to.contain('NONE');
      expect(result.PlayMedia).to.contain('NETWORK');
      expect(result.RecMedia).to.contain('NOT_IMPLEMENTED');
      done();
    });
  });

  describe('GetDeviceCapabilities', () => {
    it('executes correct request', async (done) => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'GetRemainingSleepTimerDuration',
        '<InstanceID>0</InstanceID>',
        '<RemainingSleepTimerDuration>00:29:44</RemainingSleepTimerDuration><CurrentSleepTimerGeneration>1</CurrentSleepTimerGeneration>'
      );
      const service = new AVTransportService(TestHelpers.testHost);
      const result = await service.GetRemainingSleepTimerDuration();
      expect(result.RemainingSleepTimerDuration).to.be.equal('00:29:44');
      expect(result.CurrentSleepTimerGeneration).to.be.equal(1);
      done();
    });
  });

  describe('GetMediaInfo()', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#GetMediaInfo"',
        '<u:GetMediaInfo xmlns:u=\"urn:schemas-upnp-org:service:AVTransport:1\"><InstanceID>0</InstanceID></u:GetMediaInfo>',
        'GetMediaInfoResponse',
        'AVTransport',
        '<NrTracks>300</NrTracks><MediaDuration>NOT_IMPLEMENTED</MediaDuration><CurrentURI>x-rincon-queue:RINCON_000xxx1400#0</CurrentURI><CurrentURIMetaData></CurrentURIMetaData><NextURI></NextURI><NextURIMetaData></NextURIMetaData><PlayMedium>NETWORK</PlayMedium><RecordMedium>NOT_IMPLEMENTED</RecordMedium><WriteStatus>NOT_IMPLEMENTED</WriteStatus>'
      );

      const service = new AVTransportService(TestHelpers.testHost, 1400);
      const result = await service.GetMediaInfo();
      expect(result).to.have.nested.property('CurrentURI','x-rincon-queue:RINCON_000xxx1400#0');
    });
  });

  describe('GetPositionInfo()', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#GetPositionInfo"',
        '<u:GetPositionInfo xmlns:u=\"urn:schemas-upnp-org:service:AVTransport:1\"><InstanceID>0</InstanceID></u:GetPositionInfo>',
        'GetPositionInfoResponse',
        'AVTransport',
        `<Track>219</Track>
        <TrackDuration>0:04:34</TrackDuration>
        <TrackMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;-1&quot; parentID=&quot;-1&quot; restricted=&quot;true&quot;&gt;&lt;res protocolInfo=&quot;sonos.com-spotify:*:audio/x-spotify:*&quot; duration=&quot;0:04:34&quot;&gt;x-sonos-spotify:spotify%3atrack%3a6bblF1vFB4fFJYcvr63cBQ?sid=9&amp;amp;flags=8224&amp;amp;sn=7&lt;/res&gt;&lt;r:streamContent&gt;&lt;/r:streamContent&gt;&lt;upnp:albumArtURI&gt;/getaa?s=1&amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a6bblF1vFB4fFJYcvr63cBQ%3fsid%3d9%26flags%3d8224%26sn%3d7&lt;/upnp:albumArtURI&gt;&lt;dc:title&gt;All I Want for Christmas Is New Year&amp;apos;s Day&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.musicTrack&lt;/upnp:class&gt;&lt;dc:creator&gt;Hurts&lt;/dc:creator&gt;&lt;upnp:album&gt;Happiness - Deluxe Edition&lt;/upnp:album&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</TrackMetaData>
        <TrackURI>x-sonos-spotify:spotify%3atrack%3a6bblF1vFB4fFJYcvr63cBQ?sid=9&amp;flags=8224&amp;sn=7</TrackURI>
        <RelTime>0:02:04</RelTime
        ><AbsTime>NOT_IMPLEMENTED</AbsTime>
        <RelCount>2147483647</RelCount>
        <AbsCount>2147483647</AbsCount>`
      );

      const service = new AVTransportService(TestHelpers.testHost, 1400);
      //const service = new AVTransportService('192.168.96.56', 1400);
      const result = await service.GetPositionInfo();
      expect(result).to.have.nested.property('Track', 219);
      expect(result.TrackMetaData).to.have.nested.property('Album', 'Happiness - Deluxe Edition');
    });
  });

  describe('GetTransportSettings()', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#GetTransportSettings"',
        '<u:GetTransportSettings xmlns:u=\"urn:schemas-upnp-org:service:AVTransport:1\"><InstanceID>0</InstanceID></u:GetTransportSettings>',
        'GetTransportSettingsResponse',
        'AVTransport',
        '<PlayMode>REPEAT_ALL</PlayMode><RecQualityMode>xxx</RecQualityMode>'
      );

      const service = new AVTransportService(TestHelpers.testHost, 1400);
      const result = await service.GetTransportSettings();
      expect(result).to.have.nested.property('PlayMode', PlayMode.RepeatAll);
      expect(result).to.have.nested.property('RecQualityMode', 'xxx');

    });
  });

  describe('Play()', () => {
    it('throws HttpError when faulty but no soap error', async () => {
      TestHelpers.mockHttpError('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Play"',
        '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>2</InstanceID><Speed>bla</Speed></u:Play>',
        400);

      const service = new AVTransportService(TestHelpers.testHost, 1400);

      try {
        await service.Play({ InstanceID: 2, Speed: 'bla' });
      } catch (error) {
        expect(error).to.have.property('Action', 'Play');
        expect(error).to.have.property('HttpStatusCode', 400);
        expect(error).to.have.property('name', 'HttpError');
        return;
      }

      // It should not get here
      expect(false).to.be.true;
    });

    it('throws SonosError on faulty input', async () => {
      TestHelpers.mockSoapError('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Play"',
        '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>2</InstanceID><Speed>bla</Speed></u:Play>',
        718);
      const service = new AVTransportService(TestHelpers.testHost, 1400);
      try {
        await service.Play({ InstanceID: 2, Speed: 'bla' });
      } catch (error) {
        expect(error).to.have.property('Action', 'Play');
        expect(error).to.have.property('FaultCode', 's:Client');
        expect(error).to.have.property('Fault', 'UPnPError');
        expect(error).to.have.property('name', 'SonosError');
        expect(error).to.have.property('UpnpErrorCode', 718);
        return;
      }

      // It should not get here
      expect(false).to.be.true;
    });

    it('works', async () => {
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Play"',
        '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>',
        'PlayResponse',
        'AVTransport');
      const service = new AVTransportService(TestHelpers.testHost, 1400);

      const result = await service.Play({ InstanceID: 0, Speed: '1' });
      expect(result).to.be.eq(true);
    });
  });

  describe('Event parsing', () => {
    it('works', (done) => {
      process.env.SONOS_DISABLE_EVENTS = 'true'
      const service = new AVTransportService(TestHelpers.testHost, 1400);
      service.Events.once('serviceEvent', (data) => {
        expect(data.CurrentCrossfadeMode).to.be.false;
        expect(data.CurrentPlayMode).to.be.equal(PlayMode.Shuffle);
        expect(data.CurrentTrack).to.be.equal(36);
        expect(data.NumberOfTracks).to.be.equal(300);
        expect(data.TransportState).to.be.equal('PLAYING');


        done()
      })
      service.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><LastChange>&lt;Event xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/AVT/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;&lt;InstanceID val=&quot;0&quot;&gt;&lt;TransportState val=&quot;PLAYING&quot;/&gt;&lt;CurrentPlayMode val=&quot;SHUFFLE&quot;/&gt;&lt;CurrentCrossfadeMode val=&quot;0&quot;/&gt;&lt;NumberOfTracks val=&quot;300&quot;/&gt;&lt;CurrentTrack val=&quot;36&quot;/&gt;&lt;CurrentSection val=…=&quot;NOT_IMPLEMENTED&quot;/&gt;&lt;RecordStorageMedium val=&quot;NOT_IMPLEMENTED&quot;/&gt;&lt;PossiblePlaybackStorageMedia val=&quot;NONE, NETWORK&quot;/&gt;&lt;PossibleRecordStorageMedia val=&quot;NOT_IMPLEMENTED&quot;/&gt;&lt;RecordMediumWriteStatus val=&quot;NOT_IMPLEMENTED&quot;/&gt;&lt;CurrentRecordQualityMode val=&quot;NOT_IMPLEMENTED&quot;/&gt;&lt;PossibleRecordQualityModes val=&quot;NOT_IMPLEMENTED&quot;/&gt;&lt;/InstanceID&gt;&lt;/Event&gt;</LastChange></e:property></e:propertyset>');
      delete process.env.SONOS_DISABLE_EVENTS
    }, 1)
  })
});
