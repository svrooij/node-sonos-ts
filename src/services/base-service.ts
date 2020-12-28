import fetch, { Request, Response } from 'node-fetch';

import { parse } from 'fast-xml-parser';
import { Guid } from 'guid-typescript';
import { EventEmitter } from 'events';
import debug, { Debugger } from 'debug';
import StrictEventEmitter from 'strict-event-emitter-types';
import SoapHelper from '../helpers/soap-helper';
import XmlHelper from '../helpers/xml-helper';
import { Track } from '../models/track';
import MetadataHelper from '../helpers/metadata-helper';
import SonosEventListener from '../sonos-event-listener';
import { ServiceEvent, ServiceEvents } from '../models/service-event';
import SonosError from '../models/sonos-error';
import HttpError from '../models/http-error';
import { SonosUpnpError } from '../models/sonos-upnp-error';

/**
 * Base Service class will handle all the requests to the sonos device.
 *
 * @description BaseService is used by all automatically generated services.
 * @export
 * @abstract
 * @class BaseService
 */
export default abstract class BaseService <TServiceEvent> {
  protected readonly host: string;

  protected readonly port: number;

  private debugger?: Debugger;

  protected get debug(): Debugger {
    if (this.debugger === undefined) this.debugger = debug(`sonos:service:${this.serviceNane.toLowerCase()}:${this.host}`);
    return this.debugger;
  }

  private events?: StrictEventEmitter<EventEmitter, ServiceEvent<TServiceEvent>>;

  /**
   * Control URL is the relative endpoint to send command to.
   *
   * @abstract
   * @type {string}
   * @memberof BaseService
   */
  abstract readonly controlUrl: string;

  /**
   * Event Subscription Url is the relative endpoint to enable notifications.
   *
   * @abstract
   * @type {string}
   * @memberof BaseService
   */
  abstract readonly eventSubUrl: string;

  /**
   * Scp Url is the relative endpoint where this service is described
   *
   * @abstract
   * @type {string}
   * @memberof BaseService
   */
  abstract readonly scpUrl: string;

  /**
   * Service Name is the name of the service, used in the commands
   *
   * @abstract
   * @type {string}
   * @memberof BaseService
   */
  abstract readonly serviceNane: string;

  /**
   * Possible errors for this service
   *
   * @abstract
   * @type {SonosUpnpError[]}
   * @memberof BaseService
   */
  abstract readonly errors: SonosUpnpError[];

  /**
   * Creates an instance of the implemented service.
   * @param {string} host The ip or the domainname of the sonos speaker
   * @param {number} [port=1400] The port of the sonos speaker (defaults to 1400)
   * @param {string} [uuid=Guid.create().toString()] The uuid of the speaker, used for grouping and events.
   * @memberof BaseService
   */
  constructor(host: string, port = 1400, private uuid: string = Guid.create().toString()) {
    this.host = host;
    this.port = port;
  }

  public get Host():string {
    return this.host;
  }

  public get Uuid(): string {
    return this.uuid;
  }

  // #region Protected requests handlers
  /**
   * SoapRequest will do a request that expects a Response
   *
   * @protected
   * @template TResponse
   * @param {string} action The action to call
   * @returns {Promise<TResponse>} Will return a promise of the requested response
   * @memberof BaseService
   */
  protected async SoapRequest<TResponse>(action: string): Promise<TResponse> {
    this.debug('%s()', action);
    return await this.handleRequestAndParseResponse<TResponse>(this.generateRequest<undefined>(action, undefined), action);
  }

  /**
   * SoapRequestWithBody will do a request that expects a Response
   *
   * @protected
   * @template TRequest
   * @template TResponse
   * @param {string} action The action to call
   * @param {TBody} body The request body parameters
   * @returns {Promise<TResponse>}
   * @memberof BaseService
   */
  protected async SoapRequestWithBody<TBody, TResponse>(action: string, body: TBody): Promise<TResponse> {
    this.debug('%s(%o)', action, body);
    return await this.handleRequestAndParseResponse<TResponse>(this.generateRequest<TBody>(action, body), action);
  }

  /**
   * SoapRequestNoResponse will do a request where it doesn't expect a Response
   *
   * @protected
   * @param {string} action The action to call
   * @returns {Promise<boolean>} boolean returns true if command is send succesfull and sonos responded with ok
   * @memberof BaseService
   */
  protected async SoapRequestNoResponse(action: string): Promise<boolean> {
    this.debug('%s()', action);
    return await this.handleRequest(this.generateRequest<undefined>(action, undefined), action);
  }

