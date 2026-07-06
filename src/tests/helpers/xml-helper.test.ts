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

  describe('ParseXml()', () => {

    it('parses xml with unencoded & in url without throwing', () => {
      const xml = '<root><item url="https://example.com/image?w=60&amp;image=test" /></root>';
      expect(() => XmlHelper.ParseXml(xml)).not.toThrow();
    });

    it('parses xml with bare & in attribute value without throwing', () => {
      const xml = '<root><item url="https://example.com/image?w=60&image=test" /></root>';
      expect(() => XmlHelper.ParseXml(xml)).not.toThrow();
    });

    it('parses xml with bare & in text content without throwing', () => {
      const xml = '<root><item>https://cdn.example.com/i/image?w=60&image=https%3A%2F%2Fcdn-profiles.tune</item></root>';
      expect(() => XmlHelper.ParseXml(xml)).not.toThrow();
    });

    it('preserves valid xml entities when sanitizing', () => {
      const xml = '<root><item title="Rock &amp; Roll" /></root>';
      expect(() => XmlHelper.ParseXml(xml)).not.toThrow();
      const result = XmlHelper.ParseXml(xml) as Record<string, unknown>;
      expect((result['root'] as Record<string, unknown>)['item']).toEqual({ title: 'Rock & Roll' });
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
