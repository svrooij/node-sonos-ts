import fetch from 'node-fetch'
import { Request } from 'node-fetch'
import { SoapHelper } from '../helpers/soap-helper'
import { parse } from 'fast-xml-parser'
import { Guid } from 'guid-typescript'

export abstract class BaseService {
  protected readonly host: string;
  protected readonly port: number;
  abstract readonly controlUrl: string;
  abstract readonly eventSubUrl: string;
  abstract readonly scpUrl: string;
  abstract readonly serviceNane: string;
  constructor(host: string, port = 1400, private uuid: string = Guid.create().toString()) {
    this.host = host;
    this.port = port;
  }

  protected SoapRequest<TResponse>(action: string): Promise<TResponse> {
    return this.handleRequestAndParseResponse<TResponse>(this.generateRequest<undefined>(action, undefined), action);
  }

  protected SoapRequestNoResponse(action: string): Promise<boolean> {
    return this.handleRequest(this.generateRequest<undefined>(action, undefined));
  }

  protected SoapRequestWithBody<TRequest,TResponse>(action: string, body: TRequest): Promise<TResponse> {
    return this.handleRequestAndParseResponse<TResponse>(this.generateRequest<TRequest>(action, body), action);
  }

  protected SoapRequestWithBodyNoResponse<TRequest>(action: string, body: TRequest): Promise<boolean> {
    return this.handleRequest(this.generateRequest<TRequest>(action, body));
  }

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
        return result['s:Envelope']['s:Body'][`u:${action}Response`]
      });
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
        body: this.messageBody<TBody>(action, body)
      }
    );
  }

  private messageAction(action: string): string {
    return `"urn:schemas-upnp-org:service:${this.serviceNane}:1#${action}"`;
  }

  private messageBody<TBody>(action: string, body: TBody): string {
    let messageBody = `<u:${action} xmlns:u="urn:schemas-upnp-org:service:${this.serviceNane}:1">`
    if (body) {
      for (const [key, value] of Object.entries(body)) {
        messageBody += `<${key}>${value}</${key}>`;
      }
    }
    messageBody += `</u:${action}>`;
    return SoapHelper.PutInEnvelope(messageBody);
  }

  private getUrl(): string {
    return `http://${this.host}:${this.port}${this.controlUrl}`;
  }
}