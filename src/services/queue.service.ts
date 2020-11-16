/**
 * Sonos QueueService
 *
 * Stephan van Rooij
 * https://svrooij.io
 *
 * This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 */
import BaseService from './base-service';
import {
  BrowseResponse, Track,
} from '../models';

/**
 * Modify and browse queues
 *
 * @export
 * @class QueueService
 * @extends {BaseService}
 */
export class QueueService extends BaseService<QueueServiceEvent> {
  readonly serviceNane: string = 'Queue';

  readonly controlUrl: string = '/MediaRenderer/Queue/Control';

  readonly eventSubUrl: string = '/MediaRenderer/Queue/Event';

  readonly scpUrl: string = '/xml/Queue1.xml';

  // #region actions
  async AddMultipleURIs(input: { QueueID: number; UpdateID: number; ContainerURI: string; ContainerMetaData: Track | string; DesiredFirstTrackNumberEnqueued: number; EnqueueAsNext: boolean; NumberOfURIs: number; EnqueuedURIsAndMetaData: string }):
  Promise<AddMultipleURIsResponse> { return await this.SoapRequestWithBody<typeof input, AddMultipleURIsResponse>('AddMultipleURIs', input); }

  async AddURI(input: { QueueID: number; UpdateID: number; EnqueuedURI: string; EnqueuedURIMetaData: Track | string; DesiredFirstTrackNumberEnqueued: number; EnqueueAsNext: boolean }):
  Promise<AddURIResponse> { return await this.SoapRequestWithBody<typeof input, AddURIResponse>('AddURI', input); }

  async AttachQueue(input: { QueueOwnerID: string }):
  Promise<AttachQueueResponse> { return await this.SoapRequestWithBody<typeof input, AttachQueueResponse>('AttachQueue', input); }

  async Backup():
  Promise<boolean> { return await this.SoapRequestNoResponse('Backup'); }

  async Browse(input: { QueueID: number; StartingIndex: number; RequestedCount: number }):
  Promise<BrowseResponse> { return await this.SoapRequestWithBody<typeof input, BrowseResponse>('Browse', input); }

  async CreateQueue(input: { QueueOwnerID: string; QueueOwnerContext: string; QueuePolicy: string }):
  Promise<CreateQueueResponse> { return await this.SoapRequestWithBody<typeof input, CreateQueueResponse>('CreateQueue', input); }

  async RemoveAllTracks(input: { QueueID: number; UpdateID: number }):
  Promise<RemoveAllTracksResponse> { return await this.SoapRequestWithBody<typeof input, RemoveAllTracksResponse>('RemoveAllTracks', input); }

  async RemoveTrackRange(input: { QueueID: number; UpdateID: number; StartingIndex: number; NumberOfTracks: number }):
  Promise<RemoveTrackRangeResponse> { return await this.SoapRequestWithBody<typeof input, RemoveTrackRangeResponse>('RemoveTrackRange', input); }

  async ReorderTracks(input: { QueueID: number; StartingIndex: number; NumberOfTracks: number; InsertBefore: number; UpdateID: number }):
  Promise<ReorderTracksResponse> { return await this.SoapRequestWithBody<typeof input, ReorderTracksResponse>('ReorderTracks', input); }

  async ReplaceAllTracks(input: { QueueID: number; UpdateID: number; ContainerURI: string; ContainerMetaData: Track | string; CurrentTrackIndex: number; NewCurrentTrackIndices: string; NumberOfURIs: number; EnqueuedURIsAndMetaData: string }):
  Promise<ReplaceAllTracksResponse> { return await this.SoapRequestWithBody<typeof input, ReplaceAllTracksResponse>('ReplaceAllTracks', input); }

  async SaveAsSonosPlaylist(input: { QueueID: number; Title: string; ObjectID: string }):
  Promise<SaveAsSonosPlaylistResponse> { return await this.SoapRequestWithBody<typeof input, SaveAsSonosPlaylistResponse>('SaveAsSonosPlaylist', input); }
  // #endregion

  // Event properties from service description.
  protected eventProperties(): {[key: string]: string} {
    return {
      Curated: 'boolean',
      LastChange: 'string',
      UpdateID: 'number',
    };
  }
}

// Generated responses
export interface AddMultipleURIsResponse {
  FirstTrackNumberEnqueued: number;
  NumTracksAdded: number;
  NewQueueLength: number;
  NewUpdateID: number;
}

export interface AddURIResponse {
  FirstTrackNumberEnqueued: number;
  NumTracksAdded: number;
  NewQueueLength: number;
  NewUpdateID: number;
}

export interface AttachQueueResponse {
  QueueID: number;
  QueueOwnerContext: string;
}

export interface CreateQueueResponse {
  QueueID: number;
}

export interface RemoveAllTracksResponse {
  NewUpdateID: number;
}

export interface RemoveTrackRangeResponse {
  NewUpdateID: number;
}

export interface ReorderTracksResponse {
  NewUpdateID: number;
}

export interface ReplaceAllTracksResponse {
  NewQueueLength: number;
  NewUpdateID: number;
}

export interface SaveAsSonosPlaylistResponse {
  AssignedObjectID: string;
}

// Strong type event
export interface QueueServiceEvent {
  Curated?: boolean;
  LastChange?: string;
  UpdateID?: number;
}
