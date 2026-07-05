/**
 * Sonos Queue service
 *
 * Stephan van Rooij
 * https://svrooij.io
 *
 * This file is generated, do not edit manually. https://sonos.svrooij.io/
 */
import BaseService from './base-service';
import { SonosUpnpError } from '../models/sonos-upnp-error';
import SonosUpnpErrors from './sonos-upnp-errors';
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

  readonly errors: SonosUpnpError[] = SonosUpnpErrors.defaultErrors;

  // #region actions
  AddMultipleURIs(input: { QueueID: number; UpdateID: number; ContainerURI: string; ContainerMetaData: Track | string; DesiredFirstTrackNumberEnqueued: number; EnqueueAsNext: boolean; NumberOfURIs: number; EnqueuedURIsAndMetaData: string }):
  Promise<AddMultipleURIsResponse> { return this.SoapRequestWithBody<typeof input, AddMultipleURIsResponse>('AddMultipleURIs', input); }

  AddURI(input: { QueueID: number; UpdateID: number; EnqueuedURI: string; EnqueuedURIMetaData: Track | string; DesiredFirstTrackNumberEnqueued: number; EnqueueAsNext: boolean }):
  Promise<AddURIResponse> { return this.SoapRequestWithBody<typeof input, AddURIResponse>('AddURI', input); }

  AttachQueue(input: { QueueOwnerID: string }):
  Promise<AttachQueueResponse> { return this.SoapRequestWithBody<typeof input, AttachQueueResponse>('AttachQueue', input); }

  Backup():
  Promise<boolean> { return this.SoapRequestNoResponse('Backup'); }

  Browse(input: { QueueID: number; StartingIndex: number; RequestedCount: number }):
  Promise<BrowseResponse> { return this.SoapRequestWithBody<typeof input, BrowseResponse>('Browse', input); }

  CreateQueue(input: { QueueOwnerID: string; QueueOwnerContext: string; QueuePolicy: string }):
  Promise<CreateQueueResponse> { return this.SoapRequestWithBody<typeof input, CreateQueueResponse>('CreateQueue', input); }

  RemoveAllTracks(input: { QueueID: number; UpdateID: number }):
  Promise<RemoveAllTracksResponse> { return this.SoapRequestWithBody<typeof input, RemoveAllTracksResponse>('RemoveAllTracks', input); }

  RemoveTrackRange(input: { QueueID: number; UpdateID: number; StartingIndex: number; NumberOfTracks: number }):
  Promise<RemoveTrackRangeResponse> { return this.SoapRequestWithBody<typeof input, RemoveTrackRangeResponse>('RemoveTrackRange', input); }

  ReorderTracks(input: { QueueID: number; StartingIndex: number; NumberOfTracks: number; InsertBefore: number; UpdateID: number }):
  Promise<ReorderTracksResponse> { return this.SoapRequestWithBody<typeof input, ReorderTracksResponse>('ReorderTracks', input); }

  ReplaceAllTracks(input: { QueueID: number; UpdateID: number; ContainerURI: string; ContainerMetaData: Track | string; CurrentTrackIndex: number; NewCurrentTrackIndices: string; NumberOfURIs: number; EnqueuedURIsAndMetaData: string }):
  Promise<ReplaceAllTracksResponse> { return this.SoapRequestWithBody<typeof input, ReplaceAllTracksResponse>('ReplaceAllTracks', input); }

  SaveAsSonosPlaylist(input: { QueueID: number; Title: string; ObjectID: string }):
  Promise<SaveAsSonosPlaylistResponse> { return this.SoapRequestWithBody<typeof input, SaveAsSonosPlaylistResponse>('SaveAsSonosPlaylist', input); }
  // #endregion

  protected responseProperties(): { [key: string]: string } {
    return {
      FirstTrackNumberEnqueued: 'number',
      NumTracksAdded: 'number',
      NewQueueLength: 'number',
      NewUpdateID: 'number',
      QueueID: 'number',
      QueueOwnerContext: 'string',
      Result: 'string',
      NumberReturned: 'number',
      TotalMatches: 'number',
      UpdateID: 'number',
      AssignedObjectID: 'string',
    };
  }

  // Event properties from service description.
  protected eventProperties(): { [key: string]: string } {
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
