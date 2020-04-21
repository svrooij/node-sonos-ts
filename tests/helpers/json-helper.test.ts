import { expect } from 'chai';

import JsonHelper from '../../src/helpers/json-helper';

describe('JsonHelper', () => {
  describe('TryParse(...)', () => {
    it('returns string when send regular string', () => {
      const input = 'AHGAstewrjh":dd35662dd';

      const result = JsonHelper.TryParse(input);
      expect(result).to.be.an('string');
      expect(result).to.be.eq(input);
    });

    it('returns object when send valid json string', () => {
      const input = JSON.stringify({ Id: 20, Name: 'Testname', Active: true });

      const result = JsonHelper.TryParse(input);
      expect(result).to.be.an('object');
      expect(result).to.have.property('Id', 20);
      expect(result).to.have.property('Name', 'Testname');
      expect(result).to.have.property('Active', true);
    });
  });
});
