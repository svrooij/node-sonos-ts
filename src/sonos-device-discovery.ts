import { EventEmitter } from 'events';
import { createSocket, Socket, RemoteInfo } from 'dgram';
import debug, { Debugger } from 'debug';

export default class SonosDeviceDiscovery {
  private readonly debug: Debugger;

  private readonly devices: Player[] = [];

  private readonly socket: Socket;

  private readonly events = new EventEmitter();

  private pollTimeout: NodeJS.Timeout | undefined;

  private searchTimeout: NodeJS.Timeout | undefined;

  private isBound = false;

  private readonly DeviceAvailable = 'DeviceAvailable';

  constructor() {
    this.debug = debug('sonos:device-discovery');
    this.socket = createSocket({ type: 'udp4', reuseAddr: true });
    this.socket.on('message', (buffer: Buffer, rinfo: RemoteInfo) => {
      const msg = buffer.toString();
      this.debug('SSDP message\r\n%s', msg);
      if (/.Sonos.+/.test(msg)) {
        const modelCheck = /SERVER.{0,200}\((.{2,50})\)/.exec(msg);
        const model = (modelCheck && modelCheck.length > 1 ? modelCheck[1] : undefined);
        const addr = rinfo.address;
        if (model && !this.devices.some((d) => d.host === addr)) {
          this.debug('Found %s on %s', model, addr);
          const player: Player = { host: addr, port: 1400, model };
          this.devices.push(player);
          this.events.emit(this.DeviceAvailable, player);
        }
      }
    });
    this.socket.on('listening', () => {
      this.debug('UDP socket started listening');
    });
    this.socket.on('error', (err) => {
      this.debug('Error with socket', err);
    });
    this.socket.bind({ port: 1900, exclusive: false }, () => {
      this.debug('Bound to port 1900');
      this.isBound = true;
      this.socket.setBroadcast(true);
    });
    this.debug('Device discovery created');
  }

  private readonly SEARCH_STRING = Buffer.from(['M-SEARCH * HTTP/1.1',
    'HOST: 239.255.255.250:1900',
    'MAN: ssdp:discover',
    'MX: 3',
    'ST: urn:schemas-upnp-org:device:ZonePlayer:1',
  ].join('\r\n'));

  private sendBroadcast(): void {
    this.debug('sendBroadcast()');
    if (this.isBound !== true) {
      this.debug('UDP port not bound, waiting 100ms');
      this.pollTimeout = setTimeout(() => {
        this.sendBroadcast();
      }, 100);
      return;
    }

    this.sendBroadcastToAddress('239.255.255.250');
    this.sendBroadcastToAddress('255.255.255.255');
    this.pollTimeout = setTimeout(() => {
      this.sendBroadcast();
    }, 6000);
  }

  private sendBroadcastToAddress(addr: string): void {
    // this.debug('sendBroadcastToAddress(\'%s\')', addr);
    const buff = this.SEARCH_STRING;
    this.socket.send(buff, 0, buff.length, 1900, addr);
  }

  private setCancelTimeout(timeoutSeconds: number): void {
    this.searchTimeout = setTimeout(() => {
      this.debug('Timeout occured');
      this.events.emit('timeout');
      this.Cancel();
    }, timeoutSeconds * 1000);
  }

  public SearchOne(timeoutSeconds = 10): Promise<Player> {
    this.debug('Search one device in %d seconds', timeoutSeconds);
    return new Promise<Player>((resolve, reject) => {
      this.events.once(this.DeviceAvailable, (player) => {
        this.Cancel();
        resolve(player);
      });
      this.events.once('timeout', () => {
        reject(new Error('No players found'));
      });
      this.setCancelTimeout(timeoutSeconds);
      this.sendBroadcast();
    });
  }

  public Search(timeoutSeconds = 30): Promise<Player[]> {
    this.debug('Search all devices in %d seconds', timeoutSeconds);
    return new Promise<Player[]>((resolve, reject) => {
      this.events.once('timeout', () => {
        if (this.devices.length > 0) {
          resolve(this.devices);
        } else {
          reject(new Error('No players found'));
        }
      });
      this.setCancelTimeout(timeoutSeconds);
      this.sendBroadcast();
    });
  }

  private Cancel(): void {
    if (this.pollTimeout !== undefined) {
      clearTimeout(this.pollTimeout);
    }
    if (this.searchTimeout !== undefined) {
      clearTimeout(this.searchTimeout);
    }
    if (this.socket) {
      this.socket.close();
    }
  }
}

interface Player {
  host: string;
  port: number;
  model: string | undefined;
}
