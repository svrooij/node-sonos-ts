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
  
  static mockRequest (endpoint: string, action: string, requestBody: string, responseTag: string, serviceName: string, responseBody?: string) {
    return nock(`http://${TestHelpers.testHost}:1400`, { reqheaders: { soapaction: action } })
      .post(endpoint, SoapHelper.PutInEnvelope(requestBody))
      .reply(200, TestHelpers.generateResponse(responseTag, serviceName, responseBody))
  }

  static mockAlarmListResponse() {
    const responseBody = fs.readFileSync(path.join(__dirname, 'services', 'responses', 'alarm-service.ListAlarms.xml')).toString()
    TestHelpers.mockRequest('/AlarmClock/Control',
      '"urn:schemas-upnp-org:service:AlarmClock:1#ListAlarms"',
      '<u:ListAlarms xmlns:u="urn:schemas-upnp-org:service:AlarmClock:1"></u:ListAlarms>',
      'ListAlarmsResponse',
      'AlarmClock',
      responseBody
    );
  }
}
