import { Ok, Err, Result } from '../src';

describe('Result', () => {
  describe('Ok', () => {
    describe('constructor', () => {
      it('should create an Ok value', () => {
        const val = new Ok(42);
        expect(val.is_ok()).toBe(true);
        expect(val.is_err()).toBe(false);
        expect(val.unwrap()).toBe(42);
      });
    });
    describe('map', () => {
      it('should map an Ok value to another Ok value', () => {
        const val = new Ok(42);
        const res = val.map((v) => v.toString());
        expect(res.is_ok()).toBe(true);
        expect(res.unwrap()).toBe('42');
      });
    });
    describe('map_err', () => {
      it('should map an Ok value to an Err value', () => {
        const val = new Ok(2);
        const res = val.map_err((err) => new Err(`error code: ${err}`));
        expect(res.is_err()).toBe(false);
        expect(res.unwrap()).toBe(2);
      });
    });

    describe('map_or', () => {
      it('should apply a function to the contained value', () => {
        const val = new Ok('foo');
        expect(val.map_or(42, (v) => v.length)).toBe(3);
        const res: Result<string, unknown> = new Err('bar');
        expect(res.map_or(42, (v) => v.length)).toBe(42);
      });
    });

    describe('map_or_else', () => {
      it('should map a `Result<T, E>` to `U` by applying a function to a contained `Ok` value', () => {
        const k = 21;
        const val = new Ok('foo');
        expect(
          val.map_or_else(
            () => k * 2,
            (val) => val.length,
          ),
        ).toBe(3);
      });
    });

    describe('and', () => {
      it('should chain Ok values using and', () => {
        const val1 = new Ok(2);
        const val2 = new Err('late error');
        expect(val1.and(val2).unwrap_err()).toBe(new Err('late error').unwrap_err());
      });
    });

    describe('and_then', () => {
      it('should chain Ok values using and_then', () => {
        const val = new Ok(42);
        const res = val.and_then((v) => new Ok(v.toString()));
        expect(res.is_ok()).toBe(true);
        expect(res.unwrap()).toBe('42');
      });
    });

    describe('unwrap_or', () => {
      it('should unwrap an Ok value using unwrap_or', () => {
        const val = new Ok(42);
        expect(val.unwrap_or(0)).toBe(42);
      });

      it('should return default value using unwrap_or on an Err value', () => {
        const err = new Err(new Error('unexpected error'));
        expect(err.unwrap_or(0)).toBe(0);
      });
    });

    describe('unwrap_or_else', () => {
      it('should return default value using unwrap_or_else on an Err value', () => {
        const err = new Err(new Error('unexpected error'));
        expect(err.unwrap_or_else(() => 0)).toBe(0);
      });
    });

    describe('cloned', () => {
      it('should clone an Ok value', () => {
        const val = new Ok(42);
        const res = val.cloned();
        expect(res.is_ok()).toBe(true);
        expect(res.unwrap()).toBe(42);
      });
    });

    describe('match', () => {
      it('should match an Ok value to a pattern', () => {
        const val = new Ok(42);
        const res = val.match({
          ok: (v) => v.toString(),
          err: (_) => 'Enexpected error',
        });
        expect(res).toBe('42');
      });
    });

    describe('match', () => {
      it('should panic with the provided message when provided an `Err`', () => {
        const x = new Err('emergency failure');
        try {
          x.expect('Testing expect');
        } catch (error) {
          expect(error).toStrictEqual(new Error('Testing expect'));
        }
      });
    });
  });

  describe('Err', () => {
    describe('constructor', () => {
      it('should create an Err instance', () => {
        const error = new Error('Something went wrong');
        const result = new Err(error);
        expect(result.is_ok()).toBe(false);
        expect(result.is_err()).toBe(true);
        expect(result.unwrap_err()).toBe(error);
      });
    });

    describe('unwrap', () => {
      it('should throw an error when trying to unwrap an Err', () => {
        const error = new Error('Something went wrong');
        const result = new Err(error);
        expect(() => result.unwrap()).toThrowError('called `unwrap()` on an `Err` value');
        expect(() => result.expect('Custom error message')).toThrowError('Custom error message');
      });
    });
  });
});
