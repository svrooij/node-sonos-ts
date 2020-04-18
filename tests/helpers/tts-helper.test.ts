// import { mocked } from 'ts-jest/utils'
// import fetch from 'node-fetch'
// jest.mock('node-fetch')


import TtsHelper from '../../src/helpers/tts-helper';
import { expect, assert}  from 'chai';

(process.env.SONOS_TTS_ENDPOINT ? describe : describe.skip)('TtsHelper', () => {
  describe('GetTtsUriFromEndpoint()', () => {
    it('should get correct uri', async () => {
      const endpoint = process.env.SONOS_TTS_ENDPOINT || '';
      const message = 'Er staat iemand aan de voordeur';
      const lang = 'nl-nl';
      const result = await TtsHelper.GetTtsUriFromEndpoint(endpoint, message, lang);
      expect(result).to.be.string;
    })


  })
})