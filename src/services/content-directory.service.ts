/**
 * Sonos ContentDirectoryService
 *
 * Stephan van Rooij
 * https://svrooij.io
 *
 * This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 */
import BaseService from './base-service';
import ArrayHelper from '../helpers/array-helper';
import MetadataHelper from '../helpers/metadata-helper';
import XmlHelper from '../helpers/xml-helper';
import { SonosUpnpError } from '../models/sonos-upnp-error';
import SonosUpnpErrors from './sonos-upnp-errors';
import {
  BrowseResponse,
} from '../models';

/**
 * Browse for local content
 *
 * @export
 * @class ContentDirectoryServiceBase
 * @extends {BaseService}
 */
export class ContentDirectoryServiceBase extends BaseService<ContentDirectoryServiceEvent> {
  readonly serviceNane: string = 'ContentDirectory';

  readonly controlUrl: string = '/MediaServer/ContentDirectory/Control';

  readonly eventSubUrl: string = '/MediaServer/ContentDirectory/Event';

  readonly scpUrl: string = '/xml/ContentDirectory1.xml';

  /**
   * Default errors and service specific errors
   *
   * @type {SonosUpnpError[]}
   * @remarks See https://svrooij.io/sonos-api-docs/#manual-documentation-file
   */
  readonly errors: SonosUpnpError[] = [
    ...SonosUpnpErrors.defaultErrors,
    { code: 701, description: 'No such object' },
    { code: 702, description: 'Invalid CurrentTagValue' },
    { code: 703, description: 'Invalid NewTagValue' },
    { code: 704, description: 'Required tag' },
    { code: 705, description: 'Read-only tag' },
    { code: 706, description: 'Parameter mismatch' },
    { code: 708, description: 'Invalid search criteria' },
    { code: 709, description: 'Invalid sort criteria' },
    { code: 710, description: 'No such container' },
    { code: 711, description: 'Restricted object' },
    { code: 712, description: 'Bad metadata' },
    { code: 713, description: 'Restricted parent object' },
    { code: 714, description: 'No such source resource' },
    { code: 715, description: 'Resource access denied' },
    { code: 716, description: 'Transfer busy' },
    { code: 717, description: 'No such file transfer' },
    { code: 718, description: 'No such destination resource' },
    { code: 719, description: 'Destinaton resource access denied' },
    { code: 720, description: 'Cannot process the request' },
  ];

  // #region actions
  /**
   * Browse for content, see BrowseParsed for a better experience.
   *
   * @param {string} input.ObjectID - The search query, ['A:ARTIST','A:ALBUMARTIST','A:ALBUM','A:GENRE','A:COMPOSER','A:TRACKS','A:PLAYLISTS'] with optionally ':search+query' behind it.
   * @param {string} input.BrowseFlag - How to browse [ 'BrowseMetadata' / 'BrowseDirectChildren' ]
   * @param {string} input.Filter - Which fields should be returned '*' for all.
   * @param {number} input.StartingIndex - Paging, where to start
   * @param {number} input.RequestedCount - Paging, number of items
   * @param {string} input.SortCriteria - Sort the results based on metadata fields. '+upnp:artist,+dc:title' for sorting on artist then on title.
   */
  async Browse(input: { ObjectID: string; BrowseFlag: string; Filter: string; StartingIndex: number; RequestedCount: number; SortCriteria: string }):
  Promise<BrowseResponse> { return await this.SoapRequestWithBody<typeof input, BrowseResponse>('Browse', input); }

  async CreateObject(input: { ContainerID: string; Elements: string }):
  Promise<CreateObjectResponse> { return await this.SoapRequestWithBody<typeof input, CreateObjectResponse>('CreateObject', input); }

