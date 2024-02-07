import { expect }  from 'chai'
import { randomUUID } from 'crypto';
import SonosDevice from '../src/sonos-device'
import { TestHelpers } from './test-helpers';
import SonosEventListener from '../src/sonos-event-listener';
import AsyncHelper from '../src/helpers/async-helper';
import fetch from 'node-fetch';

describe('SonosDevice - Events', () => {
  beforeAll(() => {
    process.env.SONOS_DISABLE_LISTENER = 'true'
  })
  afterEach(async () => {
    await SonosEventListener.DefaultInstance.StopListener();
  });
  afterAll(() => {
    delete process.env.SONOS_DISABLE_LISTENER;
  })

  it('automatically creates event subscription', async (done) => {
    const port = 1402;
    const scope = TestHelpers.getScope(port);

    // Required to catch event subscription
    //process.env.SONOS_LISTENER_HOST = 'localhost-events'
    const renderingControlSid = randomUUID().toString();
    scope
      .intercept('/MediaRenderer/RenderingControl/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
      .reply(200, '', {
        sid: renderingControlSid
      });

    const avtransportSid = randomUUID().toString();
    scope
      .intercept('/MediaRenderer/AVTransport/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
      .reply(200, '', {
        sid: avtransportSid
      });

    const randomUuid = randomUUID().toString();
    const device = new SonosDevice(TestHelpers.testHost, port, randomUuid);
    const statusBefore = SonosEventListener.DefaultInstance.GetStatus();
    expect(statusBefore.isListening).to.be.false;
    device.Events.on('currentTrack', (track) => {});
    await AsyncHelper.Delay(50); // Delay is needed because the subscription is registered out-of-band.

    const statusAfter = SonosEventListener.DefaultInstance.GetStatus();
    expect(statusAfter.isListening).to.be.true;
    expect(statusAfter.currentSubscriptions).to.be.an('array').that.has.lengthOf(2);

    const avSubscription = statusAfter.currentSubscriptions.find((s) => s.sid === avtransportSid);
    expect(avSubscription).to.be.not.undefined;
    expect(avSubscription?.uuid).to.be.equal(randomUuid);
    expect(avSubscription?.service).to.be.equal('AVTransport');
    done();
  });

  it.skip('automatically unsubscribes event subscription', async (done) => {
    const port = 1403;
    const scope = TestHelpers.getScope(port);

    // Required to catch event subscription
    //process.env.SONOS_LISTENER_HOST = 'localhost-events'
    const renderingControlSid = randomUUID().toString();
    scope
      .intercept('/MediaRenderer/RenderingControl/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
      .reply(200, '', {
        sid: renderingControlSid
      });

    const avtransportSid = randomUUID().toString();
    scope
      .intercept('/MediaRenderer/AVTransport/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
      .reply(200, '', {
        sid: avtransportSid
      });
    
    scope
      .intercept('/MediaRenderer/RenderingControl/Event', 'UNSUBSCRIBE', undefined , { reqheaders: { sid: renderingControlSid }})
      .reply(204, '');

    scope
      .intercept('/MediaRenderer/AVTransport/Event', 'UNSUBSCRIBE', undefined, { reqheaders: { sid: avtransportSid }})
      .reply(204, '');

    const randomUuid = randomUUID().toString();
    const device = new SonosDevice(TestHelpers.testHost, port, randomUuid);
    device.Events.on('currentTrack', (track) => {});
    await AsyncHelper.Delay(500); // Delay is needed because the subscription is registered out-of-band.

    const statusBefore = SonosEventListener.DefaultInstance.GetStatus();
    expect(statusBefore.currentSubscriptions).to.be.an('array').that.has.lengthOf(2);

    device.Events.removeAllListeners('currentTrack');
    await AsyncHelper.Delay(500); // Delay is needed because the subscription is registered out-of-band.

    const statusAfter = SonosEventListener.DefaultInstance.GetStatus();
    expect(statusAfter.currentSubscriptions).to.be.an('array').that.has.lengthOf(0);
    done();
    
  });

  it('refreshes some subscriptions', async (done) => {
    process.env.DEBUG = 'sonos:*';
    const port = 2000;
    const scope = TestHelpers.getScope(port);
    const renderingControlSid = randomUUID().toString();
    const avtransportSid = randomUUID().toString();

    scope
    .intercept('/MediaRenderer/AVTransport/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
    .reply(200, '', {
      sid: avtransportSid
    });

    scope
      .intercept('/MediaRenderer/RenderingControl/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
      .reply(200, '', {
        sid: renderingControlSid
      });

    scope
      .intercept('/MediaRenderer/AVTransport/Event', 'SUBSCRIBE', undefined, { reqheaders: { SID: avtransportSid, Timeout: 'Second-3600' }})
      .reply(200, '');
    
    scope
      .intercept('/MediaRenderer/RenderingControl/Event', 'SUBSCRIBE', undefined, { reqheaders: { SID: renderingControlSid, Timeout: 'Second-3600' }})
      .reply(200, '');

    const device = new SonosDevice(TestHelpers.testHost, port);
    device.Events.on('currentTrack', (track) => { });
    await AsyncHelper.Delay(100);

    const result = await device.RefreshEventSubscriptions();
    expect(result).to.be.true;
    await AsyncHelper.Delay(100);
    done();
    // scope.isDone();
  }, 3000);

  it('refreshes AVTransport events', async (done) => {
    const port = 2001;
    const scope = TestHelpers.getScope(port);

    const avtransportSid = randomUUID().toString();
    scope
      .intercept('/MediaRenderer/AVTransport/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
      .reply(200, '', {
        sid: avtransportSid
      });
    
    scope
      .intercept('/MediaRenderer/AVTransport/Event', 'SUBSCRIBE', undefined, { reqheaders: { SID: avtransportSid, Timeout: 'Second-3600' }})
      .reply(200, '');

    const device = new SonosDevice(TestHelpers.testHost, port);
    device.AVTransportService.Events.on('serviceEvent', (data) => { })
    await AsyncHelper.Delay(50);

    const result = await device.AVTransportService.CheckEventListener();
    expect(result).to.be.true;
    scope.isDone();
    done();
  }, 3000);
});

describe('SonosEventListener', () => {
  // beforeAll(() => {
  //   process.env.SONOS_DISABLE_LISTENER = 'true'
  // })

  afterEach(async () => {
    await SonosEventListener.DefaultInstance.StopListener().catch(err => {});
    //delete process.env.SONOS_DISABLE_LISTENER;
  });

  it.skip('allows updating host and port', () => {
    const result = SonosEventListener.DefaultInstance.UpdateSettings({ host: 'fake-host' , port: 10000 });
    expect(result).to.be.true;
    const endpoint = SonosEventListener.DefaultInstance.GetEndpoint('fake-uuid', 'test-service');
    expect(endpoint).to.be.equal('http://fake-host:10000/sonos/fake-uuid/test-service');
  });

  it('disallows updating host and port', () => {
    SonosEventListener.DefaultInstance.StartListener();
    const result = SonosEventListener.DefaultInstance.UpdateSettings({ host: 'fake-host' , port: 10000 });
    expect(result).to.be.false;
  });
});

describe('SonosEventListener - HTTP', () => {
  beforeAll((done) => {
    SonosEventListener.DefaultInstance.StartListener(() => {
      setTimeout(done, 500);
    });
  });

  afterAll(async () => {
    await SonosEventListener.DefaultInstance.StopListener();
  }, 1000)

  it('/status works', async (done) => {
    const response = await fetch('http://localhost:6329/status');
    expect(response.ok).to.be.true;
    done();
  }, 10000);

  it('/health works', async (done) => {
    const response = await fetch('http://localhost:6329/health');
    expect(response.ok).to.be.true;
    done();
  }, 1000);

  it('/nonexisting returns 404', async (done) => {
    const response = await fetch('http://localhost:6329/nonexisting');
    
    expect(response.ok).to.be.false;
    expect(response.status).to.be.eq(404, 'Status code should be 404');
    done();
  }, 1000);

});
  