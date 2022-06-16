import { expect } from 'chai';
import { TestHelpers } from '../test-helpers';
import { AudioInService } from '../../src/services/audio-in.service';

describe('AudioInService', () => {
  describe('GetAudioInputAttributes()', () => {
    it('works', async () => {
      const service = new AudioInService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/AudioIn/Control', 'AudioIn',
        'GetAudioInputAttributes', undefined,
        '<CurrentName>Audio Component</CurrentName><CurrentIcon>AudioComponent</CurrentIcon>');
      
      const result = await service.GetAudioInputAttributes();
      expect(result).to.have.nested.property('CurrentName', 'Audio Component');
      expect(result).to.have.nested.property('CurrentIcon', 'AudioComponent');
    });
  });

  describe('GetLineInLevel()', () => {
    it('works', async () => {
      const service = new AudioInService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/AudioIn/Control', 'AudioIn',
        'GetLineInLevel', undefined,
        '<CurrentLeftLineInLevel>1</CurrentLeftLineInLevel><CurrentRightLineInLevel>1</CurrentRightLineInLevel>');
      
      const result = await service.GetLineInLevel();
      expect(result).to.have.nested.property('CurrentLeftLineInLevel', 1);
      expect(result).to.have.nested.property('CurrentRightLineInLevel', 1);
    });
  });


  describe('Event parsing', () => {
    it('works', (done) => {
      process.env.SONOS_DISABLE_EVENTS = 'true'
      const service = new AudioInService(TestHelpers.testHost, 1400);
      service.Events.once('serviceEvent', (data) => {
        expect(data.AudioInputName).to.be.equal('Audio Component');
        expect(data.Icon).to.be.equal('AudioComponent');
        expect(data.LeftLineInLevel).to.be.equal(1);
        expect(data.LineInConnected).to.be.true;
        expect(data.RightLineInLevel).to.be.equal(1);
        done()
      })
      service.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><AudioInputName>Audio Component</AudioInputName></e:property><e:property><Icon>AudioComponent</Icon></e:property><e:property><LineInConnected>1</LineInConnected></e:property><e:property><LeftLineInLevel>1</LeftLineInLevel></e:property><e:property><RightLineInLevel>1</RightLineInLevel></e:property></e:propertyset>');
      delete process.env.SONOS_DISABLE_EVENTS
    }, 1)
  })
});