  /**
   * SoapRequestWithBodyNoResponse will do a request where it doesn't expect a Response
   *
   * @protected
   * @template TBody
   * @param {string} action The action to call
   * @param {TBody} body The request body parameters
   * @returns {Promise<boolean>} boolean returns true if command is send succesfull and sonos responded with ok
   * @memberof BaseService
   */
  protected async SoapRequestWithBodyNoResponse<TBody>(action: string, body: TBody): Promise<boolean> {
    this.debug('%s(%o)', action, body);
    return await this.handleRequest(this.generateRequest<TBody>(action, body), action);
  }
  // #endregion

  // #region Request builders
  private getUrl(): string {
    return `http://${this.host}:${this.port}${this.controlUrl}`;
  }

  private messageAction(action: string): string {
    return `"urn:schemas-upnp-org:service:${this.serviceNane}:1#${action}"`;
  }

  private generateRequest<TBody>(action: string, body: TBody): Request {
    return new Request(
      this.getUrl(),
      {
        method: 'POST',
        headers: {
          SOAPAction: this.messageAction(action),
          'Content-type': 'text/xml; charset=utf8',
        },
        body: this.generateRequestBody<TBody>(action, body),
      },
    );
  }

  /**
   * generateRequestBody will generate the request body, and to conversion from 'Track' to xml if needed
   *
   * @private
   * @template TBody
   * @param {string} action
   * @param {TBody} body
   * @returns {string}
   * @memberof BaseService
   */
  private generateRequestBody<TBody>(action: string, body: TBody): string {
    let messageBody = `<u:${action} xmlns:u="urn:schemas-upnp-org:service:${this.serviceNane}:1">`;
    if (body) {
      Object.entries(body).forEach((v) => {
        // Deconstruct v into key and value.
        const [key, value] = v;
        if (typeof value === 'object' && key.indexOf('MetaData') > -1) messageBody += `<${key}>${XmlHelper.EncodeXml(MetadataHelper.TrackToMetaData(value))}</${key}>`;
        else if (typeof value === 'string' && key.endsWith('URI')) messageBody += `<${key}>${XmlHelper.EncodeTrackUri(value)}</${key}>`;
        else if (typeof value === 'boolean') messageBody += `<${key}>${value === true ? '1' : '0'}</${key}>`;
        else messageBody += `<${key}>${value ?? ''}</${key}>`;
      });
    }
    messageBody += `</u:${action}>`;
    return SoapHelper.PutInEnvelope(messageBody);
  }
  // #endregion

  // #region Request handlers
  /**
   * handleRequest send the request to the device.
   *
   * @private
   * @param {Request} request the request to send
   * @returns {Promise<boolean>} boolean returns true if command is send succesfull and sonos responded with ok
   * @memberof BaseService
   */
  private async handleRequest(request: Request, action: string): Promise<boolean> {
    const response = await fetch(request);
    if (response.ok) {
      return true;
    }
    return await this.handleErrorResponse<boolean>(action, response);
  }

  /**
   * handleRequestAndParseResponse send the request to the device and parsed the result to the specified return type
   *
   * @private
   * @template TResponse
   * @param {Request} request the request to send
   * @param {string} action the action (used to parse the response)
   * @returns {Promise<TResponse>} a promise with the requested result
   * @memberof BaseService
   */
  private async handleRequestAndParseResponse<TResponse>(request: Request, action: string): Promise<TResponse> {
    const response = await fetch(request);
    const responseText = response.ok === true
      ? await response.text()
      : await this.handleErrorResponse<string>(action, response);

    const result = parse(responseText);
    if (!result || !result['s:Envelope']) {
      this.debug('Invalid response for %s %o', action, result);
      throw new Error(`Invalid response for ${action}: ${result}`);
    }
    return this.parseEmbeddedXml<TResponse>(result['s:Envelope']['s:Body'][`u:${action}Response`]);
  }

  /**
   * This method will handle the error responses, it will always throw an error, after debug output.
   *
   * @private
   * @template TResponse
   * @param {Response} response
   * @returns {Promise<TResponse>}
   * @memberof BaseService
   */
  private async handleErrorResponse<TResponse>(action: string, response: Response): Promise<TResponse> {
    const responseText = await response.text();
    if (responseText !== '') {
      const errorResponse = parse(responseText);
      if (typeof errorResponse['s:Envelope']['s:Body']['s:Fault'] !== 'undefined') {
        const error = errorResponse['s:Envelope']['s:Body']['s:Fault'];
        this.debug('Sonos error on %s %o', action, error);
        const upnpErrorCode = error.detail?.UPnPError?.errorCode as number | undefined;
        const upnpError = upnpErrorCode !== undefined ? this.errors.find((e) => e.code === upnpErrorCode) : undefined;
        throw new SonosError(action, error.faultcode, error.faultstring, upnpErrorCode, upnpError?.description);
      }
    }
    this.debug('handleRequest error %d %s', response.status, response.statusText);
    throw new HttpError(action, response.status, response.statusText);
  }

