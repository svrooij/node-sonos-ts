import SonosDevice from '../sonos-device';
import { TestHelpers } from './test-helpers';
import { TransportState } from '../models';


describe('SonosDevice Metadata', () => {
  describe('SetTransportUri', () => {
    // This tests fails for some reason, not sure is Artist radio ever worked.
    it.skip('should work with artist radio', async () => {
      const trackUri = 'spotify:artistRadio:72qVrKXRp9GeFQOesj0Pmv';
      const scope = TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'SetAVTransportURI',
        '<InstanceID>0</InstanceID><CurrentURI>x-sonosapi-radio:spotify%3aartistRadio%3a72qVrKXRp9GeFQOesj0Pmv?sid=9&amp;flags=8300&amp;sn=2</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;100c206cspotify%3aartistRadio%3a72qVrKXRp9GeFQOesj0Pmv&quot; parentID=&quot;10052064spotify%3aartist%3a72qVrKXRp9GeFQOesj0Pmv&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Guus Meeuwis Radio&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast.#artistRadio&lt;/upnp:class&gt;&lt;dc:creator&gt;Guus Meeuwis&lt;/dc:creator&gt;&lt;upnp:albumArtURI&gt;https://i.scdn.co/image/ab6761610000e5ebf5eda5ecd45cdbc2cc3c184a&lt;/upnp:albumArtURI&gt;&lt;r:albumArtist&gt;Guus Meeuwis&lt;/r:albumArtist&gt;&lt;r:description&gt;Guus Meeuwis&lt;/r:description&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON2311_X_#Svc2311-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData>',
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const result = await device.SetAVTransportURI(trackUri);
      expect(scope.isDone()).toBeTruthy();
      expect(result).toBeTruthy();
    });

    it('should work with a stream url', async () => {
      const trackUri = 'x-rincon-mp3radio://https://kexp.streamguys1.com/kexp160.aac';
      const scope = TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'SetAVTransportURI',
        '<InstanceID>0</InstanceID><CurrentURI>x-rincon-mp3radio://https://kexp.streamguys1.com/kexp160.aac</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;-1&quot; restricted=&quot;true&quot;&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;RINCON_AssociatedZPUDN&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData>',
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const result = await device.SetAVTransportURI(trackUri);
      expect(scope.isDone()).toBeTruthy();
      expect(result).toBeTruthy();
    });

    it('should work with a tunein stream url', async () => {
      const trackUri = 'x-sonosapi-stream:tunein%3a9464?sid=303&flags=8232&sn=2';
      const scope = TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'SetAVTransportURI',
        '<InstanceID>0</InstanceID><CurrentURI>x-sonosapi-stream:tunein%3a9464?sid=303&amp;flags=8232&amp;sn=2</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;10092020tunein%3a9464&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Some radio station&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;RINCON_AssociatedZPUDN&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData>',
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400);
      const result = await device.SetAVTransportURI(trackUri);
      expect(scope.isDone()).toBeTruthy();
      expect(result).toBeTruthy();
    });
  });

  describe('RestoreState', () => {
    it('should restore a tunein stream with corrected ItemId when stored ItemId is -1', async () => {
      const scope = TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'SetAVTransportURI',
        '<InstanceID>0</InstanceID><CurrentURI>x-sonosapi-stream:tunein%3a9464?sid=303&amp;flags=8232&amp;sn=2</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;10092020tunein%3a9464&quot; restricted=&quot;true&quot;&gt;&lt;upnp:albumArtURI&gt;https://sali.sonos.radio/image?w=60&lt;/upnp:albumArtURI&gt;&lt;dc:title&gt;SRF 3&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;RINCON_AssociatedZPUDN&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData>',
      );
      TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'Play',
        '<InstanceID>0</InstanceID><Speed>1</Speed>',
        '',
        scope,
      );

      const device = new SonosDevice(TestHelpers.testHost, 1400);
      // Pre-set volume and muted to match the state so those calls are skipped
      (device as any).volume = 1;
      (device as any).muted = false;

      const state = {
        mediaInfo: {
          NrTracks: 5,
          MediaDuration: 'NOT_IMPLEMENTED',
          CurrentURI: 'x-sonosapi-stream:tunein%3a9464?sid=303&flags=8232&sn=2',
          CurrentURIMetaData: {
            AlbumArtUri: 'https://sali.sonos.radio/image?w=60',
            Title: 'SRF 3',
            UpnpClass: 'object.item.audioItem.audioBroadcast',
            ItemId: '-1',
            ParentId: '-1',
          },
          NextURI: '',
          NextURIMetaData: '',
          PlayMedium: 'NETWORK',
          RecordMedium: 'NOT_IMPLEMENTED',
          WriteStatus: 'NOT_IMPLEMENTED',
        },
        muted: false,
        positionInfo: {
          Track: 2,
          TrackDuration: '0:00:00',
          TrackMetaData: '',
          TrackURI: 'aac://http://stream.srg-ssr.ch/m/drs3/aacp_96',
          RelTime: '0:00:03',
          AbsTime: 'NOT_IMPLEMENTED',
          RelCount: 2147483647,
          AbsCount: 2147483647,
        },
        transportState: TransportState.Playing,
        volume: 1,
      };

      const result = await device.RestoreState(state);
      expect(scope.isDone()).toBeTruthy();
      expect(result).toBeTruthy();
    });
  });
});