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
      // var service = new AlarmClockService('192.168.96.56', 1400)

      const result = await service.Backup();
      expect(result).to.be.eq(true);
    });
  });
});
