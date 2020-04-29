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

    it('Produces same metadata as legacy for Spotify track', () => {
      const track = MetadataHelper.GuessTrack(spotifyTrack);
      expect(track).to.be.an('object');
      const legacyMetadataObject = GenerateMetadata(spotifyTrack, '', '2311');

      const metadata = MetadataHelper.TrackToMetaData(track);
      assert.equal(metadata, legacyMetadataObject.metadata);
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

  describe('TrackToMetaData', () => {
    it('returns emtpy string when track undefined', () => {
      const result = MetadataHelper.TrackToMetaData(undefined);
      expect(result).to.be.eq('');
    });
  });
});
