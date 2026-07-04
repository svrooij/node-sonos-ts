import { TestHelpers } from '../test-helpers';
import { AudioInService } from '../../services/audio-in.service';

describe('AudioInService', () => {
  describe('GetAudioInputAttributes()', () => {
    it('works', async () => {
      const service = new AudioInService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/AudioIn/Control', 'AudioIn',
        'GetAudioInputAttributes', undefined,
        '<CurrentName>Audio Component</CurrentName><CurrentIcon>AudioComponent</CurrentIcon>');
      
      const result = await service.GetAudioInputAttributes();
      expect(result).toHaveProperty('CurrentName', 'Audio Component');
      expect(result).toHaveProperty('CurrentIcon', 'AudioComponent');
    });
  });

  describe('GetLineInLevel()', () => {
    it('works', async () => {
      const service = new AudioInService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/AudioIn/Control', 'AudioIn',
        'GetLineInLevel', undefined,
        '<CurrentLeftLineInLevel>1</CurrentLeftLineInLevel><CurrentRightLineInLevel>1</CurrentRightLineInLevel>');
      
      const result = await service.GetLineInLevel();
      expect(result).toHaveProperty('CurrentLeftLineInLevel', 1);
      expect(result).toHaveProperty('CurrentRightLineInLevel', 1);
    });
  });


  describe('Event parsing', () => {
    it('works', (done) => {
      process.env.SONOS_DISABLE_EVENTS = 'true'
      const service = new AudioInService(TestHelpers.testHost, 1400);
      service.Events.once('serviceEvent', (data) => {
        expect(data.AudioInputName).toEqual('Audio Component');
        expect(data.Icon).toEqual('AudioComponent');
        expect(data.LeftLineInLevel).toEqual(1);
        expect(data.LineInConnected).toBeTruthy();
        expect(data.RightLineInLevel).toEqual(1);
        done()
      })
      service.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><AudioInputName>Audio Component</AudioInputName></e:property><e:property><Icon>AudioComponent</Icon></e:property><e:property><LineInConnected>1</LineInConnected></e:property><e:property><LeftLineInLevel>1</LeftLineInLevel></e:property><e:property><RightLineInLevel>1</RightLineInLevel></e:property></e:propertyset>');
      delete process.env.SONOS_DISABLE_EVENTS
    }, 1)
  })
});
