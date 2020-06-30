import nock from 'nock';
import { expect } from 'chai';
import TtsHelper from '../../src/helpers/tts-helper';

describe('TtsHelper', () => {
  describe('GetTtsUriFromEndpoint()', () => {
    (process.env.SONOS_TTS_ENDPOINT ? it : it.skip)('actual uri', async () => {
      const endpoint = process.env.SONOS_TTS_ENDPOINT || '';
      const message = 'Er staat iemand aan de voordeur';
      const lang = 'nl-nl';
      const result = await TtsHelper.GetTtsUriFromEndpoint(endpoint, message, lang);
      expect(result).to.be.string;
    });

    it('preferes cdn uri', async () => {
      const endpoint = 'http://localhost/tts-endpoint';
      const text = 'Someone at the frontdoor';
      const lang = 'en-us';
      const gender = 'female';

      const resultUri = 'https://localhost/cache/sound.mp3';
      const cdnUri = 'https://localhost/cdn/sound.mp3';
      const reqBody = JSON.stringify({ text, lang, gender });
      const respBody = JSON.stringify({ cdnUri, uri: resultUri });
      nock('http://localhost', { reqheaders: { 'Content-type': 'application/json' } })
        .post('/tts-endpoint', reqBody)
        .reply(200, respBody);

      const result = await TtsHelper.GetTtsUriFromEndpoint(endpoint, text, lang, gender);
      expect(result).to.be.eq(cdnUri);
    });

    it('throws http error', async () => {
      const endpoint = 'http://localhost/tts-endpoint';
      const text = 'Someone at the frontdoor';
      const lang = 'en-us';
      const gender = 'female';

      const reqBody = JSON.stringify({ text, lang, gender });
      nock('http://localhost', { reqheaders: { 'Content-type': 'application/json' } })
        .post('/tts-endpoint', reqBody)
        .reply(400, '');

      try {
        await TtsHelper.GetTtsUriFromEndpoint(endpoint, text, lang, gender);
      } catch (error) {
        expect(error).to.not.be.null;
        expect(error).have.property('Action', 'GetTtsUriFromEndpoint');
        expect(error).have.property('HttpStatusCode', 400);
        return;
      }
      expect(false).to.be.true; // This should not be reached.
    });
  });

  describe('TtsOptionsToNotification()', () => {
    it('requests uri', async () => {
      const endpoint = 'http://localhost/tts-endpoint';
      const text = 'Er staat iemand aan de voordeur';
      const lang = 'nl-nl';
      const gender = 'male';

      const resultUri = 'https://localhost/cache/sound.mp3';
      const reqBody = JSON.stringify({ text, lang, gender });
      const respBody = JSON.stringify({ uri: resultUri });
      nock('http://localhost', { reqheaders: { 'Content-type': 'application/json' } })
        .post('/tts-endpoint', reqBody)
        .reply(200, respBody);

      const result = await TtsHelper.TtsOptionsToNotification({
        endpoint,
        text,
        lang,
        gender
      });
      expect(result).have.property('trackUri', resultUri);
    });

    (process.env.SONOS_TTS_ENDPOINT ? it : it.skip)('throws error when endpoint not set', async () => {
      try {
        await TtsHelper.TtsOptionsToNotification({
          text: 'test text'
        });
      } catch (error) {
        expect(error).to.not.be.null;
        expect(error).have.property('message', 'TTS endpoint is required, check the documentation.');
        return;
      }
      expect(false).to.be.true; // This should not be reached.
    })

    it('throws error when language not set', async () => {
      try {
        await TtsHelper.TtsOptionsToNotification({
          text: 'test text',
          endpoint: 'http://fake_endpoint'
        });
      } catch (error) {
        expect(error).to.not.be.null;
        expect(error).have.property('message', 'TTS lang is required.');
        return;
      }
      expect(false).to.be.true; // This should not be reached.
    })

    it('throws error when test not set or empty', async () => {
      try {
        await TtsHelper.TtsOptionsToNotification({
          text: '',
          lang: 'test',
          endpoint: 'http://fake_endpoint'
        });
      } catch (error) {
        expect(error).to.not.be.null;
        expect(error).have.property('message', 'TTS text is required, duh!');
        return;
      }
      expect(false).to.be.true; // This should not be reached.
    })
  })
});
