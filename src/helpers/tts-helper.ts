import fetch, { Request } from 'node-fetch';

import { TtsResponse } from '../models';

import debug = require('debug');

export default class TtsHelper {
  private static debug = debug('sonos:tts');

  // TODO Automaticly get from pacakge on build
  private static pack = { version: '1.1.5', homepage: 'https://github.com/svrooij/node-sonos-ts' };


  static async GetTtsUriFromEndpoint(endpoint: string, text: string, language: string, gender?: string): Promise<string> {
    TtsHelper.debug('Getting tts uri from server %s', endpoint);
    const request = new Request(
      endpoint,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'User-Agent': `node-sonos-ts/${TtsHelper.pack.version} (${TtsHelper.pack.homepage})`,

        },
        body: JSON.stringify({ text, lang: language, gender }),
      },
    );

    const response = await fetch(request);
    if (!response.ok) {
      this.debug('handleRequest error %d %s', response.status, response.statusText);
      throw new Error(`Http status ${response.status} (${response.statusText})`);
    }
    const data = JSON.parse(await response.text()) as TtsResponse;
    return data.cdnUri || data.uri;
  }
}
