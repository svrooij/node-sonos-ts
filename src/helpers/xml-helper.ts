import { parse } from 'fast-xml-parser'

const htmlEntities: any = {
  nbsp: ' ',
  cent: '¢',
  pound: '£',
  yen: '¥',
  euro: '€',
  copy: '©',
  reg: '®',
  lt: '<',
  gt: '>',
  quot: '"',
  amp: '&',
  apos: '\''
};
export class XmlHelper {
  /**
   * Decode an encoded xml string
   *
   * @static
   * @param {string} text Encoded XML
   * @returns {string} Decoded XML
   * @memberof XmlHelper
   */
  static DecodeXml(text: string): string {
    if(typeof text === 'undefined') return ''
    return text.replace(/\&([^;]+);/g, function (entity, entityCode) {
      let match;

      if (entityCode in htmlEntities) {
          return htmlEntities[entityCode];
          /*eslint no-cond-assign: 0*/
      } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
          return String.fromCharCode(parseInt(match[1], 16));
          /*eslint no-cond-assign: 0*/
      } else if (match = entityCode.match(/^#(\d+)$/)) {
          return String.fromCharCode(~~match[1]);
      } else {
          return entity;
      }
    });
  }

   /**
   * DecodeAndParseXml will decode the encoded xml string and then try to parse it
   *
   * @static
   * @param {string} encodedXml Encoded Xml string
   * @returns {*} a parsed Object of the XML string
   * @memberof XmlHelper
   */
  static DecodeAndParseXml(encodedXml: string, attributeNamePrefix = '_'): any {
    return parse(XmlHelper.DecodeXml(encodedXml), { ignoreAttributes: false, attributeNamePrefix: attributeNamePrefix });
  }

  /**
   * EncodeXml will encode a xml string so it is safe to send to sonos.
   *
   * @static
   * @param {string} xml
   * @returns {string}
   * @memberof XmlHelper
   */
  static EncodeXml(xml: string): string {
    if(typeof xml === 'undefined') return ''
    return xml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  }

  static EncodeTrackUri(trackUri: string): string {
    const index = trackUri.indexOf(':') + 1
    return trackUri.substr(0, index) + this.EncodeXml(trackUri.substr(index)).replace(/:/g, '%3a');
  }

  static DecodeTrackUri(input: string): string {
    return XmlHelper.DecodeXml(decodeURIComponent(input));
  }
}
