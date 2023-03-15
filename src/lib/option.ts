import { Err, Ok, Result } from './result';

/**
 * Represents a pattern for handling the result of a computation that can either produce
 * a value of type `T` or not produce a value.
 *
 * @typeParam T - The type of the contents of the Option.
 * @typeParam R - The type of the result of the match pattern.
 */
type OptionPattern<T, R> = {
  /**
   * A function that takes a value of type `T` and returns a value of type `R`.
   * This function should be called if the Option contains a value.
   *
   * @param v - The wrapped value of type `T`.
   * @returns A value of type `R`.
   */
  some: (v: T) => R;

  /**
   * A function that produces a value of type `R`.
   * This function should be called if the Option is empty.
   *
   * @returns A value of type `R`.
   */
  none: () => R;
};

/**
 * Represents the outcome of a computation that can either produce
 * a value of type `T` or not produce a value.
 *
 * @typeParam T - The type of the contents of the Option.
 */
interface IOption<T> {
  /**
   * Checks if the option is a `Some` value.
   *
   * @example
   * ```ts
   * let x = new Some(2);
   * x.is_some(); // true
   * ```
   * @returns `true` if the result is `Some`.
   */
  is_some: () => boolean;

  /**
   * Checks if the result is a `None` value.
   *
   * @example
   * ```ts
   * let x = new None();
   * x.is_none(); // true
   * ```
   * @returns `true` if the result is `None`.
   */
  is_none: () => boolean;

  /**
   * Maps an `Option<T>` to `Option<U>` by applying a function to a contained `Some` value, leaving a `None` value untouched.
   * This is associative: `foo.map(f).map(g)` is the same as `foo.map((x) => g(f(x)))`.
   *
   * @example
   * ```ts
   * let x = new Some(2)
   * x.map(x => x + 3); // Some(5)
   * ```
   * @typeParam U - The type to map the `Some` value to.
   * @param op - The function to apply to the contained `Some` value.
   * @returns A `Option<U>` containing the result of applying `op` to the contained `Some` value, or the original `None` value if it was an `None`.
   */
  map<U>(op: (val: T) => U): Option<U>;

  /**
   * Returns the provided default value (if `None`), or applies to the contained value (if `Some`).
   * Arguments passed to `map_or` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `map_or_else`, which is lazily evaluated.
   *
   * @example
   * ```ts
   * let x = new Some('foo');
   * x.map_or(42, (v) => v.length); // 3
   *
   * let x: Option<string> = new None();
   * x.map_or(42, (v) => v.length); // 42
   * ```
   * @typeParam U - The type to map the `Some` value to.
   * @param def - The default value to return if `None`.
   * @param op - The function to apply to the contained `Some` value.
   * @returns The result of applying `op` to the contained `Some` value, or the provided default value if it was an `None`.
   */
  map_or<U>(def: U, op: (val: T) => U): U;

  /**
   * Computes a default function result (if `None`), or applies a different function to the contained value (if `Some`).
   * This function can be used to unpack a wrapped result while handling `None` with an expensive fallback.
   *
   * @example
   * ```ts
   * let k = 21;
   * let x = new Some('foo');
   * x.map_or_else(() => k * 2, v => v.length); // 3
   * ```
   * @typeParam U - The type to map the `Some` value to.
   * @param def - The default function to call if `None`.
   * @param op - The function to apply to the contained `Some` value.
   * @returns The result of applying `op` to the contained `Some` value, or the result of calling `default` if it was an `None`.
   */
  map_or_else<U>(def: () => U, op: (val: T) => U): U;

  /**
   * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and `None` to `Err(err)`.
   * Arguments passed to ok_or are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `ok_or_else`, which is lazily evaluated.
   *
   * @example
   * ```ts
   * let x = Some(26);
   * x.ok_or("error!"); // Ok(26)
   * ```
   * @typeParam E - The type of the provided error.
   * @param err - The error to return if `None`.
   * @returns `Ok(v)` if the result is `Some(v)`, otherwise returns `Err(err)`.
   */
  ok_or<E>(err: E): Result<T, E>;

