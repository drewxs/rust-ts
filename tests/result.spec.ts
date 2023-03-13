import { Ok, Err } from '../src';

describe('Result', () => {
  describe('Ok', () => {
    it('should create an Ok value', () => {
      const val = new Ok(42);
      expect(val.is_ok()).toBe(true);
      expect(val.is_err()).toBe(false);
      expect(val.unwrap()).toBe(42);
    });

    it('should map an Ok value to another Ok value', () => {
      const val = new Ok(42);
      const res = val.map((v) => v.toString());
      expect(res.is_ok()).toBe(true);
      expect(res.unwrap()).toBe('42');
    });

    it('should map an Ok value to an Err value', () => {
      const val = new Ok(42);
      const res = val.map_err((err) => new Err(err));
      expect(res.is_err()).toBe(false);
      expect(res.unwrap()).toBe(42);
    });

    it('should chain Ok values using and_then', () => {
      const val = new Ok(42);
      const res = val.and_then((v) => new Ok(v.toString()));
      expect(res.is_ok()).toBe(true);
      expect(res.unwrap()).toBe('42');
    });

    it('should chain Ok values using and', () => {
      const val1 = new Ok(42);
      const val2 = new Ok(69);
      const res = val1.and(val2);
      expect(res.is_ok()).toBe(true);
      expect(res.unwrap()).toBe(69);
    });

    it('should unwrap an Ok value using unwrap_or', () => {
      const val = new Ok(42);
      expect(val.unwrap_or(0)).toBe(42);
    });

    it('should return default value using unwrap_or on an Err value', () => {
      const err = new Err(new Error('unexpected error'));
      expect(err.unwrap_or(0)).toBe(0);
    });

    it('should return default value using unwrap_or_else on an Err value', () => {
      const err = new Err(new Error('unexpected error'));
      expect(err.unwrap_or_else(() => 0)).toBe(0);
    });

    it('should clone an Ok value', () => {
      const val = new Ok(42);
      const res = val.cloned();
      expect(res.is_ok()).toBe(true);
      expect(res.unwrap()).toBe(42);
    });

    it('should copy an Ok value', () => {
      const val = new Ok(42);
      const res = val.copied();
      expect(res.is_ok()).toBe(true);
      expect(res.unwrap()).toBe(42);
    });

    it('should match an Ok value to a pattern', () => {
      const val = new Ok(42);
      const res = val.match({
        ok: (v) => v.toString(),
        err: (_) => 'unexpected error',
      });
      expect(res).toBe('42');
    });
  });

  describe('Err', () => {
    it('should create an Err instance', () => {
      const error = new Error('Something went wrong');
      const result = new Err(error);
      expect(result.is_ok()).toBe(false);
      expect(result.is_err()).toBe(true);
      expect(result.unwrap_err()).toBe(error);
    });

    it('should throw an error when trying to unwrap an Err', () => {
      const error = new Error('Something went wrong');
      const result = new Err(error);
      expect(() => result.unwrap()).toThrowError('called `unwrap()` on an `Err` value');
      expect(() => result.expect('Custom error message')).toThrowError('Custom error message');
    });
  });
});
