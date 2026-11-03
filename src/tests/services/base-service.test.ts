import fetch, { Response } from 'node-fetch';
import { ServiceEvents } from '../../models';
import { RenderingControlService } from '../../services/rendering-control.service.extension';

jest.mock('node-fetch', () => ({
  ...jest.requireActual('node-fetch'),
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../sonos-event-listener', () => ({
  __esModule: true,
  default: {
    DefaultInstance: {
      GetEndpoint: () => 'http://localhost:6329/sonos/test/RenderingControl',
      RegisterSubscription: jest.fn(),
      UnregisterSubscription: jest.fn(),
    },
  },
}));

describe('BaseService event subscriptions', () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it('renews a subscription after its last listener is removed and added again', async () => {
    jest.useFakeTimers();
    jest.mocked(fetch)
      .mockResolvedValue(new Response('', { status: 200 }))
      .mockResolvedValueOnce(new Response('', { status: 200, headers: { sid: 'uuid:first' } }))
      .mockResolvedValueOnce(new Response('', { status: 200 }))
      .mockResolvedValueOnce(new Response('', { status: 200, headers: { sid: 'uuid:second' } }));
    const service = new RenderingControlService('192.0.2.1');
    const listener = jest.fn();

    service.Events.on(ServiceEvents.ServiceEvent, listener);
    await jest.advanceTimersByTimeAsync(0);
    service.Events.removeListener(ServiceEvents.ServiceEvent, listener);
    await jest.advanceTimersByTimeAsync(0);
    expect(fetch).toHaveBeenLastCalledWith(expect.any(String), {
      method: 'UNSUBSCRIBE',
      headers: { SID: 'uuid:first' },
    });

    service.Events.on(ServiceEvents.ServiceEvent, listener);
    await jest.advanceTimersByTimeAsync(0);
    await jest.advanceTimersByTimeAsync(600_000);

    expect(fetch).toHaveBeenLastCalledWith('http://192.0.2.1:1400/MediaRenderer/RenderingControl/Event', {
      method: 'SUBSCRIBE',
      headers: { SID: 'uuid:second', Timeout: 'Second-3600' },
    });

    service.Events.removeListener(ServiceEvents.ServiceEvent, listener);
    await jest.advanceTimersByTimeAsync(0);
    expect(jest.getTimerCount()).toBe(0);
  });
});