  /**
   * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and `None` to `Err(err())`.
   *
   * @example
   * ```ts
   * letx = None();
   * x.ok_or_else(() => "error!"); // Err("error!")
   * ```
   * @typeParam E - The type of the provided error.
   * @param err - The error to return if `None` (lazy).
   * @returns `Ok(v)` if the result is `Some(v)`, otherwise returns `Err(err())`.
   */
  ok_or_else<E>(err: () => E): Result<T, E>;

  /**
   * Returns `res` if the result is `Some`, otherwise returns the `None` value.
   * Arguments passed to `and` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `and_then`, which is lazily evaluated.
   *
   * @example
   * ```ts
   * let x = new Some(2);
   * let y = new None();
   * x.and(y); // None()
   * ```
   * @typeParam U - Success type of the result to return if `Some`.
   * @param res - The result to return if `Some`.
   * @returns `res` if the result is `Some`, otherwise `None`.
   */
  and<U>(res: Option<U>): Option<U>;

  /**
   * Calls `op` if the result is `Some`, otherwise returns the `None` value.
   * This function can be used for control flow based on `Option` values.
   * This is a monadic bind operation:
   *     `x.and_then((v) => v)` is equivalent to `x`.
   *     `x.and_then(f).and_then(g)` is equivalent to `x.and_then(x => f(x).and_then(g))`.
   *
   * @example
   * ```ts
   * const parse_num = (s: string) => Number.isNan(Number(s)) ? new None<number>() : new Some(Number(s));
   *
   * new Some('2').and_then(parse_num); // Some(2)
   * new Some('foo').and_then(parse_num); // None()
   * new None<string>().and_then(parse_num); // None()
   * ```
   * @typeParam U - Success type of the result to return if `Some`.
   * @param op - The function to call if `Some`.
   * @returns The result of calling `op` if the result is `Some`, otherwise returns the `None` value.
   */
  and_then<U>(op: (val: T) => Option<U>): Option<U>;

  /**
   * Returns `res` if the result is `None`, otherwise returns the `Some` value.
   * Arguments passed to `or` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `or_else`, which is lazily evaluated.
   *
   * @example
   * ```ts
   * let x = Some(2);
   * let y = None();
   * x.or(y); // Some(2)
   *
   * let x = None();
   * let y = Some(2);
   * x.or(y); // Some(2)
   *
   * let x = None();
   * let y = None();
   * x.or(y); // None()
   *
   * let x = Some(2);
   * let y = Some(100);
   * x.or(y); // Some(2)
   * ```
   * @param res - The result to return if `None`.
   * @returns `res` if `None`, otherwise `Some` value.
   */
  or(res: Option<T>): Option<T>;

  /**
   * Returns the option if it contains a value, otherwise calls `f` and returns the result.
   *
   * @example
   * ```ts
   * const sq = (x: number) => x * x;
   * const err = (x: number) => new None(x);
   *
   * let nobody = () => new None();
   * let vikings = () => new Some("vikings");
   *
   * Some("barbarians").or_else(vikings); // Some("barbarians")
   * None().or_else(vikings); // Some("vikings")
   * None().or_else(nobody); // None()
   * ```
   * @param op - The function to call if `None`.
   * @returns The result of calling `op` if the result is `None`, otherwise returns the `Some` value.
   */
  or_else(op: () => Option<T>): Option<T>;

  /**
   * Returns the contained `Some` value.
   * Because this function may throw an exception, its use is generally discouraged. Instead, prefer to call `unwrap_or`, or `unwrap_or_else`.
   *
   * @example
   * ```ts
   * let x = new Some(2);
   * x.unwrap(); // 2
   *
   * let y = new None();
   * y.unwrap(); // throws error
   * ```
   * @returns The contained `Some` value.
   * @throws {Error} If the value is `None`.
   */
  unwrap(): T;

  /**
   * Returns the contained `Some` value or a provided default.
   * Arguments passed to `unwrap_or` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `unwrap_or_else`, which is lazily evaluated.
   *
   * @example
   * ```ts
   * let x = new Some(42);
   * x.unwrap_or(7); // 42
   *
   * let y = new None();
   * y.unwrap_or(7); // 7
   * ```
   * @param def - The default value to return if `None`.
   * @returns The contained `Some` value or the provided default value if `None`.
   */
  unwrap_or(def: T): T;

