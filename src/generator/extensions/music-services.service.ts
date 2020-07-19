
import XmlHelper from '../helpers/xml-helper';
import ArrayHelper from '../helpers/array-helper';

export interface MusicService {
  Capabilities: string;
  ContainerType: string;
  Id: number;
  Manifest: { Uri: string; Version: string };
  Name: string;
  Policy: { Auth: 'Anonymous' | 'AppLink' | 'DeviceLink' | 'UserId'; PollInterval?: number };
  Presentation?: { Strings?: { Uri: string; Version: string }; PresentationMap?: { Uri: string; Version: string }};
  SecureUri: string;
  Uri: string;
  Version: string;
}

export class MusicServicesService extends MusicServicesServiceBase {
  private musicServices?: Array<MusicService>;

  /**
   * A parsed version of ListAvailableServices
   *
   * @param {boolean} [cache=false] Should the list be fetched once and then kept in memory?
   * @returns {Promise<Array<MusicService>>} All available music services (not only subscribed ones).
   * @memberof MusicServicesService
   */
  public async ListAndParseAvailableServices(cache = false): Promise<Array<MusicService>> {
    if (cache === true && this.musicServices !== undefined) {
      return this.musicServices;
    }
    const encodedResponse = await this.ListAvailableServices();
    const raw = XmlHelper.DecodeAndParseXml(encodedResponse.AvailableServiceDescriptorList, '');
    const result = ArrayHelper.ForceArray(raw.Services.Service)
      .map((service) => MusicServicesService.ParseMusicService(service))
      .sort((a, b) => a.Name.localeCompare(b.Name));

    if (cache === true) {
      this.musicServices = result;
    }
    return result;
  }

  private static ParseMusicService(service: any): MusicService {
    const temp = service;
    const result = {
      Id: parseInt(service.Id, 10),
      Policy: {
        Auth: service.Policy?.Auth,
        PollInterval: parseInt(service?.Policy?.PollInterval || '-1', 10),
      },
    };
    delete temp.Id;
    delete temp.Policy;
    return { ...temp, ...result } as MusicService;
  }
}
