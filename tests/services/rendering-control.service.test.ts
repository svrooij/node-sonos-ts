import { expect } from 'chai';
import { TestHelpers } from '../test-helpers';
import { RenderingControlService } from '../../src/services/rendering-control.service';

describe('RenderingControlService', () => {
  describe('GetBass', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
        '"urn:schemas-upnp-org:service:RenderingControl:1#GetBass"',
        '<u:GetBass xmlns:u=\"urn:schemas-upnp-org:service:RenderingControl:1\"><InstanceID>0</InstanceID></u:GetBass>',
        'GetBassResponse',
        'RenderingControl',
        '<CurrentBass>0</CurrentBass>'
      );
      const service = new RenderingControlService(TestHelpers.testHost, 1400);

      const response = await service.GetBass({InstanceID: 0});
      expect(response.CurrentBass).to.be.eq(0);
    })
  })
  describe('GetHeadphoneConnected', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
        '"urn:schemas-upnp-org:service:RenderingControl:1#GetHeadphoneConnected"',
        '<u:GetHeadphoneConnected xmlns:u=\"urn:schemas-upnp-org:service:RenderingControl:1\"><InstanceID>0</InstanceID></u:GetHeadphoneConnected>',
        'GetHeadphoneConnectedResponse',
        'RenderingControl',
        '<CurrentHeadphoneConnected>0</CurrentHeadphoneConnected>'
      );
      const service = new RenderingControlService(TestHelpers.testHost, 1400);

      const response = await service.GetHeadphoneConnected({InstanceID: 0});
      expect(response.CurrentHeadphoneConnected).to.be.eq(0);
    })
  })

  describe('GetVolume', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
        '"urn:schemas-upnp-org:service:RenderingControl:1#GetVolume"',
        '<u:GetVolume xmlns:u=\"urn:schemas-upnp-org:service:RenderingControl:1\"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetVolume>',
        'GetVolumeResponse',
        'RenderingControl',
        '<CurrentVolume>15</CurrentVolume>'
      );
      const service = new RenderingControlService(TestHelpers.testHost, 1400);

      const response = await service.GetVolume({InstanceID: 0, Channel: 'Master'});
      expect(response.CurrentVolume).to.be.eq(15);
    })
  })

  describe('SetRelativeVolume', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
        '"urn:schemas-upnp-org:service:RenderingControl:1#SetRelativeVolume"',
        '<u:SetRelativeVolume xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel><Adjustment>1</Adjustment></u:SetRelativeVolume>',
        'SetRelativeVolumeResponse',
        'RenderingControl',
        '<NewVolume>11</NewVolume>'
      );
      const service = new RenderingControlService(TestHelpers.testHost, 1400);

      const response = await service.SetRelativeVolume({InstanceID: 0, Channel: 'Master', Adjustment: 1});
      expect(response.NewVolume).to.be.eq(11);
    })
  })

  describe('SetVolume', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
        '"urn:schemas-upnp-org:service:RenderingControl:1#SetVolume"',
        '<u:SetVolume xmlns:u=\"urn:schemas-upnp-org:service:RenderingControl:1\"><InstanceID>0</InstanceID><Channel>Master</Channel><DesiredVolume>10</DesiredVolume></u:SetVolume>',
        'SetVolumeResponse',
        'RenderingControl'
      );
      const service = new RenderingControlService(TestHelpers.testHost, 1400);

      const response = await service.SetVolume({InstanceID: 0, Channel: 'Master', DesiredVolume: 10});
      expect(response).to.be.true;
    })
  })


})