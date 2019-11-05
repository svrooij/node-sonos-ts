import { Track } from '../models'

export class MetadataHelper {

  /**
   * ParseDIDLTrack will parse track metadata for you.
   *
   * @static
   * @param {*} parsedItem Object from XmlParser
   * @param {string} host Sonos host, to make album uri an absolute url
   * @param {number} [port=1400] Sonos port, to make album uri an absolute url
   * @returns {Track} Parsed track
   * @memberof MetadataHelper
   */
  static ParseDIDLTrack(parsedItem: any, host: string, port = 1400): Track {
    const didlItem = (parsedItem['DIDL-Lite'] && parsedItem['DIDL-Lite'].item) ? parsedItem['DIDL-Lite'].item : parsedItem;
    const track: Track = {
      Album: didlItem['upnp:album'],
      Artist: didlItem['dc:creator'],
      AlbumArtUri: undefined,
      Title: didlItem['dc:title'],
      UpnpClass: didlItem['upnp:class'],
      Duration: undefined,
      ItemId: didlItem._id,
      ParentId: didlItem._parentID,
      TrackUri: undefined,
      ProtocolInfo: undefined
    };
    if(didlItem['upnp:albumArtURI']) {
      const art = (didlItem['upnp:albumArtURI'] as string).replace(/&amp;/, '&');
      track.AlbumArtUri = art.startsWith('http') ? art : `http://${host}:${port}${art}`;
    }
    
    if(didlItem.res) {
      track.Duration = didlItem.res._duration
      track.TrackUri = didlItem.res['#text']
      track.ProtocolInfo = didlItem.res._protocolInfo
    }

    return track;
  }

  /**
   * Track to MetaData will generate a XML string that can be used as MetaData
   *
   * @static
   * @param {Track} track The track do describe
   * @returns {string} XML string (be sure to encode before using)
   * @memberof MetadataHelper
   */
  static TrackToMetaData(track: Track): string {
    let metadata = '<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">'
    metadata += `<item id="${track.ItemId}"` + (track.ParentId !== undefined) ? ` parentID="${track.ParentId}">` : '>'
    metadata += `<res protocolInfo="http-get:*:audio/mpeg:*" duration="${track.Duration}">${track.TrackUri}</res>`
    if (track.AlbumArtUri !== undefined) metadata += `<upnp:albumArtURI>${track.AlbumArtUri}</upnp:albumArtURI>`
    if (track.Title !== undefined) metadata += `<dc:title>${track.Title}</dc:title>`
    if (track.Artist !== undefined) metadata += `<dc:creator>${track.Artist}</dc:creator>`
    if (track.Album !== undefined) metadata += `<upnp:album>${track.Album}</upnp:album>`
    if (track.UpnpClass !== undefined) metadata += `<upnp:class>${track.UpnpClass}</upnp:class>`
    metadata += '<desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">RINCON_AssociatedZPUDN</desc>'
    metadata += '</item></DIDL-Lite>'
    return metadata
  }
}