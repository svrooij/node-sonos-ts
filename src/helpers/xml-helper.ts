import { parse } from 'fast-xml-parser'
import { Track } from '../services/models'

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
    return text.replace(/\&([^;]+);/g, function (entity, entityCode) {
      var match;

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
  static DecodeAndParseXml(encodedXml: string): any {
    return parse(XmlHelper.DecodeXml(encodedXml));
  }

  static ParseDIDLTrack(parsedItem: any, host: string, port: number = 1400): Track {
    const didlItem = (parsedItem['DIDL-Lite'] && parsedItem['DIDL-Lite'].item) ? parsedItem['DIDL-Lite'].item : parsedItem;
    console.log('Parsing track %j', didlItem)
    let track: Track = {
      Album: undefined,
      Artist: undefined,
      AlbumArtUri: undefined,
      Title: undefined,
      UpnpClass: undefined
    };
    if(didlItem['dc:title']) track.Title = didlItem['dc:title'];
    if(didlItem['dc:creator']) track.Artist = didlItem['dc:creator'];
    if(didlItem['upnp:album']) track.Album = didlItem['upnp:album'];
    if(didlItem['upnp:albumArtURI']) {
      const art = didlItem['upnp:albumArtURI'];
      track.AlbumArtUri = art.startsWith('http') ? art : `http://${host}:${port}${art}`;
    } 
    if(didlItem['upnp:class']) track.UpnpClass = didlItem['upnp:class'];
    return track;
  }
}