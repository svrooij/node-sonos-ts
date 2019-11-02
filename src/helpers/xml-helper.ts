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

  static ParseDIDL(didlItem: any, host: string, port: number = 1400): any {
    let track = {
      Artist: null,
      Title: null,
      Album: null,
      AlbumArtUri: null,
      UpnpClass: null
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