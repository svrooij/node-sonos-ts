import { expect } from 'chai';

import IpHelper from '../../src/helpers/ip-helper';

describe('IpHelper', () => {
  describe('IsIpv4(...)', () => {
    it('returns true for 1.1.8.6', () => {
      const input = '1.1.8.6';

      const result = IpHelper.IsIpv4(input);
      expect(result).to.be.true;
    });
    it('returns true for 192.168.0.10', () => {
      const input = '192.168.0.10';

      const result = IpHelper.IsIpv4(input);
      expect(result).to.be.true;
    });

    it('returns true for 255.0.0.1', () => {
      const input = '255.0.0.1';

      const result = IpHelper.IsIpv4(input);
      expect(result).to.be.true;
    });

    it('returns false for host.local', () => {
      const input = 'host.local';

      const result = IpHelper.IsIpv4(input);
      expect(result).to.be.false;
    });

    it('returns false for some-sonos-speaker', () => {
      const input = 'some-sonos-speaker';

      const result = IpHelper.IsIpv4(input);
      expect(result).to.be.false;
    });

    it('returns false for some-sonos-speaker.svrooij.io', () => {
      const input = 'some-sonos-speaker.svrooij.io';

      const result = IpHelper.IsIpv4(input);
      expect(result).to.be.false;
    });

  });
});
