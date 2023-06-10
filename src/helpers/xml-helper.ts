import { encode, decode } from 'html-entities';
import { XMLParser, XMLValidator } from 'fast-xml-parser';

export default class XmlHelper {
  /**
   * Decode an encoded xml string
   *
   * @static
   * @param {string} text Encoded XML
   * @returns {string} Decoded XML
   * @memberof XmlHelper
   */
  static DecodeXml(text: unknown): string | undefined {
    if (typeof text !== 'string' || text === '') {
      return undefined;
    }

    return decode(text, { level: 'xml' });
  }

  /**
   * Decode an encoded xml string
   *
   * @static
   * @param {string} text Encoded XML
   * @returns {string} Decoded XML
   * @memberof XmlHelper
   */
  static DecodeHtml(text: unknown): string | undefined {
    if (typeof text === 'undefined' || (typeof text === 'string' && text === '')) {
      return undefined;
    }
    if (typeof text !== 'string') {
      return XmlHelper.DecodeHtml(`${text}`);
    }
    return decode(text);
  }

  /**
   * DecodeAndParseXml will decode the encoded xml string and then try to parse it
   *
   * @static
   * @param {string} encodedXml Encoded Xml string
   * @param attributeNamePrefix
   * @returns {*} a parsed Object of the XML string
   * @memberof XmlHelper
   */
  static DecodeAndParseXml(encodedXml: unknown, attributeNamePrefix = '_'): unknown {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix });
    if (typeof encodedXml === 'string' && encodedXml !== '' && XMLValidator.validate(encodedXml)) {
      return parser.parse(encodedXml as string);
    }
    const decoded = XmlHelper.DecodeXml(encodedXml);
    if (typeof decoded === 'undefined') return undefined;
    return parser.parse(decoded);
  }

  /**
   * DecodeAndParseXml will decode the encoded xml string and then try to parse it
   *
   * @static
   * @param {string} encodedXml Encoded Xml string
   * @returns {*} a parsed Object of the XML string
   * @memberof XmlHelper
   */
  static DecodeAndParseXmlNoNS(encodedXml: unknown, attributeNamePrefix = '_'): unknown {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix });
    if (typeof encodedXml === 'string' && encodedXml !== '' && XMLValidator.validate(encodedXml)) {
      return parser.parse(encodedXml as string);
    }
    const decoded = XmlHelper.DecodeXml(encodedXml);
    return decoded ? parser.parse(decoded) : undefined;
  }

  /**
   * EncodeXml will encode a xml string so it is safe to send to sonos.
   *
   * @static
   * @param {string} xml
   * @returns {string}
   * @memberof XmlHelper
   */
  static EncodeXml(xml: unknown): string {
    if (typeof xml !== 'string' || xml === '') return '';
    return encode(xml, { level: 'xml' });
  }

  static EncodeTrackUri(trackUri: string): string {
    if (trackUri.startsWith('http')) return encodeURI(trackUri);
    if (
      trackUri.startsWith('x-sonos-hta')
      || trackUri.startsWith('x-rincon-mp3radio')
    ) return trackUri;

    if (trackUri.startsWith('x-rincon-playlist:')) {
      const index = trackUri.indexOf('/');
      return trackUri.substr(0, index) + this.EncodeXml(trackUri.substr(index)).replace(/:/g, '%3a').replace(/ /g, '%20');
    }

    // Part below needs some work.
    const index = trackUri.indexOf(':') + 1;
    return trackUri.substr(0, index) + this.EncodeXml(trackUri.substr(index)).replace(/:/g, '%3a');
  }

  static DecodeTrackUri(input: unknown): string | undefined {
    if (typeof input !== 'string' || input === '') {
      return undefined;
    }
    return XmlHelper.DecodeXml(decodeURIComponent(input));
  }
}
