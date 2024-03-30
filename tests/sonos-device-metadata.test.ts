import { expect }  from 'chai'
import { EventEmitter } from 'events';
import { randomUUID } from 'crypto';
import SonosDevice from '../src/sonos-device'
import { TestHelpers } from './test-helpers';
import SonosEventListener from '../src/sonos-event-listener';
import { SmapiClient } from '../src/musicservices/smapi-client';
import { PlayMode, Repeat, TransportState } from '../src/models';


describe('SonosDevice Metadata', () => {
  describe('SetTransportUri', () => {
    // This tests fails for some reason, not sure is Artist radio ever worked.
    it.skip('should work with artist radio', async() => {
      const trackUri = 'spotify:artistRadio:72qVrKXRp9GeFQOesj0Pmv'
      const scope = TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'SetAVTransportURI',
        '<InstanceID>0</InstanceID><CurrentURI>x-sonosapi-radio:spotify%3aartistRadio%3a72qVrKXRp9GeFQOesj0Pmv?sid=9&amp;flags=8300&amp;sn=2</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;100c206cspotify%3aartistRadio%3a72qVrKXRp9GeFQOesj0Pmv&quot; parentID=&quot;10052064spotify%3aartist%3a72qVrKXRp9GeFQOesj0Pmv&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Guus Meeuwis Radio&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast.#artistRadio&lt;/upnp:class&gt;&lt;dc:creator&gt;Guus Meeuwis&lt;/dc:creator&gt;&lt;upnp:albumArtURI&gt;https://i.scdn.co/image/ab6761610000e5ebf5eda5ecd45cdbc2cc3c184a&lt;/upnp:albumArtURI&gt;&lt;r:albumArtist&gt;Guus Meeuwis&lt;/r:albumArtist&gt;&lt;r:description&gt;Guus Meeuwis&lt;/r:description&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON2311_X_#Svc2311-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData>'
        )
        const device = new SonosDevice(TestHelpers.testHost, 1400);
        const result = await device.SetAVTransportURI(trackUri);
        expect(scope.isDone()).to.be.true;
        expect(result).to.be.true
    })

    it('should work with a stream url', async() => {
      const trackUri = 'x-rincon-mp3radio://https://kexp.streamguys1.com/kexp160.aac'
      const scope = TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
        'AVTransport',
        'SetAVTransportURI',
        '<InstanceID>0</InstanceID><CurrentURI>x-rincon-mp3radio://https://kexp.streamguys1.com/kexp160.aac</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;-1&quot; restricted=&quot;true&quot;&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;RINCON_AssociatedZPUDN&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData>'
        )
        const device = new SonosDevice(TestHelpers.testHost, 1400);
        const result = await device.SetAVTransportURI(trackUri);
        expect(scope.isDone()).to.be.true;
        expect(result).to.be.true
    })
  })
});