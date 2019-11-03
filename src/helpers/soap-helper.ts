export class SoapHelper {
  static PutInEnvelope(message: string): string {
    return [// '<?xml version="1.0" encoding="utf-8"?>',
    '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
    '<s:Body>' + message + '</s:Body>',
    '</s:Envelope>'].join('\r\n')
  }
}