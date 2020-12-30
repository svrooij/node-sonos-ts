import { expect } from 'chai';
import { TestHelpers } from '../test-helpers';
import { SystemPropertiesService } from '../../src/services/system-properties.service.extension';
import { Guid } from 'guid-typescript';

describe('SystemPropertiesService', () => {
    describe('GetAccountData()', () => {
      it('returns undefined when no accounts found', async () => {
        TestHelpers.mockSoapError(
          '/SystemProperties/Control',
          '"urn:schemas-upnp-org:service:SystemProperties:1#GetString"',
          '<u:GetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-accounts</VariableName></u:GetString>',
          800,
          500,
          's:Client',
          'UPnPError'
        );
        const service = new SystemPropertiesService(TestHelpers.testHost, 1400);
        const result = await service.GetAccountData(300);
        expect(result).to.be.undefined;
      });
    })
    describe('DeleteAccount()', () => {
      it('deletes account', async() => {
        const port = 1500;
        const scope = TestHelpers.getScope(port);
        TestHelpers.mockRequest('/SystemProperties/Control',
          '"urn:schemas-upnp-org:service:SystemProperties:1#GetString"',
          '<u:GetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-accounts</VariableName></u:GetString>',
          'GetStringResponse',
          'SystemProperties',
          `<StringValue>9|300</StringValue>`,
          scope
        );
        TestHelpers.mockRequest('/SystemProperties/Control',
          '"urn:schemas-upnp-org:service:SystemProperties:1#SetString"',
          '<u:SetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-accounts</VariableName><StringValue>9</StringValue></u:SetString>',
          'SetStringResponse',
          'SystemProperties',
          undefined,
          scope
        );
        TestHelpers.mockRequest('/SystemProperties/Control',
          '"urn:schemas-upnp-org:service:SystemProperties:1#Remove"',
          '<u:Remove xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-300-key</VariableName></u:Remove>',
          'RemoveResponse',
          'SystemProperties',
          undefined,
          scope
        );

        TestHelpers.mockRequest('/SystemProperties/Control',
          '"urn:schemas-upnp-org:service:SystemProperties:1#Remove"',
          '<u:Remove xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-300-token</VariableName></u:Remove>',
          'RemoveResponse',
          'SystemProperties',
          undefined,
          scope
        );
        const service = new SystemPropertiesService(TestHelpers.testHost, port);
        const result = await service.DeleteAccount(300);
        expect(result).to.be.true;
        scope.isDone();
      });

      it('returns false when account not found', async () => {
        TestHelpers.mockSoapError(
          '/SystemProperties/Control',
          '"urn:schemas-upnp-org:service:SystemProperties:1#GetString"',
          '<u:GetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-accounts</VariableName></u:GetString>',
          800,
          500,
          's:Client',
          'UPnPError'
        );
        const service = new SystemPropertiesService(TestHelpers.testHost, 1400);
        const result = await service.DeleteAccount(300);
        expect(result).to.be.false;
      })
    })
    describe('SaveAccount(...)', () => {
      it('saves account and creates account list', async() => {
        const port = 1503;
        const scope = TestHelpers.getScope(port);
        TestHelpers.mockSoapError(
          '/SystemProperties/Control',
          '"urn:schemas-upnp-org:service:SystemProperties:1#GetString"',
          '<u:GetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-accounts</VariableName></u:GetString>',
          800,
          500,
          's:Client',
          'UPnPError',
          scope
        );
        TestHelpers.mockRequest('/SystemProperties/Control',
          '"urn:schemas-upnp-org:service:SystemProperties:1#SetString"',
          '<u:SetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-accounts</VariableName><StringValue>300</StringValue></u:SetString>',
          'SetStringResponse',
          'SystemProperties',
          undefined,
          scope
        );
        const key = Guid.create().toString();
        const token = Guid.create().toString();
        TestHelpers.mockRequest('/SystemProperties/Control',
          '"urn:schemas-upnp-org:service:SystemProperties:1#SetString"',
          `<u:SetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-300-key</VariableName><StringValue>${key}</StringValue></u:SetString>`,
          'SetStringResponse',
          'SystemProperties',
          undefined,
          scope
        );
        TestHelpers.mockRequest('/SystemProperties/Control',
          '"urn:schemas-upnp-org:service:SystemProperties:1#SetString"',
          `<u:SetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-300-token</VariableName><StringValue>${token}</StringValue></u:SetString>`,
          'SetStringResponse',
          'SystemProperties',
          undefined,
          scope
        );
        

        const service = new SystemPropertiesService(TestHelpers.testHost, port);
        const result = await service.SaveAccount(300, key, token);
        expect(result).to.be.true;
        scope.isDone();
      });

      it('saves account and updates account list', async() => {
        const port = 1501;
        const scope = TestHelpers.getScope(port);
        TestHelpers.mockRequest('/SystemProperties/Control',
          '"urn:schemas-upnp-org:service:SystemProperties:1#GetString"',
          '<u:GetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-accounts</VariableName></u:GetString>',
          'GetStringResponse',
          'SystemProperties',
          `<StringValue>9</StringValue>`,
          scope
        );
        TestHelpers.mockRequest('/SystemProperties/Control',
          '"urn:schemas-upnp-org:service:SystemProperties:1#SetString"',
          '<u:SetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-accounts</VariableName><StringValue>9|300</StringValue></u:SetString>',
          'SetStringResponse',
          'SystemProperties',
          undefined,
          scope
        );
        const key = Guid.create().toString();
        const token = Guid.create().toString();
        TestHelpers.mockRequest('/SystemProperties/Control',
          '"urn:schemas-upnp-org:service:SystemProperties:1#SetString"',
          `<u:SetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-300-key</VariableName><StringValue>${key}</StringValue></u:SetString>`,
          'SetStringResponse',
          'SystemProperties',
          undefined,
          scope
        );
        TestHelpers.mockRequest('/SystemProperties/Control',
          '"urn:schemas-upnp-org:service:SystemProperties:1#SetString"',
          `<u:SetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-300-token</VariableName><StringValue>${token}</StringValue></u:SetString>`,
          'SetStringResponse',
          'SystemProperties',
          undefined,
          scope
        );
        

        const service = new SystemPropertiesService(TestHelpers.testHost, port);
        const result = await service.SaveAccount(300, key, token);
        expect(result).to.be.true;
        scope.isDone();
      });

      it('saves account', async() => {
        const port = 1506;
        const scope = TestHelpers.getScope(port);
        TestHelpers.mockRequest('/SystemProperties/Control',
          '"urn:schemas-upnp-org:service:SystemProperties:1#GetString"',
          '<u:GetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-accounts</VariableName></u:GetString>',
          'GetStringResponse',
          'SystemProperties',
          `<StringValue>300</StringValue>`,
          scope
        );
        const key = Guid.create().toString();
        const token = Guid.create().toString();
        TestHelpers.mockRequest('/SystemProperties/Control',
          '"urn:schemas-upnp-org:service:SystemProperties:1#SetString"',
          `<u:SetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-300-key</VariableName><StringValue>${key}</StringValue></u:SetString>`,
          'SetStringResponse',
          'SystemProperties',
          undefined,
          scope
        );
        TestHelpers.mockRequest('/SystemProperties/Control',
          '"urn:schemas-upnp-org:service:SystemProperties:1#SetString"',
          `<u:SetString xmlns:u="urn:schemas-upnp-org:service:SystemProperties:1"><VariableName>sonos-ts-300-token</VariableName><StringValue>${token}</StringValue></u:SetString>`,
          'SetStringResponse',
          'SystemProperties',
          undefined,
          scope
        );
        

        const service = new SystemPropertiesService(TestHelpers.testHost, port);
        const result = await service.SaveAccount(300, key, token);
        expect(result).to.be.true;
        scope.isDone();
      });
    })
    describe('Event parsing', () => {
    it('works', (done) => {
      process.env.SONOS_DISABLE_EVENTS = 'true'
      const service = new SystemPropertiesService(TestHelpers.testHost, 1400);
      service.Events.once('serviceEvent', (data) => {
        expect(data.CustomerID).to.be.equal('111xxx');
        expect(data.UpdateID).to.be.equal(0);
        expect(data.UpdateIDX).to.be.equal(0);
        done()
      })
      service.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><CustomerID>111xxx</CustomerID></e:property><e:property><UpdateID>0</UpdateID></e:property><e:property><UpdateIDX>0</UpdateIDX></e:property><e:property><ThirdPartyHash></ThirdPartyHash></e:property></e:propertyset>');
      delete process.env.SONOS_DISABLE_EVENTS
    }, 1)
  })
});
