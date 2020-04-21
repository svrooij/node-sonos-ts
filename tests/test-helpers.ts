import nock from 'nock'
import fs from 'fs'
import path from 'path'
import SoapHelper from '../src/helpers/soap-helper'

export class TestHelpers {
  static get testHost (): string {
    return 'localhost';
  }

  static generateResponse (responseTag: string, serviceName: string, responseBody: string | undefined) {
    const soapBody = `<u:${responseTag} xmlns:u="urn:schemas-upnp-org:service:${serviceName}:1">${(responseBody || '')}</u:${responseTag}>`
    return SoapHelper.PutInEnvelope(soapBody)
  }
  
  static mockRequest (endpoint: string, action: string, requestBody: string, responseTag: string, responseService: string, responseBody?: string) {
    return nock(`http://${TestHelpers.testHost}:1400`, { reqheaders: { soapaction: action } })
      .post(endpoint, SoapHelper.PutInEnvelope(requestBody))
      .reply(200, TestHelpers.generateResponse(responseTag, responseService, responseBody))
  }

  static mockHttpError(endpoint: string, action: string, requestBody: string, httpErrorCode: number = 500) {
    return nock(`http://${TestHelpers.testHost}:1400`, { reqheaders: { soapaction: action } })
      .post(endpoint, SoapHelper.PutInEnvelope(requestBody))
      .reply(httpErrorCode, '' );
  }

  static mockSoapError(endpoint: string, action: string, requestBody: string, upnpErrorCode: number = 718, httpErrorCode: number = 500, faultCode: string = 's:Client', faultString: string = 'UPnPError') {
    return nock(`http://${TestHelpers.testHost}:1400`, { reqheaders: { soapaction: action } })
      .post(endpoint, SoapHelper.PutInEnvelope(requestBody))
      .reply(httpErrorCode, 
        SoapHelper.PutInEnvelope(`<s:Fault><faultcode>${faultCode}</faultcode><faultstring>${faultString}</faultstring><detail><UPnPError xmlns="urn:schemas-upnp-org:control-1-0"><errorCode>${upnpErrorCode}</errorCode></UPnPError></detail></s:Fault>`)
      );
  }

  static mockAlarmListResponse() {
    TestHelpers.mockSoapRequestWithFile('/AlarmClock/Control',
      '"urn:schemas-upnp-org:service:AlarmClock:1#ListAlarms"',
      '<u:ListAlarms xmlns:u="urn:schemas-upnp-org:service:AlarmClock:1"></u:ListAlarms>',
      'ListAlarmsResponse',
      'AlarmClock',
      ['services', 'responses', 'alarm-service.ListAlarms.xml']
    );
  }

  static mockZoneGroupState() {
    TestHelpers.mockSoapRequestWithFile('/ZoneGroupTopology/Control',
      '"urn:schemas-upnp-org:service:ZoneGroupTopology:1#GetZoneGroupState"',
      '<u:GetZoneGroupState xmlns:u="urn:schemas-upnp-org:service:ZoneGroupTopology:1"></u:GetZoneGroupState>',
      'GetZoneGroupStateResponse',
      'ZoneGroupTopology',
      ['services', 'responses', 'zone-group.GroupState.xml']
    );
  }

  static mockSoapRequestWithFile(endpoint: string, action: string, requestBody: string, responseTag: string, responseService: string, bodyFileParts: string[]) {
    const responseBody = fs.readFileSync(path.join(__dirname, ...bodyFileParts)).toString()
    TestHelpers.mockRequest(endpoint,
      action,
      requestBody,
      responseTag,
      responseService,
      responseBody
    );
  }
}