  protected abstract responseProperties(): {[key: string]: string};

  /**
   * parseEmbeddedXml will parse the value of some response properties
   *
   * @private
   * @template TResponse
   * @param {*} input The object with properties that have XML
   * @returns {TResponse}
   * @memberof BaseService
   */
  private parseEmbeddedXml<TResponse>(input: any): TResponse {
    const output: {[key: string]: any } = {};
    const keys = Object.keys(input);
    keys.forEach((k) => {
      output[k] = this.parseValue(k, input[k], this.responseProperties()[k]);
    });
    return output as TResponse;
  }

  protected parseValue(name: string, input: unknown, expectedType: string): Track | string | boolean | number | unknown {
    if (expectedType === 'Track | string' && typeof input === 'string') {
      if (input.startsWith('&lt;')) {
        return MetadataHelper.ParseDIDLTrack(XmlHelper.DecodeAndParseXml(input), this.host, this.port);
      }
      return undefined; // undefined is more appropriate, but that would be a breaking change.
    }

    if (name.indexOf('URI') > -1 && typeof input === 'string') {
      return input === '' ? undefined : XmlHelper.DecodeTrackUri(input);
    }

    switch (expectedType) {
      case 'boolean':
        return input === 1 || input === '1';
      case 'number':
        return typeof input === 'number' ? input : parseInt(input as string, 10);
      case 'string':
        return typeof input === 'string' && input === '' ? undefined : input;
      default:
        return input;
    }
  }
  // #endregion

  // #region Events
  private sid?: string;

  private eventRenewInterval?: NodeJS.Timeout;

  /**
   * Events allowes you access to the events generated by this service.
   *
   * @description The service will automatically subscribe to events when you first use this.
   * @readonly
   * @type {EventEmitter}
   * @memberof BaseService
   */
  public get Events(): StrictEventEmitter<EventEmitter, ServiceEvent<TServiceEvent>> {
    if (this.events === undefined) {
      this.events = new EventEmitter();
      this.events.on('removeListener', async () => {
        this.debug('Listener removed');

        const events = this.events?.eventNames().filter((e) => e !== 'removeListener' && e !== 'newListener');
        if (this.sid !== undefined && events?.length === 0) {
          await this.cancelSubscription()
            .catch((err) => {
              this.debug('Cancelling event subscription failed', err);
            });
        }
      });
      this.events.on('newListener', async () => {
        this.debug('Listener added');
        if (this.sid === undefined && process.env.SONOS_DISABLE_EVENTS === undefined) {
          this.debug('Subscribing to events');
          await this.subscribeForEvents()
            .catch((err) => {
              this.debug('Subscriping for events failed', err);
            });
        }
      });
    }
    return this.events;
  }

  /**
   * Subscribe to events of this service, is called automatically.
   *
   * @private
   * @remarks Do not call manually!!
   */
  private async subscribeForEvents(): Promise<boolean> {
    const callback = SonosEventListener.DefaultInstance.GetEndpoint(this.uuid, this.serviceNane);
    this.debug('Creating event subscription with callback: %s', callback);
    const resp = await fetch(new Request(
      `http://${this.host}:${this.port}${this.eventSubUrl}`,
      {
        method: 'SUBSCRIBE',
        headers: {
          callback: `<${callback}>`,
          NT: 'upnp:event',
          Timeout: 'Second-3600',
        },
      },
    ));
    const sid = resp.ok ? resp.headers.get('sid') as string : undefined;
    if (sid === undefined || sid === '') {
      throw new Error('No subscription id received');
    }
    this.sid = sid;
    if (this.eventRenewInterval === undefined) {
      this.eventRenewInterval = setInterval(async () => {
        await this.renewEventSubscription()
          .catch((err) => {
            this.debug('Renewing event subscription failed', err);
          });
      }, 600 * 1000); // Renew events every 10 minutes.
    }
    SonosEventListener.DefaultInstance.RegisterSubscription(sid, this);

    return true;
  }

  /**
   * Renew event subscription, is called automatically.
   *
   * @private
   * @remarks Do not call manually!!
   */
  private async renewEventSubscription(): Promise<boolean> {
    this.debug('Renewing event subscription');
    if (this.sid !== undefined) {
      const resp = await fetch(new Request(
        `http://${this.host}:${this.port}${this.eventSubUrl}`,
        {
          method: 'SUBSCRIBE',
          headers: {
            SID: this.sid,
            Timeout: 'Second-3600',
          },
        },
      ));
      if (resp.ok) {
        this.debug('Renewed event subscription');
        return true;
      }
    }

    this.debug('Renew event subscription failed, trying to resubscribe');
    await this.subscribeForEvents()
      .catch((err) => {
        this.debug('Subscriping for events failed', err);
      });
    return this.sid !== undefined;
  }

