import { expect } from 'chai';

import { TestHelpers } from '../test-helpers';
import { QueueService } from '../../src/services/queue.service';

describe('QueueService', () => {
  describe('Backup', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/MediaRenderer/Queue/Control',
        '"urn:schemas-upnp-org:service:Queue:1#Backup"',
        '<u:Backup xmlns:u="urn:schemas-upnp-org:service:Queue:1"></u:Backup>',
        '',
        'Queue');

      const service = new QueueService(TestHelpers.testHost, 1400);
      // const service = new AlarmClockService('192.168.96.56', 1400)

      const result = await service.Backup();
      expect(result).to.be.eq(true);
    });
  });

  describe('Event parsing', () => {
    it('works', (done) => {
      process.env.SONOS_DISABLE_EVENTS = 'true'
      const service = new QueueService(TestHelpers.testHost, 1400);
      service.Events.once('serviceEvent', (data) => {
        expect(data.Curated).to.be.false;
        expect(data.UpdateID).to.be.equal(2);
        done()
      })
      service.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><LastChange>&lt;Event xmlns=&quot;urn:schemas-sonos-com:metadata-1-0/Queue/&quot;&gt;&lt;QueueID val=&quot;0&quot;&gt;&lt;UpdateID val=&quot;2&quot;/&gt;&lt;Curated val=&quot;0&quot;/&gt;&lt;QueueOwnerID val=&quot;&quot;/&gt;&lt;/QueueID&gt;&lt;QueueID val=&quot;1&quot;&gt;&lt;UpdateID val=&quot;0&quot;/&gt;&lt;Curated val=&quot;0&quot;/&gt;&lt;QueueOwnerID val=&quot;&quot;/&gt;&lt;/QueueID&gt;&lt;/Event&gt;</LastChange></e:property></e:propertyset>');
      delete process.env.SONOS_DISABLE_EVENTS
    }, 1)
  })
});
