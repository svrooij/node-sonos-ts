import { expect }  from 'chai'
import { TestHelpers } from '../test-helpers'
import { AlarmClockService } from '../../src/services/alarm-clock.service'
import { PlayMode } from '../../src/models'

describe('AlarmClockService', () => {
  describe('CreateAlarm', () => {
    it('encodes track uri and metadata', async () => {
      TestHelpers.mockRequest('/AlarmClock/Control',
        '"urn:schemas-upnp-org:service:AlarmClock:1#CreateAlarm"',
        '<u:CreateAlarm xmlns:u="urn:schemas-upnp-org:service:AlarmClock:1"><StartLocalTime>09:00:00</StartLocalTime><Duration>00:08:00</Duration><Recurrence>ONCE</Recurrence><Enabled>1</Enabled><RoomUUID>fake_uuid</RoomUUID><ProgramURI>http://livingears.com/music/SceneNotHeard/091909/Do%20You%20Mind%20Kyla.mp3</ProgramURI><ProgramMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;100&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Do you mind&lt;/dc:title&gt;&lt;dc:creator&gt;Kyla &amp; the gang&lt;/dc:creator&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;RINCON_AssociatedZPUDN&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</ProgramMetaData><PlayMode>SHUFFLE</PlayMode><Volume>10</Volume><IncludeLinkedZones>0</IncludeLinkedZones></u:CreateAlarm>',
        'CreateAlarmResponse',
        'AlarmClock',
        '<AssignedID>100</AutoAdjustDst>'
      );

      const service = new AlarmClockService(TestHelpers.testHost, 1400)

      const result = await service.CreateAlarm({
        StartLocalTime: '09:00:00',
        Duration: '00:08:00',
        Recurrence: 'ONCE',
        Enabled: true,
        RoomUUID: 'fake_uuid',
        ProgramURI: 'http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3',
        ProgramMetaData: { ItemId: '100', Title: 'Do you mind', Artist: 'Kyla & the gang' },
        PlayMode: PlayMode.Shuffle,
        Volume: 10,
        IncludeLinkedZones: false
      });
      expect(result).to.have.nested.property('AssignedID', 100)
    })
  })

  describe('GetTimeZone', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/AlarmClock/Control',
        '"urn:schemas-upnp-org:service:AlarmClock:1#GetTimeZone"',
        '<u:GetTimeZone xmlns:u="urn:schemas-upnp-org:service:AlarmClock:1"></u:GetTimeZone>',
        'GetTimeZoneResponse',
        'AlarmClock',
        '<AutoAdjustDst>1</AutoAdjustDst><Index>27</Index>'
      );

      const service = new AlarmClockService(TestHelpers.testHost, 1400)

      const result = await service.GetTimeZone();
      expect(result).to.have.nested.property('AutoAdjustDst', 1)
      expect(result).to.have.nested.property('Index', 27)
    })
  })
  describe('ListAndParseAlarms()', () => {
    (process.env.SONOS_HOST ? it : it.skip)('actual device', async () => {
      const service = new AlarmClockService(process.env.SONOS_HOST || 'should_not_get_here');
      const alarms = await service.ListAndParseAlarms();

      expect(alarms).to.be.an('array');
      expect(alarms).to.have.lengthOf.at.least(1);
    });

    it('works', async () => {
      TestHelpers.mockAlarmListResponse();
      const service = new AlarmClockService(TestHelpers.testHost, 1400);
      const alarms = await service.ListAndParseAlarms();
      expect(alarms).to.be.an('array');
      expect(alarms).to.have.lengthOf(2);
    });
  });

  describe('PatchAlarm()', () => {
    it('throws when not found', async () => {
      TestHelpers.mockAlarmListResponse();
      const service = new AlarmClockService(TestHelpers.testHost, 1400);
      try {
        const result = await service.PatchAlarm({ 
          ID: 500,
          Enabled: false
        });
      } catch (error) {
        expect(error).to.not.be.null;
        expect(error).have.property('message').that.contains('500');
        return;
      }
      expect(false).to.be.true; // This should not be reached.

    });

    it('updates everything', async () => {
      TestHelpers.mockAlarmListResponse();
      TestHelpers.mockRequest('/AlarmClock/Control',
      '"urn:schemas-upnp-org:service:AlarmClock:1#UpdateAlarm"',
      '<u:UpdateAlarm xmlns:u="urn:schemas-upnp-org:service:AlarmClock:1"><Duration>00:10:00</Duration><Enabled>1</Enabled><ID>1712</ID><IncludeLinkedZones>0</IncludeLinkedZones><PlayMode>NORMAL</PlayMode><ProgramMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;1006206cspotify%3auser%3aspotify%3aplaylist%3a37i9dQZF1DWZpGSuzrdTXg&quot; restricted=&quot;true&quot; parentID=&quot;10082064featured_pls&quot;&gt;&lt;dc:title&gt;Easy On Sunday&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.playlistContainer&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;RINCON_AssociatedZPUDN&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</ProgramMetaData><ProgramURI>x-rincon-cpcontainer:1006206cspotify%3auser%3aspotify%3aplaylist%3a37i9dQZF1DWZpGSuzrdTXg?sid=9&amp;flags=8300&amp;sn=7</ProgramURI><Recurrence>WEEKDAYS</Recurrence><RoomUUID>RINCON_B8E9378A0DDC01400</RoomUUID><StartLocalTime>09:00:00</StartLocalTime><Volume>6</Volume></u:UpdateAlarm>',
      '',
      'AlarmClock'
    );
      const service = new AlarmClockService(TestHelpers.testHost, 1400);

      const result = await service.PatchAlarm({ 
        ID: 1712,
        Duration: '00:10:00',
        Enabled: true,
        PlayMode: PlayMode.Normal,
        Recurrence: 'WEEKDAYS',
        StartLocalTime: '09:00:00',
        Volume: 6
      });
      expect(result).to.be.true;
    });
    it('updates nothing', async () => {
      TestHelpers.mockAlarmListResponse();
      TestHelpers.mockRequest('/AlarmClock/Control',
      '"urn:schemas-upnp-org:service:AlarmClock:1#UpdateAlarm"',
      '<u:UpdateAlarm xmlns:u="urn:schemas-upnp-org:service:AlarmClock:1"><Duration>00:08:00</Duration><Enabled>0</Enabled><ID>1712</ID><IncludeLinkedZones>0</IncludeLinkedZones><PlayMode>SHUFFLE</PlayMode><ProgramMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;1006206cspotify%3auser%3aspotify%3aplaylist%3a37i9dQZF1DWZpGSuzrdTXg&quot; restricted=&quot;true&quot; parentID=&quot;10082064featured_pls&quot;&gt;&lt;dc:title&gt;Easy On Sunday&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.playlistContainer&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;RINCON_AssociatedZPUDN&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</ProgramMetaData><ProgramURI>x-rincon-cpcontainer:1006206cspotify%3auser%3aspotify%3aplaylist%3a37i9dQZF1DWZpGSuzrdTXg?sid=9&amp;flags=8300&amp;sn=7</ProgramURI><Recurrence>WEEKDAYS</Recurrence><RoomUUID>RINCON_B8E9378A0DDC01400</RoomUUID><StartLocalTime>08:15:00</StartLocalTime><Volume>8</Volume></u:UpdateAlarm>',
      '',
      'AlarmClock'
    );
      const service = new AlarmClockService(TestHelpers.testHost, 1400);

      const result = await service.PatchAlarm({ 
        ID: 1712,
      });
      expect(result).to.be.true;
    });
  });
});

