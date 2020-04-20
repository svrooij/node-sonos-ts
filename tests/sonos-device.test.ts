import SonosDevice from '../src/sonos-device'
import { expect }  from 'chai'
import { TestHelpers } from './test-helpers';

(process.env.SONOS_HOST ? describe : describe.skip)('SonosDevice - local', () => {

  (process.env.JOIN_DEVICE ? it : it.skip)('Joins a device by name', async () => {
    const device = new SonosDevice(process.env.SONOS_HOST || '')
    const result = await device.JoinGroup(process.env.JOIN_DEVICE || 'Slaapkamer')
    await device.AVTransportService.BecomeCoordinatorOfStandaloneGroup();
    expect(result).to.be.eq(true);
  });
});

describe('SonosDevice', () => {
  describe('AddUriToQueue()', () => {
    it('accepts sonos track', async () => {
      const track = 'spotify:track:3b9xTm2eiaCRTGqUEWuzxc';
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"',
        '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>x-sonos-spotify:spotify%3atrack%3a3b9xTm2eiaCRTGqUEWuzxc?sid=9&amp;flags=8224&amp;sn=7</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;00032020spotify%3atrack%3a3b9xTm2eiaCRTGqUEWuzxc&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.musicTrack&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON2311_X_#Svc2311-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>',
        'AddURIToQueueResponse',
        'AVTransport',
        '<FirstTrackNumberEnqueued>1</FirstTrackNumberEnqueued><NewQueueLength>1</NewQueueLength><NumTracksAdded>1</NumTracksAdded>'
      );

      const device = new SonosDevice(TestHelpers.testHost, 1400)

      var result = await device.AddUriToQueue(track);
      expect(result).to.have.nested.property('FirstTrackNumberEnqueued', 1)
      expect(result).to.have.nested.property('NewQueueLength', 1)
      expect(result).to.have.nested.property('NumTracksAdded', 1)
    })
  })

  describe('GetFavoriteRadioShows()', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/MediaServer/ContentDirectory/Control',
        '"urn:schemas-upnp-org:service:ContentDirectory:1#Browse"',
        '<u:Browse xmlns:u="urn:schemas-upnp-org:service:ContentDirectory:1"><ObjectID>R:0/1</ObjectID><BrowseFlag>BrowseDirectChildren</BrowseFlag><Filter>*</Filter><StartingIndex>0</StartingIndex><RequestedCount>0</RequestedCount><SortCriteria></SortCriteria></u:Browse>',
        'BrowseResponse',
        'ContentDirectory',
        '<Result></Result><NumberReturned>0</NumberReturned><TotalMatches>0</TotalMatches><UpdateID>1</UpdateID>'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400)

      const result = await device.GetFavoriteRadioShows();
      expect(result).to.be.an('object');
      expect(result).to.have.property('NumberReturned', 0);
      expect(result).to.have.property('TotalMatches', 0);
      expect(result).to.have.property('UpdateID', 1);
      expect(result).to.have.property('Result').that.is.a('string')
    })
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
      const device = new SonosDevice(TestHelpers.testHost, 1400)

      const result = await device.GetFavoriteRadioStations();
      expect(result).to.be.an('object');
      expect(result).to.have.property('NumberReturned', 12);
      expect(result).to.have.property('TotalMatches', 12);
      expect(result).to.have.property('UpdateID', 1);
      expect(result).to.have.property('Result').that.is.an('array').with.lengthOf(12);
    })
  });

  describe('JoinGroup(...)', () => {
    it('Joins known group', async () => {
      TestHelpers.mockZoneGroupState();
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-rincon:RINCON_000FFFFFF42C01400</CurrentURI><CurrentURIMetaData></CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport'
      )
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const result = await device.JoinGroup('Eetkamer')
      expect(result).to.be.true;
    });
    it('Returns false when already in the group', async () => {
      TestHelpers.mockZoneGroupState();
      const device = new SonosDevice(TestHelpers.testHost, 1400, 'RINCON_000FFFFFF4AA01400')
      const result = await device.JoinGroup('Eetkamer')
      expect(result).to.be.false;
    });
    it('throws error for unknown group', async () => {
      const otherDevice = 'Slaapkamer';
      TestHelpers.mockZoneGroupState();
      const device = new SonosDevice(TestHelpers.testHost, 1400, 'RINCON_000FFFFFF4AA01400')
      try {
        const result = await device.JoinGroup(otherDevice)
      }
      catch (error) {
        expect(error).to.be.an('error')
        expect(error).to.have.property('message', `Player '${otherDevice}' isn't found!`);
        return;
      }
      // Should not be reached
      expect(true).to.be.false;

    })
  })

  describe('ExecuteCommand()', () => {
    it('executes \'Play\'', async () => {
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Play"',
        '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>',
        'PlayResponse',
        'AVTransport'
      )
      const device = new SonosDevice(TestHelpers.testHost, 1400)

      var result = await device.ExecuteCommand('Play')
      expect(result).to.be.eq(true);
    })

    it('executes \'AVTransportService.Next\'', async () => {
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Next"',
        '<u:Next xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:Next>',
        'NextResponse',
        'AVTransport'
      )
      const device = new SonosDevice(TestHelpers.testHost, 1400)

      var result = await device.ExecuteCommand('AVTransportService.Next')
      expect(result).to.be.eq(true);
    })
  });

  describe.skip('PlayNotification(...)', () => {

  })

  describe.skip('PlayTTS(...)', () => {

  })

  describe('SetAVTransportURI(...)', () => {
    it('accepts x-sonosapi-stream:...', async () => {
      const track = 'x-sonosapi-stream:s78122?sid=254&flags=8224&sn=0'
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u=\"urn:schemas-upnp-org:service:AVTransport:1\"><InstanceID>0</InstanceID><CurrentURI>x-sonosapi-stream:s78122?sid=254&amp;flags=8224&amp;sn=0</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;10092020_xxx_xxxx&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Some radio station&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;RINCON_AssociatedZPUDN&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400)

      var result = await device.SetAVTransportURI(track);
      expect(result).to.be.true;
    });
    it('accepts radio:s78122', async () => {
      const track = 'radio:s78122'
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u=\"urn:schemas-upnp-org:service:AVTransport:1\"><InstanceID>0</InstanceID><CurrentURI>x-sonosapi-stream:s78122?sid=254&amp;flags=8224&amp;sn=0</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;10092020_xxx_xxxx&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Some radio station&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;RINCON_AssociatedZPUDN&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400)

      var result = await device.SetAVTransportURI(track);
      expect(result).to.be.true;
    })
  })


  describe('Services', () => {
    it('can initialize AVTransportService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.AVTransportService;
      expect(service).to.be.an('object');
    });

    it('can initialize AlarmClockService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.AlarmClockService;
      expect(service).to.be.an('object');
    });

    it('can initialize AudioInService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.AudioInService;
      expect(service).to.be.an('object');
    });

    it('can initialize ConnectionManagerService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.ConnectionManagerService;
      expect(service).to.be.an('object');
    });

    it('can initialize ContentDirectoryService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.ContentDirectoryService;
      expect(service).to.be.an('object');
    });

    it('can initialize DevicePropertiesService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.DevicePropertiesService;
      expect(service).to.be.an('object');
    });

    it('can initialize GroupManagementService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.GroupManagementService;
      expect(service).to.be.an('object');
    });

    it('can initialize GroupRenderingControlService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.GroupRenderingControlService;
      expect(service).to.be.an('object');
    });

    it('can initialize MusicServicesService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.MusicServicesService;
      expect(service).to.be.an('object');
    });

    it('can initialize QPlayService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.QPlayService;
      expect(service).to.be.an('object');
    });

    it('can initialize QueueService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.QueueService;
      expect(service).to.be.an('object');
    });

    it('can initialize RenderingControlService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.RenderingControlService;
      expect(service).to.be.an('object');
    });

    it('can initialize SystemPropertiesService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.SystemPropertiesService;
      expect(service).to.be.an('object');
    });

    it('can initialize VirtualLineInService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.VirtualLineInService;
      expect(service).to.be.an('object');
    });

    it('can initialize ZoneGroupTopologyService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.ZoneGroupTopologyService;
      expect(service).to.be.an('object');
    });

  });

  describe('SwitchTo..', () => {
    it('SwitchToLineIn sends correct command', async () => {
      const deviceID = 'not_a_real_ID';
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-rincon-stream:not_a_real_ID01400</CurrentURI><CurrentURIMetaData></CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400, deviceID)

      var result = await device.SwitchToLineIn();
      expect(result).to.be.eq(true);
    });
    it('SwitchToQueue sends correct command', async () => {
      const deviceID = 'not_a_real_ID';
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-rincon-queue:not_a_real_ID01400#0</CurrentURI><CurrentURIMetaData></CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400, deviceID)

      var result = await device.SwitchToQueue();
      expect(result).to.be.eq(true);
    });
    it('SwitchToTV sends correct command', async () => {
      const deviceID = 'not_a_real_ID';
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-sonos-htastream:not_a_real_ID01400%3aspdiff</CurrentURI><CurrentURIMetaData></CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400, deviceID)

      var result = await device.SwitchToTV();
      expect(result).to.be.eq(true);
    });
  });
})
