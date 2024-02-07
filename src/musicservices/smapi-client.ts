import fetch from 'node-fetch';
import debug, { Debugger } from 'debug';
import SmapiError from './smapi-error';
import ArrayHelper from '../helpers/array-helper';
import XmlHelper from '../helpers/xml-helper';

/**
 * Options to create a sonos music api client.
 *
 * @param {string} name Name of music service, display only
 * @param {string} url SOAP endpoint of music service
 * @param {number} serviceId The ID of the service, take from the sonos internal list.
 * @param {string} auth Authentication requirements, take from the sonos internal list. Authentication logic depends on it.
 * @param {string} deviceId DeviceID is used from authentication, take from SystemPropertiesService.GetString 'R_TrialZPSerial'
 * @param {string} timezone Timezone is send to remote service, used for contextual things? Defaults to '+01:00'
 * @param {string} householdId HouseholdId is used from authentication, take from DevicePropertiesService.GetHouseholdID().CurrentHouseholdID
 * @param {string} key private key is used for authentication (not sure how to fetch this from sonos)
 * @param {string} authToken authToken is used for authentication (not sure how to fetch from sonos)
 *
 * @export
 * @interface SmapiClientOptions
 */
export interface SmapiClientOptions {
  name: string;
  url: string;
  serviceId: number;
  auth: 'Anonymous' | 'AppLink' | 'DeviceLink' | 'UserId';
  deviceId?: string;
  timezone?: string;
  householdId?: string;
  key?: string;
  authToken?: string;
  saveNewAccount?: SaveNemAccountHandler;
}

declare type SaveNemAccountHandler = (serviceId: number, key: string, token: string) => Promise<void>;

export interface MediaList {
  index: number;
  count: number;
  total: number;
  mediaMetadata?: MediaMetadata[];
  mediaCollection?: MediaItem[];
}

export interface Media {
  id: string;
  itemType: string;
  title: string;
}

export interface MediaMetadata extends Media {
  summary?: string;
  trackUri?: string;
}

export interface MediaItem extends Media {
  albumArtURI: string;
  canEnumerate: boolean;
  canPlay: boolean;
  displayType: string;
}

export interface DeviceLink {
  regUrl: string;
  linkCode: string;
  showLinkCode: boolean;
}

export interface AppLinkResponse {
  authorizeAccount?: {
    appUrlStringId: string;
    deviceLink: DeviceLink
  };
  createAccount?: {
    appUrlStringId: string;
  }
}

export interface DeviceAuthResponse {
  authToken: string;
  privateKey: string;
  userInfo?: {
    accountTier?: 'paidPremium' | string;
    nickname?: string;
    userIdHashCode?: string;
  }
}

export enum SmapiClientErrors {
  TokenRefreshRequiredError = 'tokenRefreshRequired',
}

/**
 * Sonos mucis service client, use GetMetadata as a starting point.
 *
 * @export
 * @remarks You shouldn't initialize yourself, take the one from sonos.MusicServicesClient('serviceName') because you'll need a lot of data know by sonos only.
 * @class SmapiClient
 */
export class SmapiClient {
  private readonly options: SmapiClientOptions;

  private debugger?: Debugger;

  private key?: string;

  private authToken?: string;

  protected get debug(): Debugger {
    if (this.debugger === undefined) this.debugger = debug(`sonos:smapi:${this.options.name}`);
    return this.debugger;
  }

  constructor(options: SmapiClientOptions) {
    this.options = options;
    this.key = options.key;
    this.authToken = options.authToken;
  }

  public async GetLoginLink(): Promise<DeviceLink> {
    if (this.options.auth === 'AppLink') {
      const appLink = await this.GetAppLink();
      if (appLink.authorizeAccount !== undefined) {
        return appLink.authorizeAccount?.deviceLink;
      }
    }

    if (this.options.auth === 'DeviceLink') {
      return await this.GetDeviceLinkCode();
    }

    throw new Error('Login not supported for this service');
  }

  /**
   * Get the AppLink for this music service, to connect it to your sonos system.
   * Only for services with Auth == 'AppLink'
   *
   * @returns {Promise<AppLinkResponse>}
   * @memberof SmapiClient
   */
  public async GetAppLink(): Promise<AppLinkResponse> {
    return await this.SoapRequestWithBody<any, AppLinkResponse>('getAppLink',
      {
        householdId: this.getHouseholdIdOrThrow(),
      });
  }

  /**
   * Get credentials for the remote service, you'll need the linkcode from GetAppLink
   *
   * @param {string} linkCode
   * @returns
   * @memberof SmapiClient
   */
  public async GetDeviceAuthToken(linkCode: string): Promise<DeviceAuthResponse> {
    return await this.SoapRequestWithBody<any, DeviceAuthResponse>('getDeviceAuthToken',
      {
        householdId: this.getHouseholdIdOrThrow(),
        linkCode,
        linkDeviceId: this.options.deviceId,
      })
      .then(async (data) => {
        if (this.options.saveNewAccount !== undefined) { // Save the account by the library provided way.
          await this.options.saveNewAccount(this.options.serviceId, data.privateKey, data.authToken);
        }
        return data;
      });
  }

