import nock from 'nock'
import fs from 'fs'
import path from 'path'
import SoapHelper from '../src/helpers/soap-helper'

export class TestHelpers {
  static get testHost (): string {
    return 'localhost';
  }

  static getScope(port = 1400, options: nock.Options | undefined = undefined): nock.Scope {
    return nock(`http://${TestHelpers.testHost}:${port}`, options);
  }

  static generateResponse (responseTag: string, serviceName: string, responseBody: string | undefined) {
    const soapBody = `<u:${responseTag} xmlns:u="urn:schemas-upnp-org:service:${serviceName}:1">${(responseBody || '')}</u:${responseTag}>`
    return SoapHelper.PutInEnvelope(soapBody)
  }
  
  static mockRequest(endpoint: string, action: string, requestBody: string, responseTag: string, responseService: string, responseBody?: string, scope: nock.Scope = TestHelpers.getScope()): nock.Scope {
    return scope
      .post(endpoint, requestBody ? SoapHelper.PutInEnvelope(requestBody) : undefined, { reqheaders: {
        soapaction: action
      }})
      .reply(200, TestHelpers.generateResponse(responseTag, responseService, responseBody))
    //return TestHelpers.mockRequestInScope(scope, endpoint, action, requestBody, responseTag, responseService, responseBody);
  }

  static mockRequestToService(endpoint: string, service: string, action: string, requestBody: string, responseBody: string | undefined, scope: nock.Scope = TestHelpers.getScope()): nock.Scope {
    return TestHelpers.mockRequest(endpoint,
      `"urn:schemas-upnp-org:service:${service}:1#${action}"`,
      `<u:${action} xmlns:u="urn:schemas-upnp-org:service:${service}:1">${requestBody}</u:${action}>`,
      `${action}Response`,
      service,
      responseBody,
      scope)
  }

  static mockHttpError(endpoint: string, action: string, requestBody: string, httpErrorCode: number = 500, scope: nock.Scope = TestHelpers.getScope()): nock.Scope {
    return scope
      .post(endpoint, SoapHelper.PutInEnvelope(requestBody), { reqheaders: { soapaction: action } })
      .reply(httpErrorCode, '' );
  }

  static mockSoapError(endpoint: string, action: string, requestBody: string, upnpErrorCode: number = 718, httpErrorCode: number = 500, faultCode: string = 's:Client', faultString: string = 'UPnPError', scope: nock.Scope = TestHelpers.getScope()): nock.Scope {
    return scope
      .post(endpoint, SoapHelper.PutInEnvelope(requestBody), { reqheaders: { soapaction: action } })
      .reply(httpErrorCode, 
        SoapHelper.PutInEnvelope(`<s:Fault><faultcode>${faultCode}</faultcode><faultstring>${faultString}</faultstring><detail><UPnPError xmlns="urn:schemas-upnp-org:control-1-0"><errorCode>${upnpErrorCode}</errorCode></UPnPError></detail></s:Fault>`)
      );
  }

  static mockAlarmListResponse(scope: nock.Scope = TestHelpers.getScope()): nock.Scope {
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

  static mockMusicServicesListResponse(scope: nock.Scope = TestHelpers.getScope()) : nock.Scope {
    return TestHelpers.mockSoapRequestWithFile('/MusicServices/Control',
      '"urn:schemas-upnp-org:service:MusicServices:1#ListAvailableServices"',
      '<u:ListAvailableServices xmlns:u="urn:schemas-upnp-org:service:MusicServices:1"></u:ListAvailableServices>',
      'ListAvailableServicesResponse',
      'MusicServices',
      ['services', 'responses', 'music-services.ListAvailableServices.xml'],
      scope);
    }

  static mockZoneGroupState(scope: nock.Scope = TestHelpers.getScope(), file: string = 'zone-group.GroupState.xml'): nock.Scope {
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

  static mockSoapRequestWithFile(endpoint: string, action: string, requestBody: string, responseTag: string, responseService: string, bodyFileParts: string[], scope: nock.Scope = TestHelpers.getScope()): nock.Scope {
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

  static mockDeviceDesription(scope: nock.Scope = TestHelpers.getScope()): nock.Scope {
    const responseBody = fs.readFileSync(path.join(__dirname, 'services', 'responses', 'device_description.xml')).toString()
    return scope
      .get('/xml/device_description.xml')
      .reply(200, responseBody);
  }
}
