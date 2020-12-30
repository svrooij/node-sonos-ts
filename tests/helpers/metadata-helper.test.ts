import { expect, assert } from 'chai';
import MetadataHelper from '../../src/helpers/metadata-helper';

const { GenerateMetadata } = require('./legacy-helpers');

const spotifyTrack = 'spotify:track:6sYJuVcEu4gFHmeTLdHzRz';
const completeTrackUri = 'x-sonos-spotify:spotify:track:6sYJuVcEu4gFHmeTLdHzRz?sid=9&flags=8224&sn=7';

describe('MetadataHelper', () => {
  describe('GuessMetaDataAndTrackUri', () => {
    it('returns correct TrackUri', () => {
      const data = MetadataHelper.GuessMetaDataAndTrackUri(spotifyTrack);
      expect(data).to.be.an('object');
      expect(data).to.have.nested.property('trackUri', completeTrackUri);
      expect(data).to.have.nested.property('metadata');
    });
  });

  describe('GuessTrack', () => {
    it('Guess metadata for file:///jffs/settings/savedqueues.rsq#7', () => {
      const track = MetadataHelper.GuessTrack('file:///jffs/settings/savedqueues.rsq#7');
      expect(track).to.have.property('ItemId', 'SQ:7');
      expect(track).to.have.property('TrackUri', 'file:///jffs/settings/savedqueues.rsq#7');
    });

    it('Guess metadata for sonos:playlist:7', () => {
      const track = MetadataHelper.GuessTrack('sonos:playlist:7');
      expect(track).to.have.property('ItemId', 'SQ:7');
      expect(track).to.have.property('TrackUri', 'file:///jffs/settings/savedqueues.rsq#7');
    });

    it('Not guess metadata for sonos:playlist:a', () => {
      const track = MetadataHelper.GuessTrack('sonos:playlist:a');
      expect(track).to.be.undefined;
    });
  });

  describe('GuessTrack -> Deezer', () => {
    it('Guess metadata for deezer:album:169734362', () => {
      const track = MetadataHelper.GuessTrack('deezer:album:169734362');
      expect(track).to.have.property('TrackUri', 'x-rincon-cpcontainer:1004006calbum-169734362?sid=2&flags=108&sn=23');
    });

    it('Guess metadata for x-rincon-cpcontainer:1004006calbum-169734362?sid=2&amp;flags=108&amp;sn=23', () => {
      const track = MetadataHelper.GuessTrack('x-rincon-cpcontainer:1004006calbum-169734362?sid=2&amp;flags=108&amp;sn=23');
      expect(track).to.have.property('TrackUri', 'x-rincon-cpcontainer:1004006calbum-169734362?sid=2&flags=108&sn=23');
      expect(track).to.have.property('UpnpClass', 'object.container.album.musicAlbum.#HERO');
    });

    it('Guess metadata for deezer:artistTopTracks:6049784', () => {
      const track = MetadataHelper.GuessTrack('deezer:artistTopTracks:6049784');
      expect(track).to.have.property('TrackUri', 'x-rincon-cpcontainer:10fe206ctracks-artist-6049784?sid=2&flags=8300&sn=23');
    });

    it('Guess metadata for x-rincon-cpcontainer:10fe206ctracks-artist-6049784?sid=2&amp;flags=8300&amp;sn=23', () => {
      const track = MetadataHelper.GuessTrack('x-rincon-cpcontainer:10fe206ctracks-artist-6049784?sid=2&amp;flags=8300&amp;sn=23');
      expect(track).to.have.property('TrackUri', 'x-rincon-cpcontainer:10fe206ctracks-artist-6049784?sid=2&flags=8300&sn=23');
      expect(track).to.have.property('UpnpClass', 'object.container.#DEFAULT');
    });

    it('Guess metadata for deezer:playlist:1371651955', () => {
      const track = MetadataHelper.GuessTrack('deezer:playlist:1371651955');
      expect(track).to.have.property('TrackUri', 'x-rincon-cpcontainer:1006006cplaylist_spotify%3aplaylist-1371651955?sid=2&flags=108&sn=23');
    });

    it('Guess metadata for x-rincon-cpcontainer:1006006cplaylist_spotify%3aplaylist-1371651955?sid=2&amp;flags=108&amp;sn=23', () => {
      const track = MetadataHelper.GuessTrack('x-rincon-cpcontainer:1006006cplaylist_spotify%3aplaylist-1371651955?sid=2&amp;flags=108&amp;sn=23');
      expect(track).to.have.property('TrackUri', 'x-rincon-cpcontainer:1006006cplaylist_spotify%3aplaylist-1371651955?sid=2&flags=108&sn=23');
    });

    it('Guess metadata for deezer:track:1121931512', () => {
      const track = MetadataHelper.GuessTrack('deezer:track:1121931512');
      expect(track).to.have.property('TrackUri', 'x-sonos-http:tr:1121931512.mp3?sid=2&flags=8224&sn=23');
    });

    it('Guess metadata for x-sonos-http:tr%3a1121931512.mp3?sid=2&amp;flags=8224&amp;sn=23', () => {
      const track = MetadataHelper.GuessTrack('x-sonos-http:tr%3a1121931512.mp3?sid=2&amp;flags=8224&amp;sn=23');
      expect(track).to.have.property('TrackUri', 'x-sonos-http:tr:1121931512.mp3?sid=2&flags=8224&sn=23');
      expect(track).to.have.property('UpnpClass', 'object.item.audioItem.musicTrack.#DEFAULT');
    });
  });

  describe('GuessTrack -> Spotify', () => {
    it('Guess metadata for Spotify artist top tracks', () => {
      const track = MetadataHelper.GuessTrack('spotify:artistTopTracks:72qVrKXRp9GeFQOesj0Pmv');
      expect(track).to.be.an('object');
    });

    it('Guess metadata for Spotify track', () => {
      const track = MetadataHelper.GuessTrack(spotifyTrack);
      expect(track).to.be.an('object');
    });

    it('Guess metadata for Spotify user playlist', () => {
      const uri = 'spotify:user:37i9dQZF1DX4WYpdgoIcn6'
      const track = MetadataHelper.GuessTrack(uri);
      expect(track).to.be.an('object');
    });

    it('Produces same metadata as legacy for Spotify track', () => {
      const track = MetadataHelper.GuessTrack(spotifyTrack);
      expect(track).to.be.an('object');
      const legacyMetadataObject = GenerateMetadata(spotifyTrack, '', '2311');

      const metadata = MetadataHelper.TrackToMetaData(track);
      assert.equal(metadata, legacyMetadataObject.metadata);
    });

    it('Returns undefined for unsupported uri', () => {
      const uri = 'fake:music:service'
      const track = MetadataHelper.GuessTrack(uri);
      expect(track).to.be.undefined;
    });

    it('Returns undefined for unsupported spotify uri', () => {
      const uri = 'spotify:fake:fake-id'
      const track = MetadataHelper.GuessTrack(uri);
      expect(track).to.be.undefined;
    });
  });

  describe('GuessTrackAndMetadata', () => {
    it('Works for Spotify album', () => {
      const data = MetadataHelper.GuessMetaDataAndTrackUri('spotify:album:5nD7RkUvn3TRlDcQSABOjo');
      expect(data).to.be.an('object');
      expect(data).to.have.property('trackUri', 'x-rincon-cpcontainer:1004206cspotify:album:5nD7RkUvn3TRlDcQSABOjo?sid=9&flags=8300&sn=7');
      expect(data).to.have.nested.property('metadata.ItemId', '0004206cspotify%3aalbum%3a5nD7RkUvn3TRlDcQSABOjo');
    });

    it('Works for Spotify artist radio', () => {
      const data = MetadataHelper.GuessMetaDataAndTrackUri('spotify:artistRadio:72qVrKXRp9GeFQOesj0Pmv');
      expect(data).to.be.an('object');
      expect(data).to.have.property('trackUri', 'x-sonosapi-radio:spotify:artistRadio:72qVrKXRp9GeFQOesj0Pmv?sid=9&flags=8300&sn=7');
      expect(data).to.have.nested.property('metadata.ItemId', '100c206cspotify%3aartistRadio%3a72qVrKXRp9GeFQOesj0Pmv');
    });

    it('Works for Spotify artist top tracks', () => {
      const data = MetadataHelper.GuessMetaDataAndTrackUri('spotify:artistTopTracks:72qVrKXRp9GeFQOesj0Pmv');
      expect(data).to.be.an('object');
      expect(data).to.have.property('trackUri', 'x-rincon-cpcontainer:100e206cspotify:artistTopTracks:72qVrKXRp9GeFQOesj0Pmv?sid=9&flags=8300&sn=7');
      expect(data).to.have.nested.property('metadata.ItemId', '100e206cspotify%3aartistTopTracks%3a72qVrKXRp9GeFQOesj0Pmv');
      expect(data).to.have.nested.property('metadata.ParentId', '10052064spotify%3aartist%3a72qVrKXRp9GeFQOesj0Pmv');
    });

    it('Works for Spotify playlist', () => {
      const data = MetadataHelper.GuessMetaDataAndTrackUri('spotify:playlist:37i9dQZEVXbLoATJ81JYX');
      expect(data).to.be.an('object');
      expect(data).to.have.property('trackUri', 'x-rincon-cpcontainer:1006206spotify:playlist:37i9dQZEVXbLoATJ81JYX?sid=9&flags=8300&sn=7');
      expect(data).to.have.nested.property('metadata.ItemId', '10062a6cspotify%3aplaylist%3a37i9dQZEVXbLoATJ81JYX');
    });
  })

  describe('ParseDIDLTrack', () => {
    it('decodes html entities', (done) => {
      const album = 'Christmas &amp; New Year';
      const title = 'Bell&apos;s';
      const didl = {
        'upnp:album': album,
        'dc:title': title
      };
      const result = MetadataHelper.ParseDIDLTrack(didl, 'fake_host');
      expect(result).to.has.property('Album','Christmas & New Year');
      expect(result).to.has.property('Title', 'Bell\'s');
      done();
    });

    it('decodes numeric album', (done) => {
      const album = 19;
      const artist = 'Adele';
      const didl = {
        'upnp:album': album,
        'dc:creator': artist
      };
      const result = MetadataHelper.ParseDIDLTrack(didl, 'fake_host');
      expect(result).to.has.property('Album','19');
      expect(result).to.has.property('Artist', artist);
      done();
    });

    it('decodes spotify album art uri correctly', (done) => {
      const hostName = 'fake_host'
      const albumArt = '/getaa?s=1&amp;u=x-sonos-spotify%3aspotify%253atrack%253a0WS5DKZ6QnHvFYBk8lRRm0%3fsid%3d9%26flags%3d8224%26sn%3d7';
      const expectedUri = `http://${hostName}:1400/getaa?s=1&u=x-sonos-spotify%3aspotify%253atrack%253a0WS5DKZ6QnHvFYBk8lRRm0%3fsid%3d9%26flags%3d8224%26sn%3d7`;
      const didl = {
        'upnp:albumArtURI': albumArt,
        'upnp:album': 'CeeLo&apos;s Magic Moment', 
        'dc:creator': 'CeeLo Green',
        'dc:title': 'This Christmas'
      };
      const result = MetadataHelper.ParseDIDLTrack(didl, 'fake_host');
      expect(result).to.have.property('Album', 'CeeLo\'s Magic Moment');
      expect(result).to.have.property('AlbumArtUri', expectedUri);
      expect(result).to.have.property('Artist', 'CeeLo Green');
      expect(result).to.have.property('Title', 'This Christmas');
      done();
    });

    it('parsed r:streamContent correctly 2', (done) => {
      const artist = 'Guus Meeuwis';
      const title = 'Brabant'
      const id = 'FAKE_ITEM_ID'
      const didl = {
        _id: id,
        'r:streamContent': `${artist} - ${title}`
      }
      const result = MetadataHelper.ParseDIDLTrack(didl, 'fake_host')
      expect(result).to.be.an('object');
      expect(result).to.have.nested.property('Artist', artist);
      expect(result).to.have.nested.property('Title', title);
      expect(result).to.have.nested.property('ItemId', id);
      done();
    })

    it('parsed r:streamContent and r:radioShowMd correctly', (done) => {
      const artist = 'Guus Meeuwis';
      const title = 'Brabant'
      const id = 'FAKE_ITEM_ID'
      const didl = {
        _id: id,
        'r:streamContent': artist,
        'r:radioShowMd': title
      }
      const result = MetadataHelper.ParseDIDLTrack(didl, 'fake_host')
      expect(result).to.be.an('object');
      expect(result).to.have.nested.property('Artist', artist);
      expect(result).to.have.nested.property('Title', title);
      expect(result).to.have.nested.property('ItemId', id);
      done();
    })

    it('parsed r:streamContent', (done) => {
      const artist = 'Guus Meeuwis';
      const id = 'FAKE_ITEM_ID'
      const didl = {
        _id: id,
        'r:streamContent': artist
      }
      const result = MetadataHelper.ParseDIDLTrack(didl, 'fake_host')
      expect(result).to.be.an('object');
      expect(result).to.have.nested.property('Artist', artist);
      expect(result).to.have.nested.property('ItemId', id);
      done();
    });
  });

  describe('TrackToMetaData', () => {
    it('includes resource', () => {
      const trackUri = 'https://cdn.smartersoft-group.com/various/pull-bell-short.mp3';
      const albumUri = 'https://avatars2.githubusercontent.com/u/1292510?v=4'
      const album = 'Just a Bell';
      const duration = '00:28:07';
      const fakeProtocolInfo = 'fake-protocol:*'
      const metadata = MetadataHelper.TrackToMetaData({
        ParentId: '11',
        TrackUri: trackUri,
        Duration: duration,
        AlbumArtUri: albumUri,
        Album: album,
        ProtocolInfo: fakeProtocolInfo
      }, true);
      expect(metadata).to.be.not.undefined;
      expect(metadata).to.contain(trackUri);
      expect(metadata).to.contain(albumUri);
      expect(metadata).to.contain(album);
      expect(metadata).to.contain(duration);
      expect(metadata).to.contain(fakeProtocolInfo);
    });

    it('returns emtpy string when track undefined', () => {
      const result = MetadataHelper.TrackToMetaData(undefined);
      expect(result).to.be.eq('');
    });
  });
});
