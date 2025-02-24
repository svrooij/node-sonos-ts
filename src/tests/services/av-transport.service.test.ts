
import { TestHelpers } from '../test-helpers';
import { PlayMode } from '../../models';
import { AVTransportService } from '../../services/av-transport.service';

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
      expect(result).toHaveProperty('FirstTrackNumberEnqueued', 1);
      expect(result).toHaveProperty('NewQueueLength', 1);
      expect(result).toHaveProperty('NumTracksAdded', 1);
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
      expect(result).toBeTruthy();
    });
  });

  describe('BecomeCoordinatorOfStandaloneGroup', () => {
    it('executes correct request', async () => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'BecomeCoordinatorOfStandaloneGroup',
        '<InstanceID>0</InstanceID>',
        '<DelegatedGroupCoordinatorID>RINCON_0000000000001400</DelegatedGroupCoordinatorID><NewGroupID>RINCON_0000000000001400:4444</NewGroupID>'
      );
      const service = new AVTransportService(TestHelpers.testHost);
      const result = await service.BecomeCoordinatorOfStandaloneGroup();
      expect(result).toBeDefined();
      expect(result.DelegatedGroupCoordinatorID).toBeDefined();
      expect(result.NewGroupID).toBeDefined();
    });
  });

  describe('ChangeCoordinator', () => {
    it('executes correct request', async () => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'ChangeCoordinator',
        '<InstanceID>0</InstanceID><CurrentCoordinator>RINCON_AA0000000001400</CurrentCoordinator><NewCoordinator>RINCON_000000000001400</NewCoordinator><NewTransportSettings></NewTransportSettings><CurrentAVTransportURI></CurrentAVTransportURI>',
        ''
      );
      const service = new AVTransportService(TestHelpers.testHost);
      const result = await service.ChangeCoordinator({ InstanceID: 0, CurrentCoordinator: 'RINCON_AA0000000001400',  NewCoordinator: 'RINCON_000000000001400', NewTransportSettings: '', CurrentAVTransportURI: ''});
      expect(result).toBe(true);
    });
  });

  describe('DelegateGroupCoordinationTo', () => {
    it('executes correct request', async () => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'DelegateGroupCoordinationTo',
        '<InstanceID>0</InstanceID><NewCoordinator>RINCON_000000000001400</NewCoordinator><RejoinGroup>1</RejoinGroup>',
        ''
      );
      const service = new AVTransportService(TestHelpers.testHost);
      const result = await service.DelegateGroupCoordinationTo({ InstanceID: 0, NewCoordinator: 'RINCON_000000000001400', RejoinGroup: true });
      expect(result).toBe(true);
    });
  });

  describe('EndDirectControlSession', () => {
    it('executes correct request', async () => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'EndDirectControlSession',
        '<InstanceID>0</InstanceID>',
        ''
      );
      const service = new AVTransportService(TestHelpers.testHost);
      const result = await service.EndDirectControlSession();
      expect(result).toBeTruthy();
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
      expect(result.CrossfadeMode).toBeTruthy();
    });
  });

  describe('GetCurrentTransportActions', () => {
    it('executes correct request', async () => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'GetCurrentTransportActions',
        '<InstanceID>0</InstanceID>',
        '<Actions>Set, Play</Actions>'
      );
      const service = new AVTransportService(TestHelpers.testHost);
      const result = await service.GetCurrentTransportActions();
      expect(result.Actions).toContain('Set');
      expect(result.Actions).toContain('Play');
    });
  });

  describe('GetDeviceCapabilities', () => {
    it('executes correct request', async () => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'GetDeviceCapabilities',
        '<InstanceID>0</InstanceID>',
        '<PlayMedia>NONE, NETWORK</PlayMedia><RecMedia>NOT_IMPLEMENTED</RecMedia><RecQualityModes>NOT_IMPLEMENTED</RecQualityModes>'
      );
      const service = new AVTransportService(TestHelpers.testHost);
      const result = await service.GetDeviceCapabilities();
      expect(result.PlayMedia).toContain('NONE');
      expect(result.PlayMedia).toContain('NETWORK');
      expect(result.RecMedia).toContain('NOT_IMPLEMENTED');
    });
  });

  describe('GetDeviceCapabilities', () => {
    it('executes correct request', async () => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'GetRemainingSleepTimerDuration',
        '<InstanceID>0</InstanceID>',
        '<RemainingSleepTimerDuration>00:29:44</RemainingSleepTimerDuration><CurrentSleepTimerGeneration>1</CurrentSleepTimerGeneration>'
      );
      const service = new AVTransportService(TestHelpers.testHost);
      const result = await service.GetRemainingSleepTimerDuration();
      expect(result.RemainingSleepTimerDuration).toEqual('00:29:44');
      expect(result.CurrentSleepTimerGeneration).toEqual(1);
    });
  });

  describe('GetMediaInfo()', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#GetMediaInfo"',
        '<u:GetMediaInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetMediaInfo>',
        'GetMediaInfoResponse',
        'AVTransport',
        '<NrTracks>300</NrTracks><MediaDuration>NOT_IMPLEMENTED</MediaDuration><CurrentURI>x-rincon-queue:RINCON_000xxx1400#0</CurrentURI><CurrentURIMetaData></CurrentURIMetaData><NextURI></NextURI><NextURIMetaData></NextURIMetaData><PlayMedium>NETWORK</PlayMedium><RecordMedium>NOT_IMPLEMENTED</RecordMedium><WriteStatus>NOT_IMPLEMENTED</WriteStatus>'
      );

      const service = new AVTransportService(TestHelpers.testHost, 1400);
      const result = await service.GetMediaInfo();
      expect(result).toHaveProperty('CurrentURI','x-rincon-queue:RINCON_000xxx1400#0');
    });
  });

  describe('GetPositionInfo()', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#GetPositionInfo"',
        '<u:GetPositionInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetPositionInfo>',
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
      expect(result).toHaveProperty('Track', 219);
      expect(result.TrackMetaData).toHaveProperty('Album', 'Happiness - Deluxe Edition');
    });
  });

  describe('GetRunningAlarmProperties', () => {
    it('executes correct request', async () => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'GetRunningAlarmProperties',
        '<InstanceID>0</InstanceID>',
        '<AlarmID>100</AlarmID><GroupID>FAKE_GROUP</GroupID><LoggedStartTime>2025-02-24T18:00:00z</LoggedStartTime>'
      );
      const service = new AVTransportService(TestHelpers.testHost);
      const result = await service.GetRunningAlarmProperties();
      expect(result.AlarmID).toBe(100);
      expect(result.GroupID).toBe('FAKE_GROUP');
      expect(result.LoggedStartTime).toBeDefined();
    });
  });

  describe('GetTransportSettings()', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#GetTransportSettings"',
        '<u:GetTransportSettings xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetTransportSettings>',
        'GetTransportSettingsResponse',
        'AVTransport',
        '<PlayMode>REPEAT_ALL</PlayMode><RecQualityMode>xxx</RecQualityMode>'
      );

      const service = new AVTransportService(TestHelpers.testHost, 1400);
      const result = await service.GetTransportSettings();
      expect(result).toHaveProperty('PlayMode', PlayMode.RepeatAll);
      expect(result).toHaveProperty('RecQualityMode', 'xxx');

    });
  });

  
  describe('NotifyDeletedURI', () => {
    it('executes correct request', async () => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'NotifyDeletedURI',
        '<InstanceID>0</InstanceID><DeletedURI>x-rincon-queue:RINCON_000xxx1400#0</DeletedURI>',
        ''
      );
      const service = new AVTransportService(TestHelpers.testHost);
      const result = await service.NotifyDeletedURI({InstanceID: 0, DeletedURI: 'x-rincon-queue:RINCON_000xxx1400#0'});
      expect(result).toBe(true);
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
        expect(error).toHaveProperty('Action', 'Play');
        expect(error).toHaveProperty('HttpStatusCode', 400);
        expect(error).toHaveProperty('name', 'HttpError');
        return;
      }

      // It should not get here
      expect(false).toBeTruthy();
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
        expect(error).toHaveProperty('Action', 'Play');
        expect(error).toHaveProperty('FaultCode', 's:Client');
        expect(error).toHaveProperty('Fault', 'UPnPError');
        expect(error).toHaveProperty('name', 'SonosError');
        expect(error).toHaveProperty('UpnpErrorCode', 718);
        return;
      }

      // It should not get here
      expect(false).toBeTruthy();
    });

    it('works', async () => {
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Play"',
        '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>',
        'PlayResponse',
        'AVTransport');
      const service = new AVTransportService(TestHelpers.testHost, 1400);

      const result = await service.Play({ InstanceID: 0, Speed: '1' });
      expect(result).toEqual(true);
    });
  });

  describe('RemoveAllTracksFromQueue', () => {
    it('executes correct request', async () => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'RemoveAllTracksFromQueue',
        '<InstanceID>0</InstanceID>',
        ''
      );
      const service = new AVTransportService(TestHelpers.testHost);
      const result = await service.RemoveAllTracksFromQueue();
      expect(result).toBe(true);
    });
  });

  describe('SaveQueue', () => {
    it('executes correct request', async () => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'SaveQueue',
        '<InstanceID>0</InstanceID><Title>My Queue</Title><ObjectID></ObjectID>',
        '<AssignedObjectID>Q:0/10</AssignedObjectID>'
      );
      const service = new AVTransportService(TestHelpers.testHost);
      const result = await service.SaveQueue({InstanceID: 0, Title: 'My Queue', ObjectID: ''});
      expect(result).toBeDefined();
      expect(result.AssignedObjectID).toBe('Q:0/10');
    });
  });

  describe('SnoozeAlarm', () => {
    it('executes correct request', async () => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'SnoozeAlarm',
        '<InstanceID>0</InstanceID><Duration>00:12:00</Duration>',
        ''
      );
      const service = new AVTransportService(TestHelpers.testHost);
      const result = await service.SnoozeAlarm({InstanceID: 0, Duration: '00:12:00' });
      expect(result).toBe(true);
    });
  });

  describe('Event parsing', () => {
    it('works', (done) => {
      process.env.SONOS_DISABLE_EVENTS = 'true'
      const service = new AVTransportService(TestHelpers.testHost, 1400);
      service.Events.once('serviceEvent', (data) => {
        expect(data.CurrentCrossfadeMode).toBeFalsy();
        expect(data.CurrentPlayMode).toEqual(PlayMode.Shuffle);
        expect(data.CurrentTrack).toEqual(36);
        expect(data.NumberOfTracks).toEqual(300);
        expect(data.TransportState).toEqual('PLAYING');


        done()
      })
      service.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><LastChange>&lt;Event xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/AVT/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;&lt;InstanceID val=&quot;0&quot;&gt;&lt;TransportState val=&quot;PLAYING&quot;/&gt;&lt;CurrentPlayMode val=&quot;SHUFFLE&quot;/&gt;&lt;CurrentCrossfadeMode val=&quot;0&quot;/&gt;&lt;NumberOfTracks val=&quot;300&quot;/&gt;&lt;CurrentTrack val=&quot;36&quot;/&gt;&lt;CurrentSection val=&quot;NOT_IMPLEMENTED&quot;/&gt;&lt;RecordStorageMedium val=&quot;NOT_IMPLEMENTED&quot;/&gt;&lt;PossiblePlaybackStorageMedia val=&quot;NONE, NETWORK&quot;/&gt;&lt;PossibleRecordStorageMedia val=&quot;NOT_IMPLEMENTED&quot;/&gt;&lt;RecordMediumWriteStatus val=&quot;NOT_IMPLEMENTED&quot;/&gt;&lt;CurrentRecordQualityMode val=&quot;NOT_IMPLEMENTED&quot;/&gt;&lt;PossibleRecordQualityModes val=&quot;NOT_IMPLEMENTED&quot;/&gt;&lt;/InstanceID&gt;&lt;/Event&gt;</LastChange></e:property></e:propertyset>');
      delete process.env.SONOS_DISABLE_EVENTS
    }, 1)
  })
});
