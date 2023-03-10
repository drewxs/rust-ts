import { Result } from '../src';

describe('Result class', () => {
  describe('is_ok method', () => {
    it('returns true if the result is an Ok value', () => {
      const result = Result.ok(42);
      expect(result.is_ok()).toBe(true);
    });

    it('returns false if the result is an Err value', () => {
      const result = Result.err('an error occurred');
      expect(result.is_ok()).toBe(false);
    });
  });

  describe('is_err method', () => {
    it('returns true if the result is an Err value', () => {
      const result = Result.err('an error occurred');
      expect(result.is_err()).toBe(true);
    });

    it('returns false if the result is an Ok value', () => {
      const result = Result.ok(42);
      expect(result.is_err()).toBe(false);
    });
  });

  describe('unwrap method', () => {
    it('returns the value if the result is an Ok value', () => {
      const result = Result.ok(42);
      expect(result.unwrap()).toBe(42);
    });

    it('throws an error if the result is an Err value', () => {
      const result = Result.err('an error occurred');
      expect(() => result.unwrap()).toThrow('an error occurred');
    });
  });

  describe('unwrap_err method', () => {
    it('returns the error if the result is an Err value', () => {
      const result = Result.err('an error occurred');
      expect(result.unwrap_err()).toBe('an error occurred');
    });

    it('throws an error if the result is an Ok value', () => {
      const result = Result.ok(42);
      expect(() => result.unwrap_err()).toThrow('called `unwrap_err()` on an `Ok` value: 42');
    });
  });
});
