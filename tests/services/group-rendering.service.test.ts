import { expect } from 'chai';
import { TestHelpers } from '../test-helpers';
import { GroupRenderingControlService } from '../../src/services/group-rendering-control.service';

describe('GroupRenderingControlService', () => {

  describe('GetGroupMute()', () => {
    it('works', async () => {
      const service = new GroupRenderingControlService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaRenderer/GroupRenderingControl/Control', 'GroupRenderingControl',
        'GetGroupMute', '<InstanceID>0</InstanceID>',
        '<CurrentMute>0</CurrentMute>');
      
      const result = await service.GetGroupMute();
      expect(result.CurrentMute).to.be.false;
    });
  });

  describe('GetGroupVolume()', () => {
    it('works', async () => {
      const service = new GroupRenderingControlService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaRenderer/GroupRenderingControl/Control', 'GroupRenderingControl',
        'GetGroupVolume', '<InstanceID>0</InstanceID>',
        '<CurrentVolume>10</CurrentVolume>');
      
      const result = await service.GetGroupVolume();
      expect(result.CurrentVolume).to.be.equal(10);
    });
  });

  describe('SetGroupMute()', () => {
    it('returns custom error', async () => {
      const service = new GroupRenderingControlService(TestHelpers.testHost, 1400);
      TestHelpers.mockSoapError('/MediaRenderer/GroupRenderingControl/Control',
        'SetGroupMute', '<u:SetGroupMute xmlns:u="urn:schemas-upnp-org:service:GroupRenderingControl:1"><InstanceID>0</InstanceID><DesiredMute>1</DesiredMute></u:SetGroupMute>',
        701);
      
      await TestHelpers.expectThrowsAsync(() => service.SetGroupMute({ InstanceID: 0, DesiredMute: true}), undefined, 'Player isn&#x27;t the coordinator');
    })
    it('works', async () => {
      const service = new GroupRenderingControlService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaRenderer/GroupRenderingControl/Control', 'GroupRenderingControl',
        'SetGroupMute', '<InstanceID>0</InstanceID><DesiredMute>1</DesiredMute>',
        '');
      
      const result = await service.SetGroupMute({ InstanceID: 0, DesiredMute: true});
      expect(result).to.be.true;
    });
  });

  describe('SetGroupVolume()', () => {
    it('works', async () => {
      const service = new GroupRenderingControlService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaRenderer/GroupRenderingControl/Control', 'GroupRenderingControl',
        'SetGroupVolume', '<InstanceID>0</InstanceID><DesiredVolume>10</DesiredVolume>',
        '');
      
      const result = await service.SetGroupVolume({ InstanceID: 0, DesiredVolume: 10 });
      expect(result).to.be.true;
    });
  });

});
