import { randomUUID } from 'crypto';
import SonosDevice from '../sonos-device';
import { TestHelpers } from './test-helpers';
import SonosEventListener from '../sonos-event-listener';
import AsyncHelper from '../helpers/async-helper';
import fetch from 'node-fetch';

describe('SonosDevice - Events', () => {
  beforeAll(() => {
    process.env.SONOS_DISABLE_LISTENER = 'true';
  });
  afterEach(async () => {
    await SonosEventListener.DefaultInstance.StopListener();
  });
  afterAll(() => {
    delete process.env.SONOS_DISABLE_LISTENER;
  });

  it('automatically creates event subscription', async () => {
    const port = 1402;
    const scope = TestHelpers.getScope(port);

    // Required to catch event subscription
    //process.env.SONOS_LISTENER_HOST = 'localhost-events'
    const renderingControlSid = randomUUID().toString();
    scope
      .intercept('/MediaRenderer/RenderingControl/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' } })
      .reply(200, '', {
        sid: renderingControlSid,
      });

    const avtransportSid = randomUUID().toString();
    scope
      .intercept('/MediaRenderer/AVTransport/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' } })
      .reply(200, '', {
        sid: avtransportSid,
      });

    const randomUuid = randomUUID().toString();
    const device = new SonosDevice(TestHelpers.testHost, port, randomUuid);
    const statusBefore = SonosEventListener.DefaultInstance.GetStatus();
    expect(statusBefore.isListening).toBe(false);
    device.Events.on('currentTrack', () => {});
    await AsyncHelper.Delay(50); // Delay is needed because the subscription is registered out-of-band.

    const statusAfter = SonosEventListener.DefaultInstance.GetStatus();
    expect(statusAfter.isListening).toBeTruthy();
    expect(statusAfter.currentSubscriptions).toBeDefined()
    expect(statusAfter.currentSubscriptions).toHaveLength(2);

    const avSubscription = statusAfter.currentSubscriptions.find((s) => s.sid === avtransportSid);
    expect(avSubscription).toBeDefined();
    expect(avSubscription?.uuid).toEqual(randomUuid);
    expect(avSubscription?.service).toEqual('AVTransport');
  });

  it.skip('automatically unsubscribes event subscription', async () => {
    const port = 1403;
    const scope = TestHelpers.getScope(port);

    // Required to catch event subscription
    //process.env.SONOS_LISTENER_HOST = 'localhost-events'
    const renderingControlSid = randomUUID().toString();
    scope
      .intercept('/MediaRenderer/RenderingControl/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' } })
      .reply(200, '', {
        sid: renderingControlSid,
      });

    const avtransportSid = randomUUID().toString();
    scope
      .intercept('/MediaRenderer/AVTransport/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' } })
      .reply(200, '', {
        sid: avtransportSid,
      });
    
    scope
      .intercept('/MediaRenderer/RenderingControl/Event', 'UNSUBSCRIBE', undefined, { reqheaders: { sid: renderingControlSid } })
      .reply(204, '');

    scope
      .intercept('/MediaRenderer/AVTransport/Event', 'UNSUBSCRIBE', undefined, { reqheaders: { sid: avtransportSid } })
      .reply(204, '');

    const randomUuid = randomUUID().toString();
    const device = new SonosDevice(TestHelpers.testHost, port, randomUuid);
    device.Events.on('currentTrack', () => {});
    await AsyncHelper.Delay(500); // Delay is needed because the subscription is registered out-of-band.

    const statusBefore = SonosEventListener.DefaultInstance.GetStatus();
    expect(statusBefore.currentSubscriptions).toBeDefined()
    expect(statusBefore.currentSubscriptions).toHaveLength(2);

    device.Events.removeAllListeners('currentTrack');
    await AsyncHelper.Delay(500); // Delay is needed because the subscription is registered out-of-band.

    const statusAfter = SonosEventListener.DefaultInstance.GetStatus();
    expect(statusAfter.currentSubscriptions).toBeDefined();
    expect(statusAfter.currentSubscriptions).toHaveLength(0);
    
  });

  it('refreshes some subscriptions', async () => {
    process.env.DEBUG = 'sonos:*';
    const port = 2000;
    const scope = TestHelpers.getScope(port);
    const renderingControlSid = randomUUID().toString();
    const avtransportSid = randomUUID().toString();

    scope
      .intercept('/MediaRenderer/AVTransport/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' } })
      .reply(200, '', {
        sid: avtransportSid,
      });

    scope
      .intercept('/MediaRenderer/RenderingControl/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' } })
      .reply(200, '', {
        sid: renderingControlSid,
      });

    scope
      .intercept('/MediaRenderer/AVTransport/Event', 'SUBSCRIBE', undefined, { reqheaders: { SID: avtransportSid, Timeout: 'Second-3600' } })
      .reply(200, '');
    
    scope
      .intercept('/MediaRenderer/RenderingControl/Event', 'SUBSCRIBE', undefined, { reqheaders: { SID: renderingControlSid, Timeout: 'Second-3600' } })
      .reply(200, '');

    const device = new SonosDevice(TestHelpers.testHost, port);
    device.Events.on('currentTrack', () => { });
    await AsyncHelper.Delay(100);

    const result = await device.RefreshEventSubscriptions();
    expect(result).toBeTruthy();
    await AsyncHelper.Delay(100);
    // scope.isDone();
  }, 3000);

  it('refreshes AVTransport events', async () => {
    const port = 2001;
    const scope = TestHelpers.getScope(port);

    const avtransportSid = randomUUID().toString();
    scope
      .intercept('/MediaRenderer/AVTransport/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' } })
      .reply(200, '', {
        sid: avtransportSid,
      });
    
    scope
      .intercept('/MediaRenderer/AVTransport/Event', 'SUBSCRIBE', undefined, { reqheaders: { SID: avtransportSid, Timeout: 'Second-3600' } })
      .reply(200, '');

    const device = new SonosDevice(TestHelpers.testHost, port);
    device.AVTransportService.Events.on('serviceEvent', () => { });
    await AsyncHelper.Delay(50);

    const result = await device.AVTransportService.CheckEventListener();
    expect(result).toBeTruthy();
    scope.isDone();
  }, 3000);
});

