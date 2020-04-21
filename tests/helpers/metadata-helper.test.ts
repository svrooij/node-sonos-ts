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

  describe('TrackToMetaData', () => {
    it('returns emtpy string when track undefined', () => {
      const result = MetadataHelper.TrackToMetaData(undefined);
      expect(result).to.be.eq('');
    });
  });
});
