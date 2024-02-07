import {
  XmlCdata,
  XmlComment,
  XmlDeclaration,
  XmlDocument, XmlDocumentType, XmlElement, XmlProcessingInstruction, XmlText, parseXml,
} from '@rgrove/parse-xml';
import { encode, decode } from 'html-entities';

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
    if (typeof text === 'string' && !text.startsWith('$lt;')) {
      return text;
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
   * @returns {*} a parsed Object of the XML string
   * @memberof XmlHelper
   */
  static DecodeAndParseXml(encodedXml: unknown): Record<string, unknown> | unknown {
    const decoded = XmlHelper.DecodeXml(encodedXml);
    if (typeof decoded === 'undefined') return undefined;
    return this.ParseXml(decoded, false);
  }

  /**
   * DecodeAndParseXml will decode the encoded xml string and then try to parse it
   *
   * @static
   * @param {string} encodedXml Encoded Xml string
   * @returns {*} a parsed Object of the XML string
   * @memberof XmlHelper
   */
  static DecodeAndParseXmlNoNS(encodedXml: unknown): Record<string, unknown> | unknown {
    const decoded = XmlHelper.DecodeXml(encodedXml);
    return decoded ? this.ParseXml(decoded, true) : undefined;
  }

  static ParseEmbeddedXml(input: unknown): Record<string, unknown> | unknown {
    if (typeof input !== 'string' || input === '') return undefined;
    const inputToParse = input.indexOf('\\"') > -1 ? input.replace('\\"', '"') : input;

    const xmlDocument = parseXml(inputToParse as string);

    const result = this.NormalizeXml(xmlDocument, true);
    return result;
  }

  static ParseXml(input: unknown, removeNamespace = false): Record<string, unknown> | unknown {
    if (typeof input !== 'string' || input === '') return undefined;
    const xmlDocument = parseXml(input);

    const result = this.NormalizeXml(xmlDocument, removeNamespace);
    return result;
  }

  private static ParseValue(input: unknown): unknown {
    if (typeof input === 'string') {
      if (input === 'true') return true;
      if (input === 'false') return false;
      if (input === 'null') return null;
      // check if the supplied input value might be a string representation of a number
      if (!Number.isNaN(Number(input))) return Number(input);
      return input;
    }
    return input;
  }

  static NormalizeXml(input: XmlDocument | XmlElement | unknown, removeNamespace: boolean): Record<string, unknown> | unknown {
    if (input === null) return undefined;
    if (input instanceof XmlText) {
      return input.text;
    }

    if ((input instanceof XmlDocument) || (input instanceof XmlElement)) {
      if (input.children.length === 1 && input.children[0] instanceof XmlText && (input instanceof XmlElement && Object.keys(input.attributes).length === 0)) {
        return this.ParseValue(input.children[0].text);
      }
      const result: Record<string, unknown> = {};

      if (input instanceof XmlElement) {
        // itereate over the attributes and add them to the result
        // tell eslint to ignore the next line as it is a for of loop
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of Object.entries(input.attributes)) {
          if (!key.startsWith('xmlns')) {
            const finalKey = removeNamespace ? key.replace(/.*:/, '') : key;
            result[finalKey] = this.ParseValue(value);
          }
        }
      }

      input.children.forEach((child: XmlElement | XmlText | XmlCdata | XmlComment | XmlProcessingInstruction| XmlDeclaration | XmlDocumentType) => {
      // for (const child of input.children) {
        if (child instanceof XmlElement) {
          const value = this.NormalizeXml(child, removeNamespace);
          const name = removeNamespace ? child.name.replace(/.*:/, '') : child.name;
          if (name in result) {
            const existing = result[name];
            if (Array.isArray(existing)) {
              existing.push(value);
            } else {
              result[name] = [existing, value];
            }
          } else {
            result[name] = value;
          }
        } else if (child instanceof XmlText) {
          if (child.text.trim() !== '') {
            result['#text'] = this.ParseValue(child.text);
          }
        }
      // }
      });
      return result;
    }
    if (input instanceof XmlText) {
      return this.ParseValue(input.text);
    }
    return input;
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