  /**
   * Returns the contained `Some` value or computes it from a closure.
   *
   * @example
   * ```ts
   * const k = 10;
   * new Some(4).unwrap_or_else(|| 2 * k); // 4
   * new None().unwrap_or_else(|| 2 * k); // 20
   * ```
   * @param op - The closure to compute a default value if `None`.
   * @returns The contained `Some` value or the result of the closure if `None`.
   */
  unwrap_or_else(op: () => T): T;

  /**
   * Returns the contained `Some` value if it exists, otherwise throws an Error with the provided message.
   *
   * @example
   * ```ts
   * let x = new None();
   * x.expect('Testing expect'); // throws Error('Testing expect')
   * ```
   * @param msg - The message to use if the value is an `None`.
   * @returns The contained `Some` value.
   * @throws {Error} If the value is an `None`, with a message provided by `msg`.
   */
  expect(msg: string): T;

  /**
   * Pattern matches over `some` and `none` variants.
   *
   * @example
   * ```ts
   * let x = new Some(42);
   * let y = x.match({
   *  some: (val) => val.toString(),
   *  none: () => 'Unexpected error'
   * }); // '42'
   * ```
   * @typeParam R - The return type of the pattern.
   * @param pattern - The pattern to match over.
   * @returns The result of the pattern match.
   */
  match<R>(pattern: OptionPattern<T, R>): R;
}

/**
 * Option variant that contains a value.
 *
 * @typeParam T - The type of the wrapped value.
 */
export class Some<T> implements IOption<T> {
  private value: T;
  constructor(val: T) {
    this.value = val;
  }
  is_some = (): boolean => true;
  is_none = (): boolean => false;
  map<U>(op: (val: T) => U): Option<U> {
    return new Some<U>(op(this.value));
  }
  map_or<U>(_: U, op: (val: T) => U): U {
    return op(this.value);
  }
  map_or_else<U>(_: () => U, op: (val: T) => U): U {
    return op(this.value);
  }
  ok_or<E>(_: E): Result<T, E> {
    return new Ok<T, E>(this.value);
  }
  ok_or_else<E>(_: () => E): Result<T, E> {
    return new Ok<T, E>(this.value);
  }
  and<U>(res: Option<U>): Option<U> {
    return res;
  }
  and_then<U>(op: (val: T) => Option<U>): Option<U> {
    return op(this.value);
  }
  or(_: Option<T>): Option<T> {
    return new Some<T>(this.value);
  }
  or_else(_: () => Option<T>): Option<T> {
    return new Some<T>(this.value);
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
  expect(_: string): T {
    return this.value;
  }
  match<R>(pattern: OptionPattern<T, R>): R {
    return pattern.some(this.value);
  }
}

/**
 * Option variant that contains the error value.
 *
 * @typeParam T - The type of the successful result value.
 */
export class None<T> implements IOption<T> {
  is_some = (): boolean => false;
  is_none = (): boolean => true;
  map<U>(_: (val: T) => U): Option<U> {
    return new None<U>();
  }
  map_or<U>(def: U, _: (val: T) => U): U {
    return def;
  }
  map_or_else<U>(def: () => U, _: (val: T) => U): U {
    return def();
  }
  ok_or<E>(err: E): Result<T, E> {
    return new Err<T, E>(err);
  }
  ok_or_else<E>(op: () => E): Result<T, E> {
    return new Err<T, E>(op());
  }
  and<U>(_: Option<U>): Option<U> {
    return new None<U>();
  }
  and_then<U>(_: (val: T) => Option<U>): Option<U> {
    return new None<U>();
  }
  or(res: Option<T>): Option<T> {
    return res;
  }
  or_else(op: () => Option<T>): Option<T> {
    return op();
  }
  unwrap(): T {
    throw new Error('called `unwrap()` on a `None` value');
  }
  unwrap_or(def: T): T {
    return def;
  }
  unwrap_or_else(op: () => T): T {
    return op();
  }
  cloned(): Option<T> {
    return new None<T>();
  }
  expect(msg: string): T {
    throw new Error(msg);
  }
  match<R>(pattern: OptionPattern<T, R>): R {
    return pattern.none();
  }
}

/**
 * A type that represents either success (`Some`) or failure (`None`).
 *
 * @typeParam T - The type of the successful result value.
 * @typeParam E - The type of the error value.
 */
export type Option<T> = Some<T> | None<T>;
