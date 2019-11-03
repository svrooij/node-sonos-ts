// Auto-generated on Sun Nov 03 2019 16:33:10 GMT+0100 (Central European Standard Time)
import { BaseService } from './base-service';

export class MusicServicesService extends BaseService {
  readonly serviceNane: string = 'MusicServices';
  readonly controlUrl: string = '/MusicServices/Control';  
  readonly eventSubUrl: string = '/MusicServices/Event';
  readonly scpUrl: string = '/xml/MusicServices1.xml';
  

  // Actions
  GetSessionId(input: { ServiceId: number, Username: string }): Promise<GetSessionIdResponse> { return this.SoapRequestWithBody<typeof input, GetSessionIdResponse>('GetSessionId', input); }
  ListAvailableServices(): Promise<ListAvailableServicesResponse> { return this.SoapRequest<ListAvailableServicesResponse>('ListAvailableServices'); }
  UpdateAvailableServices(): Promise<boolean> { return this.SoapRequestNoResponse('UpdateAvailableServices'); }
}

// Response classes
export interface GetSessionIdResponse {
  SessionId: string
}

export interface ListAvailableServicesResponse {
  AvailableServiceDescriptorList: string,
  AvailableServiceTypeList: string,
  AvailableServiceListVersion: string
}
