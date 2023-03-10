export enum ResultVariant {
  Ok,
  Err,
}

export type ResultPattern<T, E, R> = {
  ok: (val: T) => R;
  err: (err: E) => R;
};

export class Result<T, E> {
  private value: T | undefined;
  private error: E | undefined;
  private variant: ResultVariant;

  private constructor(variant: ResultVariant, value?: T, error?: E) {
    this.variant = variant;
    this.value = value;
    this.error = error;
  }

  static ok<T, E>(value: T): Result<T, E> {
    return new Result<T, E>(ResultVariant.Ok, value);
  }

  static err<T, E>(error: E): Result<T, E> {
    return new Result<T, E>(ResultVariant.Err, undefined, error);
  }

  is_ok(): boolean {
    return this.variant === ResultVariant.Ok;
  }

  is_err(): boolean {
    return this.variant === ResultVariant.Err;
  }

  unwrap(): T {
    if (this.is_ok()) {
      return this.value as T;
    } else {
      throw new Error(`called \`unwrap()\` on an \`Err\` value: ${this.error}`);
    }
  }

  unwrap_or(optb: T): T {
    if (this.is_ok()) {
      return this.value as T;
    } else {
      return optb;
    }
  }

  unwrap_err(): E {
    if (this.is_err()) {
      return this.error as E;
    } else {
      throw new Error(`called \`unwrap_err()\` on an \`Ok\` value: ${this.value}`);
    }
  }

  expect(msg: string): T {
    if (this.is_ok()) {
      return this.value as T;
    } else {
      throw new Error(msg);
    }
  }

  expect_err(msg: string): E {
    if (this.is_err()) {
      return this.error as E;
    } else {
      throw new Error(msg);
    }
  }

  map<U>(fn: (val: T) => U): Result<U, E> {
    if (this.is_ok()) {
      return Result.ok(fn(this.value as T));
    } else {
      return Result.err(this.error as E);
    }
  }

  map_err<F>(fn: (err: E) => F): Result<T, F> {
    if (this.is_err()) {
      return Result.err(fn(this.error as E));
    } else {
      return Result.ok(this.value as T);
    }
  }

  and<U>(res: Result<U, E>): Result<U, E> {
    if (this.is_ok()) {
      return res;
    } else {
      return Result.err(this.error as E);
    }
  }

  and_then<U>(fn: (val: T) => Result<U, E>): Result<U, E> {
    if (this.is_ok()) {
      return fn(this.value as T);
    } else {
      return Result.err(this.error as E);
    }
  }

  or<F>(res: Result<T, F>): Result<T, F> {
    if (this.is_ok()) {
      return Result.ok(this.value as T);
    } else {
      return res;
    }
  }

  or_else<F>(fn: (err: E) => Result<T, F>): Result<T, F> {
    if (this.is_ok()) {
      return Result.ok(this.value as T);
    } else {
      return fn(this.error as E);
    }
  }

  match<R>(pattern: ResultPattern<T, E, R>): R {
    if (this.is_ok()) {
      return pattern.ok(this.value as T);
    } else {
      return pattern.err(this.error as E);
    }
  }

  static from<T, E>(result: T | undefined, err: E | undefined): Result<T, E> {
    if (result !== undefined) {
      return Result.ok(result);
    } else {
      return Result.err(err as E);
    }
  }
}
