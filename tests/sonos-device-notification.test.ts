import { assert, expect }  from 'chai'
import nock from 'nock'
import SonosDevice from '../src/sonos-device'
import { TestHelpers } from './test-helpers';
import SonosEventListener from '../src/sonos-event-listener';
import AsyncHelper from '../src/helpers/async-helper';



describe('SonosDevice - Notifications', () => {
  describe('PlayNotification(...)', () => {
    afterEach(async (done) => {
      await SonosEventListener.DefaultInstance.StopListener();
      setTimeout(() => done(), 30);

    })
    it('executes right requests', async (done) => {

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

      // Get Mute
      TestHelpers.mockRequestToService('/MediaRenderer/RenderingControl/Control','RenderingControl', 'GetMute',
        '<InstanceID>0</InstanceID><Channel>Master</Channel>', '<CurrentMute>0</CurrentMute>', scope);

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
        .intercept('/MediaRenderer/RenderingControl/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
        .reply(200, '', {
          sid: renderingControlSid
        });

      const avtransportSid = '07896553-d7d6-4b7d-a3d9-f4d86b33d6d2'
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

      // Start playing notification
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

      const nockResult = scope.isDone();
      expect(result).to.be.true;
      done();
    });

    it('returns false when not playing', async (done) => {
      // GetTransportInfo
      const scope = TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#GetTransportInfo"',
        '<u:GetTransportInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetTransportInfo>',
        'GetTransportInfoResponse',
        'AVTransport',
        '<CurrentTransportState>STOPPED</CurrentTransportState>'
      );

      // Get Volume
      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
        '"urn:schemas-upnp-org:service:RenderingControl:1#GetVolume"',
        '<u:GetVolume xmlns:u=\"urn:schemas-upnp-org:service:RenderingControl:1\"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetVolume>',
        'GetVolumeResponse',
        'RenderingControl',
        `<CurrentVolume>10</CurrentVolume>`,
        scope
      );

      // Get Mute
      TestHelpers.mockRequestToService('/MediaRenderer/RenderingControl/Control','RenderingControl', 'GetMute',
        '<InstanceID>0</InstanceID><Channel>Master</Channel>', '<CurrentMute>0</CurrentMute>', scope);
    
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

      const device = new SonosDevice(TestHelpers.testHost, 1400);

      const result = await device.PlayNotification({
        delayMs: 10,
        onlyWhenPlaying: true,
        timeout: 1,
        trackUri: 'spotify:artist:3b9xTm2eiaCRTGqUEWuzxc',
        volume: 10
      });
      expect(result).to.be.false;
      done();
    });

    it('plays two notifications', async (done) => {
      const currentVolume = 6;
      const notificationVolume = 10;
      const port = 1410;
      const scope = TestHelpers.getScope(port);
      // GetTransportInfo
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control', 'AVTransport', 'GetTransportInfo',
        '<InstanceID>0</InstanceID>', '<CurrentTransportState>PLAYING</CurrentTransportState>', scope);

      // Get Volume
      TestHelpers.mockRequestToService('/MediaRenderer/RenderingControl/Control','RenderingControl', 'GetVolume',
        '<InstanceID>0</InstanceID><Channel>Master</Channel>', `<CurrentVolume>${currentVolume}</CurrentVolume>`, scope);

      // Get Mute
      TestHelpers.mockRequestToService('/MediaRenderer/RenderingControl/Control','RenderingControl', 'GetMute',
        '<InstanceID>0</InstanceID><Channel>Master</Channel>', '<CurrentMute>0</CurrentMute>', scope);

      // GetMediaInfo
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control', 'AVTransport', 'GetMediaInfo', '<InstanceID>0</InstanceID>',
        '<NrTracks>51</NrTracks><MediaDuration>NOT_IMPLEMENTED</MediaDuration><CurrentURI>x-rincon-queue:RINCON_000FFFFFFFFF01400#0</CurrentURI><CurrentURIMetaData></CurrentURIMetaData><NextURI></NextURI><NextURIMetaData></NextURIMetaData><PlayMedium>NETWORK</PlayMedium><RecordMedium>NOT_IMPLEMENTED</RecordMedium><WriteStatus>NOT_IMPLEMENTED</WriteStatus>',
        scope);

      // GetPositionInfo
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control', 'AVTransport', 'GetPositionInfo', '<InstanceID>0</InstanceID>',
        '<Track>26</Track><TrackDuration>0:03:58</TrackDuration><TrackMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;-1&quot; parentID=&quot;-1&quot; restricted=&quot;true&quot;&gt;&lt;res protocolInfo=&quot;sonos.com-spotify:*:audio/x-spotify:*&quot; duration=&quot;0:03:58&quot;&gt;x-sonos-spotify:spotify%3atrack%3a1PWV26P0WRrRpKWj3Z7KVy?sid=9&amp;amp;flags=8224&amp;amp;sn=7&lt;/res&gt;&lt;r:streamContent&gt;&lt;/r:streamContent&gt;&lt;upnp:albumArtURI&gt;/getaa?s=1&amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a1PWV26P0WRrRpKWj3Z7KVy%3fsid%3d9%26flags%3d8224%26sn%3d7&lt;/upnp:albumArtURI&gt;&lt;dc:title&gt;200 Dreams&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.musicTrack&lt;/upnp:class&gt;&lt;dc:creator&gt;Noisecontrollers&lt;/dc:creator&gt;&lt;upnp:album&gt;200 Dreams EP&lt;/upnp:album&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</TrackMetaData><TrackURI>x-sonos-spotify:spotify%3atrack%3a1PWV26P0WRrRpKWj3Z7KVy?sid=9&amp;flags=8224&amp;sn=7</TrackURI><RelTime>0:02:18</RelTime><AbsTime>NOT_IMPLEMENTED</AbsTime><RelCount>2147483647</RelCount><AbsCount>2147483647</AbsCount>',
        scope);

      // SetAVTransportURI Play Artist radio
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control', 'AVTransport', 'SetAVTransportURI',
        '<InstanceID>0</InstanceID><CurrentURI>x-sonosapi-radio:spotify%3aartistRadio%3a37i9dQZF1E4lKH7XBCfvaH?sid=9&amp;flags=8300&amp;sn=7</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;100c206cspotify%3aartistRadio%3a37i9dQZF1E4lKH7XBCfvaH&quot; restricted=&quot;true&quot; parentID=&quot;10052064spotify%3aartist%3a37i9dQZF1E4lKH7XBCfvaH&quot;&gt;&lt;dc:title&gt;Artist radio&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast.#artistRadio&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON2311_X_#Svc2311-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData>',
        undefined,
        scope);

      // Set second notification url
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control', 'AVTransport', 'SetAVTransportURI',
        '<InstanceID>0</InstanceID><CurrentURI>x-sonosapi-radio:spotify%3aartistRadio%3a37i9dQZF1E4lKH7XBCfxxx?sid=9&amp;flags=8300&amp;sn=7</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;100c206cspotify%3aartistRadio%3a37i9dQZF1E4lKH7XBCfxxx&quot; restricted=&quot;true&quot; parentID=&quot;10052064spotify%3aartist%3a37i9dQZF1E4lKH7XBCfxxx&quot;&gt;&lt;dc:title&gt;Artist radio&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast.#artistRadio&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON2311_X_#Svc2311-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData>',
        undefined,
        scope);

      // Set Volume to {notificationVolume}
      TestHelpers.mockRequestToService('/MediaRenderer/RenderingControl/Control','RenderingControl', 'SetVolume',
        `<InstanceID>0</InstanceID><Channel>Master</Channel><DesiredVolume>${notificationVolume}</DesiredVolume>`,
        undefined, scope);

      // Required to catch event subscription
      //process.env.SONOS_LISTENER_HOST = 'localhost-events'
      const renderingControlSid = '78f289d1-6289-43a9-948d-3a2a5c5753c9';
      scope
        .intercept('/MediaRenderer/RenderingControl/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
        .reply(200, '', {
          sid: renderingControlSid
        });

      const avtransportSid = '07896553-d7d6-4b7d-a3d9-f4d86b33d6d2'
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

      // Set Volume to 6 (previous)
      TestHelpers.mockRequestToService('/MediaRenderer/RenderingControl/Control','RenderingControl', 'SetVolume',
        `<InstanceID>0</InstanceID><Channel>Master</Channel><DesiredVolume>${currentVolume}</DesiredVolume>`,
        undefined, scope);

      // SetAVTransportURI Revert to original
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control', 'AVTransport', 'SetAVTransportURI',
        '<InstanceID>0</InstanceID><CurrentURI>x-rincon-queue:RINCON_000FFFFFFFFF01400#0</CurrentURI><CurrentURIMetaData></CurrentURIMetaData>',
        undefined,
        scope);

      // Start playing
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control', 'AVTransport', 'Play',
        '<InstanceID>0</InstanceID><Speed>1</Speed>',
        undefined,
        scope);

      // Start playing for second notification
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control', 'AVTransport', 'Play',
        '<InstanceID>0</InstanceID><Speed>1</Speed>',
        undefined,
        scope);

      // Restart playing
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control', 'AVTransport', 'Play',
        '<InstanceID>0</InstanceID><Speed>1</Speed>',
        undefined,
        scope);

      // Emit the event that normally would be triggered by the sonos event subscription.
      const device = new SonosDevice(TestHelpers.testHost, port);
      let notificationsPlayed = 0;
      setTimeout(async () => {
        await device.PlayNotification({
          delayMs: 10,
          onlyWhenPlaying: false,
          notificationFired: async (played: boolean) => {
            notificationsPlayed++;
            await AsyncHelper.Delay(100);
            expect(notificationsPlayed).to.be.equal(2);
            done();
          },
          timeout: 1,
          trackUri: 'spotify:artistRadio:37i9dQZF1E4lKH7XBCfxxx'
        })
      }, 500);

      await device.PlayNotification({
        delayMs: 10,
        onlyWhenPlaying: false,
        notificationFired: (played: boolean) => {
          notificationsPlayed++;
        },
        timeout: 1,
        trackUri: 'spotify:artistRadio:37i9dQZF1E4lKH7XBCfvaH',
        volume: notificationVolume
      });
    });

    it('throws error when incorrect delay is specified', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      try {
        await device.PlayNotification({
          trackUri: 'fake',
          delayMs: 5000
        });
      } catch(error) {
        expect(error).to.not.be.null;
        expect(error).have.property('message', 'Delay (if specified) should be between 1 and 4000');
      }
    });

    it('throws error when incorrect volume is specified', async () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      try {
        await device.PlayNotification({
          trackUri: 'fake',
          volume: 101
        });
      } catch(error) {
        expect(error).to.not.be.null;
        expect(error).have.property('message', 'Volume needs to be between 1 and 100');
      }
    });
  });

  describe('PlayTTS(...)', () => {
    afterEach(async (done) => {
      await SonosEventListener.DefaultInstance.StopListener();
      setTimeout(() => done(), 30);
    });

    it('return false when not playing', async (done) => {
      const port = 1700;
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
        `<CurrentVolume>10</CurrentVolume>`,
        scope
      );

      // Get Mute
      TestHelpers.mockRequestToService('/MediaRenderer/RenderingControl/Control','RenderingControl', 'GetMute',
        '<InstanceID>0</InstanceID><Channel>Master</Channel>', '<CurrentMute>0</CurrentMute>', scope);
        
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

      const endpoint = 'http://localhost/tts-endpoint'
      const text = 'Er staat iemand aan de voordeur';
      const lang = 'nl-nl';

      const resultUri = 'https://localhost/cache/sound.mp3';
      const respBody = JSON.stringify({ uri: resultUri });
      nock('http://localhost', { reqheaders: { 'Content-type': 'application/json' } })
        .post('/tts-endpoint')
        .reply(200, respBody);

      const device = new SonosDevice(TestHelpers.testHost, port);

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
      done();
    });

  });
})

