import debug from 'debug';

const dns = import('dns');

export default class IpHelper {
  private static debug = debug('sonos:dns');

  /**
   * Check if a strig is a valid IP (v4) address.
   * @param hostOrIp Hostname or ip you wish to check
   * @returns whether or not the input validates as an IP.
   */
  static IsIpv4(hostOrIp: string) : boolean {
    const regexExp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
    return regexExp.test(hostOrIp);
  }

  /**
   * Async method to resolve a hostname, with catch that returns the input on error.
   * @param hostname Hostname you wish to resolve
   * @returns The IP or the inputted hostname if the name could not be resolved
   */
  static async ResolveHostname(hostname: string): Promise<string> {
    IpHelper.debug('Resolving %s', hostname);
    const { promises } = (await dns);
    return promises
      .lookup(hostname)
      .then((result) => {
        IpHelper.debug('Resolved %s to %s', hostname, result.address);
        return result.address;
      })
      .catch((err) => {
        IpHelper.debug('Error resolving %s to ip', hostname, err);
        return hostname;
      });
  }
}
