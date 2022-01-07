import nock from 'nock'
import fs from 'fs'
import path from 'path'
import { createSocket } from 'dgram';
import SoapHelper from '../src/helpers/soap-helper'
import { expect } from 'chai';

/**
 * Some helpers to setup mocked sonos http requests
 */
export class TestHelpers {
  static get testHost (): string {
    return 'sonos-test-host';
  }

  /**
   * Create a scope separate from the request to set specific settings (like a different port)
   * @param port The port the nock scope should be for.
   * @param options Extra nock options
   */
  static getScope(port = 1400, options: nock.Options | undefined = undefined, host = TestHelpers.testHost): nock.Scope {
    return nock(`http://${host}:${port}`, options);
  }

  private static generateResponse (responseTag: string, serviceName: string, responseBody: string | undefined) {
    const soapBody = `<u:${responseTag} xmlns:u="urn:schemas-upnp-org:service:${serviceName}:1">${(responseBody || '')}</u:${responseTag}>`
    return SoapHelper.PutInEnvelope(soapBody)
  }
  
  /**
   * Mock a soap request, hard way, see TestHelpers.mockRequestToService(...)
   * @param endpoint Soap endpoint
   * @param action Soap action
   * @param requestBody How should the request look like
   * @param responseTag Response tag, like '{ActionName}Response'
   * @param responseService Name of service (used in response)
   * @param responseBody This should be returned inside the soap response
   * @param scope (optional) use this scope instead of creating a new scope
   */
  static mockRequest(endpoint: string, action: string, requestBody: string, responseTag: string, responseService: string, responseBody: string | undefined = undefined, scope = TestHelpers.getScope()): nock.Scope {
    return scope
      .post(endpoint, requestBody ? SoapHelper.PutInEnvelope(requestBody) : undefined, { reqheaders: {
        soapaction: action
      }})
      .reply(200, TestHelpers.generateResponse(responseTag, responseService, responseBody))
    //return TestHelpers.mockRequestInScope(scope, endpoint, action, requestBody, responseTag, responseService, responseBody);
  }

  /**
   * Mock a soap request, easy way
   * @param endpoint Soap endpoint
   * @param service Service name like 'AVTransport'
   * @param action Soap action like 'Play'
   * @param requestBody the request body should look like this to match, like '<InstanceID>0</InstanceID>'
   * @param responseBody the soap response body, or ''
   * @param scope (optional) use this scope instead of creating a new scope
   */
  static mockRequestToService(endpoint: string, service: string, action: string, requestBody: string | undefined, responseBody: string = '', scope = TestHelpers.getScope()): nock.Scope {
    return TestHelpers.mockRequest(endpoint,
      `"urn:schemas-upnp-org:service:${service}:1#${action}"`,
      `<u:${action} xmlns:u="urn:schemas-upnp-org:service:${service}:1">${requestBody ?? ''}</u:${action}>`,
      `${action}Response`,
      service,
      responseBody,
      scope)
  }

  static mockHttpError(endpoint: string, action: string, requestBody: string, httpErrorCode = 500, scope = TestHelpers.getScope()): nock.Scope {
    return scope
      .post(endpoint, SoapHelper.PutInEnvelope(requestBody), { reqheaders: { soapaction: action } })
      .reply(httpErrorCode, '' );
  }

  static mockSoapError(endpoint: string, action: string, requestBody: string, upnpErrorCode = 718, httpErrorCode = 500, faultCode = 's:Client', faultString = 'UPnPError', scope = TestHelpers.getScope()): nock.Scope {
    return scope
      .post(endpoint, SoapHelper.PutInEnvelope(requestBody), { reqheaders: { soapaction: action } })
      .reply(httpErrorCode, 
        SoapHelper.PutInEnvelope(`<s:Fault><faultcode>${faultCode}</faultcode><faultstring>${faultString}</faultstring><detail><UPnPError xmlns="urn:schemas-upnp-org:control-1-0"><errorCode>${upnpErrorCode}</errorCode></UPnPError></detail></s:Fault>`)
      );
  }