  /**
   * Unsubscribe to events of this service, is called automatically.
   *
   * @private
   * @remarks Do not call manually!!
   */
  private async cancelSubscription(): Promise<boolean> {
    this.debug('Cancelling event subscription');
    if (this.eventRenewInterval !== undefined) {
      clearInterval(this.eventRenewInterval);
    }

    if (this.sid !== undefined) {
      const resp = await fetch(new Request(
        `http://${this.host}:${this.port}${this.eventSubUrl}`,
        {
          method: 'UNSUBSCRIBE',
          headers: {
            SID: this.sid,
          },
        },
      ));
      SonosEventListener.DefaultInstance.UnregisterSubscription(this.sid);
      this.sid = undefined;
      this.debug('Cancelled event subscription success %o', resp.ok);
      return resp.ok;
    }

    this.debug('No subscription to cancel');
    return false;
  }

  /**
   * Force refresh the event subscription
   *
   * @returns {Promise<boolean>} returns true on success and false if you weren't listening for events.
   * @memberof BaseService
   */
  public async CheckEventListener(): Promise<boolean> {
    if (this.sid !== undefined) {
      return await this.renewEventSubscription();
    }
    return false;
  }

  /**
   * Parse Event called by the SonosEventListener, it will parse the xml and emit the right events
   *
   * @param {string} xml Event request body, received from the SonosEventListener
   * @memberof BaseService
   * @remarks Should not be called by anything other then SonosEventListener.
   */
  public ParseEvent(xml: string): void {
    this.debug('Got event');
    const rawBody = parse(xml, { attributeNamePrefix: '', ignoreNameSpace: true }).propertyset.property;
    this.Events.emit(ServiceEvents.Unprocessed, rawBody);
    if (rawBody.LastChange) {
      const rawEventWrapper = XmlHelper.DecodeAndParseXmlNoNS(rawBody.LastChange, '') as any;
      const rawEvent = rawEventWrapper.Event.InstanceID ? rawEventWrapper.Event.InstanceID : rawEventWrapper.Event;
      const parsedEvent = this.cleanEventLastChange(rawEvent);
      // console.log(rawEvent)
      this.Events.emit(ServiceEvents.Data, parsedEvent);
      // this.Events.emit(ServiceEvents.LastChange, parsedEvent)
    } else {
      const properties = Array.isArray(rawBody) ? rawBody : [rawBody];
      try {
        const parsedEvent = this.cleanEventBody(properties);
        this.Events.emit(ServiceEvents.Data, parsedEvent);
      } catch (e) {
        this.debug('Error %o', e);
      }

      // this.Events.emit(ServiceEvents.Data, parsedEvent)
    }
  }

  protected ResolveEventPropertyValue(name: string, originalValue: unknown, type: string): any {
    if (typeof originalValue === 'string' && originalValue.startsWith('&lt;')) {
      if (name.endsWith('MetaData')) {
        return MetadataHelper.ParseDIDLTrack(XmlHelper.DecodeAndParseXml(originalValue), this.host, this.port);
      }
      return XmlHelper.DecodeAndParseXml(originalValue, '');
    }

    switch (type) {
      case 'number':
        return typeof originalValue === 'number' ? originalValue : parseInt(originalValue as string, 10);
      case 'boolean':
        return originalValue === '1' || originalValue === 1;
      default:
        return originalValue;
    }
  }

  protected abstract eventProperties(): {[key: string]: string};

  private cleanEventLastChange(inputRaw: any): TServiceEvent {
    const input = Array.isArray(inputRaw) ? inputRaw[0] : inputRaw;
    const output: {[key: string]: any} = {};

    const inKeys = Object.keys(input).filter((k) => k !== 'val');
    const properties = this.eventProperties();
    const keys = Object.keys(properties).filter((k) => inKeys.indexOf(k) > -1);

    keys.forEach((k) => {
      const originalValue = input[k].val ?? input[k];
      if (originalValue === undefined || originalValue === '') return;
      output[k] = this.ResolveEventPropertyValue(k, originalValue, properties[k]);
    });

    if (Object.keys(output).length === 0) {
      const entries = Object.entries(input);
      if (entries.length === 1) {
        return this.cleanEventLastChange(entries[0][1]);
      }
    }

    return output as unknown as TServiceEvent;
  }

  private cleanEventBody(input: any[]): TServiceEvent {
    // const output: {[key: string]: any} = {};
    const temp: {[key: string]: string} = {};
    input.forEach((v) => {
      Object.keys(v)
        .forEach((k) => {
          temp[k] = v[k];
        });
    });

    return this.cleanEventLastChange(temp);
  }
  // #endregion
}