  public async GetDeviceLinkCode(): Promise<DeviceLink> {
    return await this.SoapRequestWithBody<any, DeviceLink>('getDeviceLinkCode',
      {
        householdId: this.getHouseholdIdOrThrow(),
      });
  }

  /**
   * This is the main entrypoint for the external Music service.
   * You can browse lists, sometimes referring to other lists.
   *
   * @param {string} input.id The ID where you want the media info for. 'root' for the initial list.
   * @param {number} input.index Where you want to start in the list, 0 is a good start.
   * @param {number} input.count How many items you want, use something sensible like 10.
   * @param {boolean?} input.recursive optional, If true, the music service should return a flat collection of track metadata.
   * @returns {Promise<any>}
   * @memberof SmapiClient
   */
  public async GetMetadata(input: { id: string; index: number; count: number; recursive: boolean; }) : Promise<MediaList> {
    return await this.SoapRequestWithBody('getMetadata', input).then((resp: any) => this.PostProcessMediaResult(resp));
  }

  public async GetExtendedMetadata(input: { id: string }): Promise<MediaList> {
    return await this.SoapRequestWithBody('getExtendedMetadata', input).then((resp: any) => this.PostProcessMediaResult(resp));
  }

  public async GetMediaMetadata(input: { id: string }): Promise<any> {
    return await this.SoapRequestWithBody('getMediaMetadata', input);
  }

  public async GetMediaUri(input: { id: string }): Promise<any> {
    return await this.SoapRequestWithBody('getMediaURI', input);
  }

  public async Search(input: { id: string; term: string; index: number; count: number }): Promise<MediaList> {
    return await this.SoapRequestWithBody<any, any>('search', input).then((resp: any) => this.PostProcessMediaResult(resp));
  }

  private PostProcessMediaResult(input: any): MediaList {
    const result: MediaList = {
      index: input.index,
      count: input.count,
      total: input.total,
      mediaMetadata: undefined,
      mediaCollection: undefined,
    };

    if (input.mediaMetadata !== undefined) {
      result.mediaMetadata = ArrayHelper.ForceArray<MediaMetadata>(input.mediaMetadata);
      result.mediaMetadata = result.mediaMetadata.map((m) => {
        const withTrack = m;
        if (m.itemType === 'stream') withTrack.trackUri = `x-sonosapi-stream:${m.id}?sid=${this.options.serviceId}`;
        return withTrack;
      });
    }

    if (input.mediaCollection !== undefined) {
      result.mediaCollection = ArrayHelper.ForceArray<MediaItem>(input.mediaCollection);
    }

    return result;
  }

  // #region Private server stuff
  private async SoapRequest<TResponse>(action: string, isRetryWithNewCredentials = false): Promise<TResponse> {
    this.debug('%s()', action);
    try {
      return await this.handleRequestAndParseResponse<object, TResponse>(undefined, action);
    } catch (err) {
      if (err instanceof SmapiError && (err.Fault as any).faultstring === SmapiClientErrors.TokenRefreshRequiredError && !isRetryWithNewCredentials) {
        return await this.SoapRequest<TResponse>(action, true);
      }
      throw err;
    }
  }

  private async SoapRequestWithBody<TBody, TResponse>(action: string, body: TBody, isRetryWithNewCredentials = false): Promise<TResponse> {
    this.debug('%s(%o)', action, body);
    try {
      return await this.handleRequestAndParseResponse<TBody, TResponse>(body, action);
    } catch (err) {
      if (err instanceof SmapiError && (err.Fault as any).faultstring === SmapiClientErrors.TokenRefreshRequiredError && !isRetryWithNewCredentials) {
        return await this.SoapRequestWithBody<TBody, TResponse>(action, body, true);
      }
      throw err;
    }
  }

