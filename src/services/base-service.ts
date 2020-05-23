import fetch, { Request, Response } from 'node-fetch';

import { parse } from 'fast-xml-parser';
import { Guid } from 'guid-typescript';
import { EventEmitter } from 'events';
import debug, { Debugger } from 'debug';
import StrictEventEmitter from 'strict-event-emitter-types';
import SoapHelper from '../helpers/soap-helper';
import XmlHelper from '../helpers/xml-helper';
import MetadataHelper from '../helpers/metadata-helper';
import SonosEventListener from '../sonos-event-listener';
import { ServiceEvents } from '../models/sonos-events';
import SonosError from '../models/sonos-error';
import HttpError from '../models/http-error';
import { ServiceEvent } from '../models/service-event';

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
        else messageBody += `<${key}>${value}</${key}>`;
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
        throw new SonosError(action, error.faultcode, error.faultstring, error.detail?.UPnPError?.errorCode);
      }
    }
    this.debug('handleRequest error %d %s', response.status, response.statusText);
    throw new HttpError(action, response.status, response.statusText);
  }

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
      if (k.indexOf('MetaData') > -1 || k.indexOf('URI') > -1) {
        const originalValue = input[k] as string;
        if (k.indexOf('MetaData') > -1) {
          output[k] = originalValue.startsWith('&lt;')
            ? MetadataHelper.ParseDIDLTrack(XmlHelper.DecodeAndParseXml(originalValue), this.host, this.port)
            : originalValue;
        } else {
          output[k] = XmlHelper.DecodeTrackUri(originalValue);
        }
      } else {
        output[k] = input[k];
      }
    });
    return output as TResponse;
  }
  // #endregion

  // #region Events
  private sid?: string;

  private eventRenewTimeout?: NodeJS.Timeout;

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
        if (this.events === undefined) return;
        const events = this.events.eventNames().filter((e) => e !== 'removeListener' && e !== 'newListener');
        if (this.sid !== undefined && events.length === 0) await this.cancelSubscription(this.sid);
      });
      this.events.on('newListener', async () => {
        this.debug('Listener added');
        if (this.sid === undefined && process.env.SONOS_DISABLE_EVENTS === undefined) {
          this.debug('Subscribing to events');
          const sid = await this.subscribeForEvents();
          SonosEventListener.DefaultInstance.RegisterSubscription(sid, this);
        }
      });
    }
    return this.events;
  }

  private async subscribeForEvents(): Promise<string> {
    const callback = SonosEventListener.DefaultInstance.GetEndpoint(this.uuid, this.serviceNane);
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
    this.eventRenewTimeout = setTimeout(async () => {
      if (this.sid !== undefined) {
        await this.renewEventSubscription(this.sid);
      }
    }, 3500 * 1000);

    return sid;
  }

  private async renewEventSubscription(sid: string): Promise<boolean> {
    this.debug('Renewing event subscription');
    const resp = await fetch(new Request(
      `http://${this.host}:${this.port}${this.eventSubUrl}`,
      {
        method: 'SUBSCRIBE',
        headers: {
          SID: sid,
          Timeout: 'Second-3600',
        },
      },
    ));
    if (resp.ok) {
      this.debug('Renewed event subscription');
      this.eventRenewTimeout = setTimeout(async () => {
        if (this.sid !== undefined) await this.renewEventSubscription(this.sid);
      }, 3500 * 1000);
      return true;
    }

    this.debug('Renew event subscription failed, trying to resubscribe');
    const newSid = await this.subscribeForEvents();
    SonosEventListener.DefaultInstance.RegisterSubscription(newSid, this);
    return true;
  }

  private async cancelSubscription(sid: string): Promise<boolean> {
    this.debug('Cancelling event subscription');
    if (this.eventRenewTimeout !== undefined) clearTimeout(this.eventRenewTimeout);
    this.sid = undefined;
    const resp = await fetch(new Request(
      `http://${this.host}:${this.port}${this.eventSubUrl}`,
      {
        method: 'UNSUBSCRIBE',
        headers: {
          SID: sid,
        },
      },
    ));
    this.debug('Cancelled event subscription success %o', resp.ok);
    return resp.ok;
  }

  /**
   * Parse Event is used by the SonosEventListener and shouldn't be used by other people
   *
   * @param {string} xml Event request body, received from the SonosEventListener
   * @memberof BaseService
   */
  public ParseEvent(xml: string): void {
    this.debug('Got event');
    const rawBody = parse(xml, { attributeNamePrefix: '', ignoreNameSpace: true }).propertyset.property;
    this.Events.emit(ServiceEvents.Unprocessed, rawBody);
    if (rawBody.LastChange) {
      const rawEventWrapper = XmlHelper.DecodeAndParseXmlNoNS(rawBody.LastChange, '');
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

  protected ResolveEventPropertyValue(name: string, originalValue: any, type: string): any {
    if (name.indexOf('MetaData') > -1 && originalValue.startsWith('&lt;')) return MetadataHelper.ParseDIDLTrack(XmlHelper.DecodeAndParseXml(originalValue), this.host, this.port);

    if (typeof originalValue === 'string' && originalValue.startsWith('&lt;')) {
      return XmlHelper.DecodeAndParseXml(originalValue, '');
    }

    switch (type) {
      case 'number':
        return parseInt(originalValue, 10);
      case 'boolean':
        return originalValue === '1';
      default:
        return originalValue;
    }
  }

  protected abstract eventProperties(): {[key: string]: string};

  private cleanEventLastChange(input: any): TServiceEvent {
    const output: {[key: string]: any} = {};

    const inKeys = Object.keys(input).filter((k) => k !== 'val');
    const properties = this.eventProperties();
    const keys = Object.keys(properties).filter((k) => inKeys.indexOf(k) > -1);

    keys.forEach((k) => {
      const originalValue = input[k].val ?? input[k];
      if (originalValue === undefined || originalValue === '') return;
      output[k] = this.ResolveEventPropertyValue(k, originalValue, properties[k]);
    });

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
