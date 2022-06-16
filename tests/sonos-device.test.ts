import { expect }  from 'chai'
import { EventEmitter } from 'events';
import SonosDevice from '../src/sonos-device'
import { TestHelpers } from './test-helpers';
import SonosEventListener from '../src/sonos-event-listener';
import { Guid } from 'guid-typescript';
import { SmapiClient } from '../src/musicservices/smapi-client';
import { TransportState } from '../src/models';

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
      
      TestHelpers.mockSonosLoadDeviceData();
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

      const device = new SonosDevice(TestHelpers.testHost, 1400)

      const result = await device.AddUriToQueue(track);
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

  describe('AlarmPatch()', () => {
    it('calls AlarmClockService.PatchAlarm', async () => {
      TestHelpers.mockAlarmListResponse();
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      try {
        await device.AlarmPatch({
          ID: 500,
          Enabled: false,
        });
      } catch (error) {
        expect(error).to.not.be.null;
        expect(error).have.property('message').that.contains('500');
        return;
      }
      expect(false).to.be.true; // This should not be reached.
    });
  });

  describe('CurrentTrackUri', () => {
    it('returns value from private field', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const trackUri = 'fake:track:uri';
      device['currentTrackUri'] = trackUri;
      expect(device.CurrentTrackUri).to.be.equal(trackUri);
    })
  })

  describe('CurrentTransportState', () => {
    it('returns value from private field', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      device['currentTransportState'] = TransportState.Transitioning;
      expect(device.CurrentTransportState).to.be.equal(TransportState.Transitioning);
    })
  })

  describe('CurrentTransportStateSimple', () => {
    it('returns value from coordinator if defined', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      device['coordinator'] = new SonosDevice(TestHelpers.testHost, 1500);
      device['coordinator']['currentTransportState'] = TransportState.Transitioning;
      expect(device.CurrentTransportStateSimple).to.be.equal(TransportState.Playing);
    })
  })

  describe('EnqueuedTransportUri', () => {
    it('returns value from private field', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const trackUri = 'fake:track:uri';
      device['enqueuedTransportUri'] = trackUri;
      expect(device.EnqueuedTransportUri).to.be.equal(trackUri);
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

      const result = await device.ExecuteCommand('Play');
      expect(result).to.be.eq(true);
    });

    it('executes \'LoadUuid\'', async () => {
      TestHelpers.mockRequestToService('/DeviceProperties/Control',
        'DeviceProperties',
        'GetZoneInfo',
        '',
        '<SerialNumber>00-FF-FF-FF-FF-BC:A</SerialNumber><SoftwareVersion>56.0-76060</SoftwareVersion><DisplaySoftwareVersion>11.1</DisplaySoftwareVersion><HardwareVersion>1.16.4.1-2</HardwareVersion><IPAddress>192.168.2.30</IPAddress><MACAddress>00:FF:FF:FF:FF:BC</MACAddress><CopyrightInfo>© 2003-2019, Sonos, Inc. All rights reserved.</CopyrightInfo><ExtraInfo>OTP: 1.1.1(1-16-4-zp5s-0.5)</ExtraInfo><HTAudioIn>0</HTAudioIn><Flags>1</Flags>'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400);

      const result = await device.ExecuteCommand('LoadUuid', true);
      expect(result).to.be.eq('RINCON_00FFFFFFFFBC01400');
    });

    it('executes \'AlarmClockService.GetFormat\'', async () => {
      TestHelpers.mockRequest('/AlarmClock/Control',
        '"urn:schemas-upnp-org:service:AlarmClock:1#GetFormat"',
        '<u:GetFormat xmlns:u="urn:schemas-upnp-org:service:AlarmClock:1"></u:GetFormat>',
        'GetFormatResponse',
        'AlarmClock',
        '<CurrentTimeFormat>24H</CurrentTimeFormat><CurrentDateFormat>DMY</CurrentDateFormat>'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400);

      const result = await device.ExecuteCommand('AlarmclockService.Getformat');

      expect(result).to.have.property('CurrentTimeFormat', '24H');
      expect(result).to.have.property('CurrentDateFormat', 'DMY');
    });

    it('throws error on AudioInService.xxx', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      try {
        await device.ExecuteCommand('AudioInService.xxx');
      } catch {
        return
      }
      expect(true).to.be.false;
    })

    it('executes \'AVTransportService.ConfigureSleepTimer\'', async () => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'ConfigureSleepTimer',
        '<InstanceID>0</InstanceID><NewSleepTimerDuration>00:03:05</NewSleepTimerDuration>',
        ''
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const options = JSON.stringify({ InstanceID: 0, NewSleepTimerDuration: '00:03:05' });
      const result = await device.ExecuteCommand('AVTransportService.ConfigureSleepTimer', options);
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

      const result = await device.ExecuteCommand('AVTransportService.Next');
      expect(result).to.be.eq(true);
    });

    it('throws error on ConnectionManagerService.xxx', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      try {
        await device.ExecuteCommand('ConnectionManagerService.xxx');
      } catch {
        return
      }
      expect(true).to.be.false;
    });

    it('throws error on ContentDirectoryService.xxx', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      try {
        await device.ExecuteCommand('ContentDirectoryService.xxx');
      } catch {
        return
      }
      expect(true).to.be.false;
    });

    it('throws error on DevicePropertiesService.xxx', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      try {
        await device.ExecuteCommand('DevicePropertiesService.xxx');
      } catch {
        return
      }
      expect(true).to.be.false;
    });

    it('throws error on GroupManagementService.xxx', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      try {
        await device.ExecuteCommand('GroupManagementService.xxx');
      } catch {
        return
      }
      expect(true).to.be.false;
    });

    it('throws error on GroupRenderingControlService.xxx', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      try {
        await device.ExecuteCommand('GroupRenderingControlService.xxx');
      } catch {
        return
      }
      expect(true).to.be.false;
    });

    it('throws error on HTControlService.xxx', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      try {
        await device.ExecuteCommand('HTControlService.xxx');
      } catch {
        return
      }
      expect(true).to.be.false;
    });

    it('throws error on MusicServicesService.xxx', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      try {
        await device.ExecuteCommand('MusicServicesService.xxx');
      } catch {
        return
      }
      expect(true).to.be.false;
    });

    it('throws error on QPlayService.xxx', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      try {
        await device.ExecuteCommand('QPlayService.xxx');
      } catch {
        return
      }
      expect(true).to.be.false;
    });

    it('throws error on QueueService.xxx', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      try {
        await device.ExecuteCommand('QueueService.xxx');
      } catch {
        return
      }
      expect(true).to.be.false;
    });

    it('throws error on RenderingControlService.xxx', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      try {
        await device.ExecuteCommand('RenderingControlService.xxx');
      } catch {
        return
      }
      expect(true).to.be.false;
    });

    it('throws error on SystemPropertiesService.xxx', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      try {
        await device.ExecuteCommand('SystemPropertiesService.xxx');
      } catch {
        return
      }
      expect(true).to.be.false;
    });

    it('throws error on VirtualLineInService.xxx', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      try {
        await device.ExecuteCommand('VirtualLineInService.xxx');
      } catch {
        return
      }
      expect(true).to.be.false;
    });

    it('executes \'ZoneGroupTopologyService.GetZoneGroupAttributes\'', async () => {
      TestHelpers.mockRequest('/ZoneGroupTopology/Control',
        '"urn:schemas-upnp-org:service:ZoneGroupTopology:1#GetZoneGroupAttributes"',
        '<u:GetZoneGroupAttributes xmlns:u="urn:schemas-upnp-org:service:ZoneGroupTopology:1"></u:GetZoneGroupAttributes>',
        'GetZoneGroupAttributesResponse',
        'ZoneGroupTopology',
        '<CurrentZoneGroupName>Kantoor</CurrentZoneGroupName><CurrentZoneGroupID>fakeID</CurrentZoneGroupID>'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400);

      const result = await device.ExecuteCommand('zonegrouptopologyservice.getzonegroupAttributes');

      expect(result).to.have.property('CurrentZoneGroupName', 'Kantoor');
      expect(result).to.have.property('CurrentZoneGroupID', 'fakeID');
    });

    it('throws error on xxx.xxx', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      try {
        await device.ExecuteCommand('xxx.xxx');
      } catch {
        return
      }
      expect(true).to.be.false;
    })
  });

  describe('GetDeviceDescription()', () => {
    it('loads device description', async () => {
      TestHelpers.mockDeviceDesription();
      const device = new SonosDevice(TestHelpers.testHost);
      const result = await device.GetDeviceDescription();
      const playbar = 'Sonos Playbar';
      expect(result.modelName).to.be.equal(playbar);
      expect(result.modelDescription).to.be.equal(playbar);
      expect(result.roomName).to.be.equal('TV');
    });
    it('throws error on http error', async () => {
      TestHelpers.getScope(1410).get('/xml/device_description.xml').reply(400, 'Bad Request');
      const device = new SonosDevice(TestHelpers.testHost, 1410);
      try {
        const result = await device.GetDeviceDescription();
      } catch(err) {
        expect(err).to.not.be.null;
        expect(err).to.have.property('message', 'Loading device description failed 400 Bad Request');
        return;
      }
      expect(false).to.be.true; // Should never be reached
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

  describe('GetFavorites()', () => {
    it('works', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaServer/ContentDirectory/Control', 'ContentDirectory',
        'Browse', '<ObjectID>FV:2</ObjectID><BrowseFlag>BrowseDirectChildren</BrowseFlag><Filter>*</Filter><StartingIndex>0</StartingIndex><RequestedCount>0</RequestedCount><SortCriteria></SortCriteria>',
        '<Result>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;FV:2/21&quot; parentID=&quot;FV:2&quot; restricted=&quot;false&quot;&gt;&lt;dc:title&gt;Bottoms Up&lt;/dc:title&gt;&lt;upnp:class&gt;object.itemobject.item.sonos-favorite&lt;/upnp:class&gt;&lt;r:ordinal&gt;0&lt;/r:ordinal&gt;&lt;res protocolInfo=&quot;sonos.com-spotify:*:audio/x-spotify:*&quot;&gt;x-sonos-spotify:spotify%3atrack%3a7nDoBWDvf02SyD8kEQuuPO?sid=9&amp;amp;flags=8224&amp;amp;sn=7&lt;/res&gt;&lt;upnp:albumArtURI&gt;https://i.scdn.co/image/f8eb3c2a6921b2a71f5a4a4de7eecc6fc8cf5021&lt;/upnp:albumArtURI&gt;&lt;r:type&gt;instantPlay&lt;/r:type&gt;&lt;r:description&gt;Door Brantley Gilbert&lt;/r:description&gt;&lt;r:resMD&gt;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;10032020spotify%3atrack%3a7nDoBWDvf02SyD8kEQuuPO&amp;quot; parentID=&amp;quot;100e206cspotify%3aartistTopTracks%3a5q8HGNo0BjLWaTAhRtbwxa&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;dc:title&amp;gt;Bottoms Up&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;desc id=&amp;quot;cdudn&amp;quot; nameSpace=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot;&amp;gt;SA_RINCON2311_X_#Svc2311-0-Token&amp;lt;/desc&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&lt;/r:resMD&gt;&lt;/item&gt;&lt;item id=&quot;FV:2/22&quot; parentID=&quot;FV:2&quot; restricted=&quot;false&quot;&gt;&lt;dc:title&gt;Je bibliotheek&lt;/dc:title&gt;&lt;upnp:class&gt;object.itemobject.item.sonos-favorite&lt;/upnp:class&gt;&lt;r:ordinal&gt;1&lt;/r:ordinal&gt;&lt;res&gt;&lt;/res&gt;&lt;upnp:albumArtURI&gt;http://spotify-static-resources.s3.amazonaws.com/imgstub/your_music_v4_legacy.png&lt;/upnp:albumArtURI&gt;&lt;r:type&gt;shortcut&lt;/r:type&gt;&lt;r:description&gt;Van Spotify&lt;/r:description&gt;&lt;r:resMD&gt;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;10fe2064yourmusic_root&amp;quot; parentID=&amp;quot;00080024yourmusic_root&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;dc:title&amp;gt;Je bibliotheek&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.container&amp;lt;/upnp:class&amp;gt;&amp;lt;desc id=&amp;quot;cdudn&amp;quot; nameSpace=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot;&amp;gt;SA_RINCON2311_X_#Svc2311-0-Token&amp;lt;/desc&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&lt;/r:resMD&gt;&lt;/item&gt;&lt;item id=&quot;FV:2/9&quot; parentID=&quot;FV:2&quot; restricted=&quot;false&quot;&gt;&lt;dc:title&gt;Q-Dance Hard&lt;/dc:title&gt;&lt;upnp:class&gt;object.itemobject.item.sonos-favorite&lt;/upnp:class&gt;&lt;r:ordinal&gt;2&lt;/r:ordinal&gt;&lt;res protocolInfo=&quot;x-sonosapi-stream:*:*:*&quot;&gt;x-sonosapi-stream:s106914?sid=254&amp;amp;flags=32&lt;/res&gt;&lt;upnp:albumArtURI&gt;http://d1i6vahw24eb07.cloudfront.net/s106914q.gif&lt;/upnp:albumArtURI&gt;&lt;r:type&gt;instantPlay&lt;/r:type&gt;&lt;r:description&gt;TuneIn station&lt;/r:description&gt;&lt;r:resMD&gt;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;F00090020s106914&amp;quot; parentID=&amp;quot;F000c0008s106914&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;dc:title&amp;gt;Q-Dance Hard&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.audioBroadcast&amp;lt;/upnp:class&amp;gt;&amp;lt;desc id=&amp;quot;cdudn&amp;quot; nameSpace=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot;&amp;gt;SA_RINCON65031_&amp;lt;/desc&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&lt;/r:resMD&gt;&lt;/item&gt;&lt;item id=&quot;FV:2/2&quot; parentID=&quot;FV:2&quot; restricted=&quot;false&quot;&gt;&lt;dc:title&gt;Q-Music&lt;/dc:title&gt;&lt;upnp:class&gt;object.itemobject.item.sonos-favorite&lt;/upnp:class&gt;&lt;r:ordinal&gt;3&lt;/r:ordinal&gt;&lt;res protocolInfo=&quot;x-sonosapi-stream:*:*:*&quot;&gt;x-sonosapi-stream:s87683?sid=254&amp;amp;flags=32&lt;/res&gt;&lt;upnp:albumArtURI&gt;http://d1i6vahw24eb07.cloudfront.net/s87683q.gif&lt;/upnp:albumArtURI&gt;&lt;r:type&gt;instantPlay&lt;/r:type&gt;&lt;r:description&gt;TuneIn station&lt;/r:description&gt;&lt;r:resMD&gt;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;F00090020s87683&amp;quot; parentID=&amp;quot;F00020064search%3astation:mus&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;dc:title&amp;gt;Q-Music&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.audioBroadcast&amp;lt;/upnp:class&amp;gt;&amp;lt;desc id=&amp;quot;cdudn&amp;quot; nameSpace=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot;&amp;gt;SA_RINCON65031_&amp;lt;/desc&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&lt;/r:resMD&gt;&lt;/item&gt;&lt;item id=&quot;FV:2/24&quot; parentID=&quot;FV:2&quot; restricted=&quot;false&quot;&gt;&lt;dc:title&gt;Sky Radio&lt;/dc:title&gt;&lt;upnp:class&gt;object.itemobject.item.sonos-favorite&lt;/upnp:class&gt;&lt;r:ordinal&gt;4&lt;/r:ordinal&gt;&lt;res protocolInfo=&quot;x-rincon-mp3radio:*:*:*&quot;&gt;x-sonosapi-stream:s9067?sid=254&amp;amp;flags=32&lt;/res&gt;&lt;r:type&gt;instantPlay&lt;/r:type&gt;&lt;r:description&gt;TuneIn-station&lt;/r:description&gt;&lt;r:resMD&gt;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;R:0/0/4&amp;quot; parentID=&amp;quot;R:0/0&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;dc:title&amp;gt;Sky Radio&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.audioBroadcast&amp;lt;/upnp:class&amp;gt;&amp;lt;desc id=&amp;quot;cdudn&amp;quot; nameSpace=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot;&amp;gt;SA_RINCON65031_&amp;lt;/desc&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&lt;/r:resMD&gt;&lt;/item&gt;&lt;item id=&quot;FV:2/13&quot; parentID=&quot;FV:2&quot; restricted=&quot;false&quot;&gt;&lt;dc:title&gt;SLAM!FM&lt;/dc:title&gt;&lt;upnp:class&gt;object.itemobject.item.sonos-favorite&lt;/upnp:class&gt;&lt;r:ordinal&gt;5&lt;/r:ordinal&gt;&lt;res protocolInfo=&quot;x-rincon-mp3radio:*:*:*&quot;&gt;x-sonosapi-stream:s67814?sid=254&amp;amp;flags=32&lt;/res&gt;&lt;r:type&gt;instantPlay&lt;/r:type&gt;&lt;r:description&gt;TuneIn station&lt;/r:description&gt;&lt;r:resMD&gt;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;R:0/0/11&amp;quot; parentID=&amp;quot;R:0/0&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;dc:title&amp;gt;SLAM!FM&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.audioBroadcast&amp;lt;/upnp:class&amp;gt;&amp;lt;desc id=&amp;quot;cdudn&amp;quot; nameSpace=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot;&amp;gt;SA_RINCON65031_&amp;lt;/desc&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&lt;/r:resMD&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</Result><NumberReturned>6</NumberReturned><TotalMatches>6</TotalMatches><UpdateID>3</UpdateID>');
      
      const result = await device.GetFavorites();
      expect(result).to.be.an('object');
      expect(result).to.have.property('NumberReturned', 6);
      expect(result).to.have.property('TotalMatches', 6);
      expect(result).to.have.property('UpdateID', 3);
    });
  });

  describe('GetNightMode()', () => {
    it('executes correct command', async () => {
      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
        '"urn:schemas-upnp-org:service:RenderingControl:1#GetEQ"',
        '<u:GetEQ xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><EQType>NightMode</EQType></u:GetEQ>',
        'GetEQResponse',
        'RenderingControl',
        '<CurrentValue>1</CurrentValue>'
      );
      const device = new SonosDevice(TestHelpers.testHost);
      const result = await device.GetNightMode();
      expect(result).to.be.true;
    });
  });

  describe('GetSpeechEnhancement()', () => {
    it('executes correct command', async () => {
      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
        '"urn:schemas-upnp-org:service:RenderingControl:1#GetEQ"',
        '<u:GetEQ xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><EQType>DialogLevel</EQType></u:GetEQ>',
        'GetEQResponse',
        'RenderingControl',
        '<CurrentValue>0</CurrentValue>'
      );
      const device = new SonosDevice(TestHelpers.testHost);
      const result = await device.GetSpeechEnhancement();
      expect(result).to.be.false;
    });
  });

  describe('GetState()', () => {
    it('returns preloaded mute, state and volume', async () => {

      const device = new SonosDevice(TestHelpers.testHost, 1400);
      // Set private fields, normally set by events
      device['muted'] = true;
      device['volume'] = 6;
      device['currentTransportState'] = TransportState.Paused;

      expect(device['muted']).to.be.true;
      expect(device['volume']).to.be.equal(6);

      const scope = TestHelpers.mockAvTransportGetMediaInfo();
      TestHelpers.mockAvTransportGetPositionInfo(scope);

      const state = await device.GetState();
      expect(state.muted).to.be.true;
      expect(state.volume).to.be.equal(6);
      expect(state.transportState).to.be.equal(TransportState.Stopped)

    });
  })

  describe('GetQueue()', () => {
    it('works', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToServiceWithFileResponse('/MediaServer/ContentDirectory/Control', 'ContentDirectory',
        'Browse', '<ObjectID>Q:0</ObjectID><BrowseFlag>BrowseDirectChildren</BrowseFlag><Filter>*</Filter><StartingIndex>0</StartingIndex><RequestedCount>0</RequestedCount><SortCriteria></SortCriteria>',
        ['services','responses','contentdirectory.browse-queue.xml']);
      
      const result = await device.GetQueue();
      expect(result).to.be.an('object');
      expect(result).to.have.property('NumberReturned', 70);
      expect(result).to.have.property('TotalMatches', 70);
      expect(result).to.have.property('UpdateID', 2);
      expect(result.Result).to.have.lengthOf(70);
    });
  });

  describe('GetZoneGroupState()', () => {
    it('works', async () => {
      TestHelpers.mockZoneGroupState();

      const device = new SonosDevice(TestHelpers.testHost, 1400);

      const result = await device.GetZoneGroupState();
      expect(result).to.have.lengthOf(1);
      expect(result[0].members).to.have.lengthOf(3);
    });
  })

  describe('GetZoneInfo()', () => {
    it('works', async () => {
      TestHelpers.mockRequestToService('/DeviceProperties/Control', 'DeviceProperties',
      'GetZoneInfo','',
      '<SerialNumber>00-FF-FF-FF-FF-BC:A</SerialNumber><SoftwareVersion>56.0-76060</SoftwareVersion><DisplaySoftwareVersion>11.1</DisplaySoftwareVersion><HardwareVersion>1.16.4.1-2</HardwareVersion><IPAddress>192.168.2.30</IPAddress><MACAddress>00:FF:FF:FF:FF:BC</MACAddress><CopyrightInfo>© 2003-2019, Sonos, Inc. All rights reserved.</CopyrightInfo><ExtraInfo>OTP: 1.1.1(1-16-4-zp5s-0.5)</ExtraInfo><HTAudioIn>0</HTAudioIn><Flags>1</Flags>')

      const device = new SonosDevice(TestHelpers.testHost, 1400);

      const result = await device.GetZoneInfo();
      expect(result.MACAddress).to.be.eq('00:FF:FF:FF:FF:BC');
      expect(result.SerialNumber).to.be.eq('00-FF-FF-FF-FF-BC:A');
    });
  })

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
      const randomDeviceId: string = Guid.create().toString();
      const randomAccountKey: string = Guid.create().toString();
      const randomAccountToken:string = Guid.create().toString();
      const randomHouseHoldId:string = Guid.create().toString();
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
      const device = new SonosDevice(TestHelpers.testHost);
      const result = await device.MusicServicesSubscribed();
      expect(result).to.be.an('array').that.has.lengthOf(1);
      const firstItem = result?.[0];
      expect(firstItem).to.have.property('Name', 'Spotify');
    });
  });

  describe('Name', () => {
    it('returns name from zone attributes', async () => {
      TestHelpers.mockSonosLoadDeviceData();
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const result = await device.LoadDeviceData();
      expect(result).to.be.true;
      device['name'] = undefined;
      expect(device.Name).to.be.equal('Kantoor');
    });
    it('throws when zone attributes not loaded', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      expect(() => device.Name).to.throw();
    })
  })

  describe('Next()', () => {
    it('works', async () => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control', 'AVTransport','Next','<InstanceID>0</InstanceID>')

      const device = new SonosDevice(TestHelpers.testHost, 1400);

      const result = await device.Next();
      expect(result).to.be.true;
    });
  })

  describe('NextTrackUri', () => {
    it('returns value from private field', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const trackUri = 'fake:track:uri';
      device['nextTrackUri'] = trackUri;
      expect(device.NextTrackUri).to.be.equal(trackUri);
    })
  })

  describe('Port', () => {
    it('returns port number', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1500);
      expect(device.Port).to.be.equal(1500);
    })
  })

  describe('Previous()', () => {
    it('works', async () => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control', 'AVTransport','Previous','<InstanceID>0</InstanceID>')

      const device = new SonosDevice(TestHelpers.testHost, 1400);

      const result = await device.Previous();
      expect(result).to.be.true;
    });
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
      const device = new SonosDevice(TestHelpers.testHost, 1400);

      const result = await device.SetAVTransportURI(track);
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

  describe('SetNightMode()', () => {
    it('executes correct command when set to true', async () => {
      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
        '"urn:schemas-upnp-org:service:RenderingControl:1#SetEQ"',
        '<u:SetEQ xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><EQType>NightMode</EQType><DesiredValue>1</DesiredValue></u:SetEQ>',
        'SetEQResponse',
        'RenderingControl',
        undefined
      );
      const device = new SonosDevice(TestHelpers.testHost);
      const result = await device.SetNightMode(true);
      expect(result).to.be.true;
    });
    it('executes correct command when set to false', async () => {
      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
        '"urn:schemas-upnp-org:service:RenderingControl:1#SetEQ"',
        '<u:SetEQ xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><EQType>NightMode</EQType><DesiredValue>0</DesiredValue></u:SetEQ>',
        'SetEQResponse',
        'RenderingControl',
        undefined
      );
      const device = new SonosDevice(TestHelpers.testHost);
      const result = await device.SetNightMode(false);
      expect(result).to.be.true;
    });
  });

  describe('SetSpeechEnhancement()', () => {
    it('executes correct command when set to true', async () => {
      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
        '"urn:schemas-upnp-org:service:RenderingControl:1#SetEQ"',
        '<u:SetEQ xmlns:u=\"urn:schemas-upnp-org:service:RenderingControl:1\"><InstanceID>0</InstanceID><EQType>DialogLevel</EQType><DesiredValue>1</DesiredValue></u:SetEQ>',
        'SetEQResponse',
        'RenderingControl',
        undefined
      );
      const device = new SonosDevice(TestHelpers.testHost);
      const result = await device.SetSpeechEnhancement(true);
      expect(result).to.be.true;
    });
    it('executes correct command when set to false', async () => {
      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
        '"urn:schemas-upnp-org:service:RenderingControl:1#SetEQ"',
        '<u:SetEQ xmlns:u=\"urn:schemas-upnp-org:service:RenderingControl:1\"><InstanceID>0</InstanceID><EQType>DialogLevel</EQType><DesiredValue>0</DesiredValue></u:SetEQ>',
        'SetEQResponse',
        'RenderingControl',
        undefined
      );
      const device = new SonosDevice(TestHelpers.testHost);
      const result = await device.SetSpeechEnhancement(false);
      expect(result).to.be.true;
    });
  });

  describe('SetRelativeGroupVolume()', () => {
    it('executes the correct command', async () => {
      TestHelpers.mockRequest('/MediaRenderer/GroupRenderingControl/Control',
      '"urn:schemas-upnp-org:service:GroupRenderingControl:1#SetRelativeGroupVolume"',
      '<u:SetRelativeGroupVolume xmlns:u="urn:schemas-upnp-org:service:GroupRenderingControl:1"><InstanceID>0</InstanceID><Adjustment>40</Adjustment></u:SetRelativeGroupVolume>',
      'SetRelativeGroupVolumeResponse',
      'GroupRenderingControl'
    );
      const device = new SonosDevice(TestHelpers.testHost);
      await device.SetRelativeGroupVolume(40);
    });
  });

  describe('SetRelativeVolume()', () => {
    it('executes the correct command', async () => {
      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
      '"urn:schemas-upnp-org:service:RenderingControl:1#SetRelativeVolume"',
      '<u:SetRelativeVolume xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel><Adjustment>40</Adjustment></u:SetRelativeVolume>',
      'SetRelativeVolumeResponse',
      'RenderingControl'
    );
      const device = new SonosDevice(TestHelpers.testHost);
      await device.SetRelativeVolume(40);
    });
  });

  describe('SetVolume()', () => {
    it('throws error when invalid volume', async (done) => {

      const device = new SonosDevice(TestHelpers.testHost);
      try {
        await device.SetVolume(105);
      } catch(err) {
        expect(err).to.not.be.undefined;
        done();
      }
    });
    it('executes the correct command', async () => {
      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
      '"urn:schemas-upnp-org:service:RenderingControl:1#SetVolume"',
      `<u:SetVolume xmlns:u=\"urn:schemas-upnp-org:service:RenderingControl:1\"><InstanceID>0</InstanceID><Channel>Master</Channel><DesiredVolume>40</DesiredVolume></u:SetVolume>`,
      'SetVolumeResponse',
      'RenderingControl'
    );
      const device = new SonosDevice(TestHelpers.testHost);
      await device.SetVolume(40);
    });
  });

  describe('TogglePlayback()', () => {
    it('Send play when stopped', async () => {
      const scope = TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#GetTransportInfo"',
        '<u:GetTransportInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetTransportInfo>',
        'GetTransportInfoResponse',
        'AVTransport',
        '<CurrentTransportState>STOPPED</CurrentTransportState>',
      );

      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Play"',
        '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>',
        'PlayResponse',
        'AVTransport',
        undefined,
        scope
      );

      const device = new SonosDevice(TestHelpers.testHost);
      const result = await device.TogglePlayback();
      expect(result).to.be.true;
    });

    it('Send pause when playing', async () => {
      const scope = TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#GetTransportInfo"',
        '<u:GetTransportInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetTransportInfo>',
        'GetTransportInfoResponse',
        'AVTransport',
        '<CurrentTransportState>PLAYING</CurrentTransportState>',
      );

      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Pause"',
        '<u:Pause xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:Pause>',
        'PauseResponse',
        'AVTransport',
        undefined,
        scope
      );

      const device = new SonosDevice(TestHelpers.testHost);
      const result = await device.TogglePlayback();
      expect(result).to.be.true;
    });
  });

  describe('Services', () => {
    it('can initialize AVTransportService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.AVTransportService;
      expect(service).to.be.an('object');
    });

    it('uses instance of AVTransportService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.AVTransportService;
      expect(service).to.be.an('object');
      const service2 = device.AVTransportService;
      expect(service).to.be.equal(service2);
    });

    it('can initialize AlarmClockService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.AlarmClockService;
      expect(service).to.be.an('object');
    });

    it('uses instance of AlarmClockService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.AlarmClockService;
      expect(service).to.be.an('object');
      const service2 = device.AlarmClockService;
      expect(service).to.be.equal(service2);
    });

    it('can initialize AudioInService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.AudioInService;
      expect(service).to.be.an('object');
    });

    it('uses instance of AudioInService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.AudioInService;
      expect(service).to.be.an('object');
      const service2 = device.AudioInService;
      expect(service).to.be.equal(service2);
    });

    it('can initialize ConnectionManagerService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.ConnectionManagerService;
      expect(service).to.be.an('object');
    });

    it('uses instance of ConnectionManagerService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.ConnectionManagerService;
      expect(service).to.be.an('object');
      const service2 = device.ConnectionManagerService;
      expect(service).to.be.equal(service2);
    });

    it('can initialize ContentDirectoryService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.ContentDirectoryService;
      expect(service).to.be.an('object');
    });

    it('uses instance of ContentDirectoryService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.ContentDirectoryService;
      expect(service).to.be.an('object');
      const service2 = device.ContentDirectoryService;
      expect(service).to.be.equal(service2);
    });

    it('can initialize DevicePropertiesService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.DevicePropertiesService;
      expect(service).to.be.an('object');
    });

    it('uses instance of DevicePropertiesService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.DevicePropertiesService;
      expect(service).to.be.an('object');
      const service2 = device.DevicePropertiesService;
      expect(service).to.be.equal(service2);
    });

    it('can initialize GroupManagementService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.GroupManagementService;
      expect(service).to.be.an('object');
    });

    it('uses instance of GroupManagementService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.GroupManagementService;
      expect(service).to.be.an('object');
      const service2 = device.GroupManagementService;
      expect(service).to.be.equal(service2);
    });

    it('can initialize GroupRenderingControlService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.GroupRenderingControlService;
      expect(service).to.be.an('object');
    });

    it('uses instance of GroupRenderingControlService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.GroupRenderingControlService;
      expect(service).to.be.an('object');
      const service2 = device.GroupRenderingControlService;
      expect(service).to.be.equal(service2);
    });

    it('can initialize HTControlService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.HTControlService;
      expect(service).to.be.an('object');
    });

    it('uses instance of HTControlService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.HTControlService;
      expect(service).to.be.an('object');
      const service2 = device.HTControlService;
      expect(service).to.be.equal(service2);
    });

    it('can initialize MusicServicesService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.MusicServicesService;
      expect(service).to.be.an('object');
    });

    it('uses instance of MusicServicesService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.MusicServicesService;
      expect(service).to.be.an('object');
      const service2 = device.MusicServicesService;
      expect(service).to.be.equal(service2);
    });

    it('can initialize QPlayService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.QPlayService;
      expect(service).to.be.an('object');
    });

    it('uses instance of QPlayService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.QPlayService;
      expect(service).to.be.an('object');
      const service2 = device.QPlayService;
      expect(service).to.be.equal(service2);
    });

    it('can initialize QueueService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.QueueService;
      expect(service).to.be.an('object');
    });

    it('uses instance of QueueService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.QueueService;
      expect(service).to.be.an('object');
      const service2 = device.QueueService;
      expect(service).to.be.equal(service2);
    });

    it('can initialize RenderingControlService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.RenderingControlService;
      expect(service).to.be.an('object');
    });

    it('uses instance of RenderingControlService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.RenderingControlService;
      expect(service).to.be.an('object');
      const service2 = device.RenderingControlService;
      expect(service).to.be.equal(service2);
    });

    it('can initialize SystemPropertiesService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.SystemPropertiesService;
      expect(service).to.be.an('object');
    });

    it('uses instance of SystemPropertiesService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.SystemPropertiesService;
      expect(service).to.be.an('object');
      const service2 = device.SystemPropertiesService;
      expect(service).to.be.equal(service2);
    });

    it('can initialize VirtualLineInService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.VirtualLineInService;
      expect(service).to.be.an('object');
    });

    it('uses instance of VirtualLineInService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.VirtualLineInService;
      expect(service).to.be.an('object');
      const service2 = device.VirtualLineInService;
      expect(service).to.be.equal(service2);
    });

    it('can initialize ZoneGroupTopologyService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.ZoneGroupTopologyService;
      expect(service).to.be.an('object');
    });

    it('uses instance of ZoneGroupTopologyService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const service = device.ZoneGroupTopologyService;
      expect(service).to.be.an('object');
      const service2 = device.ZoneGroupTopologyService;
      expect(service).to.be.equal(service2);
    });

  });

  describe('Stop()', () => {
    it('works', async () => {
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control', 'AVTransport','Stop','<InstanceID>0</InstanceID>')

      const device = new SonosDevice(TestHelpers.testHost, 1400);

      const result = await device.Stop();
      expect(result).to.be.true;
    });
  })

  describe('SwitchTo..', () => {
    it('SwitchToLineIn() sends correct command', async () => {
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
    it('SwitchToQueue() sends correct command', async () => {
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
    it('SwitchToTV() sends correct command', async () => {
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

      const result = await device.SwitchToTV();
      expect(result).to.be.eq(true);
    });
  });

  describe('RefreshEventSubscriptions', () => {
    afterEach(async () => {
      await SonosEventListener.DefaultInstance.StopListener();
    })
    it('does nothing without subscriptions', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);

      const result = await device.RefreshEventSubscriptions();
      expect(result).to.be.false;

      const result2 = await device.AVTransportService.CheckEventListener();
      expect(result2).to.be.false;
    });

    it('checks all services and returns false', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      device.AlarmClockService;
      device.AudioInService;
      device.AVTransportService;
      device.ConnectionManagerService;
      device.ContentDirectoryService;
      device.DevicePropertiesService;
      device.GroupManagementService;
      device.GroupRenderingControlService;
      device.HTControlService;
      device.MusicServicesService;
      device.QPlayService;
      device.QueueService;
      device.RenderingControlService;
      device.SystemPropertiesService;
      device.VirtualLineInService;
      device.ZoneGroupTopologyService;

      const result = await device.RefreshEventSubscriptions();
      expect(result).to.be.false;

      const result2 = await device.AVTransportService.CheckEventListener();
      expect(result2).to.be.false;
    });

  });

  describe('Group options in constructor', () => {
    it('returns correct groupname', (done) => {
      const groupName = 'Special sonos group';
      const name = 'Office';
      const uuid = 'fake-uuid';
      const emitter = new EventEmitter();
      const device = new SonosDevice('localhost', 1400, uuid, name, { name: groupName, managerEvents: emitter });
      expect(device.GroupName).to.be.equal(groupName);
      expect(device.Name).to.be.equal(name);
      done();
    });

    it('subscribes for group updates', (done) => {
      const groupName = 'Special sonos group';
      const name = 'Office';
      const uuid = 'fake-uuid';
      const emitter = new EventEmitter();
      const device = new SonosDevice('localhost', 1400, uuid, name, { name: groupName, managerEvents: emitter });
      
      const subscriptions = emitter.eventNames();
      expect(subscriptions).to.be.an('array').that.contains(uuid);
      done();
    });

    it('Updates group name', (done) => {
      const groupName = 'Special sonos group';
      const newGroupName = 'Office-disco';
      const name = 'Office';
      const uuid = 'fake-uuid';
      const emitter = new EventEmitter();
      const device = new SonosDevice('localhost', 1400, uuid, name, { name: groupName, managerEvents: emitter });
      
      emitter.emit(uuid, { name: newGroupName });
      expect(device.GroupName).to.be.equal(newGroupName);
      done();
    });
  });
});
