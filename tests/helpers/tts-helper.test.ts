import nock from 'nock';
import TtsHelper from '../../src/helpers/tts-helper';
import { expect }  from 'chai';

describe('TtsHelper', () => {
  describe('GetTtsUriFromEndpoint()', () => {
    (process.env.SONOS_TTS_ENDPOINT ? it : it.skip)('actual uri', async () => {
      const endpoint = process.env.SONOS_TTS_ENDPOINT || '';
      const message = 'Er staat iemand aan de voordeur';
      const lang = 'nl-nl';
      const result = await TtsHelper.GetTtsUriFromEndpoint(endpoint, message, lang);
      expect(result).to.be.string;
    });

    it('requests uri', async () => {
      const endpoint = 'http://localhost/tts-endpoint'
      const text = 'Er staat iemand aan de voordeur';
      const lang = 'nl-nl';
      const gender = 'male';

      const resultUri = 'https://localhost/cache/sound.mp3';
      const reqBody = JSON.stringify({ text, lang, gender });
      const respBody = JSON.stringify({ uri: resultUri });
      nock('http://localhost', { reqheaders: { 'Content-type': 'application/json' } })
        .post('/tts-endpoint', reqBody)
        .reply(200, respBody);
      
      const result = await TtsHelper.GetTtsUriFromEndpoint(endpoint, text, lang, gender);
      expect(result).to.be.eq(resultUri);
    });

    it('preferes cdn uri', async () => {
      const endpoint = 'http://localhost/tts-endpoint'
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
    })

    it('throws http error', async () => {
      const endpoint = 'http://localhost/tts-endpoint'
      const text = 'Someone at the frontdoor';
      const lang = 'en-us';
      const gender = 'female';

      const reqBody = JSON.stringify({ text, lang, gender });
      nock('http://localhost', { reqheaders: { 'Content-type': 'application/json' } })
        .post('/tts-endpoint', reqBody)
        .reply(400, '');
      
      try {
        const result = await TtsHelper.GetTtsUriFromEndpoint(endpoint, text, lang, gender);
      } catch (error) {
        expect(error).to.not.be.null;
        expect(error).have.property('Action', 'GetTtsUriFromEndpoint');
        expect(error).have.property('HttpStatusCode', 400);
        return;
      }
      expect(false).to.be.true; // This should not be reached.
    })
  })
})