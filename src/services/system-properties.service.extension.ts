import { SystemPropertiesServiceBase } from './system-properties.service';

export interface AccountData {
  AuthToken?: string;
  Key?: string;
}

/**
 * Extended SystemPropertiesService, all extensions are to save and load accounts for music services. They should be there, but we cannot load them.
 *
 * @export
 * @class SystemPropertiesService
 * @extends {SystemPropertiesServiceBase}
 */
export class SystemPropertiesService extends SystemPropertiesServiceBase {
  /**
   * Same as GetString, but won't throw if the value isn't found (eg. missing)
   *
   * @param {string} VariableName Name of the variable
   * @returns {(Promise<string | undefined>)} saved value or undefined
   * @memberof SystemPropertiesService
   */
  public async GetStringSafe(VariableName: string): Promise<string | undefined> {
    return await this.GetString({ VariableName })
      .then((resp) => resp.StringValue)
      .catch(() => undefined);
  }

  /**
   * Custom extension to find out saved accounts.
   *
   * @returns {(Promise<number[] | undefined>)}
   * @memberof SystemPropertiesService
   */
  public async SavedAccounts(): Promise<number[] | undefined> {
    const result = await this.GetStringSafe('sonos-ts-accounts');
    if (typeof result === 'undefined') return undefined;
    return result.toString().split('|').map((s) => parseInt(s, 10));
  }

  /**
   * Custom extension to fetch account data, saved by this library
   *
   * @param {number} serviceId ID of the music service, as returned by the MusicServiceService.
   * @returns {(Promise<AccountData | undefined>)} Get the account data or nothing if not saved an account for this service.
   * @memberof SystemPropertiesService
   */
  public async GetAccountData(serviceId: number): Promise<AccountData | undefined> {
    const accounts = await this.SavedAccounts();
    if (accounts?.some((value) => value === serviceId)) {
      return {
        AuthToken: await this.GetStringSafe(`sonos-ts-${serviceId}-token`),
        Key: await this.GetStringSafe(`sonos-ts-${serviceId}-key`),
      } as AccountData;
    }
    return undefined;
  }

  /**
   * Custom extension to delete an account saved by this library.
   *
   * @param {number} serviceId ID of the music service, as returned by the MusicServiceService.
   * @returns {Promise<boolean>} true if account was found and deleted otherwise false
   * @memberof SystemPropertiesService
   */
  public async DeleteAccount(serviceId: number): Promise<boolean> {
    const accounts = await this.SavedAccounts() ?? [];
    if (accounts.indexOf(serviceId) > -1) {
      const newAccounts = accounts.filter((val) => val !== serviceId);
      await this.SetString({ VariableName: 'sonos-ts-accounts', StringValue: newAccounts.join('|') });
      await this.Remove({ VariableName: `sonos-ts-${serviceId}-key` });
      await this.Remove({ VariableName: `sonos-ts-${serviceId}-token` });
      return true;
    }
    return false;
  }

  /**
   * Custom extension to save account login data, in your sonos system.
   *
   * @param {number} serviceId
   * @param {string} token
   * @param {string} key
   * @returns {Promise<boolean>}
   * @memberof SystemPropertiesService
   */
  public async SaveAccount(serviceId: number, key: string, token: string): Promise<boolean> {
    const accounts = await this.SavedAccounts() ?? [];
    if (accounts.indexOf(serviceId) === -1) {
      accounts.push(serviceId);
      accounts.sort((a: number, b: number) => a - b);
      await this.SetString({ VariableName: 'sonos-ts-accounts', StringValue: accounts.join('|') });
    }
    await this.SetString({ VariableName: `sonos-ts-${serviceId}-token`, StringValue: token });
    await this.SetString({ VariableName: `sonos-ts-${serviceId}-key`, StringValue: key });
    return true;
  }
}
