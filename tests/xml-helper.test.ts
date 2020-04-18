import XmlHelper from '../src/helpers/xml-helper'
import { expect }  from 'chai'

describe('XmlHelper', () => {
  it('Encodes an url correctly', () => {
    const url = 'http://192.168.96.200:5601/cache/nl-NL/1af7308e4c6ac25a6620e339ba70a451b9dda8a2.mp3';
    const result = XmlHelper.EncodeTrackUri(url);
    expect(result).to.be.eq(url);
  })
  it('Encodes an url with query correctly', () => {
    const url = 'http://192.168.96.200:5601/cache/nl-NL/tts?text=dit is een test tekst';
    const result = XmlHelper.EncodeTrackUri(url);
    const expected = 'http://192.168.96.200:5601/cache/nl-NL/tts?text=dit%20is%20een%20test%20tekst'
    expect(result).to.be.eq(expected);
  })
})
