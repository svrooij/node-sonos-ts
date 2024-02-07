import { expect } from 'chai';
import { TestHelpers } from '../test-helpers';
import { RenderingControlService } from '../../src/services/rendering-control.service.extension';

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
      expect(response.CurrentHeadphoneConnected).to.be.false;
    })
  })

  describe('GetLoudness()', () => {
    it('works', async () => {
      const service = new RenderingControlService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaRenderer/RenderingControl/Control', 'RenderingControl',
        'GetLoudness', '<InstanceID>0</InstanceID><Channel>Master</Channel>',
        '<CurrentLoudness>0</CurrentLoudness>');
      
      const result = await service.GetLoudness({ InstanceID:0, Channel: 'Master'});
      expect(result.CurrentLoudness).to.be.false;
    });
  });

  


  describe('GetMute', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/MediaRenderer/RenderingControl/Control',
        '"urn:schemas-upnp-org:service:RenderingControl:1#GetMute"',
        '<u:GetMute xmlns:u=\"urn:schemas-upnp-org:service:RenderingControl:1\"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetMute>',
        'GetMuteResponse',
        'RenderingControl',
        '<CurrentMute>1</CurrentMute>'
      );
      const service = new RenderingControlService(TestHelpers.testHost, 1400);

      const response = await service.GetMute({InstanceID: 0, Channel: 'Master'});
      expect(response.CurrentMute).to.be.true
    })
  });

  describe('GetOutputFixed()', () => {
    it('works', async () => {
      const service = new RenderingControlService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaRenderer/RenderingControl/Control', 'RenderingControl',
        'GetOutputFixed', '<InstanceID>0</InstanceID>',
        '<CurrentFixed>0</CurrentFixed>');
      
      const result = await service.GetOutputFixed({ InstanceID:0 });
      expect(result.CurrentFixed).to.be.false;
    });
  });

  describe('GetRoomCalibrationStatus()', () => {
    it('returns false for 0', async () => {
      const service = new RenderingControlService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaRenderer/RenderingControl/Control', 'RenderingControl',
        'GetRoomCalibrationStatus', '<InstanceID>0</InstanceID>',
        '<RoomCalibrationAvailable>0</RoomCalibrationAvailable>');
      
      const result = await service.GetRoomCalibrationStatus({ InstanceID:0 });
      expect(result.RoomCalibrationAvailable).to.be.false;
    });

    it('returns true for 1', async () => {
      const service = new RenderingControlService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaRenderer/RenderingControl/Control', 'RenderingControl',
        'GetRoomCalibrationStatus', '<InstanceID>0</InstanceID>',
        '<RoomCalibrationAvailable>1</RoomCalibrationAvailable>');
      
      const result = await service.GetRoomCalibrationStatus({ InstanceID:0 });
      expect(result.RoomCalibrationAvailable).to.be.true;
    });
  });

  describe('GetOutputFixed()', () => {
    it('works', async () => {
      const service = new RenderingControlService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaRenderer/RenderingControl/Control', 'RenderingControl',
        'GetSupportsOutputFixed', '<InstanceID>0</InstanceID>',
        '<CurrentSupportsFixed>0</CurrentSupportsFixed>');
      
      const result = await service.GetSupportsOutputFixed({ InstanceID:0 });
      expect(result.CurrentSupportsFixed).to.be.false;
    });
  });

  describe('GetTreble()', () => {
    it('works', async () => {
      const service = new RenderingControlService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaRenderer/RenderingControl/Control', 'RenderingControl',
        'GetTreble', '<InstanceID>0</InstanceID>',
        '<CurrentTreble>0</CurrentTreble>');
      
      const result = await service.GetTreble({ InstanceID:0 });
      expect(result.CurrentTreble).to.be.equal(0);
    });
  });

  describe('GetVolume', () => {
    it('works', async () => {
      TestHelpers.mockRequestToService('/MediaRenderer/RenderingControl/Control', 'RenderingControl',
        'GetVolume', '<InstanceID>0</InstanceID><Channel>Master</Channel>',
        '<CurrentVolume>15</CurrentVolume>');
      const service = new RenderingControlService(TestHelpers.testHost, 1400);

      const response = await service.GetVolume({InstanceID: 0, Channel: 'Master'});
      expect(response.CurrentVolume).to.be.eq(15);
    })
  })

  describe('ResetBasicEQ', () => {
    it('works', async () => {
      TestHelpers.mockRequestToService('/MediaRenderer/RenderingControl/Control', 'RenderingControl',
        'ResetBasicEQ', '<InstanceID>0</InstanceID>',
        '<Bass>0</Bass><Treble>0</Treble><Loudness>1</Loudness><LeftVolume>100</LeftVolume><RightVolume>100</RightVolume>');
      const service = new RenderingControlService(TestHelpers.testHost, 1400);

      const response = await service.ResetBasicEQ({ InstanceID: 0 });
      expect(response.Bass).to.be.eq(0);
      expect(response.Treble).to.be.eq(0);
      expect(response.Loudness).to.be.true;
      expect(response.LeftVolume).to.be.eq(100);
      expect(response.RightVolume).to.be.eq(100);
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

  describe('Event parsing', () => {
    it('works', (done) => {
      process.env.SONOS_DISABLE_EVENTS = 'true'
      const service = new RenderingControlService(TestHelpers.testHost, 1400);
      service.Events.once('serviceEvent', (data) => {
        expect(data.Volume?.Master).to.be.eq(15)
        expect(data.Mute?.Master).to.be.false
        expect(data.PresetNameList).to.be.eq('FactoryDefaults')
        done()
      })

      
      service.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><LastChange>&lt;Event xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/RCS/&quot;&gt;&lt;InstanceID val=&quot;0&quot;&gt;&lt;Volume channel=&quot;Master&quot; val=&quot;15&quot;/&gt;&lt;Volume channel=&quot;LF&quot; val=&quot;100&quot;/&gt;&lt;Volume channel=&quot;RF&quot; val=&quot;100&quot;/&gt;&lt;Mute channel=&quot;Master&quot; val=&quot;0&quot;/&gt;&lt;Mute channel=&quot;LF&quot; val=&quot;0&quot;/&gt;&lt;Mute channel=&quot;RF&quot; val=&quot;0&quot;/&gt;&lt;Bass val=&quot;0&quot;/&gt;&lt;Treble val=&quot;0&quot;/&gt;&lt;Loudness channel=&quot;Master&quot; val=&quot;1&quot;/&gt;&lt;OutputFixed val=&quot;0&quot;/&gt;&lt;HeadphoneConnected val=&quot;0&quot;/&gt;&lt;SpeakerSize val=&quot;3&quot;/&gt;&lt;SubGain val=&quot;0&quot;/&gt;&lt;SubCrossover val=&quot;0&quot;/&gt;&lt;SubPolarity val=&quot;0&quot;/&gt;&lt;SubEnabled val=&quot;1&quot;/&gt;&lt;SonarEnabled val=&quot;1&quot;/&gt;&lt;SonarCalibrationAvailable val=&quot;1&quot;/&gt;&lt;PresetNameList val=&quot;FactoryDefaults&quot;/&gt;&lt;/InstanceID&gt;&lt;/Event&gt;</LastChange></e:property></e:propertyset>');
      delete process.env.SONOS_DISABLE_EVENTS
    }, 1)
  })
})
