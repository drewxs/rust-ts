export type ResultPattern<T, E, R> = {
  ok: (v: T) => R;
  err: (e: E) => R;
};

export interface IResult<T, E> {
  is_ok: () => boolean;
  is_err: () => boolean;
  map<U>(op: (val: T) => U): Result<U, E>;
  map_or<U>(def: U, op: (val: T) => U): U;
  map_or_else<U>(def: () => U, op: (val: T) => U): U;
  map_err<F>(op: (err: E) => Result<T, F>): Result<T, F>;
  and<U>(res: Result<U, E>): Result<U, E>;
  and_then<U>(op: (val: T) => Result<U, E>): Result<U, E>;
  or<U>(res: Result<U, E>): Result<T | U, E>;
  or_else<F>(op: (err: E) => Result<T, F>): Result<T, F>;
  unwrap(): T;
  unwrap_or(def: T): T;
  unwrap_or_else(op: () => T): T;
  unwrap_err(): E;
  cloned(): Result<T, E>;
  expect(msg: string): T;
  match<R>(pattern: ResultPattern<T, E, R>): R;
}

export class Ok<T, E> implements IResult<T, E> {
  private value: T;
  constructor(val: T) {
    this.value = val;
  }
  is_ok = (): boolean => true;
  is_err = (): boolean => false;
  map<U>(op: (val: T) => U): Result<U, E> {
    return new Ok<U, E>(op(this.value));
  }
  map_or<U>(_: U, op: (val: T) => U): U {
    return op(this.value);
  }
  map_or_else<U>(_: () => U, op: (val: T) => U): U {
    return op(this.value);
  }
  map_err<F>(_: (err: E) => Result<T, F>): Result<T, F> {
    return new Ok<T, F>(this.value);
  }
  and<U>(res: Result<U, E>): Result<U, E> {
    return res;
  }
  and_then<U>(op: (val: T) => Result<U, E>): Result<U, E> {
    return op(this.value);
  }
  or<U>(_: Result<U, E>): Result<T | U, E> {
    return new Ok<T | U, E>(this.value);
  }
  or_else<F>(_: (err: E) => Result<T, F>): Result<T, F> {
    return new Ok<T, F>(this.value);
  }
  unwrap(): T {
    return this.value;
  }
  unwrap_or(_: T) {
    return this.value;
  }
  unwrap_or_else(_: () => T): T {
    return this.value;
  }
  unwrap_err(): E {
    throw new Error('Called `unwrap_err()` on an `Ok` value');
  }
  cloned(): Result<T, E> {
    return new Ok<T, E>(this.value);
  }
  expect(_: string): T {
    return this.value;
  }
  match<R>(pattern: ResultPattern<T, E, R>): R {
    return pattern.ok(this.value);
  }
}

export class Err<T, E> implements IResult<T, E> {
  private err: E;
  constructor(err: E) {
    this.err = err;
  }
  is_ok = (): boolean => false;
  is_err = (): boolean => true;
  map<U>(_: (val: T) => U): Result<U, E> {
    return new Err<U, E>(this.err);
  }
  map_or<U>(def: U, _: (val: T) => U): U {
    return def;
  }
  map_or_else<U>(def: () => U, _: (val: T) => U): U {
    return def();
  }
  map_err<F>(op: (err: E) => Result<T, F>): Result<T, F> {
    return op(this.err);
  }
  and<U>(_: Result<U, E>): Result<U, E> {
    return new Err<U, E>(this.err);
  }
  and_then<U>(_: (val: T) => Result<U, E>): Result<U, E> {
    return new Err<U, E>(this.err);
  }
  or<U>(res: Result<U, E>): Result<T | U, E> {
    return res;
  }
  or_else<F>(op: (err: E) => Result<T, F>): Result<T, F> {
    return op(this.err);
  }
  unwrap(): T {
    throw new Error('called `unwrap()` on an `Err` value');
  }
  unwrap_or(def: T): T {
    return def;
  }
  unwrap_or_else(op: () => T): T {
    return op();
  }
  unwrap_err(): E {
    return this.err;
  }
  cloned(): Result<T, E> {
    return new Err<T, E>(this.err);
  }
  expect(msg: string): T {
    throw new Error(msg);
  }
  match<R>(pattern: ResultPattern<T, E, R>): R {
    return pattern.err(this.err);
  }
}

export type Result<T, E> = Ok<T, E> | Err<T, E>;
