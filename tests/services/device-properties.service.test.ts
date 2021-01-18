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
    });
  });

  describe('GetDeviceCapabilities', () => {
    it('executes correct request', async (done) => {
      TestHelpers.mockRequestToService('/DeviceProperties/Control',
        'DeviceProperties',
        'SetLEDState',
        '<DesiredLEDState>Off</DesiredLEDState>',
        ''
      );
      const service = new DevicePropertiesService(TestHelpers.testHost);
      const result = await service.SetLEDState({ DesiredLEDState: 'Off'});
      expect(result).to.be.true;
      done();
    });
  });

  describe('Event parsing', () => {
    it('works', (done) => {
      process.env.SONOS_DISABLE_EVENTS = 'true'
      const service = new DevicePropertiesService(TestHelpers.testHost, 1400);
      service.Events.once('serviceEvent', (data) => {
        expect(data.Icon).to.be.equal('x-rincon-roomicon:office');
        expect(data.SupportsAudioClip).to.be.false;
        expect(data.SupportsAudioIn).to.be.true;
        expect(data.WifiEnabled).to.be.false;
        expect(data.WirelessLeafOnly).to.be.false;
        expect(data.WirelessMode).to.be.equal(0);
        expect(data.ZoneName).to.be.equal('Kantoor');

        done();
      })
      service.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><ZoneName>Kantoor</ZoneName></e:property><e:property><Icon>x-rincon-roomicon:office</Icon></e:property><e:property><Configuration>1</Configuration></e:property><e:property><Invisible>0</Invisible></e:property><e:property><IsZoneBridge>0</IsZoneBridge></e:property><e:property><WirelessMode>0</WirelessMode></e:property><e:property><WirelessLeafOnly>0</WirelessLeafOnly></e:property><e:property><HasConfiguredSSID>0</HasConfiguredSSID></e:property><e:property><ChannelFreq>2412</ChannelFreq></e:property><e:property><BehindWifiExtender>0</BehindWifiExtender></e:property><e:property><WifiEnabled>0</WifiEnabled></e:property><e:property><SettingsReplicationState>RINCON_949F3E68DEA901400,45,RINCON_FFFFFFFFFFFF99999,0,RINCON_B8E9375A170401400,10,RINCON_B8E9375A170401400,1693,RINCON_B8E9378A0DDC01400,373,RINCON_B8E9378A0DDC01400,2690,RINCON_B8E9378A0DDC01400,990,RINCON_FFFFFFFFFFFF99999,0,RINCON_B8E9378A0DDC01400,8,RINCON_FFFFFFFFFFFF99999,0,RINCON_B8E9378A0DDC01400,49,RINCON_B8E9378A0DDC01400,16788,RINCON_000E58CE442C01400,7,RINCON_000E58644CBC01400,8,RINCON_000E58644CBC01400,0,RINCON_000E58644CBC01400,101</SettingsReplicationState></e:property><e:property><SecureRegState>3</SecureRegState></e:property><e:property><IsIdle>0</IsIdle></e:property><e:property><MoreInfo></MoreInfo></e:property><e:property><ChannelMapSet></ChannelMapSet></e:property><e:property><HTSatChanMapSet></HTSatChanMapSet></e:property><e:property><HTBondedZoneCommitState>0</HTBondedZoneCommitState></e:property><e:property><Orientation>0</Orientation></e:property><e:property><LastChangedPlayState>PLAYING,,,</LastChangedPlayState></e:property><e:property><AvailableRoomCalibration>000E58644CBC01400_2.1.0.1_2017-04-14_15-09-44</AvailableRoomCalibration></e:property><e:property><RoomCalibrationState>1</RoomCalibrationState></e:property><e:property><ConfigMode></ConfigMode></e:property><e:property><SupportsAudioIn>1</SupportsAudioIn></e:property><e:property><SupportsAudioClip>0</SupportsAudioClip></e:property></e:propertyset>');
      delete process.env.SONOS_DISABLE_EVENTS
    }, 1)
  })
})