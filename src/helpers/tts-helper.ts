import fetch from 'node-fetch'
import { Request } from 'node-fetch'
import debug = require('debug')
import { TtsResponse } from '../models';

export class TtsHelper {

  private static debug = debug('sonos:tts')
  // TODO Automaticly get from pacakge on build
  private static pack = { version: '0.4.2', homepage: 'https://github.com/svrooij/node-sonos-ts'}


  static async GetTtsUriFromEndpoint(endpoint: string, text: string, language: string, gender?: string): Promise<string>{
    TtsHelper.debug('Getting tts uri from server %s', endpoint);
    const request = new Request(
      endpoint,
      { 
        method: "POST", 
        headers: {
          'Content-type': 'application/json',
          'User-Agent': `node-sonos-ts/${TtsHelper.pack.version} (${TtsHelper.pack.homepage})`

        },
        body: JSON.stringify({ text: text, lang: language, gender: gender })
      }
    );

    return fetch(request)
      .then(response => {
        if(response.ok) {
          return response.text();
        } else {
          this.debug('handleRequest error %d %s', response.status, response.statusText)
          throw new Error(`Http status ${response.status} (${response.statusText})`);
        }
      })
      .then(JSON.parse)
      .then(resp => {
        return resp as TtsResponse;
      })
      .then(resp => {
        return resp.cdnUri || resp.uri;
      })

  }
}