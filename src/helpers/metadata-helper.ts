import { Track } from '../models'
import debug = require('debug')
import { XmlHelper } from './xml-helper';

export class MetadataHelper {

  private static debug = debug('sonos:metadata')

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
    MetadataHelper.debug('Parsing DIDL %o', parsedItem)
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
    if(didlItem['r:streamContent'] && typeof didlItem['r:streamContent'] === 'string' && track.Artist === undefined) {
      const streamContent = (didlItem['r:streamContent'] as string).split('-');
      if(streamContent.length === 2) {
        track.Artist = streamContent[0].trim();
        track.Title = streamContent[1].trim();
      }
    }
    if(didlItem['upnp:albumArtURI']) {
      const uri = Array.isArray(didlItem['upnp:albumArtURI']) ? didlItem['upnp:albumArtURI'][0] : didlItem['upnp:albumArtURI'];
      const art = (uri as string).replace(/&amp;/gi, '&').replace(/%25/g, '%').replace(/%3a/gi,':');
      track.AlbumArtUri = art.startsWith('http') ? art : `http://${host}:${port}${art}`;
    }
    
    if(didlItem.res) {
      track.Duration = didlItem.res._duration
      track.TrackUri = XmlHelper.DecodeTrackUri(didlItem.res['#text'])
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
  static TrackToMetaData(track: Track | undefined, includeResource = false, cdudn = 'RINCON_AssociatedZPUDN'): string {
    if (track === undefined) return ''

    if(track.CdUdn !== undefined) cdudn = track.CdUdn
    if(track.ProtocolInfo === undefined) track.ProtocolInfo = 'http-get:*:audio/mpeg:*'
    if(track.ItemId === undefined) track.ItemId = '-1'
    let metadata = '<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">'
    metadata += `<item id="${track.ItemId}" restricted="true"` + (track.ParentId !== undefined ? ` parentID="${track.ParentId}">` : '>')
    if (includeResource) metadata += `<res protocolInfo="${track.ProtocolInfo}" duration="${track.Duration}">${track.TrackUri}</res>`
    if (track.AlbumArtUri !== undefined) metadata += `<upnp:albumArtURI>${track.AlbumArtUri}</upnp:albumArtURI>`
    if (track.Title !== undefined) metadata += `<dc:title>${track.Title}</dc:title>`
    if (track.Artist !== undefined) metadata += `<dc:creator>${track.Artist}</dc:creator>`
    if (track.Album !== undefined) metadata += `<upnp:album>${track.Album}</upnp:album>`
    if (track.UpnpClass !== undefined) metadata += `<upnp:class>${track.UpnpClass}</upnp:class>`
    metadata += `<desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">${cdudn}</desc>`
    metadata += '</item></DIDL-Lite>'
    return metadata
  }

  static GuessMetaDataAndTrackUri(trackUri: string, spotifyRegion = '2311'): { trackUri: string; metedata: Track | string }{
    const metadata = MetadataHelper.GuessTrack(trackUri, spotifyRegion);

    return {
      trackUri: metadata === undefined || metadata.TrackUri === undefined ? trackUri : XmlHelper.DecodeTrackUri(metadata.TrackUri),
      metedata: metadata || ''
    }
  }

  static GuessTrack(trackUri: string, spotifyRegion = '2311'): Track | undefined {
    MetadataHelper.debug('Guessing metadata for %s', trackUri);
    let title = ''
    const match = /.*\/(.*)$/g.exec(trackUri.replace(/\.[a-zA-Z0-9]{3}$/, ''))
    if (match) {
      title = match[1]
    }
    const track: Track = {
      Album: undefined,
      Artist: undefined,
      AlbumArtUri: undefined,
      Title: undefined,
      UpnpClass: undefined,
      Duration: undefined,
      ItemId: undefined,
      ParentId: undefined,
      TrackUri: undefined,
      ProtocolInfo: undefined,
      CdUdn: undefined
    };
    if(trackUri.startsWith('x-file-cifs')) {
      track.ItemId = trackUri.replace('x-file-cifs', 'S').replace(/\s/g, '%20')
      track.Title = title.replace('%20', ' ')
      track.ParentId = 'A:TRACKS'
      track.UpnpClass = this.GetUpnpClass(track.ParentId)
      track.TrackUri = trackUri
      track.CdUdn = 'RINCON_AssociatedZPUDN'
      return track;
    }
    if (trackUri.startsWith('x-rincon-playlist')) {
      const parentMatch = /.*#(.*)\/.*/g.exec(trackUri)
      if(parentMatch === null) throw new Error('ParentID not found')
      const parentID = parentMatch[1]
      track.ItemId = `${parentID}/${title.replace(/\s/g, '%20')}`,
      track.Title = title.replace('%20', ' ')
      track.UpnpClass = this.GetUpnpClass(parentID)
      track.ParentId = parentID
      track.CdUdn = 'RINCON_AssociatedZPUDN'
      return track;
    }

    if (trackUri.startsWith('x-sonosapi-stream:')){
      track.UpnpClass = 'object.item.audioItem.audioBroadcast',
      track.Title = 'Some radio station'
      track.ItemId = '10092020' + '_xxx_xxxx' // Add station ID from url (regex?)
      return track;
    }

    if (trackUri.startsWith('x-rincon-cpcontainer:1006206ccatalog')) { // Amazon prime container
      track.TrackUri = trackUri;
      track.ItemId = trackUri.replace('x-rincon-cpcontainer:', '')
      // track.ParentId = ''
      track.UpnpClass = 'object.container.playlistContainer'
      return track;
    }

    if (trackUri.startsWith('x-rincon-cpcontainer:100d206cuser-fav')) { // Sound Cloud likes
      track.TrackUri = trackUri;
      track.ItemId = trackUri.replace('x-rincon-cpcontainer:', '')
      // track.ParentId = ''
      track.UpnpClass = 'object.container.albumList'
      track.CdUdn = 'SA_RINCON40967_X_#Svc40967-0-Token'
      return track;
    }

    if (trackUri.startsWith('x-rincon-cpcontainer:1006206cplaylist')) { // Sound Cloud playlists
      track.TrackUri = trackUri;
      track.ItemId = trackUri.replace('x-rincon-cpcontainer:', '')
      // track.ParentId = ''
      track.UpnpClass = 'object.container.playlistContainer'
      track.CdUdn = 'SA_RINCON40967_X_#Svc40967-0-Token'
      return track;
    }
    const parts = trackUri.split(':')
    if (parts.length === 3 && parts[0] === 'spotify') {
      const spotifyUri = trackUri.replace(/:/g, '%3a');
      track.Title = '';
      // track.ParentId = '';
      track.CdUdn = `SA_RINCON${spotifyRegion}_X_#Svc${spotifyRegion}-0-Token`
      if (parts[1] === 'track') {
        track.TrackUri = `x-sonos-spotify:${spotifyUri}?sid=9&amp;flags=8224&amp;sn=7`;
        track.ItemId = `00032020${spotifyUri}`;
        track.UpnpClass = 'object.item.audioItem.musicTrack';
        
        return track;
      }
      if (parts[1] === 'album') {
        track.TrackUri = `x-rincon-cpcontainer:0004206c${spotifyUri}`
        track.ItemId = `0004206c${spotifyUri}`;
        track.UpnpClass = 'object.container.album.musicAlbum'
        return track;
      }
      if (parts[1] === 'artistTopTracks') {
        track.TrackUri = `x-rincon-cpcontainer:000e206c${spotifyUri}`
        track.ItemId = `000e206c${spotifyUri}`;
        track.UpnpClass = 'object.container.playlistContainer'
        return track;
      }
      if (parts[1] === 'user') {
        track.TrackUri = `x-rincon-cpcontainer:10062a6c${spotifyUri}?sid=9&flags=10860&sn=7`
        track.ItemId = `10062a6c${spotifyUri}`;
        track.Title = 'User\'s playlist'
        track.UpnpClass = 'object.container.playlistContainer';
        track.ParentId = '10082664playlists'
        return track;
      }

      if (parts[1] === 'artistRadio') {
        track.TrackUri = `x-sonosapi-radio:${spotifyUri}?sid=12&flags=8300&sn=5`
        track.ItemId = `10062a6c${spotifyUri}`;
        track.Title = 'Artist radio'
        track.UpnpClass = 'object.item.audioItem.audioBroadcast.#artistRadio';
        track.ParentId = `10052064${spotifyUri.replace('artistRadio', 'artist')}`
        return track;
      }
    }

    MetadataHelper.debug('Don\'t support this TrackUri (yet) %s', trackUri)
    return undefined
  }

  private static GetUpnpClass = function (parentID: string): string {
    switch (parentID) {
      case 'A:ALBUMS':
        return 'object.item.audioItem.musicAlbum'
      case 'A:TRACKS':
        return 'object.item.audioItem.musicTrack'
      case 'A:ALBUMARTIST':
        return 'object.item.audioItem.musicArtist'
      case 'A:GENRE':
        return 'object.container.genre.musicGenre'
      case 'A:COMPOSER':
        return 'object.container.person.composer'
      default:
        return ''
    }
  }
}