  static mockAlarmListResponse(scope = TestHelpers.getScope()): nock.Scope {
    return TestHelpers.mockSoapRequestWithFile(
      '/AlarmClock/Control',
      '"urn:schemas-upnp-org:service:AlarmClock:1#ListAlarms"',
      '<u:ListAlarms xmlns:u="urn:schemas-upnp-org:service:AlarmClock:1"></u:ListAlarms>',
      'ListAlarmsResponse',
      'AlarmClock',
      ['services', 'responses', 'alarm-service.ListAlarms.xml'],
      scope
    );
  }

  static mockMusicServicesListResponse(scope = TestHelpers.getScope()) : nock.Scope {
    return TestHelpers.mockSoapRequestWithFile('/MusicServices/Control',
      '"urn:schemas-upnp-org:service:MusicServices:1#ListAvailableServices"',
      '<u:ListAvailableServices xmlns:u="urn:schemas-upnp-org:service:MusicServices:1"></u:ListAvailableServices>',
      'ListAvailableServicesResponse',
      'MusicServices',
      ['services', 'responses', 'music-services.ListAvailableServices.xml'],
      scope);
    }

  static mockZoneGroupState(scope = TestHelpers.getScope(), file = 'zone-group.GroupState.xml'): nock.Scope {
    return TestHelpers.mockSoapRequestWithFile(
      '/ZoneGroupTopology/Control',
      '"urn:schemas-upnp-org:service:ZoneGroupTopology:1#GetZoneGroupState"',
      '<u:GetZoneGroupState xmlns:u="urn:schemas-upnp-org:service:ZoneGroupTopology:1"></u:GetZoneGroupState>',
      'GetZoneGroupStateResponse',
      'ZoneGroupTopology',
      ['services', 'responses', file],
      scope
    );
  }

  static mockSoapRequestWithFile(endpoint: string, action: string, requestBody: string, responseTag: string, responseService: string, bodyFileParts: string[], scope = TestHelpers.getScope()): nock.Scope {
    const responseBody = fs.readFileSync(path.join(__dirname, ...bodyFileParts)).toString()
    return TestHelpers.mockRequest(
      endpoint,
      action,
      requestBody,
      responseTag,
      responseService,
      responseBody,
      scope
    );
  }

  static mockDeviceDesription(scope = TestHelpers.getScope()): nock.Scope {
    const responseBody = fs.readFileSync(path.join(__dirname, 'services', 'responses', 'device_description.xml')).toString()
    return scope
      .get('/xml/device_description.xml')
      .reply(200, responseBody);
  }
 
  static async emitSsdpMessage(port?: number, address = 'localhost', playerModel = 'ZPS1', ip = '127.16.0.1', uuid = 'RINCON_AABBAABBAABBA1400', householdId = 'Sonos_b520c167832c49388331eb1930'): Promise<void> {
    return new Promise((resolve, reject) => {
      const smartSpeakerId = '90cefea176704568af4d'
      const socket = createSocket({ type: 'udp4', reuseAddr: true });
      socket.on('error', (err) => {
        reject(err);
      })
      const buffer = Buffer.from([
        'NOTIFY * HTTP/1.1',
        'HOST: 239.255.255.250:1900',
        'CACHE-CONTROL: max-age = 1800',
        `LOCATION: http://${ip}:1400/xml/device_description.xml`,
        `NT: uuid:${uuid}`,
        'NTS: ssdp:alive',
        `SERVER: Linux UPnP/1.0 Sonos/57.9-23290 (${playerModel})`,
        `USN: uuid:${uuid}`,
        `X-RINCON-HOUSEHOLD: ${householdId}`,
        'X-RINCON-BOOTSEQ: 110',
        'X-RINCON-WIFIMODE: 0',
        'X-RINCON-VARIANT: 0',
        `HOUSEHOLD.SMARTSPEAKER.AUDIO: ${householdId}.${smartSpeakerId}`
      ].join('\r\n'));
      socket.send(buffer, port, address, (err, bytes) => {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      });
    })
    
  }

  static async expectThrowsAsync(method: Function, errorMessage?: string, upnpErrorDescription?: string) {
    let error = undefined;
    try {
      await method();
    } catch (err) {
      error = err;
    }
    expect(error).to.be.an('Error')
    if (errorMessage) {
      expect(error.message).to.equal(errorMessage)
    }
    if (upnpErrorDescription) {
      expect(error).to.have.nested.property('UpnpErrorDescription', upnpErrorDescription);
    }
  }
}
