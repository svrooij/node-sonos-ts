
import { TestHelpers } from '../test-helpers';
import { HTControlService } from '../../services/ht-control.service';

describe('HTControlService', () => {
    describe('Event parsing', () => {
    it('works', (done) => {
      process.env.SONOS_DISABLE_EVENTS = 'true'
      const service = new HTControlService(TestHelpers.testHost, 1400);
      service.Events.once('serviceEvent', (data) => {
        expect(data.IRRepeaterState).toEqual('Disabled');
        expect(data.LEDFeedbackState).toBeUndefined();;
        expect(data.RemoteConfigured).toBeUndefined();;
        expect(data.TOSLinkConnected).toBeTruthy();
        done()
      })
      service.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><TOSLinkConnected>1</TOSLinkConnected></e:property><e:property><IRRepeaterState>Disabled</IRRepeaterState></e:property></e:propertyset>');
      delete process.env.SONOS_DISABLE_EVENTS
    }, 1)
  })
});
