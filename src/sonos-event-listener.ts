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
    } else {
      // Remove unwanted interfaces on windows
      interfaces = interfaces.filter((i) => i.indexOf('vEthernet') === -1
        && i.indexOf('tun') === -1);
    }
    if (interfaces === undefined || interfaces.length === 0) {
      throw new Error('No network interfaces found');
    }

    let address: string | undefined;

    interfaces.every((inf): boolean => {
      const currentInterface = ifaces[inf];
      if (currentInterface === undefined) return true;
      const info = currentInterface.find((i) => i.family === 'IPv4' && i.internal === false);
      if (info !== undefined) {
        address = info.address;
        return false;
      }
      return true;
    });

    if (address !== undefined) return address;
    throw new Error('No non-internal ipv4 addresses found');
  }

  private readonly proxyHost?: string = process.env.SONOS_LISTENER_PROXY;

  private listenerHost: string;

  private port: number;

  private readonly debug: Debugger;

  private listeningSince?: Date;

  private listenerStarted?: boolean;

  private get isListening(): boolean {
    return this.listenerStarted === true; // && this.server.listening;
  }

  private subscriptions: { [key: string]: BaseService<unknown> } = {};

  private server: Server;

  private constructor() {
    this.debug = debug('sonos:eventlistener');
    this.listenerHost = process.env.SONOS_LISTENER_HOST || SonosEventListener.getHostIp();
    this.port = parseInt((process.env.SONOS_LISTENER_PORT || '6329'), 10);
    this.server = createServer((req: IncomingMessage, resp: ServerResponse) => this.requestHandler(req, resp));
    this.debug('Listener endpoint: %s', this.GetEndpoint('{sonos-uuid}', '{serviceName}'));
  }

  /**
   * Change the settings of the event listener.
   * @param {string?} settings.host - The new host
   * @param {number?} settings.port - The new port - cannot be changed when listener already started
   *
   * @remarks Will only change the host for new subscriptions
   * @returns Returns true is settings where changed and false if settings where not changed (already running)
   */
  public UpdateSettings(settings: { host?: string, port?: number }): boolean {
    this.debug('Updating settings host: %s, port: %d', settings.host, settings.port);
    if (settings.port !== undefined) {
      if (this.isListening) {
        return false;
      }
      this.port = settings.port;
    }
    if (settings.host !== undefined) {
      this.listenerHost = settings.host;
    }
    this.debug('New Listener endpoint: %s', this.GetEndpoint('{sonos-uuid}', '{serviceName}'));
    return true;
  }

  private requestHandler(req: IncomingMessage, resp: ServerResponse): void {
    if (req.url) {
      if (req.url.indexOf('/sonos/') > -1) {
        return this.handleSonosRequest(req, resp);
      }
      if (req.url.endsWith('/status')) {
        return this.handleStatusRequest(req, resp);
      }
      if (req.url.endsWith('/health')) {
        return this.handleHealthRequest(req, resp);
      }
    }

    resp.statusCode = 404;
    resp.end();
  }

  private handleHealthRequest(req: IncomingMessage, resp: ServerResponse): void {
    resp.statusCode = 200;
    resp.end();
  }

  private handleStatusRequest(req: IncomingMessage, resp: ServerResponse): void {
    SonosEventListener.WriteJson(resp, this.GetStatus());
  }

  private static WriteJson(resp: ServerResponse, data: unknown): void {
    resp.statusCode = 200;
    resp.setHeader('Content-Type', 'application/json');
    resp.write(JSON.stringify(data));
    resp.end();
  }

  private handleSonosRequest(req: IncomingMessage, resp: ServerResponse): void {
    const index = req.rawHeaders.findIndex((v) => v === 'SID') as number + 1;
    const sid = req.rawHeaders[index];
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
      .on('data', (chunk: unknown) => { body.push(chunk); })
      .on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        resp.statusCode = 200;
        resp.end('OK');
        // End response before parsing event.
        service.ParseEvent(bodyString);
      })
      .on('error', (err: Error) => {
        this.debug('Error receiving event', err);
      });
  }

  /**
   * Get Endpoint generates the url where the sonos speaker should send it's events.
   * @param uuid The UUID of the sonos speaker
   * @param serviceName The name of the service
   * @remarks Even though this is public, it should not be called by external applications.
   */
  public GetEndpoint(uuid: string, serviceName: string): string {
    const suffix = `sonos/${uuid}/${serviceName}`;
    if (this.proxyHost) {
      return `${this.proxyHost}/${suffix}`;
    }
    return `http://${this.listenerHost}:${this.port}/${suffix}`;
  }

  /**
   * Get debug information about the listener.
   */
  public GetStatus(): SonosEventListenerStatus {
    return {
      host: this.listenerHost,
      port: this.port,
      isListening: this.isListening,
      subscriptionUrl: this.GetEndpoint('{sonos-uuid}', '{serviceName}'),
      listeningSince: this.listeningSince,
      subscriptionCount: Object.keys(this.subscriptions).length,
      currentSubscriptions: this.GetSubscriptions(),
    };
  }

  /**
   * Get all active subscriptions
   * @remarks Subscriptions are automatically unregistered, but this doesn't always succeed
   */
  public GetSubscriptions(): Array<SubscriptionInfo> {
    return Object.entries(this.subscriptions)
      .map(([key, value]) => ({
        sid: key,
        uuid: value.Uuid,
        host: value.Host,
        service: value.serviceNane,
      }));
  }

  /**
   * Register subscription lets the events listener forward the events to the correct service.
   * @param sid Sonos subscription id
   * @param service Instance of the service that will receive the events'
   *
   * @remarks Even though this is public, it should not be called by external applications.
   */
  public RegisterSubscription(sid: string, service: BaseService<unknown>): void {
    this.StartListener();
    this.subscriptions[sid] = service;
  }

  /**
   * Unregister the subscription, this means that the service will no longer receive these events.
   * @param sid The old subscription ID
   * @remarks Even though this is public, it should not be called by external applications.
   */
  public UnregisterSubscription(sid: string): void {
    if (typeof sid === 'string' && this.subscriptions[sid]) {
      delete this.subscriptions[sid];
    }
  }

  /**
   * Start the event listener, in case you want the status endpoint without an actual event subscription.
   *
   * @remarks The event listener is started automatically, so you probably don't need to start it yourself.
   */
  public StartListener(cb: (() => void) | undefined = undefined): void {
    if (!this.isListening) {
      this.debug('Starting event listener on port %d', this.port);
      this.listenerStarted = true;
      this.listeningSince = new Date();
      if (!this.server.listening && !process.env.SONOS_DISABLE_LISTENER) {
        this.server.listen(this.port, cb);
      } else if (cb !== undefined) {
        cb();
      }
    }
  }

  /**
   * Stop the event listener.
   */
  public async StopListener(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (process.env.SONOS_DISABLE_LISTENER || (this.isListening !== true && this.server.listening !== true)) {
        Object.keys(this.subscriptions).forEach((sid) => this.UnregisterSubscription(sid));
        resolve();
        return;
      }

      this.listeningSince = undefined;
      this.listenerStarted = false;
      Object.keys(this.subscriptions).forEach((sid) => this.UnregisterSubscription(sid));

      const timer = setTimeout(() => {
        reject(new Error('Listener not closed before timeout'));
      }, 1000);

      this.server.close((err?: Error) => {
        this.listenerStarted = undefined;
        if (timer) {
          clearTimeout(timer);
        }

        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}

interface SubscriptionInfo {
  sid: string;
  service: string;
  uuid: string;
  host: string;
}

interface SonosEventListenerStatus {
  host: string;
  port: number;
  isListening: boolean;
  subscriptionUrl: string;
  listeningSince?: Date;
  subscriptionCount: number;
  currentSubscriptions: Array<SubscriptionInfo>;
}
