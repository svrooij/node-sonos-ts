import { expect } from 'chai';
import { TestHelpers } from '../test-helpers';
import { DevicePropertiesService } from '../../src/services/device-properties.service';

describe('DevicePropertiesService', () => {
  describe('GetButtonLockState', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/DeviceProperties/Control',
        '"urn:schemas-upnp-org:service:DeviceProperties:1#GetButtonLockState"',
        '<u:GetButtonLockState xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetButtonLockState>',
        'GetButtonLockStateResponse',
        'DeviceProperties',
        '<CurrentButtonLockState>Off</CurrentButtonLockState>'
      );
      const service = new DevicePropertiesService(TestHelpers.testHost, 1400);

      const buttonLockState = await service.GetButtonLockState();
      expect(buttonLockState.CurrentButtonLockState).to.be.eq('Off');
    })
  })

  describe('GetHouseholdID', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/DeviceProperties/Control',
        '"urn:schemas-upnp-org:service:DeviceProperties:1#GetHouseholdID"',
        '<u:GetHouseholdID xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetHouseholdID>',
        'GetHouseholdIDResponse',
        'DeviceProperties',
        '<CurrentHouseholdID>Sonos_fake_id</CurrentHouseholdID>'
      );
      const service = new DevicePropertiesService(TestHelpers.testHost, 1400);

      const householdResponse = await service.GetHouseholdID();
      expect(householdResponse.CurrentHouseholdID).to.be.eq('Sonos_fake_id');
    })
  })

  describe('GetLEDState', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/DeviceProperties/Control',
        '"urn:schemas-upnp-org:service:DeviceProperties:1#GetLEDState"',
        '<u:GetLEDState xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetLEDState>',
        'GetLEDStateResponse',
        'DeviceProperties',
        '<CurrentLEDState>On</CurrentLEDState>'
      );
      const service = new DevicePropertiesService(TestHelpers.testHost, 1400);

      const getLedStateResponse = await service.GetLEDState();
      expect(getLedStateResponse.CurrentLEDState).to.be.eq('On');
    })
  })

  describe('GetZoneAttributes', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/DeviceProperties/Control',
        '"urn:schemas-upnp-org:service:DeviceProperties:1#GetZoneAttributes"',
        '<u:GetZoneAttributes xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetZoneAttributes>',
        'GetZoneAttributesResponse',
        'DeviceProperties',
        '<CurrentZoneName>Kantoor</CurrentZoneName><CurrentIcon>x-rincon-roomicon:office</CurrentIcon><CurrentConfiguration>1</CurrentConfiguration>'
      );
      const service = new DevicePropertiesService(TestHelpers.testHost, 1400);

      const zoneAttributes = await service.GetZoneAttributes();
      expect(zoneAttributes.CurrentZoneName).to.be.eq('Kantoor');
      expect(zoneAttributes.CurrentIcon).to.be.eq('x-rincon-roomicon:office');
      expect(zoneAttributes.CurrentConfiguration).to.be.eq(1);
    })
  })

  describe('GetZoneInfo', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/DeviceProperties/Control',
        '"urn:schemas-upnp-org:service:DeviceProperties:1#GetZoneInfo"',
        '<u:GetZoneInfo xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetZoneInfo>',
        'GetZoneInfoResponse',
        'DeviceProperties',
        '<SerialNumber>00-FF-FF-FF-FF-BC:A</SerialNumber><SoftwareVersion>56.0-76060</SoftwareVersion><DisplaySoftwareVersion>11.1</DisplaySoftwareVersion><HardwareVersion>1.16.4.1-2</HardwareVersion><IPAddress>192.168.2.30</IPAddress><MACAddress>00:FF:FF:FF:FF:BC</MACAddress><CopyrightInfo>© 2003-2019, Sonos, Inc. All rights reserved.</CopyrightInfo><ExtraInfo>OTP: 1.1.1(1-16-4-zp5s-0.5)</ExtraInfo><HTAudioIn>0</HTAudioIn><Flags>1</Flags>'
      );
      const service = new DevicePropertiesService(TestHelpers.testHost, 1400);

      const zoneInfo = await service.GetZoneInfo();
      expect(zoneInfo.MACAddress).to.be.eq('00:FF:FF:FF:FF:BC');
      expect(zoneInfo.SerialNumber).to.be.eq('00-FF-FF-FF-FF-BC:A');
    })
  })
})