import { networkInterfaces } from 'os'
import { BaseService } from './services/base-service'
import { Server, createServer, IncomingMessage, ServerResponse } from 'http';

/**
 * SonosEventListener is the internal webservice to handle events.
 *
 * @description the SonosEventListener is created automatically by the first service you start using. You should not call this service by yourself!
 * @export
 * @class SonosEventListener
 */
export class SonosEventListener {
  private static instance: SonosEventListener;
  static get DefaultInstance(): SonosEventListener {
    if (!SonosEventListener.instance) {
      SonosEventListener.instance = new SonosEventListener();
    }
    return SonosEventListener.instance
  }

  private static getHostIp(): string {
    const ifaces = networkInterfaces();
    
    let interfaces = Object.keys(ifaces).filter(k => k !== 'lo0')
    if (process.env.SONOS_LISTENER_INTERFACE) interfaces = interfaces.filter(i => i === process.env.SONOS_LISTENER_INTERFACE)
    if (interfaces === undefined) throw new Error('No network interfaces found')

    let address: string | undefined;
    
    interfaces.forEach(inf => {
      if (address !== undefined) return;
      const info = ifaces[inf].find(i => i.family === 'IPv4' && i.internal === false)
      if (info !== undefined) address = info.address;
    })
    if (address !== undefined) return address;
    throw new Error('No non-internal ipv4 addresses found')
  }

  private readonly listenerHost: string;
  private readonly port: number;
  private isListening = false;
  private subscriptions: {[key: string]: BaseService} = {}
  private server: Server;
  private constructor() {
    this.listenerHost = process.env.SONOS_LISTENER_HOST || SonosEventListener.getHostIp();
    this.port = parseInt(process.env.SONOS_LISTENER_PORT || '6329');
    this.server = createServer((req, resp) => this.requestHandler(req, resp))
  }

  private requestHandler(req: IncomingMessage, resp: ServerResponse): void {
    const sid = req.rawHeaders[req.rawHeaders.findIndex(v => v ==='SID') + 1];
    const service = this.subscriptions[sid];
    if(service === undefined) {
      resp.statusCode = 404;
      resp.end();
      return;
    }
    const body: any[] = [];
    req
      .on('data', (chunk: any) => { body.push(chunk) })
      .on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        //this.messageHandler(req, resp, bodyString)
        service.ParseEvent(bodyString);
        resp.statusCode = 200
        resp.end('OK')
      })
      .on('error', (err: any) => {
        console.error(err)
      })
  }

  public GetEndpoint(uuid: string, serviceName: string): string {
    return `http://${this.listenerHost}:${this.port}/sonos/${uuid}/${serviceName}`
  }

  public RegisterSubscription(sid: string, service: BaseService): void {
    if(this.isListening !== true) {
      this.server.listen(this.port);
      this.isListening = true;
    }
    this.subscriptions[sid] = service; 
  }
}