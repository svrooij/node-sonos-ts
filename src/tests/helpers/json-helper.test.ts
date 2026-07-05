import JsonHelper from '../../helpers/json-helper';

describe('JsonHelper', () => {
  describe('TryParse(...)', () => {
    it('returns string when send regular string', () => {
      const input = 'AHGAstewrjh":dd35662dd';

      const result = JsonHelper.TryParse(input);
      expect(result).toBeDefined();
      expect(result).toBe(input);
    });

    it('returns object when send valid json string', () => {
      const input = JSON.stringify({ Id: 20, Name: 'Testname', Active: true });

      const result = JsonHelper.TryParse(input);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('Id', 20);
      expect(result).toHaveProperty('Name', 'Testname');
      expect(result).toHaveProperty('Active', true);
    });
  });
});
