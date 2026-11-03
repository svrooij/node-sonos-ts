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

    it('recovers malformed bare attributes in Sonos line-in metadata', () => {
      const uri = 'x-rincon-stream:RINCON_XXXXXXXXXXXXXXX00:0';
      const xml = `<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/"><item id="playback" parentID="0" restricted="false"><dc:title>loadLineIn</dc:title><upnp:class>object.item.audioItem.linein</upnp:class><res x-rincon-stream>${uri}</res></item></DIDL-Lite>`;
      const result = XmlHelper.ParseXml(xml) as Record<string, unknown>;
      const didl = result['DIDL-Lite'] as Record<string, unknown>;
      const item = didl['item'] as Record<string, unknown>;

      expect(item['res']).toBe(uri);
    });

    it('removes multiple bare attributes while preserving valid attributes', () => {
      const xml = '<root><item first-invalid second-invalid valid="kept">value</item></root>';
      const result = XmlHelper.ParseXml(xml) as Record<string, unknown>;
      const root = result['root'] as Record<string, unknown>;

      expect(root['item']).toEqual({ valid: 'kept', '#text': 'value' });
    });

    it('still throws for unrelated malformed xml', () => {
      const xml = '<root><item></root>';

      expect(() => XmlHelper.ParseXml(xml)).toThrow('Missing end tag');
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
