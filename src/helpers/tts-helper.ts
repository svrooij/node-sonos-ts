import fetch, { Request } from 'node-fetch';
import debug from 'debug';
import {
  TtsResponse, PlayTtsOptions, PlayNotificationOptions, PlayNotificationOptionsBase,
} from '../models';
import HttpError from '../models/http-error';

export default class TtsHelper {
  private static debug = debug('sonos:tts');

  // TODO Automaticly get from pacakge on build
  private static pack = { version: '1.1.5', homepage: 'https://github.com/svrooij/node-sonos-ts' };

  static async GetTtsUriFromEndpoint(endpoint: string, text: string, language: string, gender?: string, name?: string): Promise<string> {
    TtsHelper.debug('Getting tts uri from server %s', endpoint);
    const request = new Request(
      endpoint,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'User-Agent': `node-sonos-ts/${TtsHelper.pack.version} (${TtsHelper.pack.homepage})`,

        },
        body: JSON.stringify({
          text, lang: language, gender, name,
        }),
      },
    );

    const response = await fetch(request);
    if (!response.ok) {
      this.debug('handleRequest error %d %s', response.status, response.statusText);
      throw new HttpError('GetTtsUriFromEndpoint', response.status, response.statusText);
    }
    const data = JSON.parse(await response.text()) as TtsResponse;
    return data.cdnUri || data.uri;
  }

  static async TtsOptionsToNotification(options: PlayTtsOptions): Promise<PlayNotificationOptions> {
    const endpoint = options.endpoint ?? process.env.SONOS_TTS_ENDPOINT;
    if (endpoint === undefined) {
      throw new Error('TTS endpoint is required, check the documentation.');
    }

    const lang = options.lang || process.env.SONOS_TTS_LANG;
    if (lang === undefined || lang === '') {
      throw new Error('TTS lang is required.');
    }

    if (options.text === '' || options.text === undefined || options.text.length < 2) {
      throw new Error('TTS text is required, duh!');
    }

    const uri = await TtsHelper.GetTtsUriFromEndpoint(endpoint, options.text, lang, options.gender, options.name);

    // Typescript way to convert objects, someone got a better way?
    const notificationOptions: PlayNotificationOptions = options as PlayNotificationOptionsBase as PlayNotificationOptions;
    notificationOptions.trackUri = uri;
    notificationOptions.timeout = notificationOptions.timeout ?? 120;

    return notificationOptions;
  }
}