  private async handleRequestAndParseResponse<TBody, TResponse>(requestBody: TBody | undefined, action: string, isRetryWithNewCredentials = false): Promise<TResponse> {
    const response = await fetch(this.options.url, {
      method: 'POST',
      headers: {
        SOAPAction: this.messageAction(action),
        'Content-type': 'text/xml; charset=utf-8',
        'Accept-Language': 'en-US',
        'Accept-Encoding': 'gzip, deflate',
        'User-Agent': 'Linux UPnP/1.0 Sonos/29.3-87071 (ICRU_iPhone7,1); iOS/Version 8.2 (Build 12D508)',
      },
      body: this.generateRequestBody<TBody>(action, requestBody),
    });
    // if (!response.ok) {
    //   this.debug('handleRequest error %d %s', response.status, response.statusText);
    //   throw new Error(`Http status ${response.status} (${response.statusText})`);
    // }

    const result = XmlHelper.ParseXml(await response.text(), true) as any;
    if (!result || !result.Envelope || !result.Envelope.Body) {
      this.debug('Invalid response for %s %o', action, result);
      throw new Error(`Invalid response for ${action}: ${result}`);
    }
    if (typeof result.Envelope.Body.Fault !== 'undefined') {
      const fault = result.Envelope.Body.Fault;
      if (!isRetryWithNewCredentials && fault.faultstring === 'tokenRefreshRequired') {
        this.debug('Saving new tokens');
        // Set new tokens, maybe result in event?
        this.authToken = fault.detail?.refreshAuthTokenResult?.authToken;
        this.key = fault.detail?.refreshAuthTokenResult?.privateKey;

        // this.debug('New authToken: %s', this.authToken);
        // this.debug('New private key: %s', this.key);
        if (this.options.saveNewAccount !== undefined && this.key && this.authToken) {
          await this.options.saveNewAccount(this.options.serviceId, this.key, this.authToken);
        }
      }
      this.debug('Soap error %s %o', action, fault);
      throw new SmapiError(this.options.name, action, fault);
    }
    this.debug('handleRequest success');
    const body = result.Envelope.Body[`${action}Response`];
    return body[`${action}Result`] ?? body;
  }

  private messageAction(action: string): string {
    return `"http://www.sonos.com/Services/1.1#${action}"`;
  }

  private generateRequestBody<TBody>(action: string, body?: TBody): string {
    const soapHeader = this.generateSoapHeader();
    const soapBody = this.generateSoapBody<TBody>(action, body);
    return this.generateSoapEnvelope([soapHeader, soapBody]);
  }

  private generateSoapBody<TBody>(action: string, body?: TBody): string {
    let messageBody = `<soap:Body>\r\n<s:${action}>`;
    if (body) {
      Object.entries(body).forEach((v) => {
        // Deconstruct v into key and value.
        const [key, value] = v;
        if (typeof value === 'boolean') messageBody += `<s:${key}>${value === true ? '1' : '0'}</s:${key}>`;
        else messageBody += `<s:${key}>${value}</s:${key}>`;
      });
    }
    messageBody += `</s:${action}>\r\n</soap:Body>`;
    return messageBody;
  }

  private getHouseholdIdOrThrow(): string {
    if (this.options.householdId === undefined) {
      throw new Error('options.householdId is undefined, fetch from DevicePropertiesService.GetHouseholdID');
    }
    return this.options.householdId;
  }

  private generateCredentialHeader(options: { deviceId?: string; deviceCert?: string; zonePlayerId?: string; } = {}): string {
    let header = '  <s:credentials>\r\n';

    if (options.deviceId !== undefined) {
      header += `    <s:deviceId>${options.deviceId}</s:deviceId>\r\n`;
    }

    if (options.deviceCert !== undefined) {
      header += `    <s:deviceCert>${options.deviceCert}</s:deviceCert>\r\n`;
    }

    if (options.zonePlayerId !== undefined) {
      header += `    <s:zonePlayerId>${options.zonePlayerId}</s:zonePlayerId>\r\n`;
    }

    header += '    <s:deviceProvider>Sonos</s:deviceProvider>\r\n';

    // if (options.loginToken !== undefined) {
    if (this.options.auth === 'DeviceLink' || this.options.auth === 'AppLink') {
      header += `    <s:loginToken>
      <s:token>${this.authToken ?? ''}</s:token>
      <s:key>${this.key ?? ''}</s:key>
      <s:householdId>${this.getHouseholdIdOrThrow()}</s:householdId>
    </s:loginToken>\r\n`;
    }

    header += '  </s:credentials>';
    return header;
  }

  private generateContextHeader(timezone: string): string { //  filterExplicit = false
    return `  <s:context>
      <s:timeZone>${timezone}</s:timeZone>
    </s:context>`;
  //       <contentFiltering><explicit>${filterExplicit}</explicit></contentFiltering>
  }

  private generateSoapHeader(): string {
    let header = '<soap:Header>\r\n';
    header += `${this.generateContextHeader(this.options.timezone || '+01:00')}\r\n`;
    header += this.generateCredentialHeader({ deviceId: this.options.deviceId });
    header += '</soap:Header>';
    return header;
  }

  private generateSoapEnvelope(content: string[]): string {
    let body = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:s="http://www.sonos.com/Services/1.1">\r\n';
    content.forEach((c) => {
      body += `${c}\r\n`;
    });
    body += '</soap:Envelope>';
    // this.debug('Soap envelop\r\n%s', body);
    return body;
  }
  // #endregion
}
