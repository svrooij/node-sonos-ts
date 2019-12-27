import { EventEmitter } from 'events'
import { createSocket, Socket } from 'dgram'
import { Debugger } from 'debug'
import debug = require('debug')

export class SonosDeviceDiscovery {
  private readonly debug: Debugger;
  private readonly devices: Player[] = [];
  private readonly socket: Socket;
  private readonly events = new EventEmitter();
  private pollTimeout: NodeJS.Timeout | undefined
  private searchTimeout: NodeJS.Timeout | undefined
  public readonly DeviceAvailable = 'DeviceAvailable'
  constructor() {
    this.debug = debug('sonos:devicediscovery')
    this.socket = createSocket('udp4', (buffer, rinfo) => {
      const msg = buffer.toString();
      if(msg.match(/.Sonos.+/)) {
        const modelCheck = msg.match(/SERVER.*\((.*)\)/)
        const model = (modelCheck && modelCheck.length > 1 ? modelCheck[1] : undefined)
        const addr = rinfo.address
        if (this.devices.findIndex(d => d.host === addr) === -1){
          this.debug('Found %s on %s', model, addr)
          const player: Player = {host: addr, port: 1400, model: model};
          this.devices.push(player)
          this.events.emit(this.DeviceAvailable, player)
        }
      }
    })
    this.socket.bind(()=>{
      this.socket.setBroadcast(true)
    })
    this.debug('Device discovery created')
  }

  private readonly SEARCH_STRING = Buffer.from(['M-SEARCH * HTTP/1.1',
  'HOST: 239.255.255.250:1900',
  'MAN: ssdp:discover',
  'MX: 1',
  'ST: urn:schemas-upnp-org:device:ZonePlayer:1'].join('\r\n'))

  private sendBroadcast(): void {
    this.debug('Sending broadcast');
    ['239.255.255.250', '255.255.255.255'].map(a => this.sendBroadcastToAddress(a))
    this.pollTimeout = setTimeout(() => this.sendBroadcast, 8000);
  }

  private sendBroadcastToAddress(addr: string): void {
    this.socket.send(this.SEARCH_STRING, 0, this.SEARCH_STRING.length, 1900, addr)
  }
  
  private setCancelTimeout(timeoutSeconds: number): void{
    this.searchTimeout = setTimeout(() => {
      this.debug('Timeout occured')
      this.events.emit('timeout')
      this.Cancel();
    }, timeoutSeconds * 1000)
  }

  public SearchOne(timeoutSeconds = 10): Promise<Player> {
    this.debug('Search one device in %d seconds', timeoutSeconds)
    return new Promise<Player>((resolve, reject) => {
      this.events.once(this.DeviceAvailable, player => {
        this.Cancel();
        resolve(player)
      })
      this.events.once('timeout', () => {
        reject(new Error('No players found'))
      })
      this.setCancelTimeout(timeoutSeconds)
      this.sendBroadcast();
    })
  }

  public Search(timeoutSeconds = 30): Promise<Player[]> {
    this.debug('Search all devices in %d seconds', timeoutSeconds)
    return new Promise<Player[]>((resolve, reject) => {
      this.events.once('timeout', () => {
        if (this.devices.length > 0){
          resolve(this.devices)
        } else {
          reject(new Error('No players found'))
        }
        
      })
      this.setCancelTimeout(timeoutSeconds)
      this.sendBroadcast();
    })
  }

  private Cancel(): void {
    if (this.pollTimeout !== undefined) {
      clearTimeout(this.pollTimeout)
    }
    if (this.searchTimeout !== undefined) {
      clearTimeout(this.searchTimeout)
    }
    if(this.socket) {
      this.socket.close();
    }
  }
}

interface Player {
  host: string;
  port: number;
  model: string | undefined;
}