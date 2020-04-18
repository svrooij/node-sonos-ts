/* eslint-disable no-param-reassign */
import { networkInterfaces } from 'os';
import {
  Server, createServer, IncomingMessage, ServerResponse,
} from 'http';
import debug, { Debugger } from 'debug';
import BaseService from './services/base-service';

/**
 * SonosEventListener is the internal webservice to handle events.
 *
 * @description the SonosEventListener is created automatically by the first service you start using. You should not call this service by yourself!
 * @export
 * @internal
 * @class SonosEventListener
 */
export default class SonosEventListener {
  private static instance: SonosEventListener;

  static get DefaultInstance(): SonosEventListener {
    if (!SonosEventListener.instance) {
      SonosEventListener.instance = new SonosEventListener();
    }
    return SonosEventListener.instance;
  }

  private static getHostIp(): string {
    const ifaces = networkInterfaces();

    let interfaces = Object.keys(ifaces).filter((k) => k !== 'lo0');
    if (process.env.SONOS_LISTENER_INTERFACE) {
      interfaces = interfaces.filter((i) => i === process.env.SONOS_LISTENER_INTERFACE);
    }
    if (interfaces === undefined || interfaces.length === 0) {
      throw new Error('No network interfaces found');
    }

    let address: string | undefined;

    interfaces.forEach((inf) => {
      const currentInterface = ifaces[inf];
      if (currentInterface === undefined) return;
      const info = currentInterface.find((i) => i.family === 'IPv4' && i.internal === false);
      if (info !== undefined) {
        address = info.address;
      }
    });
    if (address !== undefined) return address;
    throw new Error('No non-internal ipv4 addresses found');
  }

  private readonly listenerHost: string;

  private readonly port: number;

  private readonly debug: Debugger;

  private isListening = false;

  private subscriptions: {[key: string]: BaseService<any>} = {};

  private server: Server;

  private constructor() {
    this.debug = debug('sonos:eventlistener');
    this.listenerHost = process.env.SONOS_LISTENER_HOST || SonosEventListener.getHostIp();
    this.port = parseInt((process.env.SONOS_LISTENER_PORT || '6329'), 10);
    this.server = createServer((req, resp) => this.requestHandler(req, resp));
    this.debug('Listener created host: %s port: %d', this.listenerHost, this.port);
  }

  private requestHandler(req: IncomingMessage, resp: ServerResponse): void {
    const sid = req.rawHeaders[req.rawHeaders.findIndex((v) => v === 'SID') + 1];
    this.debug('Got event on %s SID: %s', req.url, sid);
    const service = this.subscriptions[sid];
    if (service === undefined) {
      this.debug('Subscription %s not found, sending 412 to stop messages', sid);
      resp.statusCode = 412;
      resp.end();
      return;
    }
    const body: any[] = [];
    req
      .on('data', (chunk: any) => { body.push(chunk); })
      .on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        service.ParseEvent(bodyString);
        resp.statusCode = 200;
        resp.end('OK');
      })
      .on('error', (err: any) => {
        console.error(err);
      });
  }

  public GetEndpoint(uuid: string, serviceName: string): string {
    return `http://${this.listenerHost}:${this.port}/sonos/${uuid}/${serviceName}`;
  }

  public RegisterSubscription(sid: string, service: BaseService<any>): void {
    if (this.isListening !== true) {
      this.debug('Start listening on port %d', this.port);
      this.server.listen(this.port);
      this.isListening = true;
    }
    this.subscriptions[sid] = service;
  }
}