describe('SonosEventListener', () => {
  // beforeAll(() => {
  //   process.env.SONOS_DISABLE_LISTENER = 'true'
  // })

  afterEach(async () => {
    await SonosEventListener.DefaultInstance.StopListener().catch(() => {});
    //delete process.env.SONOS_DISABLE_LISTENER;
  });

  it.skip('allows updating host and port', () => {
    const result = SonosEventListener.DefaultInstance.UpdateSettings({ host: 'fake-host', port: 10000 });
    expect(result).toBeTruthy();
    const endpoint = SonosEventListener.DefaultInstance.GetEndpoint('fake-uuid', 'test-service');
    expect(endpoint).toEqual('http://fake-host:10000/sonos/fake-uuid/test-service');
  });

  it('disallows updating host and port', () => {
    SonosEventListener.DefaultInstance.StartListener();
    const result = SonosEventListener.DefaultInstance.UpdateSettings({ host: 'fake-host', port: 10000 });
    expect(result).toBe(false);
  });
});

describe.skip('SonosEventListener - HTTP', () => {
  beforeAll((done) => {
    SonosEventListener.DefaultInstance.StartListener(() => {
      setTimeout(done, 500);
    });
  });

  afterAll(async () => {
    await SonosEventListener.DefaultInstance.StopListener();
  }, 1000);

  it('/status works', async () => {
    const response = await fetch('http://localhost:6329/status');
    expect(response.ok).toBeTruthy();
  }, 10000);

  it('/health works', async () => {
    const response = await fetch('http://localhost:6329/health');
    expect(response.ok).toBeTruthy();
  }, 1000);

  it('/nonexisting returns 404', async () => {
    const response = await fetch('http://localhost:6329/nonexisting');
    
    expect(response.ok).toBe(false);
    expect(response.status).toEqual(404);
  }, 1000);

});
  