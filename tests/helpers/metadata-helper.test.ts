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
