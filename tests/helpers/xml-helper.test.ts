import { expect } from 'chai';
import XmlHelper from '../../src/helpers/xml-helper';

describe('XmlHelper', () => {
  describe('DecodeTrackUri()', () => {

    it('returns undefined when input is undefined', () => {
      const uri = undefined;
      const result = XmlHelper.DecodeTrackUri(uri);
      expect(result).to.be.undefined;
    });

    it('returns undefined when input is empty string', () => {
      const uri = '';
      const result = XmlHelper.DecodeTrackUri(uri);
      expect(result).to.be.undefined;
    });
  });

  describe('DecodeAndParseXml()', () => {

    it('returns undefined when input is undefined', () => {
      const xml = undefined;
      const result = XmlHelper.DecodeAndParseXml(xml);
      expect(result).to.be.undefined;
    });

    it('returns undefined when input is empty string', () => {
      const xml = '';
      const result = XmlHelper.DecodeAndParseXml(xml);
      expect(result).to.be.undefined;
    });
  });

  describe('DecodeAndParseXmlNoNS()', () => {

    it('returns undefined when input is undefined', () => {
      const xml = undefined;
      const result = XmlHelper.DecodeAndParseXmlNoNS(xml);
      expect(result).to.be.undefined;
    });

    it('returns undefined when input is empty string', () => {
      const xml = '';
      const result = XmlHelper.DecodeAndParseXmlNoNS(xml);
      expect(result).to.be.undefined;
    });
  });

  describe('EncodeXml()', () => {

    it('returns empty string when input is undefined', () => {
      const xml = undefined;
      const result = XmlHelper.EncodeXml(xml);
      expect(result).to.be.equal('');
    });

    it('returns empty string when input is empty string', () => {
      const xml = '';
      const result = XmlHelper.EncodeXml(xml);
      expect(result).to.be.equal('');
    });
  });

  describe('EncodeTrackUri()', () => {

    it('doesn\'t encode an uri starting with x-rincon-mp3radio', () => {
      const uri = 'x-rincon-mp3radio://cde:8000/stream'
      const result = XmlHelper.EncodeTrackUri(uri);
      expect(result).to.be.eq(uri);
    });

    it('encodes a local playlist url correctly', () => {
      const uri = 'x-rincon-playlist:RINCON_000E58FE3AEA01400#A:ALBUM/Diamond Life'
      const expectedUri = 'x-rincon-playlist:RINCON_000E58FE3AEA01400#A:ALBUM/Diamond%20Life'
      const result = XmlHelper.EncodeTrackUri(uri);
      expect(result).to.be.equal(expectedUri);
    })

    it('encodes a local playlist url correctly (no change)', () => {
      const uri = 'x-rincon-playlist:RINCON_000E58FE3AEA01400#A:ALBUM/Diamond%20Life'
      const expectedUri = 'x-rincon-playlist:RINCON_000E58FE3AEA01400#A:ALBUM/Diamond%20Life'
      const result = XmlHelper.EncodeTrackUri(uri);
      expect(result).to.be.equal(expectedUri);
    })
  });
});
