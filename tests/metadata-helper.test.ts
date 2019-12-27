import { MetadataHelper } from '../src/helpers/metadata-helper'
import { expect, assert}  from 'chai'
import 'mocha';
const GenerateMetadata = require('./legacy-helpers').GenerateMetadata

const spotifyTrack = 'spotify:track:6sYJuVcEu4gFHmeTLdHzRz'

describe('MetadataHelper', function () {
  it('Guess metadata for Spotify artist top tracks', function() {
    const track = MetadataHelper.GuessTrack('spotify:artistTopTracks:72qVrKXRp9GeFQOesj0Pmv')
    expect(track).to.be.an('object')
  })
  it('Guess metadata for Spotify track', function() {
    const track = MetadataHelper.GuessTrack(spotifyTrack)
    expect(track).to.be.an('object')
  })
  it('Produces same metadata as legacy for Spotify track', function() {
    const track = MetadataHelper.GuessTrack(spotifyTrack)
    expect(track).to.be.an('object')
    const legacyMetadataObject = GenerateMetadata(spotifyTrack, '', '2311')

    const metadata = MetadataHelper.TrackToMetaData(track)
    assert.equal(metadata, legacyMetadataObject.metadata)
  })

})
