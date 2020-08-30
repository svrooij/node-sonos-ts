
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
   * Custom extension to fetch account data, saved by this library
   *
   * @param {string} serviceName Name of the music service, as returned by the MusicServiceService.
   * @returns {(Promise<AccountData | undefined>)} Get the account data or nothing if not saved an account for this service.
   * @memberof SystemPropertiesService
   */
  public async GetAccountData(serviceName: string): Promise<AccountData | undefined> {
    const accounts = await this.SavedAccounts();
    if (accounts?.some((value) => value === serviceName)) {
      return {
        AuthToken: await this.GetStringSafe(`sonos-ts-${serviceName.toLowerCase()}-token`),
        Key: await this.GetStringSafe(`sonos-ts-${serviceName.toLowerCase()}-key`),
      } as AccountData;
    }
    return undefined;
  }

  /**
   * Custom extension to delete an account saved by this library.
   *
   * @param {string} serviceName Name of the music service, as returned by the MusicServiceService.
   * @returns {Promise<boolean>} true if account was found and deleted otherwise false
   * @memberof SystemPropertiesService
   */
  public async DeleteAccount(serviceName: string): Promise<boolean> {
    const accounts = await this.SavedAccounts() ?? [];
    if (accounts.indexOf(serviceName) > -1) {
      const newAccounts = accounts.filter((val) => val !== serviceName);
      await this.SetString({ VariableName: 'sonos-ts-accounts', StringValue: newAccounts.join('|') });
      await this.Remove({ VariableName: `sonos-ts${serviceName.toLowerCase()}-key` });
      await this.Remove({ VariableName: `sonos-ts${serviceName.toLowerCase()}-token` });
      return true;
    }
    return false;
  }

  /**
   * Custom extension to save account login data, in your sonos system.
   *
   * @param {string} serviceName
   * @param {string} token
   * @param {string} key
   * @returns {Promise<boolean>}
   * @memberof SystemPropertiesService
   */
  public async SaveAccount(serviceName: string, key: string, token: string): Promise<boolean> {
    const accounts = await this.SavedAccounts() ?? [];
    if (accounts.indexOf(serviceName) === -1) {
      accounts.push(serviceName);
      accounts.sort();
      await this.SetString({ VariableName: 'sonos-ts-accounts', StringValue: accounts.join('|') });
    }
    await this.SetString({ VariableName: `sonos-ts-${serviceName.toLowerCase()}-token`, StringValue: token });
    await this.SetString({ VariableName: `sonos-ts-${serviceName.toLowerCase()}-key`, StringValue: key });
    return true;
  }

  /**
   * Custom extension to find out saved accounts.
   *
   * @returns {(Promise<string[] | undefined>)}
   * @memberof SystemPropertiesService
   */
  public async SavedAccounts(): Promise<string[] | undefined> {
    const result = await this.GetStringSafe('sonos-ts-accounts');
    return result?.split('|');
  }
}
