import ArrayHelper from '../helpers/array-helper';
import MetadataHelper from '../helpers/metadata-helper';
import XmlHelper from '../helpers/xml-helper';
import { BrowseResponse, Track } from '../models';
import { ContentDirectoryServiceBase } from './content-directory.service';

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
      const parsedData = (XmlHelper.DecodeAndParseXml(resp.Result) as {[key: string]: any})['DIDL-Lite'];
      const itemObject = parsedData.item || parsedData.container;
      const items = ArrayHelper.ForceArray(itemObject);
      resp.Result = items
        .map((i: any) => MetadataHelper.ParseDIDLTrack(i, this.host, this.port))
        .filter((i) => typeof i !== 'undefined') as Track[];
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
