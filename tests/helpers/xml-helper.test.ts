import { expect } from 'chai';
import XmlHelper from '../../src/helpers/xml-helper';

describe('XmlHelper', () => {
  describe('EncodeTrackUri()', () => {

    it('doesn\'t encode an uri starting with x-rincon-mp3radio', () => {
      const uri = 'x-rincon-mp3radio://cde:8000/stream'
      const result = XmlHelper.EncodeTrackUri(uri);
      expect(result).to.be.eq(uri);
    });
  })
});
