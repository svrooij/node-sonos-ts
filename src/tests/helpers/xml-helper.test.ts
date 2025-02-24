//
import XmlHelper from '../../helpers/xml-helper';

describe('XmlHelper', () => {
  describe('DecodeTrackUri()', () => {

    it('returns undefined when input is undefined', () => {
      const uri = undefined;
      const result = XmlHelper.DecodeTrackUri(uri);
      expect(result).toBeUndefined();
    });

    it('returns undefined when input is empty string', () => {
      const uri = '';
      const result = XmlHelper.DecodeTrackUri(uri);
      expect(result).toBeUndefined();
    });
  });

  describe('DecodeAndParseXml()', () => {

    it('returns undefined when input is undefined', () => {
      const xml = undefined;
      const result = XmlHelper.DecodeAndParseXml(xml);
      expect(result).toBeUndefined();
    });

    it('returns undefined when input is empty string', () => {
      const xml = '';
      const result = XmlHelper.DecodeAndParseXml(xml);
      expect(result).toBeUndefined();
    });
  });

  describe('DecodeAndParseXmlNoNS()', () => {

    it('returns undefined when input is undefined', () => {
      const xml = undefined;
      const result = XmlHelper.DecodeAndParseXmlNoNS(xml);
      expect(result).toBeUndefined();;
    });

    it('returns undefined when input is empty string', () => {
      const xml = '';
      const result = XmlHelper.DecodeAndParseXmlNoNS(xml);
      expect(result).toBeUndefined();;
    });
  });

  describe('EncodeXml()', () => {

    it('returns empty string when input is undefined', () => {
      const xml = undefined;
      const result = XmlHelper.EncodeXml(xml);
      expect(result).toBe('');
    });

    it('returns empty string when input is empty string', () => {
      const xml = '';
      const result = XmlHelper.EncodeXml(xml);
      expect(result).toBe('');
    });
  });

  describe('EncodeTrackUri()', () => {

    it('doesn\'t encode an uri starting with x-rincon-mp3radio', () => {
      const uri = 'x-rincon-mp3radio://cde:8000/stream'
      const result = XmlHelper.EncodeTrackUri(uri);
      expect(result).toBe(uri);
    });

    it('encodes a local playlist url correctly', () => {
      const uri = 'x-rincon-playlist:RINCON_000E58FE3AEA01400#A:ALBUM/Diamond Life'
      const expectedUri = 'x-rincon-playlist:RINCON_000E58FE3AEA01400#A:ALBUM/Diamond%20Life'
      const result = XmlHelper.EncodeTrackUri(uri);
      expect(result).toEqual(expectedUri);
    })

    it('encodes a local playlist url correctly (no change)', () => {
      const uri = 'x-rincon-playlist:RINCON_000E58FE3AEA01400#A:ALBUM/Diamond%20Life'
      const expectedUri = 'x-rincon-playlist:RINCON_000E58FE3AEA01400#A:ALBUM/Diamond%20Life'
      const result = XmlHelper.EncodeTrackUri(uri);
      expect(result).toEqual(expectedUri);
    })
  });
});