describe('PlayNotificationTwo(...) Queue Tests', () => {
  afterEach(async (done) => {
    await SonosEventListener.DefaultInstance.StopListener();
    setTimeout(() => done(), 30);
  });

  it('returns false when timeout triggers', async (done) => {

    const currentVolume = 6;
    const notificationVolume = 10;
    const port = 1901;
    const scope = TestHelpers.getScope(port);

    TestHelpers.mockRequest('/DeviceProperties/Control',
      '"urn:schemas-upnp-org:service:DeviceProperties:1#GetZoneAttributes"',
      '<u:GetZoneAttributes xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetZoneAttributes>',
      'GetZoneAttributesResponse',
      'DeviceProperties',
      '<CurrentZoneName>Kantoor</CurrentZoneName><CurrentIcon>x-rincon-roomicon:office</CurrentIcon><CurrentConfiguration>1</CurrentConfiguration>',
      scope
    );

    TestHelpers.mockRequestToService('/MediaRenderer/RenderingControl/Control','RenderingControl', 'GetVolume',
      '<InstanceID>0</InstanceID><Channel>Master</Channel>', `<CurrentVolume>${currentVolume}</CurrentVolume>`, scope);

    
    TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
      '"urn:schemas-upnp-org:service:RenderingControl:1#GetMute"',
      '<u:GetMute xmlns:u=\"urn:schemas-upnp-org:service:RenderingControl:1\"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetMute>',
      'GetMuteResponse',
      'RenderingControl',
      '<CurrentMute>0</CurrentMute>',
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

    

    // GetTransportInfo
    TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
      '"urn:schemas-upnp-org:service:AVTransport:1#GetTransportInfo"',
      '<u:GetTransportInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetTransportInfo>',
      'GetTransportInfoResponse',
      'AVTransport',
      '<CurrentTransportState>STOPPED</CurrentTransportState>',
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
      .intercept('/MediaRenderer/RenderingControl/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
      .reply(200, '', {
        sid: renderingControlSid
      });

    const avtransportSid = '07896553-d7d6-4b7d-a3d9-f4d86b33d6d2'
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

    // Restart playing
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
    const deviceData = await device.LoadDeviceData();
    setTimeout(() => {
      device.AVTransportService.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><LastChange>&lt;Event xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/AVT/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;&lt;InstanceID val=&quot;0&quot;&gt;&lt;TransportState val=&quot;STOPPED&quot;/&gt;&lt;CurrentPlayMode val=&quot;SHUFFLE&quot;/&gt;&lt;CurrentCrossfadeMode val=&quot;0&quot;/&gt;&lt;NumberOfTracks val=&quot;51&quot;/&gt;&lt;CurrentTrack val=&quot;47&quot;/&gt;&lt;CurrentSection val=&quot;0&quot;/&gt;&lt;CurrentTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;CurrentTrackDuration val=&quot;0:03:24&quot;/&gt;&lt;CurrentTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:24&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;r:streamContent&amp;gt;&amp;lt;/r:streamContent&amp;gt;&amp;lt;r:radioShowMd&amp;gt;&amp;lt;/r:radioShowMd&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a2nj0bzqYZR7PXs0BoQTW3V%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Survive&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Bass Modulators&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Survive (feat. Bram Boender)&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:NextTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;r:NextTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:56&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a7aKme0bvekUFoMI0cHGIRk%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Fine Day&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Coone&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Fine Day&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:EnqueuedTransportURI val=&quot;x-rincon-cpcontainer:1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa?sid=9&amp;amp;flags=8300&amp;amp;sn=7&quot;/&gt;&lt;r:EnqueuedTransportURIMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa&amp;quot; parentID=&amp;quot;00020000playlist:hardstyle&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;dc:title&amp;gt;Hardstyle Everyday&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.container.playlistContainer&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;spakenburger&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;https://i.scdn.co/image/ab67706c0000da84c064a0cba71066f9b99808ef&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;r:description&amp;gt;Hardstyle Everyday&amp;lt;/r:description&amp;gt;&amp;lt;desc id=&amp;quot;cdudn&amp;quot; nameSpace=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot;&amp;gt;SA_RINCON2311_X_#Svc2311-0-Token&amp;lt;/desc&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;/InstanceID&gt;&lt;/Event&gt;</LastChange></e:property></e:propertyset>');
    }, 2500);

    const result = await device.PlayNotificationTwo({
      delayMs: 10,
      onlyWhenPlaying: false,
      timeout: 2,
      trackUri: 'spotify:artistRadio:37i9dQZF1E4lKH7XBCfvaH',
      volume: notificationVolume
    });

    expect(result).to.be.eq(false);
    done();
  });

  it('Notification Queue, "resolveAfterRevert" Option (Recieve 2nd promise prior to first or third)', async (done) => {

    const currentVolume = 6;
    const notificationVolume = 10;
    const port = 1902;
    const scope = TestHelpers.getScope(port);

    TestHelpers.mockRequest('/DeviceProperties/Control',
      '"urn:schemas-upnp-org:service:DeviceProperties:1#GetZoneAttributes"',
      '<u:GetZoneAttributes xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetZoneAttributes>',
      'GetZoneAttributesResponse',
      'DeviceProperties',
      '<CurrentZoneName>Kantoor</CurrentZoneName><CurrentIcon>x-rincon-roomicon:office</CurrentIcon><CurrentConfiguration>1</CurrentConfiguration>',
      scope
    );

    TestHelpers.mockRequestToService('/MediaRenderer/RenderingControl/Control','RenderingControl', 'GetVolume',
      '<InstanceID>0</InstanceID><Channel>Master</Channel>', `<CurrentVolume>${currentVolume}</CurrentVolume>`, scope);

    
    TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
      '"urn:schemas-upnp-org:service:RenderingControl:1#GetMute"',
      '<u:GetMute xmlns:u=\"urn:schemas-upnp-org:service:RenderingControl:1\"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetMute>',
      'GetMuteResponse',
      'RenderingControl',
      '<CurrentMute>0</CurrentMute>',
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

    

    // GetTransportInfo
    TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
      '"urn:schemas-upnp-org:service:AVTransport:1#GetTransportInfo"',
      '<u:GetTransportInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetTransportInfo>',
      'GetTransportInfoResponse',
      'AVTransport',
      '<CurrentTransportState>STOPPED</CurrentTransportState>',
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

    // SetAVTransportURI Play Artist radio 2nd Notification
    TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
      '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
      '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-sonosapi-radio:spotify%3aartistRadio%3a37i9dQZF1E4lKH7XBCfvaH?sid=9&amp;flags=8300&amp;sn=7</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;100c206cspotify%3aartistRadio%3a37i9dQZF1E4lKH7XBCfvaH&quot; restricted=&quot;true&quot; parentID=&quot;10052064spotify%3aartist%3a37i9dQZF1E4lKH7XBCfvaH&quot;&gt;&lt;dc:title&gt;Artist radio&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast.#artistRadio&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON2311_X_#Svc2311-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData></u:SetAVTransportURI>',
      'SetAVTransportURIResponse',
      'AVTransport',
      undefined,
      scope
    );

    // Set Volume to {notificationVolume} 2nd Notification
    TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
      '"urn:schemas-upnp-org:service:RenderingControl:1#SetVolume"',
      `<u:SetVolume xmlns:u=\"urn:schemas-upnp-org:service:RenderingControl:1\"><InstanceID>0</InstanceID><Channel>Master</Channel><DesiredVolume>${notificationVolume}</DesiredVolume></u:SetVolume>`,
      'SetVolumeResponse',
      'RenderingControl',
      undefined,
      scope
    );

    // SetAVTransportURI Play Artist radio 3rd Notification
    TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
     '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
     '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-sonosapi-radio:spotify%3aartistRadio%3a37i9dQZF1E4lKH7XBCfvaH?sid=9&amp;flags=8300&amp;sn=7</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;100c206cspotify%3aartistRadio%3a37i9dQZF1E4lKH7XBCfvaH&quot; restricted=&quot;true&quot; parentID=&quot;10052064spotify%3aartist%3a37i9dQZF1E4lKH7XBCfvaH&quot;&gt;&lt;dc:title&gt;Artist radio&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast.#artistRadio&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON2311_X_#Svc2311-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData></u:SetAVTransportURI>',
     'SetAVTransportURIResponse',
     'AVTransport',
     undefined,
     scope
   );

   // Set Volume to {notificationVolume} 3rd Notification
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
      .intercept('/MediaRenderer/RenderingControl/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
      .reply(200, '', {
        sid: renderingControlSid
      });

    const avtransportSid = '07896553-d7d6-4b7d-a3d9-f4d86b33d6d2'
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

    // Restart playing
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
    const deviceData = await device.LoadDeviceData();
    setTimeout(() => {
      device.AVTransportService.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><LastChange>&lt;Event xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/AVT/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;&lt;InstanceID val=&quot;0&quot;&gt;&lt;TransportState val=&quot;STOPPED&quot;/&gt;&lt;CurrentPlayMode val=&quot;SHUFFLE&quot;/&gt;&lt;CurrentCrossfadeMode val=&quot;0&quot;/&gt;&lt;NumberOfTracks val=&quot;51&quot;/&gt;&lt;CurrentTrack val=&quot;47&quot;/&gt;&lt;CurrentSection val=&quot;0&quot;/&gt;&lt;CurrentTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;CurrentTrackDuration val=&quot;0:03:24&quot;/&gt;&lt;CurrentTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:24&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;r:streamContent&amp;gt;&amp;lt;/r:streamContent&amp;gt;&amp;lt;r:radioShowMd&amp;gt;&amp;lt;/r:radioShowMd&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a2nj0bzqYZR7PXs0BoQTW3V%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Survive&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Bass Modulators&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Survive (feat. Bram Boender)&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:NextTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;r:NextTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:56&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a7aKme0bvekUFoMI0cHGIRk%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Fine Day&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Coone&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Fine Day&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:EnqueuedTransportURI val=&quot;x-rincon-cpcontainer:1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa?sid=9&amp;amp;flags=8300&amp;amp;sn=7&quot;/&gt;&lt;r:EnqueuedTransportURIMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa&amp;quot; parentID=&amp;quot;00020000playlist:hardstyle&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;dc:title&amp;gt;Hardstyle Everyday&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.container.playlistContainer&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;spakenburger&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;https://i.scdn.co/image/ab67706c0000da84c064a0cba71066f9b99808ef&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;r:description&amp;gt;Hardstyle Everyday&amp;lt;/r:description&amp;gt;&amp;lt;desc id=&amp;quot;cdudn&amp;quot; nameSpace=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot;&amp;gt;SA_RINCON2311_X_#Svc2311-0-Token&amp;lt;/desc&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;/InstanceID&gt;&lt;/Event&gt;</LastChange></e:property></e:propertyset>');
    }, 500);

    // 2nd Notification Play Event
    setTimeout(() => {
      device.AVTransportService.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><LastChange>&lt;Event xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/AVT/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;&lt;InstanceID val=&quot;0&quot;&gt;&lt;TransportState val=&quot;PLAYING&quot;/&gt;&lt;CurrentPlayMode val=&quot;SHUFFLE&quot;/&gt;&lt;CurrentCrossfadeMode val=&quot;0&quot;/&gt;&lt;NumberOfTracks val=&quot;51&quot;/&gt;&lt;CurrentTrack val=&quot;47&quot;/&gt;&lt;CurrentSection val=&quot;0&quot;/&gt;&lt;CurrentTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;CurrentTrackDuration val=&quot;0:03:24&quot;/&gt;&lt;CurrentTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:24&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;r:streamContent&amp;gt;&amp;lt;/r:streamContent&amp;gt;&amp;lt;r:radioShowMd&amp;gt;&amp;lt;/r:radioShowMd&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a2nj0bzqYZR7PXs0BoQTW3V%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Survive&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Bass Modulators&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Survive (feat. Bram Boender)&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:NextTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;r:NextTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:56&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a7aKme0bvekUFoMI0cHGIRk%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Fine Day&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Coone&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Fine Day&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:EnqueuedTransportURI val=&quot;x-rincon-cpcontainer:1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa?sid=9&amp;amp;flags=8300&amp;amp;sn=7&quot;/&gt;&lt;r:EnqueuedTransportURIMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa&amp;quot; parentID=&amp;quot;00020000playlist:hardstyle&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;dc:title&amp;gt;Hardstyle Everyday&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.container.playlistContainer&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;spakenburger&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;https://i.scdn.co/image/ab67706c0000da84c064a0cba71066f9b99808ef&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;r:description&amp;gt;Hardstyle Everyday&amp;lt;/r:description&amp;gt;&amp;lt;desc id=&amp;quot;cdudn&amp;quot; nameSpace=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot;&amp;gt;SA_RINCON2311_X_#Svc2311-0-Token&amp;lt;/desc&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;/InstanceID&gt;&lt;/Event&gt;</LastChange></e:property></e:propertyset>');
    }, 900);

    // 2nd Notification Stopped Event
    setTimeout(() => {
      device.AVTransportService.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><LastChange>&lt;Event xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/AVT/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;&lt;InstanceID val=&quot;0&quot;&gt;&lt;TransportState val=&quot;STOPPED&quot;/&gt;&lt;CurrentPlayMode val=&quot;SHUFFLE&quot;/&gt;&lt;CurrentCrossfadeMode val=&quot;0&quot;/&gt;&lt;NumberOfTracks val=&quot;51&quot;/&gt;&lt;CurrentTrack val=&quot;47&quot;/&gt;&lt;CurrentSection val=&quot;0&quot;/&gt;&lt;CurrentTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;CurrentTrackDuration val=&quot;0:03:24&quot;/&gt;&lt;CurrentTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:24&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;r:streamContent&amp;gt;&amp;lt;/r:streamContent&amp;gt;&amp;lt;r:radioShowMd&amp;gt;&amp;lt;/r:radioShowMd&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a2nj0bzqYZR7PXs0BoQTW3V%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Survive&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Bass Modulators&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Survive (feat. Bram Boender)&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:NextTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;r:NextTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:56&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a7aKme0bvekUFoMI0cHGIRk%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Fine Day&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Coone&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Fine Day&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:EnqueuedTransportURI val=&quot;x-rincon-cpcontainer:1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa?sid=9&amp;amp;flags=8300&amp;amp;sn=7&quot;/&gt;&lt;r:EnqueuedTransportURIMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa&amp;quot; parentID=&amp;quot;00020000playlist:hardstyle&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;dc:title&amp;gt;Hardstyle Everyday&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.container.playlistContainer&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;spakenburger&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;https://i.scdn.co/image/ab67706c0000da84c064a0cba71066f9b99808ef&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;r:description&amp;gt;Hardstyle Everyday&amp;lt;/r:description&amp;gt;&amp;lt;desc id=&amp;quot;cdudn&amp;quot; nameSpace=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot;&amp;gt;SA_RINCON2311_X_#Svc2311-0-Token&amp;lt;/desc&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;/InstanceID&gt;&lt;/Event&gt;</LastChange></e:property></e:propertyset>');
    }, 1200);

    // 2nd Notification Play Event
    setTimeout(() => {
      device.AVTransportService.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><LastChange>&lt;Event xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/AVT/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;&lt;InstanceID val=&quot;0&quot;&gt;&lt;TransportState val=&quot;PLAYING&quot;/&gt;&lt;CurrentPlayMode val=&quot;SHUFFLE&quot;/&gt;&lt;CurrentCrossfadeMode val=&quot;0&quot;/&gt;&lt;NumberOfTracks val=&quot;51&quot;/&gt;&lt;CurrentTrack val=&quot;47&quot;/&gt;&lt;CurrentSection val=&quot;0&quot;/&gt;&lt;CurrentTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;CurrentTrackDuration val=&quot;0:03:24&quot;/&gt;&lt;CurrentTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:24&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;r:streamContent&amp;gt;&amp;lt;/r:streamContent&amp;gt;&amp;lt;r:radioShowMd&amp;gt;&amp;lt;/r:radioShowMd&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a2nj0bzqYZR7PXs0BoQTW3V%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Survive&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Bass Modulators&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Survive (feat. Bram Boender)&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:NextTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;r:NextTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:56&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a7aKme0bvekUFoMI0cHGIRk%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Fine Day&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Coone&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Fine Day&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:EnqueuedTransportURI val=&quot;x-rincon-cpcontainer:1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa?sid=9&amp;amp;flags=8300&amp;amp;sn=7&quot;/&gt;&lt;r:EnqueuedTransportURIMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa&amp;quot; parentID=&amp;quot;00020000playlist:hardstyle&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;dc:title&amp;gt;Hardstyle Everyday&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.container.playlistContainer&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;spakenburger&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;https://i.scdn.co/image/ab67706c0000da84c064a0cba71066f9b99808ef&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;r:description&amp;gt;Hardstyle Everyday&amp;lt;/r:description&amp;gt;&amp;lt;desc id=&amp;quot;cdudn&amp;quot; nameSpace=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot;&amp;gt;SA_RINCON2311_X_#Svc2311-0-Token&amp;lt;/desc&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;/InstanceID&gt;&lt;/Event&gt;</LastChange></e:property></e:propertyset>');
    }, 1500);

    // 3rd Notification Stopped Event
    setTimeout(() => {
      device.AVTransportService.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><LastChange>&lt;Event xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/AVT/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;&lt;InstanceID val=&quot;0&quot;&gt;&lt;TransportState val=&quot;STOPPED&quot;/&gt;&lt;CurrentPlayMode val=&quot;SHUFFLE&quot;/&gt;&lt;CurrentCrossfadeMode val=&quot;0&quot;/&gt;&lt;NumberOfTracks val=&quot;51&quot;/&gt;&lt;CurrentTrack val=&quot;47&quot;/&gt;&lt;CurrentSection val=&quot;0&quot;/&gt;&lt;CurrentTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;CurrentTrackDuration val=&quot;0:03:24&quot;/&gt;&lt;CurrentTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:24&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;r:streamContent&amp;gt;&amp;lt;/r:streamContent&amp;gt;&amp;lt;r:radioShowMd&amp;gt;&amp;lt;/r:radioShowMd&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a2nj0bzqYZR7PXs0BoQTW3V%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Survive&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Bass Modulators&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Survive (feat. Bram Boender)&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:NextTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;r:NextTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:56&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a7aKme0bvekUFoMI0cHGIRk%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Fine Day&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Coone&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Fine Day&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:EnqueuedTransportURI val=&quot;x-rincon-cpcontainer:1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa?sid=9&amp;amp;flags=8300&amp;amp;sn=7&quot;/&gt;&lt;r:EnqueuedTransportURIMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa&amp;quot; parentID=&amp;quot;00020000playlist:hardstyle&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;dc:title&amp;gt;Hardstyle Everyday&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.container.playlistContainer&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;spakenburger&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;https://i.scdn.co/image/ab67706c0000da84c064a0cba71066f9b99808ef&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;r:description&amp;gt;Hardstyle Everyday&amp;lt;/r:description&amp;gt;&amp;lt;desc id=&amp;quot;cdudn&amp;quot; nameSpace=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot;&amp;gt;SA_RINCON2311_X_#Svc2311-0-Token&amp;lt;/desc&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;/InstanceID&gt;&lt;/Event&gt;</LastChange></e:property></e:propertyset>');
    }, 1800);

    let secondNotificationFinished = false;

    device.PlayNotificationTwo({
      delayMs: 10,
      onlyWhenPlaying: false,
      resolveAfterRevert: true,
      timeout: 6,
      trackUri: 'spotify:artistRadio:37i9dQZF1E4lKH7XBCfvaH',
      volume: notificationVolume
    }).then((result) => {
      if(secondNotificationFinished) {
        return;
      }
      // expect(device.jestDebug.join('\n')).to.be.eq("");
      assert(false, `First promise got wrongly resolved (${result}) before 2nd`);
      // expect("First promise got wrongly resolved (" + result + ") before 2nd").to.be.eq("");
      done();
    });

    device.PlayNotificationTwo({
      delayMs: 10,
      onlyWhenPlaying: false,
      resolveAfterRevert: false,
      timeout: 6,
      trackUri: 'spotify:artistRadio:37i9dQZF1E4lKH7XBCfvaH',
      volume: notificationVolume
    }).then((result) => {
      secondNotificationFinished = true;
      expect(result).to.be.eq(true);
      done();
    });

    device.PlayNotificationTwo({
      delayMs: 10,
      onlyWhenPlaying: false,
      resolveAfterRevert: true,
      timeout: 6,
      trackUri: 'spotify:artistRadio:37i9dQZF1E4lKH7XBCfvaH',
      volume: notificationVolume
    }).then((result) => {
      if(secondNotificationFinished) {
        return;
      }
      assert(false, '3rd promise got wrongly resolved before 2nd');
      // expect("3rd promise got wrongly resolved before 2nd").to.be.eq("");
      done();
    });
  });

  it('Notification Queue, Recieve both  promised resolved', async (done) => {

    const currentVolume = 6;
    const notificationVolume = 10;
    const port = 1903;
    const scope = TestHelpers.getScope(port);

    TestHelpers.mockRequest('/DeviceProperties/Control',
      '"urn:schemas-upnp-org:service:DeviceProperties:1#GetZoneAttributes"',
      '<u:GetZoneAttributes xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetZoneAttributes>',
      'GetZoneAttributesResponse',
      'DeviceProperties',
      '<CurrentZoneName>Kantoor</CurrentZoneName><CurrentIcon>x-rincon-roomicon:office</CurrentIcon><CurrentConfiguration>1</CurrentConfiguration>',
      scope
    );

    TestHelpers.mockRequestToService('/MediaRenderer/RenderingControl/Control','RenderingControl', 'GetVolume',
      '<InstanceID>0</InstanceID><Channel>Master</Channel>', `<CurrentVolume>${currentVolume}</CurrentVolume>`, scope);

    
    TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
      '"urn:schemas-upnp-org:service:RenderingControl:1#GetMute"',
      '<u:GetMute xmlns:u=\"urn:schemas-upnp-org:service:RenderingControl:1\"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetMute>',
      'GetMuteResponse',
      'RenderingControl',
      '<CurrentMute>0</CurrentMute>',
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

    

    // GetTransportInfo
    TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
      '"urn:schemas-upnp-org:service:AVTransport:1#GetTransportInfo"',
      '<u:GetTransportInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetTransportInfo>',
      'GetTransportInfoResponse',
      'AVTransport',
      '<CurrentTransportState>STOPPED</CurrentTransportState>',
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

    // SetAVTransportURI Play Artist radio 2nd Notification
    TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
      '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
      '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-sonosapi-radio:spotify%3aartistRadio%3a37i9dQZF1E4lKH7XBCfvaH?sid=9&amp;flags=8300&amp;sn=7</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;100c206cspotify%3aartistRadio%3a37i9dQZF1E4lKH7XBCfvaH&quot; restricted=&quot;true&quot; parentID=&quot;10052064spotify%3aartist%3a37i9dQZF1E4lKH7XBCfvaH&quot;&gt;&lt;dc:title&gt;Artist radio&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast.#artistRadio&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON2311_X_#Svc2311-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData></u:SetAVTransportURI>',
      'SetAVTransportURIResponse',
      'AVTransport',
      undefined,
      scope
    );

    // Set Volume to {notificationVolume} 2nd Notification
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
      .intercept('/MediaRenderer/RenderingControl/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
      .reply(200, '', {
        sid: renderingControlSid
      });

    const avtransportSid = '07896553-d7d6-4b7d-a3d9-f4d86b33d6d2'
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

    // Restart playing
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
    const deviceData = await device.LoadDeviceData();
    
    // First notification Stop Event
    setTimeout(() => {
      device.AVTransportService.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><LastChange>&lt;Event xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/AVT/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;&lt;InstanceID val=&quot;0&quot;&gt;&lt;TransportState val=&quot;STOPPED&quot;/&gt;&lt;CurrentPlayMode val=&quot;SHUFFLE&quot;/&gt;&lt;CurrentCrossfadeMode val=&quot;0&quot;/&gt;&lt;NumberOfTracks val=&quot;51&quot;/&gt;&lt;CurrentTrack val=&quot;47&quot;/&gt;&lt;CurrentSection val=&quot;0&quot;/&gt;&lt;CurrentTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;CurrentTrackDuration val=&quot;0:03:24&quot;/&gt;&lt;CurrentTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:24&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;r:streamContent&amp;gt;&amp;lt;/r:streamContent&amp;gt;&amp;lt;r:radioShowMd&amp;gt;&amp;lt;/r:radioShowMd&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a2nj0bzqYZR7PXs0BoQTW3V%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Survive&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Bass Modulators&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Survive (feat. Bram Boender)&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:NextTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;r:NextTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:56&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a7aKme0bvekUFoMI0cHGIRk%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Fine Day&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Coone&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Fine Day&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:EnqueuedTransportURI val=&quot;x-rincon-cpcontainer:1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa?sid=9&amp;amp;flags=8300&amp;amp;sn=7&quot;/&gt;&lt;r:EnqueuedTransportURIMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa&amp;quot; parentID=&amp;quot;00020000playlist:hardstyle&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;dc:title&amp;gt;Hardstyle Everyday&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.container.playlistContainer&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;spakenburger&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;https://i.scdn.co/image/ab67706c0000da84c064a0cba71066f9b99808ef&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;r:description&amp;gt;Hardstyle Everyday&amp;lt;/r:description&amp;gt;&amp;lt;desc id=&amp;quot;cdudn&amp;quot; nameSpace=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot;&amp;gt;SA_RINCON2311_X_#Svc2311-0-Token&amp;lt;/desc&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;/InstanceID&gt;&lt;/Event&gt;</LastChange></e:property></e:propertyset>');
    }, 500);

    // 2nd notification Playing Event
    setTimeout(() => {
      device.AVTransportService.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><LastChange>&lt;Event xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/AVT/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;&lt;InstanceID val=&quot;0&quot;&gt;&lt;TransportState val=&quot;PLAYING&quot;/&gt;&lt;CurrentPlayMode val=&quot;SHUFFLE&quot;/&gt;&lt;CurrentCrossfadeMode val=&quot;0&quot;/&gt;&lt;NumberOfTracks val=&quot;51&quot;/&gt;&lt;CurrentTrack val=&quot;47&quot;/&gt;&lt;CurrentSection val=&quot;0&quot;/&gt;&lt;CurrentTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;CurrentTrackDuration val=&quot;0:03:24&quot;/&gt;&lt;CurrentTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:24&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;r:streamContent&amp;gt;&amp;lt;/r:streamContent&amp;gt;&amp;lt;r:radioShowMd&amp;gt;&amp;lt;/r:radioShowMd&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a2nj0bzqYZR7PXs0BoQTW3V%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Survive&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Bass Modulators&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Survive (feat. Bram Boender)&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:NextTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;r:NextTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:56&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a7aKme0bvekUFoMI0cHGIRk%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Fine Day&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Coone&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Fine Day&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:EnqueuedTransportURI val=&quot;x-rincon-cpcontainer:1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa?sid=9&amp;amp;flags=8300&amp;amp;sn=7&quot;/&gt;&lt;r:EnqueuedTransportURIMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa&amp;quot; parentID=&amp;quot;00020000playlist:hardstyle&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;dc:title&amp;gt;Hardstyle Everyday&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.container.playlistContainer&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;spakenburger&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;https://i.scdn.co/image/ab67706c0000da84c064a0cba71066f9b99808ef&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;r:description&amp;gt;Hardstyle Everyday&amp;lt;/r:description&amp;gt;&amp;lt;desc id=&amp;quot;cdudn&amp;quot; nameSpace=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot;&amp;gt;SA_RINCON2311_X_#Svc2311-0-Token&amp;lt;/desc&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;/InstanceID&gt;&lt;/Event&gt;</LastChange></e:property></e:propertyset>');
    }, 1000);

    // 2nd notification Stop Event
    setTimeout(() => {
      device.AVTransportService.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><LastChange>&lt;Event xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/AVT/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;&lt;InstanceID val=&quot;0&quot;&gt;&lt;TransportState val=&quot;STOPPED&quot;/&gt;&lt;CurrentPlayMode val=&quot;SHUFFLE&quot;/&gt;&lt;CurrentCrossfadeMode val=&quot;0&quot;/&gt;&lt;NumberOfTracks val=&quot;51&quot;/&gt;&lt;CurrentTrack val=&quot;47&quot;/&gt;&lt;CurrentSection val=&quot;0&quot;/&gt;&lt;CurrentTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;CurrentTrackDuration val=&quot;0:03:24&quot;/&gt;&lt;CurrentTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:24&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;r:streamContent&amp;gt;&amp;lt;/r:streamContent&amp;gt;&amp;lt;r:radioShowMd&amp;gt;&amp;lt;/r:radioShowMd&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a2nj0bzqYZR7PXs0BoQTW3V%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Survive&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Bass Modulators&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Survive (feat. Bram Boender)&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:NextTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;r:NextTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:56&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a7aKme0bvekUFoMI0cHGIRk%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Fine Day&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Coone&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Fine Day&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:EnqueuedTransportURI val=&quot;x-rincon-cpcontainer:1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa?sid=9&amp;amp;flags=8300&amp;amp;sn=7&quot;/&gt;&lt;r:EnqueuedTransportURIMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa&amp;quot; parentID=&amp;quot;00020000playlist:hardstyle&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;dc:title&amp;gt;Hardstyle Everyday&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.container.playlistContainer&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;spakenburger&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;https://i.scdn.co/image/ab67706c0000da84c064a0cba71066f9b99808ef&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;r:description&amp;gt;Hardstyle Everyday&amp;lt;/r:description&amp;gt;&amp;lt;desc id=&amp;quot;cdudn&amp;quot; nameSpace=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot;&amp;gt;SA_RINCON2311_X_#Svc2311-0-Token&amp;lt;/desc&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;/InstanceID&gt;&lt;/Event&gt;</LastChange></e:property></e:propertyset>');
    }, 2200);

    let firstNotificationPlayed = false;

    device.PlayNotificationTwo({
      delayMs: 10,
      onlyWhenPlaying: false,
      resolveAfterRevert: true,
      timeout: 6,
      trackUri: 'spotify:artistRadio:37i9dQZF1E4lKH7XBCfvaH',
      volume: notificationVolume
    }).then((result) => {
      firstNotificationPlayed = result;
    });

    device.PlayNotificationTwo({
      delayMs: 10,
      onlyWhenPlaying: false,
      resolveAfterRevert: true,
      timeout: 6,
      specificTimeout: 2,
      trackUri: 'spotify:artistRadio:37i9dQZF1E4lKH7XBCfvaH',
      volume: notificationVolume
    }).then((result) => {
      if(!result) {
        expect("Second Notification didn't played").to.be.eq("");
      } else if(!firstNotificationPlayed) {
        expect("First Notification wasn't resolved or played").to.be.eq("");
      }
      done();
    });
  });

  it('Notification Queue, Test specific Timeout on second queue item', async (done) => {

    const currentVolume = 6;
    const notificationVolume = 10;
    const port = 1401;
    const scope = TestHelpers.getScope(port);

    TestHelpers.mockRequest('/DeviceProperties/Control',
      '"urn:schemas-upnp-org:service:DeviceProperties:1#GetZoneAttributes"',
      '<u:GetZoneAttributes xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetZoneAttributes>',
      'GetZoneAttributesResponse',
      'DeviceProperties',
      '<CurrentZoneName>Kantoor</CurrentZoneName><CurrentIcon>x-rincon-roomicon:office</CurrentIcon><CurrentConfiguration>1</CurrentConfiguration>',
      scope
    );

    TestHelpers.mockRequestToService('/MediaRenderer/RenderingControl/Control','RenderingControl', 'GetVolume',
      '<InstanceID>0</InstanceID><Channel>Master</Channel>', `<CurrentVolume>${currentVolume}</CurrentVolume>`, scope);

    
    TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
      '"urn:schemas-upnp-org:service:RenderingControl:1#GetMute"',
      '<u:GetMute xmlns:u=\"urn:schemas-upnp-org:service:RenderingControl:1\"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetMute>',
      'GetMuteResponse',
      'RenderingControl',
      '<CurrentMute>0</CurrentMute>',
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

    

    // GetTransportInfo
    TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
      '"urn:schemas-upnp-org:service:AVTransport:1#GetTransportInfo"',
      '<u:GetTransportInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetTransportInfo>',
      'GetTransportInfoResponse',
      'AVTransport',
      '<CurrentTransportState>STOPPED</CurrentTransportState>',
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

    // SetAVTransportURI Play Artist radio 2nd Notification
    TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
      '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
      '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-sonosapi-radio:spotify%3aartistRadio%3a37i9dQZF1E4lKH7XBCfvaH?sid=9&amp;flags=8300&amp;sn=7</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;100c206cspotify%3aartistRadio%3a37i9dQZF1E4lKH7XBCfvaH&quot; restricted=&quot;true&quot; parentID=&quot;10052064spotify%3aartist%3a37i9dQZF1E4lKH7XBCfvaH&quot;&gt;&lt;dc:title&gt;Artist radio&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast.#artistRadio&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON2311_X_#Svc2311-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData></u:SetAVTransportURI>',
      'SetAVTransportURIResponse',
      'AVTransport',
      undefined,
      scope
    );

    // Set Volume to {notificationVolume} 2nd Notification
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

    // Restart playing
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
    const deviceData = await device.LoadDeviceData();
    
    // First notification Stop Event
    setTimeout(() => {
      device.AVTransportService.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><LastChange>&lt;Event xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/AVT/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;&lt;InstanceID val=&quot;0&quot;&gt;&lt;TransportState val=&quot;STOPPED&quot;/&gt;&lt;CurrentPlayMode val=&quot;SHUFFLE&quot;/&gt;&lt;CurrentCrossfadeMode val=&quot;0&quot;/&gt;&lt;NumberOfTracks val=&quot;51&quot;/&gt;&lt;CurrentTrack val=&quot;47&quot;/&gt;&lt;CurrentSection val=&quot;0&quot;/&gt;&lt;CurrentTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;CurrentTrackDuration val=&quot;0:03:24&quot;/&gt;&lt;CurrentTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:24&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;r:streamContent&amp;gt;&amp;lt;/r:streamContent&amp;gt;&amp;lt;r:radioShowMd&amp;gt;&amp;lt;/r:radioShowMd&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a2nj0bzqYZR7PXs0BoQTW3V%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Survive&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Bass Modulators&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Survive (feat. Bram Boender)&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:NextTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;r:NextTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:56&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a7aKme0bvekUFoMI0cHGIRk%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Fine Day&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Coone&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Fine Day&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:EnqueuedTransportURI val=&quot;x-rincon-cpcontainer:1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa?sid=9&amp;amp;flags=8300&amp;amp;sn=7&quot;/&gt;&lt;r:EnqueuedTransportURIMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa&amp;quot; parentID=&amp;quot;00020000playlist:hardstyle&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;dc:title&amp;gt;Hardstyle Everyday&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.container.playlistContainer&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;spakenburger&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;https://i.scdn.co/image/ab67706c0000da84c064a0cba71066f9b99808ef&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;r:description&amp;gt;Hardstyle Everyday&amp;lt;/r:description&amp;gt;&amp;lt;desc id=&amp;quot;cdudn&amp;quot; nameSpace=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot;&amp;gt;SA_RINCON2311_X_#Svc2311-0-Token&amp;lt;/desc&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;/InstanceID&gt;&lt;/Event&gt;</LastChange></e:property></e:propertyset>');
    }, 500);

    // 2nd notification Playing Event
    setTimeout(() => {
      device.AVTransportService.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><LastChange>&lt;Event xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/AVT/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;&lt;InstanceID val=&quot;0&quot;&gt;&lt;TransportState val=&quot;PLAYING&quot;/&gt;&lt;CurrentPlayMode val=&quot;SHUFFLE&quot;/&gt;&lt;CurrentCrossfadeMode val=&quot;0&quot;/&gt;&lt;NumberOfTracks val=&quot;51&quot;/&gt;&lt;CurrentTrack val=&quot;47&quot;/&gt;&lt;CurrentSection val=&quot;0&quot;/&gt;&lt;CurrentTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;CurrentTrackDuration val=&quot;0:03:24&quot;/&gt;&lt;CurrentTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:24&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;r:streamContent&amp;gt;&amp;lt;/r:streamContent&amp;gt;&amp;lt;r:radioShowMd&amp;gt;&amp;lt;/r:radioShowMd&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a2nj0bzqYZR7PXs0BoQTW3V%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Survive&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Bass Modulators&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Survive (feat. Bram Boender)&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:NextTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;r:NextTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:56&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a7aKme0bvekUFoMI0cHGIRk%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Fine Day&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Coone&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Fine Day&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:EnqueuedTransportURI val=&quot;x-rincon-cpcontainer:1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa?sid=9&amp;amp;flags=8300&amp;amp;sn=7&quot;/&gt;&lt;r:EnqueuedTransportURIMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa&amp;quot; parentID=&amp;quot;00020000playlist:hardstyle&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;dc:title&amp;gt;Hardstyle Everyday&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.container.playlistContainer&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;spakenburger&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;https://i.scdn.co/image/ab67706c0000da84c064a0cba71066f9b99808ef&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;r:description&amp;gt;Hardstyle Everyday&amp;lt;/r:description&amp;gt;&amp;lt;desc id=&amp;quot;cdudn&amp;quot; nameSpace=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot;&amp;gt;SA_RINCON2311_X_#Svc2311-0-Token&amp;lt;/desc&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;/InstanceID&gt;&lt;/Event&gt;</LastChange></e:property></e:propertyset>');
    }, 1000);

    // 2nd notification Stop Event
    setTimeout(() => {
      device.AVTransportService.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><LastChange>&lt;Event xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/AVT/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;&lt;InstanceID val=&quot;0&quot;&gt;&lt;TransportState val=&quot;STOPPED&quot;/&gt;&lt;CurrentPlayMode val=&quot;SHUFFLE&quot;/&gt;&lt;CurrentCrossfadeMode val=&quot;0&quot;/&gt;&lt;NumberOfTracks val=&quot;51&quot;/&gt;&lt;CurrentTrack val=&quot;47&quot;/&gt;&lt;CurrentSection val=&quot;0&quot;/&gt;&lt;CurrentTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;CurrentTrackDuration val=&quot;0:03:24&quot;/&gt;&lt;CurrentTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:24&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a2nj0bzqYZR7PXs0BoQTW3V?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;r:streamContent&amp;gt;&amp;lt;/r:streamContent&amp;gt;&amp;lt;r:radioShowMd&amp;gt;&amp;lt;/r:radioShowMd&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a2nj0bzqYZR7PXs0BoQTW3V%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Survive&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Bass Modulators&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Survive (feat. Bram Boender)&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:NextTrackURI val=&quot;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;flags=8224&amp;amp;sn=7&quot;/&gt;&lt;r:NextTrackMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;-1&amp;quot; parentID=&amp;quot;-1&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;res protocolInfo=&amp;quot;sonos.com-spotify:*:audio/x-spotify:*&amp;quot; duration=&amp;quot;0:03:56&amp;quot;&amp;gt;x-sonos-spotify:spotify%3atrack%3a7aKme0bvekUFoMI0cHGIRk?sid=9&amp;amp;amp;flags=8224&amp;amp;amp;sn=7&amp;lt;/res&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;/getaa?s=1&amp;amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a7aKme0bvekUFoMI0cHGIRk%3fsid%3d9%26flags%3d8224%26sn%3d7&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;dc:title&amp;gt;Fine Day&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.item.audioItem.musicTrack&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;Coone&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:album&amp;gt;Fine Day&amp;lt;/upnp:album&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;r:EnqueuedTransportURI val=&quot;x-rincon-cpcontainer:1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa?sid=9&amp;amp;flags=8300&amp;amp;sn=7&quot;/&gt;&lt;r:EnqueuedTransportURIMetaData val=&quot;&amp;lt;DIDL-Lite xmlns:dc=&amp;quot;http://purl.org/dc/elements/1.1/&amp;quot; xmlns:upnp=&amp;quot;urn:schemas-upnp-org:metadata-1-0/upnp/&amp;quot; xmlns:r=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot; xmlns=&amp;quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&amp;quot;&amp;gt;&amp;lt;item id=&amp;quot;1006206cspotify%3aplaylist%3a04AfExnPMYJ0y6J6GW6QGa&amp;quot; parentID=&amp;quot;00020000playlist:hardstyle&amp;quot; restricted=&amp;quot;true&amp;quot;&amp;gt;&amp;lt;dc:title&amp;gt;Hardstyle Everyday&amp;lt;/dc:title&amp;gt;&amp;lt;upnp:class&amp;gt;object.container.playlistContainer&amp;lt;/upnp:class&amp;gt;&amp;lt;dc:creator&amp;gt;spakenburger&amp;lt;/dc:creator&amp;gt;&amp;lt;upnp:albumArtURI&amp;gt;https://i.scdn.co/image/ab67706c0000da84c064a0cba71066f9b99808ef&amp;lt;/upnp:albumArtURI&amp;gt;&amp;lt;r:description&amp;gt;Hardstyle Everyday&amp;lt;/r:description&amp;gt;&amp;lt;desc id=&amp;quot;cdudn&amp;quot; nameSpace=&amp;quot;urn:schemas-rinconnetworks-com:metadata-1-0/&amp;quot;&amp;gt;SA_RINCON2311_X_#Svc2311-0-Token&amp;lt;/desc&amp;gt;&amp;lt;/item&amp;gt;&amp;lt;/DIDL-Lite&amp;gt;&quot;/&gt;&lt;/InstanceID&gt;&lt;/Event&gt;</LastChange></e:property></e:propertyset>');
    }, 3000);

    let firstNotificationPlayed = false;
    let secondTriggered = false;

    device.PlayNotificationTwo({
      delayMs: 10,
      onlyWhenPlaying: false,
      resolveAfterRevert: true,
      timeout: 6,
      trackUri: 'spotify:artistRadio:37i9dQZF1E4lKH7XBCfvaH',
      volume: notificationVolume
    }).then((result) => {
      firstNotificationPlayed = true;
      if(!result) {
        expect("First Notification wasn't resolved or played").to.be.eq("");
      }

      if(secondTriggered) {
        done();
      } else {
        expect("Second Notification wasn't resolved first").to.be.eq("");
      }
    });

    device.PlayNotificationTwo({
      delayMs: 10,
      onlyWhenPlaying: false,
      resolveAfterRevert: false,
      timeout: 6,
      specificTimeout: 1,
      trackUri: 'spotify:artistRadio:37i9dQZF1E4lKH7XBCfvaH',
      volume: notificationVolume
    }).then((result) => {
      secondTriggered = true;
      if(result) {
        expect("Second Notification resolved 'true' while we expected timeout to trigger").to.be.eq("");
      }

      if(firstNotificationPlayed) {
        done();
      }
    });
  });
});
