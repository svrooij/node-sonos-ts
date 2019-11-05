import fetch from 'node-fetch'
import { Request } from 'node-fetch'
import { SoapHelper } from '../helpers/soap-helper'
import { XmlHelper } from '../helpers/xml-helper'
import { MetadataHelper } from '../helpers/metadata-helper'
import { parse } from 'fast-xml-parser'
import { Guid } from 'guid-typescript'
import { EventEmitter } from 'events'
import { SonosEventListener } from '../sonos-event-listener'

/**
 * Base Service class will handle all the requests to the sonos device.
 *
 * @description BaseService is used by all automatically generated services.
 * @export
 * @abstract
 * @class BaseService
 */
export abstract class BaseService {
  protected readonly host: string;
  protected readonly port: number;
  private events: EventEmitter | undefined;
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

  //#region Protected requests handlers
  /**
   * SoapRequest will do a request that expects a Response
   *
   * @protected
   * @template TResponse
   * @param {string} action The action to call
   * @returns {Promise<TResponse>} Will return a promise of the requested response
   * @memberof BaseService
   */
  protected SoapRequest<TResponse>(action: string): Promise<TResponse> {
    return this.handleRequestAndParseResponse<TResponse>(this.generateRequest<undefined>(action, undefined), action);
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
  protected SoapRequestWithBody<TBody,TResponse>(action: string, body: TBody): Promise<TResponse> {
    return this.handleRequestAndParseResponse<TResponse>(this.generateRequest<TBody>(action, body), action);
  }

  /**
   * SoapRequestNoResponse will do a request where it doesn't expect a Response
   *
   * @protected
   * @param {string} action The action to call
   * @returns {Promise<boolean>} boolean returns true if command is send succesfull and sonos responded with ok
   * @memberof BaseService
   */
  protected SoapRequestNoResponse(action: string): Promise<boolean> {
    return this.handleRequest(this.generateRequest<undefined>(action, undefined));
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
  protected SoapRequestWithBodyNoResponse<TBody>(action: string, body: TBody): Promise<boolean> {
    return this.handleRequest(this.generateRequest<TBody>(action, body));
  }
  //#endregion

  //#region Request builders
  private getUrl(): string {
    return `http://${this.host}:${this.port}${this.controlUrl}`;
  }

  private messageAction(action: string): string {
    return `"urn:schemas-upnp-org:service:${this.serviceNane}:1#${action}"`;
  }

  private generateRequest<TBody>(action: string, body: TBody): Request{
    return new Request(
      this.getUrl(),
      { 
        method: "POST", 
        headers: {
          SOAPAction: this.messageAction(action),
          'Content-type': 'text/xml; charset=utf8'
        },
        body: this.generateRequestBody<TBody>(action, body)
      }
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
    let messageBody = `<u:${action} xmlns:u="urn:schemas-upnp-org:service:${this.serviceNane}:1">`
    if (body) {
      for (const [key, value] of Object.entries(body)) {
        if (typeof value === 'object' && key.indexOf('MetaData') > -1)
          messageBody += `<${key}>${XmlHelper.EncodeXml(MetadataHelper.TrackToMetaData(value))}</${key}>`;
        else
          messageBody += `<${key}>${value}</${key}>`;

      }
    }
    messageBody += `</u:${action}>`;
    return SoapHelper.PutInEnvelope(messageBody);
  }
  //#endregion

  //#region Request handlers
  /**
   * handleRequest send the request to the device.
   *
   * @private
   * @param {Request} request the request to send
   * @returns {Promise<boolean>} boolean returns true if command is send succesfull and sonos responded with ok
   * @memberof BaseService
   */
  private handleRequest(request: Request): Promise<boolean> {
    return fetch(request)
      .then(response => {
        if(response.ok) {
          return true
        } else {
          throw new Error(`Http status ${response.status} (${response.statusText})`);
        }
      })
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
  private handleRequestAndParseResponse<TResponse>(request: Request, action: string): Promise<TResponse> {
    return fetch(request)
      .then(response => {
        if(response.ok) {
          return response.text();
        } else {
          throw new Error(`Http status ${response.status} (${response.statusText})`);
        }
      })
      .then(parse)
      .then(result => {
        if (!result || !result['s:Envelope']) {
          throw new Error(`Invalid response for ${action}: ${result}`)
        }
        if (typeof result['s:Envelope']['s:Body']['s:Fault'] !== 'undefined') {
          throw new Error(result['s:Envelope']['s:Body']['s:Fault'])
        }
        
        return this.parseEmbeddedXml<TResponse>(result['s:Envelope']['s:Body'][`u:${action}Response`]);
      })
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
    // Currently only parsed properties that end with 'MetaData'
    // should maybe extended to all?
    const keys = Object.keys(input).filter(k => k.indexOf('MetaData') > -1);
    keys.forEach(k => {
      const originalValue = input[k] as string;
      if(originalValue.startsWith('&lt;')) {
        input[k] = MetadataHelper.ParseDIDLTrack(XmlHelper.DecodeAndParseXml(originalValue), this.host, this.port);
      }
    });
    return input;
  }
  //#endregion

  //#region Events
  /**
   * Events allowes you access to the events generated by this service.
   *
   * @description The service will automatically subscribe to events when you first use this.
   * @readonly
   * @type {EventEmitter}
   * @memberof BaseService
   */
  public get Events(): EventEmitter {
    if (this.events === undefined) {
      this.events = new EventEmitter();
      this.subscribeForEvents().then(sid => {
        SonosEventListener.DefaultInstance.RegisterSubscription(sid, this);
      })
    }
    return this.events;
  }

  private subscribeForEvents(): Promise<string> {
    const callback = SonosEventListener.DefaultInstance.GetEndpoint(this.uuid, this.serviceNane)
    return fetch(new Request(
      `http://${this.host}:${this.port}${this.eventSubUrl}`,
      {
        method: 'SUBSCRIBE',
        headers: {
          callback: `<${callback}>`,
          NT: 'upnp:event',
          Timeout: 'Second-1800'
        }
      }
    ))
      .then(resp => {
        if(resp.ok)
          return resp.headers.get('sid') as string
        throw new Error('No subscription id received')
      })
  }

  /**
   * Parse Event is used by the SonosEventListener and shouldn't be used by other people
   *
   * @param {string} xml Event request body, received from the SonosEventListener
   * @memberof BaseService
   */
  public ParseEvent(xml: string): void {
    const rawBody = parse(xml)['e:propertyset']['e:property']
    if(rawBody.LastChange) {
      const rawEventWrapper = XmlHelper.DecodeAndParseXml(rawBody.LastChange);
      const rawEvent = rawEventWrapper.Event.InstanceID ? rawEventWrapper.Event.InstanceID : rawEventWrapper.Event
      const parsedEvent = this.cleanEventLastChange(rawEvent);
      // console.log(rawEvent)
      this.Events.emit('lastchange', parsedEvent)
    } else {
      const properties = Array.isArray(rawBody) ? rawBody : [rawBody]
      const cleanedBody = this.cleanEventBody(properties)
      this.Events.emit('data', cleanedBody)
    }

  }

  private cleanEventLastChange(input: any): any{
    const output: {[key: string]: any} = {};

    const keys = Object.keys(input).filter(k => k !== '_val');
    keys.forEach(k => {
      const originalValue = input[k]._val;
      if(originalValue === '')
        return;
      if(k.indexOf('MetaData') > -1 && originalValue.startsWith('&lt;'))
        output[this.cleanPropertyName(k)] = MetadataHelper.ParseDIDLTrack(XmlHelper.DecodeAndParseXml(originalValue), this.host, this.port)
      else 
        output[this.cleanPropertyName(k)] = originalValue
    })

    return output;
  }

  private cleanEventBody(input: any[]): any {
    const output: {[key: string]: any} = {};
    input.forEach(i => {
      const keys = Object.keys(i)
      if(keys.length > 0) {
        const originalValue = i[keys[0]]
        if(originalValue === '') return
        if(typeof originalValue  === 'string')
          output[this.cleanPropertyName(keys[0])] = originalValue.startsWith('&lt;') ? XmlHelper.DecodeAndParseXml(originalValue) : originalValue
        else
          output[this.cleanPropertyName(keys[0])] = originalValue;
      }
        
    })
    return output;
  }

  private cleanPropertyName(name: string): string {
    const index = name.lastIndexOf(':');
    return index > -1 ? name.substring(index + 1) : name;
  }

  //#endregion
}