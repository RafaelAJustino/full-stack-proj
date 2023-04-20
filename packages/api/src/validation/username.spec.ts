import * as UsernameValidation from './username';

describe('Validation - Currency', () => {
  describe('isValidUsername', () => {
    it('should be false', () => {
      const results = [
        UsernameValidation.isValidUsername(undefined),
        UsernameValidation.isValidUsername('aaa'),
        UsernameValidation.isValidUsername('abcdefghijklmnopqrstuvwxyz'),
        UsernameValidation.isValidUsername('jasbnd@'),
        UsernameValidation.isValidUsername('jasbnd_'),
      ];

      results.forEach((res) => {
        expect(res.valid).toBe(false);
        expect(res.errors.length).toBeGreaterThan(0);
      });
    });

    it('should be true', () => {
      const results = [
        UsernameValidation.isValidUsername('automativo'),
        UsernameValidation.isValidUsername('automativo_123'),
        UsernameValidation.isValidUsername('123_auTOmativo_123'),
      ];

      results.forEach((res) => {
        expect(res.valid).toBe(true);
        expect(res.errors.length).toBe(0);
      });
    });
  });
});
