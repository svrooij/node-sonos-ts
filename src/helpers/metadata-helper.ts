import debug from 'debug';
import { Track } from '../models/track';
import XmlHelper from './xml-helper';

export default class MetadataHelper {
  private static debug = debug('sonos:metadata');

  /**
   * ParseDIDLTrack will parse track metadata for you.
   *
   * @static
   * @param {*} didl Object from XmlParser
   * @param {string} host Sonos host, to make album uri an absolute url
   * @param {number} [port=1400] Sonos port, to make album uri an absolute url
   * @returns {Track} Parsed track
   * @memberof MetadataHelper
   */
  static ParseDIDLTrack(didl: unknown, host: string, port = 1400): Track | undefined {
    if (typeof didl === 'undefined') return undefined;
    MetadataHelper.debug('Parsing DIDL %o', didl);
    const parsedItem = didl as {[key: string]: any };
    const didlItem = (parsedItem['DIDL-Lite'] && parsedItem['DIDL-Lite'].item) ? parsedItem['DIDL-Lite'].item : parsedItem;
    const track: Track = {
      Album: XmlHelper.DecodeHtml(didlItem['upnp:album']),
      Artist: XmlHelper.DecodeHtml(didlItem['dc:creator']),
      AlbumArtUri: undefined,
      Title: XmlHelper.DecodeHtml(didlItem['dc:title']),
      UpnpClass: didlItem['upnp:class'],
      Duration: undefined,
      ItemId: didlItem.id ?? didlItem._id, // the previous xml parser was prefixing all attributes with _
      ParentId: didlItem.parentID ?? didlItem.parentID,
      TrackUri: undefined,
      ProtocolInfo: undefined,
    };
    if (didlItem['r:streamContent'] && typeof didlItem['r:streamContent'] === 'string' && track.Artist === undefined) {
      const streamContent = didlItem['r:streamContent'].split('-');
      if (streamContent.length === 2) {
        track.Artist = XmlHelper.DecodeHtml(streamContent[0].trim());
        track.Title = XmlHelper.DecodeHtml(streamContent[1].trim());
      } else {
        track.Artist = XmlHelper.DecodeHtml(streamContent[0].trim());
        if (didlItem['r:radioShowMd'] && typeof didlItem['r:radioShowMd'] === 'string') {
          const radioShowMd = didlItem['r:radioShowMd'].split(',');
          track.Title = XmlHelper.DecodeHtml(radioShowMd[0].trim());
        }
      }
    }
    if (didlItem['upnp:albumArtURI']) {
      const uri = Array.isArray(didlItem['upnp:albumArtURI']) ? didlItem['upnp:albumArtURI'][0] : didlItem['upnp:albumArtURI'];
      // Github user @hklages discovered that the album uri sometimes doesn't work because of encoding:
      // See https://github.com/svrooij/node-sonos-ts/issues/93 if you found and album art uri that doesn't work.
      const art = (uri as string).replace(/&amp;/gi, '&'); // .replace(/%25/g, '%').replace(/%3a/gi, ':');
      track.AlbumArtUri = art.startsWith('http') ? art : `http://${host}:${port}${art}`;
    }

    if (didlItem.res) {
      // the previous xml parser was prefixing all attributes with _
      track.Duration = didlItem.res.duration ?? didlItem.res._duration;
      track.TrackUri = XmlHelper.DecodeTrackUri(didlItem.res['#text']);
      track.ProtocolInfo = didlItem.res.protocolInfo ?? didlItem.res._protocolInfo;
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
    if (track === undefined) {
      return '';
    }

    const localCdudn = track.CdUdn ?? cdudn;
    const protocolInfo = track.ProtocolInfo ?? 'http-get:*:audio/mpeg:*';
    const itemId = track.ItemId ?? '-1';

    let metadata = '<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">';
    metadata += `<item id="${itemId}" restricted="true"${track.ParentId !== undefined ? ` parentID="${track.ParentId}">` : '>'}`;
    if (includeResource) metadata += `<res protocolInfo="${protocolInfo}" duration="${track.Duration}">${track.TrackUri}</res>`;
    if (track.AlbumArtUri !== undefined) metadata += `<upnp:albumArtURI>${track.AlbumArtUri}</upnp:albumArtURI>`;
    if (track.Title !== undefined) metadata += `<dc:title>${track.Title}</dc:title>`;
    if (track.Artist !== undefined) metadata += `<dc:creator>${track.Artist}</dc:creator>`;
    if (track.Album !== undefined) metadata += `<upnp:album>${track.Album}</upnp:album>`;
    if (track.UpnpClass !== undefined) metadata += `<upnp:class>${track.UpnpClass}</upnp:class>`;
    metadata += `<desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">${localCdudn}</desc>`;
    metadata += '</item></DIDL-Lite>';
    return metadata;
  }

  static GuessMetaDataAndTrackUri(trackUri: string, musicServiceRegion?: string): { trackUri: string; metadata: Track | string } {
    const metadata = MetadataHelper.GuessTrack(trackUri, musicServiceRegion);

    return {
      trackUri: metadata === undefined || metadata.TrackUri === undefined ? trackUri : XmlHelper.DecodeTrackUri(metadata.TrackUri) ?? '',
      metadata: metadata || '',
    };
  }

  static GuessTrack(trackUri: string, musicServiceRegion?: string): Track | undefined {
    MetadataHelper.debug('Guessing metadata for %s', trackUri);
    let title = '';
    // Can someone create a test for the next line.
    const match = /.*\/(.*)$/g.exec(trackUri.replace(/\.[a-zA-Z0-9]{3}$/, ''));
    if (match) {
      [, title] = match;
    }
    const track: Track = {
    };
    if (trackUri.startsWith('x-file-cifs')) {
      track.ItemId = trackUri.replace('x-file-cifs', 'S').replace(/\s/g, '%20');
      track.Title = title.replace('%20', ' ');
      track.ParentId = 'A:TRACKS';
      track.UpnpClass = this.GetUpnpClass(track.ParentId);
      track.TrackUri = trackUri;
      track.CdUdn = 'RINCON_AssociatedZPUDN';
      return track;
    }
    if (trackUri.startsWith('file:///jffs/settings/savedqueues.rsq#') || trackUri.startsWith('sonos:playlist:')) {
      const queueId = trackUri.match(/\d+/g);
      if (queueId?.length === 1) {
        track.TrackUri = `file:///jffs/settings/savedqueues.rsq#${queueId[0]}`;
        track.UpnpClass = 'object.container.playlistContainer';
        track.ItemId = `SQ:${queueId[0]}`;
        track.CdUdn = 'RINCON_AssociatedZPUDN';
        return track;
      }
    }
    if (trackUri.startsWith('x-rincon-playlist')) {
      const parentMatch = /.*#(.*)\/.*/g.exec(trackUri);
      if (parentMatch === null) throw new Error('ParentID not found');
      const parentID = parentMatch[1];
      track.ItemId = `${parentID}/${title.replace(/\s/g, '%20')}`;
      track.Title = title.replace('%20', ' ');
      track.UpnpClass = this.GetUpnpClass(parentID);
      track.ParentId = parentID;
      track.CdUdn = 'RINCON_AssociatedZPUDN';
      return track;
    }

    if (trackUri.startsWith('x-sonosapi-stream:')) {
      track.UpnpClass = 'object.item.audioItem.audioBroadcast';
      track.Title = 'Some radio station';
      track.ItemId = '10092020_xxx_xxxx'; // Add station ID from url (regex?)
      return track;
    }

    if (trackUri.startsWith('x-rincon-cpcontainer:1006206ccatalog')) { // Amazon prime container
      track.TrackUri = trackUri;
      track.ItemId = trackUri.replace('x-rincon-cpcontainer:', '');
      track.UpnpClass = 'object.container.playlistContainer';
      return track;
    }

    if (trackUri.startsWith('x-rincon-cpcontainer:100d206cuser-fav')) { // Sound Cloud likes
      track.TrackUri = trackUri;
      track.ItemId = trackUri.replace('x-rincon-cpcontainer:', '');
      track.UpnpClass = 'object.container.albumList';
      track.CdUdn = 'SA_RINCON40967_X_#Svc40967-0-Token';
      return track;
    }

    if (trackUri.startsWith('x-rincon-cpcontainer:1006206cplaylist')) { // Sound Cloud playlists
      track.TrackUri = trackUri;
      track.ItemId = trackUri.replace('x-rincon-cpcontainer:', '');
      track.UpnpClass = 'object.container.playlistContainer';
      track.CdUdn = 'SA_RINCON40967_X_#Svc40967-0-Token';
      return track;
    }

    if (trackUri.startsWith('x-rincon-cpcontainer:1004006calbum-')) { // Deezer Album
      const numbers = trackUri.match(/\d+/g);
      if (numbers && numbers.length >= 2) {
        return MetadataHelper.deezerMetadata('album', numbers[1]);
      }
    }

    const appleAlbumItem = /x-rincon-cpcontainer:1004206c(libraryalbum|album):([.\d\w]+)(?:\?|$)/.exec(trackUri);
    if (appleAlbumItem) { // Apple Music Album
      return MetadataHelper.appleMetadata(appleAlbumItem[1], appleAlbumItem[2], musicServiceRegion);
    }

    const applePlaylistItem = /x-rincon-cpcontainer:1006206c(libraryplaylist|playlist):([.\d\w]+)(?:\?|$)/.exec(trackUri);
    if (applePlaylistItem) { // Apple Music Playlist
      return MetadataHelper.appleMetadata(applePlaylistItem[1], applePlaylistItem[2], musicServiceRegion);
    }

    const appleTrackItem = /x-sonos-http:(librarytrack|song):([.\d\w]+)\.mp4\?.*sid=204/.exec(trackUri);
    if (appleTrackItem) { // Apple Music Track
      return MetadataHelper.appleMetadata(appleTrackItem[1], appleTrackItem[2], musicServiceRegion);
    }

    if (trackUri.startsWith('x-rincon-cpcontainer:10fe206ctracks-artist-')) { // Deezer Artists Top Tracks
      const numbers = trackUri.match(/\d+/g);
      if (numbers && numbers.length >= 3) {
        return MetadataHelper.deezerMetadata('artistTopTracks', numbers[2], musicServiceRegion);
      }
    }

    if (trackUri.startsWith('x-rincon-cpcontainer:1006006cplaylist_spotify%3aplaylist-')) { // Deezer Playlist
      const numbers = trackUri.match(/\d+/g);
      if (numbers && numbers.length >= 3) {
        return MetadataHelper.deezerMetadata('playlist', numbers[2], musicServiceRegion);
      }
    }

    if (trackUri.startsWith('x-sonos-http:tr%3a') && trackUri.includes('sid=2')) { // Deezer Track
      const numbers = trackUri.match(/\d+/g);
      if (numbers && numbers.length >= 2) {
        return MetadataHelper.deezerMetadata('track', numbers[1], musicServiceRegion);
      }
    }

    const parts = trackUri.split(':');
    if ((parts.length === 3 || parts.length === 5) && parts[0] === 'spotify') {
      return MetadataHelper.guessSpotifyMetadata(trackUri, parts[1], musicServiceRegion);
    }

    if (parts.length === 3 && parts[0] === 'deezer') {
      return MetadataHelper.deezerMetadata(parts[1], parts[2], musicServiceRegion);
    }

    if (parts.length === 3 && parts[0] === 'apple') {
      return MetadataHelper.appleMetadata(parts[1], parts[2], musicServiceRegion);
    }

    if (parts.length === 2 && parts[0] === 'radio' && parts[1].startsWith('s')) {
      const [, stationId] = parts;
      track.UpnpClass = 'object.item.audioItem.audioBroadcast';
      track.Title = 'Some radio station';
      track.ItemId = '10092020_xxx_xxxx'; // Add station ID from url (regex?)
      track.TrackUri = `x-sonosapi-stream:${stationId}?sid=254&flags=8224&sn=0`;
      return track;
    }

    MetadataHelper.debug('Don\'t support this TrackUri (yet) %s', trackUri);
    return undefined;
  }

  private static guessSpotifyMetadata(trackUri: string, kind: string, spotifyRegion?: string): Track | undefined {
    const region = spotifyRegion ?? process.env.SONOS_REGION_SPOTIFY ?? '2311';
    const spotifyUri = trackUri.replace(/:/g, '%3a');
    const track: Track = {
      Title: '',
      CdUdn: `SA_RINCON${region}_X_#Svc${region}-0-Token`,
    };

    switch (kind) {
      case 'album':
        track.TrackUri = `x-rincon-cpcontainer:1004206c${spotifyUri}?sid=9&flags=8300&sn=7`;
        track.ItemId = `0004206c${spotifyUri}`;
        track.UpnpClass = 'object.container.album.musicAlbum';
        break;
      case 'artistRadio':
        track.TrackUri = `x-sonosapi-radio:${spotifyUri}?sid=9&flags=8300&sn=7`;
        track.ItemId = `100c206c${spotifyUri}`;
        track.Title = 'Artist radio';
        track.UpnpClass = 'object.item.audioItem.audioBroadcast.#artistRadio';
        track.ParentId = `10052064${spotifyUri.replace('artistRadio', 'artist')}`;
        break;
      case 'artistTopTracks':
        track.TrackUri = `x-rincon-cpcontainer:100e206c${spotifyUri}?sid=9&flags=8300&sn=7`;
        track.ItemId = `100e206c${spotifyUri}`;
        track.ParentId = `10052064${spotifyUri.replace('artistTopTracks', 'artist')}`;
        track.UpnpClass = 'object.container.playlistContainer';
        break;
      case 'playlist':
        track.TrackUri = `x-rincon-cpcontainer:1006206c${spotifyUri}?sid=9&flags=8300&sn=7`;
        track.ItemId = `1006206c${spotifyUri}`;
        track.Title = 'Spotify playlist';
        track.UpnpClass = 'object.container.playlistContainer';
        track.ParentId = '10fe2664playlists';
        break;
      case 'track':
        track.TrackUri = `x-sonos-spotify:${spotifyUri}?sid=9&amp;flags=8224&amp;sn=7`;
        track.ItemId = `00032020${spotifyUri}`;
        track.UpnpClass = 'object.item.audioItem.musicTrack';
        break;
      case 'user':
        track.TrackUri = `x-rincon-cpcontainer:10062a6c${spotifyUri}?sid=9&flags=10860&sn=7`;
        track.ItemId = `10062a6c${spotifyUri}`;
        track.Title = 'User\'s playlist';
        track.UpnpClass = 'object.container.playlistContainer';
        track.ParentId = '10082664playlists';
        break;
      default:
        MetadataHelper.debug('Don\'t support this Spotify uri %s', trackUri);
        return undefined;
    }
    return track;
  }

  private static deezerMetadata(kind: 'album' | 'artistTopTracks' | 'playlist' | 'track' | unknown, id: string, deezerRegion?: string): Track | undefined {
    const region = deezerRegion ?? process.env.SONOS_REGION_DEEZER ?? '519';
    const track: Track = {
      CdUdn: `SA_RINCON${region}_X_#Svc${region}-0-Token`,
    };
    switch (kind) {
      case 'album':
        track.TrackUri = `x-rincon-cpcontainer:1004006calbum-${id}?sid=2&flags=108&sn=23`;
        track.UpnpClass = 'object.container.album.musicAlbum.#HERO';
        track.ItemId = `1004006calbum-${id}`;
        break;
      case 'artistTopTracks':
        track.TrackUri = `x-rincon-cpcontainer:10fe206ctracks-artist-${id}?sid=2&flags=8300&sn=23`;
        track.UpnpClass = 'object.container.#DEFAULT';
        track.ItemId = `10fe206ctracks-artist-${id}`;
        break;
      case 'playlist':
        track.TrackUri = `x-rincon-cpcontainer:1006006cplaylist_spotify%3aplaylist-${id}?sid=2&flags=108&sn=23`;
        track.UpnpClass = 'object.container.playlistContainer.#DEFAULT';
        track.ItemId = `1006006cplaylist_spotify%3aplaylist-${id}`;
        break;
      case 'track':
        track.TrackUri = `x-sonos-http:tr:${id}.mp3?sid=2&flags=8224&sn=23`;
        track.UpnpClass = 'object.item.audioItem.musicTrack.#DEFAULT';
        track.ItemId = `10032020tr%3a${id}`;
        break;
      default:
        return undefined;
    }
    return track;
  }

  private static appleMetadata(kind: 'album' | 'libraryalbum' | 'track' | 'librarytrack' | 'song' | 'playlist' | 'libraryplaylist' | unknown,
    id: string, appleRegion?: string): Track | undefined {
    const region = appleRegion ?? process.env.SONOS_REGION_APPLE ?? '52231';
    const track: Track = {
      Title: '',
      CdUdn: `SA_RINCON${region}_X_#Svc${region}-0-Token`,
    };
    const trackLabels = { song: 'song', track: 'song', librarytrack: 'librarytrack' };
    switch (kind) {
      case 'album':
      case 'libraryalbum':
        track.TrackUri = `x-rincon-cpcontainer:1004206c${kind}:${id}?sid=204`;
        track.ItemId = `1004206c${kind}%3a${id}`;
        track.UpnpClass = 'object.item.audioItem.musicAlbum';
        track.ParentId = '00020000album%3a';
        break;
      case 'playlist':
      case 'libraryplaylist':
        track.TrackUri = `x-rincon-cpcontainer:1006206c${kind}:${id}?sid=204`;
        track.ItemId = `1006206c${kind}%3a${id}`;
        track.UpnpClass = 'object.container.playlistContainer';
        track.ParentId = '00020000playlist%3a';
        break;
      case 'track':
      case 'librarytrack':
      case 'song':
        track.TrackUri = `x-sonos-http:${trackLabels[kind]}:${id}.mp4?sid=204`;
        track.ItemId = `10032020${trackLabels[kind]}%3a${id}`;
        track.UpnpClass = 'object.item.audioItem.musicTrack';
        track.ParentId = '1004206calbum%3a';
        break;
      default:
        MetadataHelper.debug('Don\'t support this Apple Music kind %s', kind);
        return undefined;
    }
    return track;
  }

  private static GetUpnpClass(parentID: string): string {
    switch (parentID) {
      case 'A:ALBUMS':
        return 'object.item.audioItem.musicAlbum';
      case 'A:TRACKS':
        return 'object.item.audioItem.musicTrack';
      case 'A:ALBUMARTIST':
        return 'object.item.audioItem.musicArtist';
      case 'A:GENRE':
        return 'object.container.genre.musicGenre';
      case 'A:COMPOSER':
        return 'object.container.person.composer';
      default:
        return '';
    }
  }
}
