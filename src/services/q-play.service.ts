/**
 * Sonos QPlayService
 *
 * Stephan van Rooij
 * https://svrooij.io
 *
 * This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 */
import BaseService from './base-service';

export class QPlayService extends BaseService<undefined> {
  readonly serviceNane: string = 'QPlay';

  readonly controlUrl: string = '/QPlay/Control';

  readonly eventSubUrl: string = '/QPlay/Event';

  readonly scpUrl: string = '/xml/QPlay1.xml';

  // #region actions
  async QPlayAuth(input: { Seed: string }):
  Promise<QPlayAuthResponse> { return await this.SoapRequestWithBody<typeof input, QPlayAuthResponse>('QPlayAuth', input); }
  // #endregion

  // No properties in service description, throw error on retrieval.
  protected eventProperties(): {[key: string]: string} {
    throw new Error('No event properties in service definition');
  }
}

// Generated responses
export interface QPlayAuthResponse {
  Code: string;
  MID: string;
  DID: string;
}

