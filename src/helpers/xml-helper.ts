import {
  XmlCdata,
  XmlComment,
  XmlDeclaration,
  XmlDocument, XmlDocumentType, XmlElement, XmlError, XmlProcessingInstruction, XmlText, parseXml,
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
    if (input.indexOf('<') === -1) return input;
    const inputToParse = input.indexOf('\\"') > -1 ? input.replace('\\"', '"') : input;

    const xmlDocument = this.ParseXmlDocument(inputToParse as string);

    const result = this.NormalizeXml(xmlDocument, true);
    return result;
  }

  static ParseXml(input: unknown, removeNamespace = false): Record<string, unknown> | unknown {
    if (typeof input !== 'string' || input === '') return undefined;
    const xmlDocument = this.ParseXmlDocument(input);

    const result = this.NormalizeXml(xmlDocument, removeNamespace);
    return result;
  }

  /**
   * SanitizeXml replaces unencoded `&` characters in XML strings with `&amp;`
   * to prevent XML parsing errors when Sonos returns XML with bare `&` in URLs.
   *
   * @static
   * @param {string} input Raw XML string
   * @returns {string} Sanitized XML string
   * @memberof XmlHelper
   */
  private static SanitizeXml(input: string): string {
    // Replace & not already part of a valid XML entity reference or character reference
    return input.replace(/&(?!(?:#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);)/g, '&amp;');
  }

  /**
   * Parse XML strictly first. If Sonos returned a bare attribute without a
   * value, remove only that invalid attribute and retry. Other XML errors are
   * still surfaced to the caller.
   *
   * @param {string} input Raw XML string
   * @returns {XmlDocument} Parsed XML document
   */
  private static ParseXmlDocument(input: string): XmlDocument {
    let xml = this.SanitizeXml(input);

    // A malformed tag can contain multiple bare attributes. Keep the retry
    // count bounded so unexpected input can never cause an endless loop.
    for (let attempt = 0; attempt < 16; attempt += 1) {
      try {
        return parseXml(xml);
      } catch (error) {
        if (!(error instanceof XmlError) || !error.message.startsWith('Attribute value expected')) {
          throw error;
        }

        const recovered = this.RemoveMalformedAttribute(xml, error.pos);
        if (recovered === xml) throw error;
        xml = recovered;
      }
    }

    return parseXml(xml);
  }

  /**
   * Remove the bare attribute immediately before a parser error position.
   * Attribute names are located from the parser-provided offset, so text,
   * comments, and valid quoted attribute values are left untouched.
   *
   * @param {string} input XML string
   * @param {number} errorPosition Parser error offset
   * @returns {string} XML with the malformed attribute removed
   */
  private static RemoveMalformedAttribute(input: string, errorPosition: number): string {
    let attributeEnd = errorPosition;
    while (attributeEnd > 0 && /\s/.test(input[attributeEnd - 1])) attributeEnd -= 1;

    let attributeStart = attributeEnd;
    while (attributeStart > 0 && /[^\s<>=/'"]/.test(input[attributeStart - 1])) attributeStart -= 1;

    let whitespaceStart = attributeStart;
    while (whitespaceStart > 0 && /\s/.test(input[whitespaceStart - 1])) whitespaceStart -= 1;

    const tagStart = input.lastIndexOf('<', whitespaceStart);
    const tagType = input[tagStart + 1];
    const isStartTag = tagStart >= 0 && !['/', '!', '?'].includes(tagType);
    if (!isStartTag || whitespaceStart === attributeStart || attributeStart <= tagStart + 1) return input;

    return input.slice(0, whitespaceStart) + input.slice(attributeEnd);
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
        for (const [key, value] of Object.entries(input.attributes)) {
          if (!key.startsWith('xmlns')) {
            const finalKey = removeNamespace ? key.replace(/.*:/, '') : key;
            result[finalKey] = this.ParseValue(value);
          }
        }
      }

      input.children.forEach((child: XmlElement | XmlText | XmlCdata | XmlComment | XmlProcessingInstruction | XmlDeclaration | XmlDocumentType) => {
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
