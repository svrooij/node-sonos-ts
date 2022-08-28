import nock from 'nock'
import { expect } from 'chai';
import fs from 'fs'
import path from 'path'
import { createSocket } from 'dgram';
import SoapHelper from '../src/helpers/soap-helper'
import { PlayMode } from '../src/models';

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

    /**
   * Mock a soap request, easy way
   * @param endpoint Soap endpoint
   * @param service Service name like 'AVTransport'
   * @param action Soap action like 'Play'
   * @param requestBody the request body should look like this to match, like '<InstanceID>0</InstanceID>'
   * @param responseBody the soap response body, or ''
   * @param scope (optional) use this scope instead of creating a new scope
   */
  static mockRequestToServiceWithFileResponse(endpoint: string, service: string, action: string, requestBody: string | undefined, bodyFilenameParts: string[], scope = TestHelpers.getScope()): nock.Scope {
    const responseBody = fs.readFileSync(path.join(__dirname, ...bodyFilenameParts)).toString();
    return TestHelpers.mockRequestToService(endpoint, service, action, requestBody, responseBody, scope);
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

  static mockSonosLoadDeviceData(scope = TestHelpers.getScope()): nock.Scope {
    TestHelpers.mockRequestToService(
      '/DeviceProperties/Control',
      'DeviceProperties',
      'GetZoneAttributes',
      undefined,
      '<CurrentZoneName>Kantoor</CurrentZoneName><CurrentIcon>x-rincon-roomicon:office</CurrentIcon><CurrentConfiguration>1</CurrentConfiguration>',
      scope
    )

    TestHelpers.mockRequestToService(
      '/MediaRenderer/RenderingControl/Control',
      'RenderingControl',
      'GetMute',
      '<InstanceID>0</InstanceID><Channel>Master</Channel>',
      '<CurrentMute>0</CurrentMute>',
      scope
    )

    TestHelpers.mockRequestToService(
      '/MediaRenderer/RenderingControl/Control',
      'RenderingControl',
      'GetVolume',
      '<InstanceID>0</InstanceID><Channel>Master</Channel>',
      '<CurrentVolume>6</CurrentVolume>',
      scope
    )

    return scope;
  }

  static mockAvTransportGetMediaInfo(scope = TestHelpers.getScope()): nock.Scope {
    return TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
      'AVTransport',
      'GetMediaInfo',
      '<InstanceID>0</InstanceID>',
      '<NrTracks>70</NrTracks><MediaDuration>NOT_IMPLEMENTED</MediaDuration><CurrentURI>x-rincon-queue:RINCON_000E58644CBC01400#0</CurrentURI><CurrentURIMetaData></CurrentURIMetaData><NextURI></NextURI><NextURIMetaData></NextURIMetaData><PlayMedium>NETWORK</PlayMedium><RecordMedium>NOT_IMPLEMENTED</RecordMedium><WriteStatus>NOT_IMPLEMENTED</WriteStatus>',
      scope
    );
  }

  static mockAvTransportGetPositionInfo(scope = TestHelpers.getScope()): nock.Scope {
    return TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
      'AVTransport',
      'GetPositionInfo',
      '<InstanceID>0</InstanceID>',
      '<Track>18</Track><TrackDuration>0:02:28</TrackDuration><TrackMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;-1&quot; parentID=&quot;-1&quot; restricted=&quot;true&quot;&gt;&lt;res protocolInfo=&quot;sonos.com-spotify:*:audio/x-spotify:*&quot; duration=&quot;0:02:28&quot;&gt;x-sonos-spotify:spotify%3atrack%3a0C0LsZeUyAG50xJKEIpBgY?sid=9&amp;amp;flags=8224&amp;amp;sn=7&lt;/res&gt;&lt;r:streamContent&gt;&lt;/r:streamContent&gt;&lt;upnp:albumArtURI&gt;/getaa?s=1&amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a0C0LsZeUyAG50xJKEIpBgY%3fsid%3d9%26flags%3d8224%26sn%3d7&lt;/upnp:albumArtURI&gt;&lt;dc:title&gt;Catch My Love&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.musicTrack&lt;/upnp:class&gt;&lt;dc:creator&gt;Noizu&lt;/dc:creator&gt;&lt;upnp:album&gt;Catch My Love&lt;/upnp:album&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</TrackMetaData><TrackURI>x-sonos-spotify:spotify%3atrack%3a0C0LsZeUyAG50xJKEIpBgY?sid=9&amp;flags=8224&amp;sn=7</TrackURI><RelTime>0:00:48</RelTime><AbsTime>NOT_IMPLEMENTED</AbsTime><RelCount>2147483647</RelCount><AbsCount>2147483647</AbsCount>',
      scope
    );
  }

  static mockAvTransportSetPlayMode(playMode: PlayMode, scope = TestHelpers.getScope()): nock.Scope {
    return TestHelpers.mockRequestToService('/MediaRenderer/AVTransport/Control',
      'AVTransport',
      'SetPlayMode',
      `<InstanceID>0</InstanceID><NewPlayMode>${playMode}</NewPlayMode>`,
      '',
      scope
    );
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
