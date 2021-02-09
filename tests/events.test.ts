import { expect }  from 'chai'
import SonosDevice from '../src/sonos-device'
import { TestHelpers } from './test-helpers';
import SonosEventListener from '../src/sonos-event-listener';
import { Guid } from 'guid-typescript';
import AsyncHelper from '../src/helpers/async-helper';

describe('SonosDevice - Events', () => {
  afterEach(async () => {
    await SonosEventListener.DefaultInstance.StopListener();
  });

  it('automatically creates event subscription', async (done) => {
    const port = 1402;
    const scope = TestHelpers.getScope(port);

    // Required to catch event subscription
    //process.env.SONOS_LISTENER_HOST = 'localhost-events'
    const renderingControlSid = Guid.create().toString();
    scope
      .intercept('/MediaRenderer/RenderingControl/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
      .reply(200, '', {
        sid: renderingControlSid
      });

    const avtransportSid = Guid.create().toString();
    scope
      .intercept('/MediaRenderer/AVTransport/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
      .reply(200, '', {
        sid: avtransportSid
      });

    const randomUuid = Guid.create().toString();
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

  it('automatically unsubscribes event subscription', async (done) => {
    const port = 1403;
    const scope = TestHelpers.getScope(port);

    // Required to catch event subscription
    //process.env.SONOS_LISTENER_HOST = 'localhost-events'
    const renderingControlSid = Guid.create().toString();
    scope
      .intercept('/MediaRenderer/RenderingControl/Event', 'SUBSCRIBE', undefined, { reqheaders: { nt: 'upnp:event' }})
      .reply(200, '', {
        sid: renderingControlSid
      });

    const avtransportSid = Guid.create().toString();
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

    const randomUuid = Guid.create().toString();
    const device = new SonosDevice(TestHelpers.testHost, port, randomUuid);
    device.Events.on('currentTrack', (track) => {});
    await AsyncHelper.Delay(20); // Delay is needed because the subscription is registered out-of-band.

    const statusBefore = SonosEventListener.DefaultInstance.GetStatus();
    expect(statusBefore.currentSubscriptions).to.be.an('array').that.has.lengthOf(2);

    device.Events.removeAllListeners('currentTrack');
    await AsyncHelper.Delay(20); // Delay is needed because the subscription is registered out-of-band.

    const statusAfter = SonosEventListener.DefaultInstance.GetStatus();
    expect(statusAfter.currentSubscriptions).to.be.an('array').that.has.lengthOf(0);
    done();
    
  });

  it('refreshes some subscriptions', async (done) => {
    process.env.DEBUG = 'sonos:*';
    const port = 2000;
    const scope = TestHelpers.getScope(port);
    const renderingControlSid = Guid.create().toString();
    const avtransportSid = Guid.create().toString();

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
  });

  it('refreshes AVTransport events', async (done) => {
    const port = 2001;
    const scope = TestHelpers.getScope(port);

    const avtransportSid = Guid.create().toString();
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
  });
});

describe('SonosEventListener', () => {
  afterEach(async () => {
    await SonosEventListener.DefaultInstance.StopListener();
  });

  it('allows updating host and port', () => {
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
  