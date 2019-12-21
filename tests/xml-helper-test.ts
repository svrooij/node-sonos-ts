import { XmlHelper } from '../src'
import { expect }  from 'chai'
import 'mocha';

describe('XmlHelper', function () {
  it('Encodes a standard url correctly', function() {
    const url = 'http://192.168.96.200:5601/cache/nl-NL/1af7308e4c6ac25a6620e339ba70a451b9dda8a2.mp3';
    const result = XmlHelper.EncodeTrackUri(url);
    expect(result).to.be.eq(url);
  })
})