import { expect }  from 'chai'
import nock from 'nock'
import SonosDevice from '../src/sonos-device'

import { TestHelpers } from './test-helpers';
import SonosEventListener from '../src/sonos-event-listener';
import { Guid } from 'guid-typescript';
import { SmapiClient } from '../src/musicservices/smapi-client';
import { AsyncHelper } from '../src/helpers/async-helper';

(process.env.SONOS_HOST ? describe : describe.skip)('SonosDevice - local', () => {

  (process.env.JOIN_DEVICE ? it : it.skip)('Joins a device by name', async () => {
    const device = new SonosDevice(process.env.SONOS_HOST || '');
    const result = await device.JoinGroup(process.env.JOIN_DEVICE || 'Slaapkamer');
    await device.AVTransportService.BecomeCoordinatorOfStandaloneGroup();
    expect(result).to.be.eq(true);
  });
});

describe('SonosDevice', () => {
  describe('LoadDeviceData()', () => {
    it('works', async () => {
      
      const scope = TestHelpers.mockRequest('/DeviceProperties/Control',
        '"urn:schemas-upnp-org:service:DeviceProperties:1#GetZoneAttributes"',
        '<u:GetZoneAttributes xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetZoneAttributes>',
        'GetZoneAttributesResponse',
        'DeviceProperties',
        '<CurrentZoneName>Kantoor</CurrentZoneName><CurrentIcon>x-rincon-roomicon:office</CurrentIcon><CurrentConfiguration>1</CurrentConfiguration>'
      );
      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
        '"urn:schemas-upnp-org:service:RenderingControl:1#GetMute"',
        '<u:GetMute xmlns:u=\"urn:schemas-upnp-org:service:RenderingControl:1\"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetMute>',
        'GetMuteResponse',
        'RenderingControl',
        '<CurrentMute>0</CurrentMute>',
        scope
      );
      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
        '"urn:schemas-upnp-org:service:RenderingControl:1#GetVolume"',
        '<u:GetVolume xmlns:u=\"urn:schemas-upnp-org:service:RenderingControl:1\"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetVolume>',
        'GetVolumeResponse',
        'RenderingControl',
        '<CurrentVolume>6</CurrentVolume>',
        scope
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const result = await device.LoadDeviceData();
      expect(result).to.be.true;
      expect(device.Name).to.be.equal('Kantoor');
      expect(device.Muted).to.be.false;
      expect(device.Volume).to.be.equal(6);
    });
  })

  describe('AddUriToQueue()', () => {
    it('accepts sonos track', async () => {
      const track = 'spotify:track:3b9xTm2eiaCRTGqUEWuzxc';
      const scope = TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"',
        '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>x-sonos-spotify:spotify%3atrack%3a3b9xTm2eiaCRTGqUEWuzxc?sid=9&amp;flags=8224&amp;sn=7</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;00032020spotify%3atrack%3a3b9xTm2eiaCRTGqUEWuzxc&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.musicTrack&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON2311_X_#Svc2311-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>',
        'AddURIToQueueResponse',
        'AVTransport',
        '<FirstTrackNumberEnqueued>1</FirstTrackNumberEnqueued><NewQueueLength>1</NewQueueLength><NumTracksAdded>1</NumTracksAdded>'
      );

      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
        '"urn:schemas-upnp-org:service:RenderingControl:1#GetVolume"',
        '<u:GetVolume xmlns:u=\"urn:schemas-upnp-org:service:RenderingControl:1\"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetVolume>',
        'GetVolumeResponse',
        'RenderingControl',
        '<CurrentVolume>15</CurrentVolume>',
        scope
      );

      const device = new SonosDevice(TestHelpers.testHost, 1400)

      var result = await device.AddUriToQueue(track);
      expect(result).to.have.nested.property('FirstTrackNumberEnqueued', 1);
      expect(result).to.have.nested.property('NewQueueLength', 1);
      expect(result).to.have.nested.property('NumTracksAdded', 1);
    });
  });

  describe('AlarmList()', () => {
    it('calls AlarmClockService.ListAndParse', async () => {
      TestHelpers.mockAlarmListResponse();
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const alarms = await device.AlarmList();
      expect(alarms).to.be.an('array');
      expect(alarms).to.have.lengthOf(2);
    });
  });

  describe('Events', () => {
    it('automatically creates event subscription', async () => {
      const port = 1402;
      const scope = TestHelpers.getScope(port);

      // Required to catch event subscription
      //process.env.SONOS_LISTENER_HOST = 'localhost-events'
      const renderingControlSid = Guid.create().toString();
      scope
        .intercept('/MediaRenderer/RenderingControl/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
        .reply(200, '', {
          sid: renderingControlSid
        });

      const avtransportSid = Guid.create().toString();
      scope
        .intercept('/MediaRenderer/AVTransport/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
        .reply(200, '', {
          sid: avtransportSid
        });

      const randomUuid = Guid.create().toString();
      const device = new SonosDevice(TestHelpers.testHost, port, randomUuid);
      const statusBefore = SonosEventListener.DefaultInstance.GetStatus();
      expect(statusBefore.isListening).to.be.false;
      device.Events.on('currentTrack', (track) => {});
      await AsyncHelper.Delay(50); // Delay is needed because the subscription is registered out-of-band.

      const statusAfter = SonosEventListener.DefaultInstance.GetStatus();
      expect(statusAfter.isListening).to.be.true;
      expect(statusAfter.currentSubscriptions).to.be.an('array').that.has.lengthOf(2);

      const avSubscription = statusAfter.currentSubscriptions.find((s) => s.sid === avtransportSid);
      expect(avSubscription).to.be.not.undefined;
      expect(avSubscription?.uuid).to.be.equal(randomUuid);
      expect(avSubscription?.service).to.be.equal('AVTransport');
      SonosEventListener.DefaultInstance.StopListener();
    })
  })

  describe('Events', () => {
    it('automatically unsubscribes event subscription', async () => {
      const port = 1403;
      const scope = TestHelpers.getScope(port);

      // Required to catch event subscription
      //process.env.SONOS_LISTENER_HOST = 'localhost-events'
      const renderingControlSid = Guid.create().toString();
      scope
        .intercept('/MediaRenderer/RenderingControl/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
        .reply(200, '', {
          sid: renderingControlSid
        });

      const avtransportSid = Guid.create().toString();
      scope
        .intercept('/MediaRenderer/AVTransport/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
        .reply(200, '', {
          sid: avtransportSid
        });
      
      scope
        .intercept('/MediaRenderer/RenderingControl/Event', 'UNSUBSCRIBE', undefined , { reqheaders: { sid: renderingControlSid }})
        .reply(204, '');

      scope
        .intercept('/MediaRenderer/AVTransport/Event', 'UNSUBSCRIBE', undefined, { reqheaders: { sid: avtransportSid }})
        .reply(204, '');

      const randomUuid = Guid.create().toString();
      const device = new SonosDevice(TestHelpers.testHost, port, randomUuid);
      device.Events.on('currentTrack', (track) => {});
      await AsyncHelper.Delay(20); // Delay is needed because the subscription is registered out-of-band.

      const statusBefore = SonosEventListener.DefaultInstance.GetStatus();
      expect(statusBefore.currentSubscriptions).to.be.an('array').that.has.lengthOf(2);

      device.Events.removeAllListeners('currentTrack');
      await AsyncHelper.Delay(20); // Delay is needed because the subscription is registered out-of-band.

      const statusAfter = SonosEventListener.DefaultInstance.GetStatus();
      expect(statusAfter.currentSubscriptions).to.be.an('array').that.has.lengthOf(0);
      SonosEventListener.DefaultInstance.StopListener();
    })
  })

  describe('ExecuteCommand()', () => {
    it('executes \'Play\'', async () => {
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Play"',
        '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>',
        'PlayResponse',
        'AVTransport'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400);

      var result = await device.ExecuteCommand('Play');
      expect(result).to.be.eq(true);
    });

    it('executes \'AVTransportService.Next\'', async () => {
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Next"',
        '<u:Next xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:Next>',
        'NextResponse',
        'AVTransport'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400);

      var result = await device.ExecuteCommand('AVTransportService.Next');
      expect(result).to.be.eq(true);
    });
  });

  describe('GetFavoriteRadioShows()', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/MediaServer/ContentDirectory/Control',
        '"urn:schemas-upnp-org:service:ContentDirectory:1#Browse"',
        '<u:Browse xmlns:u="urn:schemas-upnp-org:service:ContentDirectory:1"><ObjectID>R:0/1</ObjectID><BrowseFlag>BrowseDirectChildren</BrowseFlag><Filter>*</Filter><StartingIndex>0</StartingIndex><RequestedCount>0</RequestedCount><SortCriteria></SortCriteria></u:Browse>',
        'BrowseResponse',
        'ContentDirectory',
        '<Result></Result><NumberReturned>0</NumberReturned><TotalMatches>0</TotalMatches><UpdateID>1</UpdateID>'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400);

      const result = await device.GetFavoriteRadioShows();
      expect(result).to.be.an('object');
      expect(result).to.have.property('NumberReturned', 0);
      expect(result).to.have.property('TotalMatches', 0);
      expect(result).to.have.property('UpdateID', 1);
    });
  });

  describe('GetFavoriteRadioStations()', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/MediaServer/ContentDirectory/Control',
        '"urn:schemas-upnp-org:service:ContentDirectory:1#Browse"',
        '<u:Browse xmlns:u="urn:schemas-upnp-org:service:ContentDirectory:1"><ObjectID>R:0/0</ObjectID><BrowseFlag>BrowseDirectChildren</BrowseFlag><Filter>*</Filter><StartingIndex>0</StartingIndex><RequestedCount>0</RequestedCount><SortCriteria></SortCriteria></u:Browse>',
        'BrowseResponse',
        'ContentDirectory',
        '<Result>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;R:0/0/20&quot; parentID=&quot;R:0/0&quot; restricted=&quot;false&quot;&gt;&lt;dc:title&gt;100% NL 94.9 (Nederlands)&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-mp3radio:*:*:*&quot;&gt;x-sonosapi-stream:s78122?sid=254&amp;amp;flags=8224&amp;amp;sn=0&lt;/res&gt;&lt;/item&gt;&lt;item id=&quot;R:0/0/8&quot; parentID=&quot;R:0/0&quot; restricted=&quot;false&quot;&gt;&lt;dc:title&gt;538&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-mp3radio:*:*:*&quot;&gt;x-sonosapi-stream:s6712?sid=254&amp;amp;flags=32&lt;/res&gt;&lt;/item&gt;&lt;item id=&quot;R:0/0/6&quot; parentID=&quot;R:0/0&quot; restricted=&quot;false&quot;&gt;&lt;dc:title&gt;538 Party&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-mp3radio:*:*:*&quot;&gt;x-sonosapi-stream:s98497?sid=254&amp;amp;flags=32&lt;/res&gt;&lt;/item&gt;&lt;item id=&quot;R:0/0/10&quot; parentID=&quot;R:0/0&quot; restricted=&quot;false&quot;&gt;&lt;dc:title&gt;Q-Dance Hard&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-mp3radio:*:*:*&quot;&gt;x-sonosapi-stream:s106914?sid=254&amp;amp;flags=32&lt;/res&gt;&lt;/item&gt;&lt;item id=&quot;R:0/0/3&quot; parentID=&quot;R:0/0&quot; restricted=&quot;false&quot;&gt;&lt;dc:title&gt;Q-Music&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-mp3radio:*:*:*&quot;&gt;x-sonosapi-stream:s87683?sid=254&amp;amp;flags=32&lt;/res&gt;&lt;/item&gt;&lt;item id=&quot;R:0/0/16&quot; parentID=&quot;R:0/0&quot; restricted=&quot;false&quot;&gt;&lt;dc:title&gt;Q-Music Non Stop&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-mp3radio:*:*:*&quot;&gt;x-sonosapi-stream:s210431?sid=254&amp;amp;flags=32&lt;/res&gt;&lt;/item&gt;&lt;item id=&quot;R:0/0/7&quot; parentID=&quot;R:0/0&quot; restricted=&quot;false&quot;&gt;&lt;dc:title&gt;Radio 538 Dance Department&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-mp3radio:*:*:*&quot;&gt;x-sonosapi-stream:s75171?sid=254&amp;amp;flags=32&lt;/res&gt;&lt;/item&gt;&lt;item id=&quot;R:0/0/5&quot; parentID=&quot;R:0/0&quot; restricted=&quot;false&quot;&gt;&lt;dc:title&gt;Radio 538 Nonstop 40&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-mp3radio:*:*:*&quot;&gt;x-sonosapi-stream:s75166?sid=254&amp;amp;flags=32&lt;/res&gt;&lt;/item&gt;&lt;item id=&quot;R:0/0/4&quot; parentID=&quot;R:0/0&quot; restricted=&quot;false&quot;&gt;&lt;dc:title&gt;Sky Radio&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-mp3radio:*:*:*&quot;&gt;x-sonosapi-stream:s9067?sid=254&amp;amp;flags=32&lt;/res&gt;&lt;/item&gt;&lt;item id=&quot;R:0/0/19&quot; parentID=&quot;R:0/0&quot; restricted=&quot;false&quot;&gt;&lt;dc:title&gt;Slam hardstyle&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-mp3radio:*:*:*&quot;&gt;x-rincon-mp3radio://https://20423.live.streamtheworld.com/WEB11_MP3_SC?&lt;/res&gt;&lt;/item&gt;&lt;item id=&quot;R:0/0/11&quot; parentID=&quot;R:0/0&quot; restricted=&quot;false&quot;&gt;&lt;dc:title&gt;SLAM!FM&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-mp3radio:*:*:*&quot;&gt;x-sonosapi-stream:s67814?sid=254&amp;amp;flags=32&lt;/res&gt;&lt;/item&gt;&lt;item id=&quot;R:0/0/12&quot; parentID=&quot;R:0/0&quot; restricted=&quot;false&quot;&gt;&lt;dc:title&gt;Slam!Hardstyle&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-mp3radio:*:*:*&quot;&gt;x-sonosapi-stream:s155542?sid=254&amp;amp;flags=32&lt;/res&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</Result><NumberReturned>12</NumberReturned><TotalMatches>12</TotalMatches><UpdateID>1</UpdateID>'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400);

      const result = await device.GetFavoriteRadioStations();
      expect(result).to.be.an('object');
      expect(result).to.have.property('NumberReturned', 12);
      expect(result).to.have.property('TotalMatches', 12);
      expect(result).to.have.property('UpdateID', 1);
      expect(result).to.have.property('Result').that.is.an('array').with.lengthOf(12);
    });
  });

  describe('JoinGroup(...)', () => {
    it('Joins known group', async () => {
      
      const scope = TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-rincon:RINCON_000FFFFFF42C01400</CurrentURI><CurrentURIMetaData></CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport'
      );
      TestHelpers.mockZoneGroupState(scope);
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const result = await device.JoinGroup('Eetkamer');
      expect(result).to.be.true;
    });

    it('Returns false when already in the group', async () => {
      TestHelpers.mockZoneGroupState(TestHelpers.getScope());
      const device = new SonosDevice(TestHelpers.testHost, 1400, 'RINCON_000FFFFFF4AA01400');
      const result = await device.JoinGroup('Eetkamer')
      expect(result).to.be.false;
    });

    it('throws error for unknown group', async () => {
      const otherDevice = 'Slaapkamer';
      TestHelpers.mockZoneGroupState(TestHelpers.getScope());
      const device = new SonosDevice(TestHelpers.testHost, 1400, 'RINCON_000FFFFFF4AA01400');
      try {
        await device.JoinGroup(otherDevice);
      }
      catch (error) {
        expect(error).to.be.an('error')
        expect(error).to.have.property('message', `Player '${otherDevice}' isn't found!`);
        return;
      }
      // Should not be reached
      expect(true).to.be.false;
    });
  });

  describe('MusicServicesClient(...)', () => {
    it('returns Spotify client', async () => {
      const randomDeviceId = Guid.create().toString();
      const randomAccountKey = Guid.create().toString();
      const randomAccountToken = Guid.create().toString();
      const randomHouseHoldId = Guid.create().toString();
      const port = 1405;
      const scope = TestHelpers.getScope(port);
      TestHelpers.mockRequest('/SystemProperties/Control',
        '"urn:schemas-upnp-org:service:SystemProperties:1#GetString"',
        '<u:GetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>R_TrialZPSerial</VariableName></u:GetString>',
        'GetStringResponse',
        'SystemProperties',
        `<StringValue>${randomDeviceId}</StringValue>`,
        scope
      );
      TestHelpers.mockMusicServicesListResponse(scope);
      TestHelpers.mockRequest('/SystemProperties/Control',
        '"urn:schemas-upnp-org:service:SystemProperties:1#GetString"',
        '<u:GetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-accounts</VariableName></u:GetString>',
        'GetStringResponse',
        'SystemProperties',
        `<StringValue>9</StringValue>`,
        scope
      );
      TestHelpers.mockRequest('/SystemProperties/Control',
        '"urn:schemas-upnp-org:service:SystemProperties:1#GetString"',
        '<u:GetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-9-key</VariableName></u:GetString>',
        'GetStringResponse',
        'SystemProperties',
        `<StringValue>${randomAccountKey}</StringValue>`,
        scope
      );
      TestHelpers.mockRequest('/SystemProperties/Control',
        '"urn:schemas-upnp-org:service:SystemProperties:1#GetString"',
        '<u:GetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-9-token</VariableName></u:GetString>',
        'GetStringResponse',
        'SystemProperties',
        `<StringValue>${randomAccountToken}</StringValue>`,
        scope
      );
      TestHelpers.mockRequest('/DeviceProperties/Control',
        '"urn:schemas-upnp-org:service:DeviceProperties:1#GetHouseholdID"',
        '<u:GetHouseholdID xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetHouseholdID>',
        'GetHouseholdIDResponse',
        'DeviceProperties',
        `<CurrentHouseholdID>${randomHouseHoldId}</CurrentHouseholdID>`,
        scope
      );

      const device = new SonosDevice(TestHelpers.testHost, port);
      const spotifyClient = await device.MusicServicesClient(9);

      expect(spotifyClient).to.be.an.instanceOf(SmapiClient);
      expect(spotifyClient).to.have.nested.property('key', randomAccountKey);
      expect(spotifyClient).to.have.nested.property('authToken', randomAccountToken);


    })
  })

  describe('MusicServicesSubscribed()', () => {
    it('returns undefined when no accounts found', async () => {
      TestHelpers.mockSoapError(
        '/SystemProperties/Control',
        '"urn:schemas-upnp-org:service:SystemProperties:1#GetString"',
        '<u:GetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-accounts</VariableName></u:GetString>',
        800,
        500,
        's:Client',
        'UPnPError'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const result = await device.MusicServicesSubscribed();
      expect(result).to.be.undefined;
    });

    it('returns Spotify info', async () => {
      const scope = TestHelpers.mockMusicServicesListResponse();
      TestHelpers.mockRequest('/SystemProperties/Control',
        '"urn:schemas-upnp-org:service:SystemProperties:1#GetString"',
        '<u:GetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-accounts</VariableName></u:GetString>',
        'GetStringResponse',
        'SystemProperties',
        `<StringValue>9</StringValue>`,
        scope
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const result = await device.MusicServicesSubscribed();
      expect(result).to.be.an('array').that.has.lengthOf(1);
      const firstItem = result?.[0];
      expect(firstItem).to.have.property('Name', 'Spotify');
    });
  });

  describe('PlayNotification(...)', () => {
    it('executes right requests', async () => {

      const currentVolume = 6;
      const notificationVolume = 10;
      const port = 1401;
      const scope = TestHelpers.getScope(port);

      // GetTransportInfo
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#GetTransportInfo"',
        '<u:GetTransportInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetTransportInfo>',
        'GetTransportInfoResponse',
        'AVTransport',
        '<CurrentTransportState>STOPPED</CurrentTransportState>',
        scope
      );

      // Get Volume
      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
        '"urn:schemas-upnp-org:service:RenderingControl:1#GetVolume"',
        '<u:GetVolume xmlns:u=\"urn:schemas-upnp-org:service:RenderingControl:1\"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetVolume>',
        'GetVolumeResponse',
        'RenderingControl',
        `<CurrentVolume>${currentVolume}</CurrentVolume>`,
        scope
      );

      // GetMediaInfo
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#GetMediaInfo"',
        '<u:GetMediaInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetMediaInfo>',
        'GetMediaInfoResponse',
        'AVTransport',
        '<NrTracks>51</NrTracks><MediaDuration>NOT_IMPLEMENTED</MediaDuration><CurrentURI>x-rincon-queue:RINCON_000FFFFFFFFF01400#0</CurrentURI><CurrentURIMetaData></CurrentURIMetaData><NextURI></NextURI><NextURIMetaData></NextURIMetaData><PlayMedium>NETWORK</PlayMedium><RecordMedium>NOT_IMPLEMENTED</RecordMedium><WriteStatus>NOT_IMPLEMENTED</WriteStatus>',
        scope
      );

      // GetPositionInfo
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#GetPositionInfo"',
        '<u:GetPositionInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetPositionInfo>',
        'GetPositionInfoResponse',
        'AVTransport',
        '<Track>26</Track><TrackDuration>0:03:58</TrackDuration><TrackMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;-1&quot; parentID=&quot;-1&quot; restricted=&quot;true&quot;&gt;&lt;res protocolInfo=&quot;sonos.com-spotify:*:audio/x-spotify:*&quot; duration=&quot;0:03:58&quot;&gt;x-sonos-spotify:spotify%3atrack%3a1PWV26P0WRrRpKWj3Z7KVy?sid=9&amp;amp;flags=8224&amp;amp;sn=7&lt;/res&gt;&lt;r:streamContent&gt;&lt;/r:streamContent&gt;&lt;upnp:albumArtURI&gt;/getaa?s=1&amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a1PWV26P0WRrRpKWj3Z7KVy%3fsid%3d9%26flags%3d8224%26sn%3d7&lt;/upnp:albumArtURI&gt;&lt;dc:title&gt;200 Dreams&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.musicTrack&lt;/upnp:class&gt;&lt;dc:creator&gt;Noisecontrollers&lt;/dc:creator&gt;&lt;upnp:album&gt;200 Dreams EP&lt;/upnp:album&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</TrackMetaData><TrackURI>x-sonos-spotify:spotify%3atrack%3a1PWV26P0WRrRpKWj3Z7KVy?sid=9&amp;flags=8224&amp;sn=7</TrackURI><RelTime>0:02:18</RelTime><AbsTime>NOT_IMPLEMENTED</AbsTime><RelCount>2147483647</RelCount><AbsCount>2147483647</AbsCount>',
        scope
      );

      // SetAVTransportURI Play Artist radio
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-sonosapi-radio:spotify%3aartistRadio%3a37i9dQZF1E4lKH7XBCfvaH?sid=9&amp;flags=8300&amp;sn=7</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;100c206cspotify%3aartistRadio%3a37i9dQZF1E4lKH7XBCfvaH&quot; restricted=&quot;true&quot; parentID=&quot;10052064spotify%3aartist%3a37i9dQZF1E4lKH7XBCfvaH&quot;&gt;&lt;dc:title&gt;Artist radio&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast.#artistRadio&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON2311_X_#Svc2311-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport',
        undefined,
        scope
      );

      // Set Volume to {notificationVolume}
      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
        '"urn:schemas-upnp-org:service:RenderingControl:1#SetVolume"',
        `<u:SetVolume xmlns:u=\"urn:schemas-upnp-org:service:RenderingControl:1\"><InstanceID>0</InstanceID><Channel>Master</Channel><DesiredVolume>${notificationVolume}</DesiredVolume></u:SetVolume>`,
        'SetVolumeResponse',
        'RenderingControl',
        undefined,
        scope
      );

      // Required to catch event subscription
      //process.env.SONOS_LISTENER_HOST = 'localhost-events'
      const renderingControlSid = '78f289d1-6289-43a9-948d-3a2a5c5753c9';
      scope
      //nock(`http://${TestHelpers.testHost}:1400`, { reqheaders: { nt: 'upnp:event' }})
        .intercept('/MediaRenderer/RenderingControl/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
        .reply(200, '', {
          sid: renderingControlSid
        });

      const avtransportSid = '07896553-d7d6-4b7d-a3d9-f4d86b33d6d2'
      scope//.matchHeader('nt', 'upnp:event')
      // nock(`http://${TestHelpers.testHost}:1400`, { reqheaders: { nt: 'upnp:event' }})
        .intercept('/MediaRenderer/AVTransport/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
        .reply(200, '', {
          sid: avtransportSid
        });

      scope//.matchHeader('sid', renderingControlSid)
      // nock(`http://${TestHelpers.testHost}:1400`, { reqheaders: { sid: renderingControlSid }})
        .intercept('/MediaRenderer/RenderingControl/Event', 'UNSUBSCRIBE', undefined , { reqheaders: { sid: renderingControlSid }})
        .reply(204, '');

      scope//.matchHeader('sid', avtransportSid)
      //nock(`http://${TestHelpers.testHost}:1400`, { reqheaders: { sid: avtransportSid }})
        .intercept('/MediaRenderer/AVTransport/Event', 'UNSUBSCRIBE', undefined, { reqheaders: { sid: avtransportSid }})
        .reply(204, '');

      // Set Volume to 6 (previous)
      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
        '"urn:schemas-upnp-org:service:RenderingControl:1#SetVolume"',
        `<u:SetVolume xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel><DesiredVolume>${currentVolume}</DesiredVolume></u:SetVolume>`,
        'SetVolumeResponse',
        'RenderingControl',
        undefined,
        scope,
      );

      // SetAVTransportURI Revert to original
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-rincon-queue:RINCON_000FFFFFFFFF01400#0</CurrentURI><CurrentURIMetaData></CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport',
        undefined,
        scope,
      );

      // // Restart playing
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Play"',
        '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>',
        'PlayResponse',
        'AVTransport',
        undefined,
        scope
      );

      // Emit the event that normally would be triggered by the sonos event subscription.
      const device = new SonosDevice(TestHelpers.testHost, port);
      setTimeout(() => {
        device.AVTransportService.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><LastChange>&lt;Event xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/AVT/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;&lt;InstanceID val=&quot;0&quot;&gt;&lt;TransportState val=&quot;STOPPED&quot;/&gt;&lt;CurrentPlayMode val=&quot;SHUFFLE&quot;/&gt;&lt;CurrentCrossfadeMode val=&quot;0&quot;/&gt;&lt;NumberOfTracks val=&quot;51&quot;/&gt;&lt;CurrentTrack val=&quot;47&quot;/&gt;&lt;CurrentSection val=&quot;0&quot;/&gt;&lt;CurrentTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;CurrentTrackDuration val=&quot;0:03:24&quot;/&gt;&lt;CurrentTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:24&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;r:streamContent&amp;gt;&amp;lt;/r:streamContent&amp;gt;&amp;lt;r:radioShowMd&amp;gt;&amp;lt;/r:radioShowMd&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a2nj0bzqYZR7PXs0BoQTW3V%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Survive&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Bass Modulators&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Survive (feat. Bram Boender)&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:NextTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;r:NextTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:56&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a7aKme0bvekUFoMI0cHGIRk%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Fine Day&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Coone&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Fine Day&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:EnqueuedTransportURI val=&quot;x-rincon-cpcontainer:1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa?sid=9&amp;amp;flags=8300&amp;amp;sn=7&quot;/&gt;&lt;r:EnqueuedTransportURIMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa&amp;quot; parentID=&amp;quot;00020000playlist:hardstyle&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;dc:title&amp;gt;Hardstyle Everyday&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.container.playlistContainer&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;spakenburger&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;https://i.scdn.co/image/ab67706c0000da84c064a0cba71066f9b99808ef&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;r:description&amp;gt;Hardstyle Everyday&amp;lt;/r:description&amp;gt;&amp;lt;desc id=&amp;quot;cdudn&amp;quot; nameSpace=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot;&amp;gt;SA_RINCON2311_X_#Svc2311-0-Token&amp;lt;/desc&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;/InstanceID&gt;&lt;/Event&gt;</LastChange></e:property></e:propertyset>');
      }, 500);

      const result = await device.PlayNotification({
        delayMs: 10,
        onlyWhenPlaying: false,
        timeout: 2,
        trackUri: 'spotify:artistRadio:37i9dQZF1E4lKH7XBCfvaH',
        volume: notificationVolume
      });
      expect(result).to.be.eq(true);
      SonosEventListener.DefaultInstance.StopListener();
      
      const nockResult = scope.isDone();
      expect(result).to.be.true;
    });

    it('returns false when not playing', async () => {
      // GetTransportInfo
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#GetTransportInfo"',
        '<u:GetTransportInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetTransportInfo>',
        'GetTransportInfoResponse',
        'AVTransport',
        '<CurrentTransportState>STOPPED</CurrentTransportState>'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400);

      const result = await device.PlayNotification({
        delayMs: 10,
        onlyWhenPlaying: true,
        timeout: 1,
        trackUri: 'spotify:artist:3b9xTm2eiaCRTGqUEWuzxc',
        volume: 10
      });
      expect(result).to.be.false;
      SonosEventListener.DefaultInstance.StopListener();
    });

    it('throws error when incorrect delay is specified', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      try {
        await device.PlayNotification({
          trackUri: 'fake',
          delayMs: 5000
        })
      } catch(error) {
        expect(error).to.not.be.null;
        expect(error).have.property('message', 'Delay (if specified) should be between 1 and 4000');
      }
    })
  });

  describe('PlayTTS(...)', () => {
    it('return false when not playing', async () => {

      // GetTransportInfo
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#GetTransportInfo"',
        '<u:GetTransportInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetTransportInfo>',
        'GetTransportInfoResponse',
        'AVTransport',
        '<CurrentTransportState>STOPPED</CurrentTransportState>'
      );

      const endpoint = 'http://localhost/tts-endpoint'
      const text = 'Er staat iemand aan de voordeur';
      const lang = 'nl-nl';

      const resultUri = 'https://localhost/cache/sound.mp3';
      const respBody = JSON.stringify({ uri: resultUri });
      nock('http://localhost', { reqheaders: { 'Content-type': 'application/json' } })
        .post('/tts-endpoint')
        .reply(200, respBody);

      const device = new SonosDevice(TestHelpers.testHost, 1400);

      const result = await device.PlayTTS({
        delayMs: 10,
        onlyWhenPlaying: true,
        timeout: 1,
        text: text,
        lang: lang,
        endpoint: endpoint,
        volume: 10
      });
      expect(result).to.be.false;
    });

  });

  describe('SetAVTransportURI(...)', () => {
    it('accepts x-sonosapi-stream:...', async () => {
      const track = 'x-sonosapi-stream:s78122?sid=254&flags=8224&sn=0'
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u=\"urn:schemas-upnp-org:service:AVTransport:1\"><InstanceID>0</InstanceID><CurrentURI>x-sonosapi-stream:s78122?sid=254&amp;flags=8224&amp;sn=0</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;10092020_xxx_xxxx&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Some radio station&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;RINCON_AssociatedZPUDN&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400);

      var result = await device.SetAVTransportURI(track);
      expect(result).to.be.true;
    });
    it('accepts radio:s78122', async () => {
      const track = 'radio:s78122';
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u=\"urn:schemas-upnp-org:service:AVTransport:1\"><InstanceID>0</InstanceID><CurrentURI>x-sonosapi-stream:s78122?sid=254&amp;flags=8224&amp;sn=0</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;10092020_xxx_xxxx&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Some radio station&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;RINCON_AssociatedZPUDN&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400);

      const result = await device.SetAVTransportURI(track);
      expect(result).to.be.true;
    });
  });

  describe('Services', () => {
    it('can initialize AVTransportService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.AVTransportService;
      expect(service).to.be.an('object');
    });

    it('can initialize AlarmClockService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.AlarmClockService;
      expect(service).to.be.an('object');
    });

    it('can initialize AudioInService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.AudioInService;
      expect(service).to.be.an('object');
    });

    it('can initialize ConnectionManagerService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.ConnectionManagerService;
      expect(service).to.be.an('object');
    });

    it('can initialize ContentDirectoryService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.ContentDirectoryService;
      expect(service).to.be.an('object');
    });

    it('can initialize DevicePropertiesService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.DevicePropertiesService;
      expect(service).to.be.an('object');
    });

    it('can initialize GroupManagementService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.GroupManagementService;
      expect(service).to.be.an('object');
    });

    it('can initialize GroupRenderingControlService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.GroupRenderingControlService;
      expect(service).to.be.an('object');
    });

    it('can initialize HTControlService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.HTControlService;
      expect(service).to.be.an('object');
    });

    it('can initialize MusicServicesService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.MusicServicesService;
      expect(service).to.be.an('object');
    });

    it('can initialize QPlayService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.QPlayService;
      expect(service).to.be.an('object');
    });

    it('can initialize QueueService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.QueueService;
      expect(service).to.be.an('object');
    });

    it('can initialize RenderingControlService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.RenderingControlService;
      expect(service).to.be.an('object');
    });

    it('can initialize SystemPropertiesService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.SystemPropertiesService;
      expect(service).to.be.an('object');
    });

    it('can initialize VirtualLineInService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.VirtualLineInService;
      expect(service).to.be.an('object');
    });

    it('can initialize ZoneGroupTopologyService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.ZoneGroupTopologyService;
      expect(service).to.be.an('object');
    });

  });

  describe('SwitchTo..', () => {
    it('SwitchToLineIn sends correct command', async () => {
      TestHelpers.mockRequest('/DeviceProperties/Control',
        '"urn:schemas-upnp-org:service:DeviceProperties:1#GetZoneInfo"',
        '<u:GetZoneInfo xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetZoneInfo>',
        'GetZoneInfoResponse',
        'DeviceProperties',
        '<SerialNumber>00-FF-FF-FF-FF-BC:A</SerialNumber><SoftwareVersion>56.0-76060</SoftwareVersion><DisplaySoftwareVersion>11.1</DisplaySoftwareVersion><HardwareVersion>1.16.4.1-2</HardwareVersion><IPAddress>192.168.2.30</IPAddress><MACAddress>00:FF:FF:FF:FF:BC</MACAddress><CopyrightInfo>© 2003-2019, Sonos, Inc. All rights reserved.</CopyrightInfo><ExtraInfo>OTP: 1.1.1(1-16-4-zp5s-0.5)</ExtraInfo><HTAudioIn>0</HTAudioIn><Flags>1</Flags>'
      );
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-rincon-stream:RINCON_00FFFFFFFFBC01400</CurrentURI><CurrentURIMetaData></CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport'
      );
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Play"',
        '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>',
        'PlayResponse',
        'AVTransport');
      const device = new SonosDevice(TestHelpers.testHost, 1400);

      const result = await device.SwitchToLineIn();
      expect(result).to.be.eq(true);
    });
    it('SwitchToQueue sends correct command', async () => {
      const deviceID = 'RINCON_00FFFFFFFFBC01400';
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-rincon-queue:RINCON_00FFFFFFFFBC01400#0</CurrentURI><CurrentURIMetaData></CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400, deviceID);

      const result = await device.SwitchToQueue();
      expect(result).to.be.eq(true);
    });
    it('SwitchToTV sends correct command', async () => {
      const deviceID = 'RINCON_00FFFFFFFFBC01400';
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-sonos-htastream:RINCON_00FFFFFFFFBC01400:spdif</CurrentURI><CurrentURIMetaData></CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport'
      );
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Play"',
        '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>',
        'PlayResponse',
        'AVTransport');
      const device = new SonosDevice(TestHelpers.testHost, 1400, deviceID);

      var result = await device.SwitchToTV();
      expect(result).to.be.eq(true);
    });
  });

  describe('RefreshEventSubscriptions', () => {
    it('does nothing without subscriptions', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);

      const result = await device.RefreshEventSubscriptions();
      expect(result).to.be.false;
    })
  })
});