  async DestroyObject(input: { ObjectID: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('DestroyObject', input); }

  async FindPrefix(input: { ObjectID: string; Prefix: string }):
  Promise<FindPrefixResponse> { return await this.SoapRequestWithBody<typeof input, FindPrefixResponse>('FindPrefix', input); }

  async GetAlbumArtistDisplayOption():
  Promise<GetAlbumArtistDisplayOptionResponse> { return await this.SoapRequest<GetAlbumArtistDisplayOptionResponse>('GetAlbumArtistDisplayOption'); }

  async GetAllPrefixLocations(input: { ObjectID: string }):
  Promise<GetAllPrefixLocationsResponse> { return await this.SoapRequestWithBody<typeof input, GetAllPrefixLocationsResponse>('GetAllPrefixLocations', input); }

  async GetBrowseable():
  Promise<GetBrowseableResponse> { return await this.SoapRequest<GetBrowseableResponse>('GetBrowseable'); }

  async GetLastIndexChange():
  Promise<GetLastIndexChangeResponse> { return await this.SoapRequest<GetLastIndexChangeResponse>('GetLastIndexChange'); }

  async GetSearchCapabilities():
  Promise<GetSearchCapabilitiesResponse> { return await this.SoapRequest<GetSearchCapabilitiesResponse>('GetSearchCapabilities'); }

  async GetShareIndexInProgress():
  Promise<GetShareIndexInProgressResponse> { return await this.SoapRequest<GetShareIndexInProgressResponse>('GetShareIndexInProgress'); }

  async GetSortCapabilities():
  Promise<GetSortCapabilitiesResponse> { return await this.SoapRequest<GetSortCapabilitiesResponse>('GetSortCapabilities'); }

  async GetSystemUpdateID():
  Promise<GetSystemUpdateIDResponse> { return await this.SoapRequest<GetSystemUpdateIDResponse>('GetSystemUpdateID'); }

  async RefreshShareIndex(input: { AlbumArtistDisplayOption: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('RefreshShareIndex', input); }

  async RequestResort(input: { SortOrder: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('RequestResort', input); }

  async SetBrowseable(input: { Browseable: boolean }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetBrowseable', input); }

  async UpdateObject(input: { ObjectID: string; CurrentTagValue: string; NewTagValue: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('UpdateObject', input); }
  // #endregion

  protected responseProperties(): {[key: string]: string} {
    return {
      Result: 'string',
      NumberReturned: 'number',
      TotalMatches: 'number',
      UpdateID: 'number',
      ObjectID: 'string',
      StartingIndex: 'number',
      AlbumArtistDisplayOption: 'string',
      TotalPrefixes: 'number',
      PrefixAndIndexCSV: 'string',
      IsBrowseable: 'boolean',
      LastIndexChange: 'string',
      SearchCaps: 'string',
      IsIndexing: 'boolean',
      SortCaps: 'string',
      Id: 'number',
    };
  }

  // Event properties from service description.
  protected eventProperties(): {[key: string]: string} {
    return {
      Browseable: 'boolean',
      ContainerUpdateIDs: 'string',
      FavoritePresetsUpdateID: 'string',
      FavoritesUpdateID: 'string',
      RadioFavoritesUpdateID: 'number',
      RadioLocationUpdateID: 'number',
      RecentlyPlayedUpdateID: 'string',
      SavedQueuesUpdateID: 'string',
      SearchCapabilities: 'string',
      ShareIndexInProgress: 'boolean',
      ShareIndexLastError: 'string',
      ShareListUpdateID: 'string',
      SortCapabilities: 'string',
      SystemUpdateID: 'number',
      UserRadioUpdateID: 'string',
    };
  }
}

// Generated responses
export interface CreateObjectResponse {
  ObjectID: string;
  Result: string;
}

export interface FindPrefixResponse {
  StartingIndex: number;
  UpdateID: number;
}

export interface GetAlbumArtistDisplayOptionResponse {
  AlbumArtistDisplayOption: string;
}

export interface GetAllPrefixLocationsResponse {
  TotalPrefixes: number;
  PrefixAndIndexCSV: string;
  UpdateID: number;
}

export interface GetBrowseableResponse {
  IsBrowseable: boolean;
}

export interface GetLastIndexChangeResponse {
  LastIndexChange: string;
}

export interface GetSearchCapabilitiesResponse {
  SearchCaps: string;
}

export interface GetShareIndexInProgressResponse {
  IsIndexing: boolean;
}

export interface GetSortCapabilitiesResponse {
  SortCaps: string;
}

export interface GetSystemUpdateIDResponse {
  Id: number;
}

// Strong type event
export interface ContentDirectoryServiceEvent {
  Browseable?: boolean;
  ContainerUpdateIDs?: string;
  FavoritePresetsUpdateID?: string;
  FavoritesUpdateID?: string;
  RadioFavoritesUpdateID?: number;
  RadioLocationUpdateID?: number;
  RecentlyPlayedUpdateID?: string;
  SavedQueuesUpdateID?: string;
  SearchCapabilities?: string;
  ShareIndexInProgress?: boolean;
  ShareIndexLastError?: string;
  ShareListUpdateID?: string;
  SortCapabilities?: string;
  SystemUpdateID?: number;
  UserRadioUpdateID?: string;
}

/**
 * Browse for local content
 *
 * @export
 * @class ContentDirectoryService
 * @extends {ContentDirectoryServiceBase}
 */
export class ContentDirectoryService extends ContentDirectoryServiceBase {
  /**
   * Browse or search content directory
   *
   * @param {string} input.ObjectID The search query, ['A:ARTIST','A:ALBUMARTIST','A:ALBUM','A:GENRE','A:COMPOSER','A:TRACKS','A:PLAYLISTS'] with optionally ':search+query' behind it.
   * @param {string} input.BrowseFlag How to browse [ BrowseMetadata,BrowseDirectChildren ]
   * @param {string} input.Filter Which fields should be returned '*' for all.
   * @param {number} input.StartingIndex Where to start in the results, (could be used for paging)
   * @param {number} input.RequestedCount How many items should be returned, 0 for all.
   * @param {string} input.SortCriteria Sort the results based on metadata fields. '+upnp:artist,+dc:title' for sorting on artist then on title.
   * @returns {Promise<BrowseResponse>}
   * @memberof ContentDirectoryService
   * @see http://www.upnp.org/specs/av/UPnP-av-ContentDirectory-v1-Service.pdf
   */
  async BrowseParsed(input: { ObjectID: string; BrowseFlag: string; Filter: string; StartingIndex: number; RequestedCount: number; SortCriteria: string }): Promise<BrowseResponse> {
    const resp = await this.Browse(input);
    if (typeof resp.Result === 'string' && resp.NumberReturned > 0) {
      const parsedData = XmlHelper.DecodeAndParseXml(resp.Result)['DIDL-Lite'];
      const itemObject = parsedData.item || parsedData.container;
      const items = ArrayHelper.ForceArray(itemObject);
      resp.Result = items.map((i: any) => MetadataHelper.ParseDIDLTrack(i, this.host, this.port));
    }
    return resp;
  }

  /**
   * Same as BrowseParsed but with all parameters set to default.
   *
   * @param {string} ObjectID The search query, ['A:ARTIST','A:ALBUMARTIST','A:ALBUM','A:GENRE','A:COMPOSER','A:TRACKS','A:PLAYLISTS'] with optionally ':search+query' behind it.
   * @returns {Promise<BrowseResponse>}
   * @memberof SonosDevice
   */
  public async BrowseParsedWithDefaults(ObjectID: string): Promise<BrowseResponse> {
    return await this.BrowseParsed({
      ObjectID, BrowseFlag: 'BrowseDirectChildren', Filter: '*', StartingIndex: 0, RequestedCount: 0, SortCriteria: '',
    });
  }
}
