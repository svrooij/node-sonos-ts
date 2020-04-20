import SonosDevice from '../src/sonos-device'
import { expect }  from 'chai'
import { TestHelpers } from './test-helpers';

(process.env.SONOS_HOST ? describe : describe.skip)('SonosDevice - local', () => {

  (process.env.JOIN_DEVICE ? it : it.skip)('Joins a device by name', async () => {
    const device = new SonosDevice(process.env.SONOS_HOST || '')
    const result = await device.JoinGroup(process.env.JOIN_DEVICE || 'Slaapkamer')
    await device.AVTransportService.BecomeCoordinatorOfStandaloneGroup();
    expect(result).to.be.eq(true);
  });
});

describe('SonosDevice', () => {
  describe('ExecuteCommand()', () => {
    it('executes \'Play\'', async () => {
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Play"',
        '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>',
        'PlayResponse',
        'AVTransport'
      )
      const device = new SonosDevice(TestHelpers.testHost, 1400)

      var result = await device.ExecuteCommand('Play')
      expect(result).to.be.eq(true);
    })

    it('executes \'AVTransportService.Next\'', async () => {
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Next"',
        '<u:Next xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:Next>',
        'NextResponse',
        'AVTransport'
      )
      const device = new SonosDevice(TestHelpers.testHost, 1400)

      var result = await device.ExecuteCommand('AVTransportService.Next')
      expect(result).to.be.eq(true);
    })
  });
  describe('Services', () => {
    it('can initialize AVTransportService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.AVTransportService;
      expect(service).to.be.an('object');
    });

    it('can initialize AlarmClockService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.AlarmClockService;
      expect(service).to.be.an('object');
    });

    it('can initialize AudioInService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.AudioInService;
      expect(service).to.be.an('object');
    });

    it('can initialize ConnectionManagerService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.ConnectionManagerService;
      expect(service).to.be.an('object');
    });

    it('can initialize ContentDirectoryService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.ContentDirectoryService;
      expect(service).to.be.an('object');
    });

    it('can initialize DevicePropertiesService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.DevicePropertiesService;
      expect(service).to.be.an('object');
    });

    it('can initialize GroupManagementService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.GroupManagementService;
      expect(service).to.be.an('object');
    });

    it('can initialize GroupRenderingControlService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.GroupRenderingControlService;
      expect(service).to.be.an('object');
    });

    it('can initialize MusicServicesService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.MusicServicesService;
      expect(service).to.be.an('object');
    });

    it('can initialize QPlayService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.QPlayService;
      expect(service).to.be.an('object');
    });

    it('can initialize QueueService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.QueueService;
      expect(service).to.be.an('object');
    });

    it('can initialize RenderingControlService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.RenderingControlService;
      expect(service).to.be.an('object');
    });

    it('can initialize SystemPropertiesService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.SystemPropertiesService;
      expect(service).to.be.an('object');
    });

    it('can initialize VirtualLineInService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.VirtualLineInService;
      expect(service).to.be.an('object');
    });

    it('can initialize ZoneGroupTopologyService', () => {
      const device = new SonosDevice(TestHelpers.testHost, 1400)
      const service = device.ZoneGroupTopologyService;
      expect(service).to.be.an('object');
    });

  });
  describe('SwitchTo..', () => {
    it('SwitchToLineIn sends correct command', async () => {
      const deviceID = 'not_a_real_ID';
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-rincon-stream:not_a_real_ID01400</CurrentURI><CurrentURIMetaData></CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400, deviceID)

      var result = await device.SwitchToLineIn();
      expect(result).to.be.eq(true);
    });
    it('SwitchToQueue sends correct command', async () => {
      const deviceID = 'not_a_real_ID';
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-rincon-queue:not_a_real_ID01400#0</CurrentURI><CurrentURIMetaData></CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400, deviceID)

      var result = await device.SwitchToQueue();
      expect(result).to.be.eq(true);
    });
    it('SwitchToTV sends correct command', async () => {
      const deviceID = 'not_a_real_ID';
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-sonos-htastream:not_a_real_ID01400%3aspdiff</CurrentURI><CurrentURIMetaData></CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport'
      );
      const device = new SonosDevice(TestHelpers.testHost, 1400, deviceID)

      var result = await device.SwitchToTV();
      expect(result).to.be.eq(true);
    });
  });
})
