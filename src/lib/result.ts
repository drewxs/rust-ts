import {Option} from "./option";

/**
 * Represents a pattern for handling the result of a computation that can either succeed
 * with a value of type `T` or fail with an error of type `E`.
 *
 * @typeParam T - The type of the value contained in the `Result`.
 * @typeParam E - The type of the value contained in the `Err`.
 * @typeParam R - The type of the result of the match pattern.
 */
export interface ResultPattern<T, E, R> {
    /**
     * Function to execute if the `Result` is `Ok`.
     *
     * @param v - The successful result value of type `T`.
     * @returns A value of type `R`.
     */
    ok(v: T): R;

    /**
     * Function to execute if the `Result` is `Err`.
     *
     * @param e - The error value of type `E`.
     * @returns A value of type `R`.
     */
    err(e: E): R;
}

/**
 * Represents the outcome of a computation that can either succeed with a value of type `T`
 * or fail with an error of type `E`.
 *
 * @typeParam T - The type of the value contained in the `Result`.
 * @typeParam E - The type of the value contained in the `Err`.
 */
export interface IResult<T, E> {
    /**
     * Checks if the result is an `Ok` value.
     *
     * @example
     * ```ts
     * let x = Ok(2);
     * x.is_ok(); // true
     * ```
     * @returns `true` if the result is `Ok`.
     */
    is_ok(): boolean;

    /**
     * Checks if the result is an `Err` value.
     *
     * @example
     * ```ts
     * let x = Err("Some error message");
     * x.is_err(); // true
     * ```
     * @returns `true` if the result is `Err`.
     */
    is_err(): boolean;

    /**
     * Maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value, leaving an `Err` value untouched.
     * This function can be used to compose the results of two functions.
     *
     * @example
     * ```ts
     * let x = Ok(2)
     * x.map(x => x + 3); // Ok(5)
     * ```
     * @typeParam U - The type to map the `Ok` value to.
     * @param op - The function to apply to the contained `Ok` value.
     * @returns A `Result<U, E>` containing the result of applying `op` to the contained `Ok` value, or the original `Err` value if it was an `Err`.
     */
    map<U>(op: (val: T) => U): Result<U, E>;

    /**
     * Returns the provided default value (if `Err`), or applies to the contained value (if `Ok`).
     * Arguments passed to `map_or` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `map_or_else`, which is lazily evaluated.
     *
     * @example
     * ```ts
     * let x = Ok('foo');
     * x.map_or(42, (v) => v.length); // 3
     *
     * let x: Result<string, unknown> = Err("bar");
     * x.map_or(42, (v) => v.length); // 42
     * ```
     * @typeParam U - The type to map the `Ok` value to.
     * @param def - The default value to return if `Err`.
     * @param op - The function to apply to the contained `Ok` value.
     * @returns The result of applying `op` to the contained `Ok` value, or the provided default value if it was an `Err`.
     */
    map_or<U>(def: U, op: (val: T) => U): U;

    /**
     * Maps a `Result<T, E>` to `U` by applying fallback function `default` to a contained `Err` value, or function `op` to a contained `Ok` value.
     * This function can be used to unpack a successful result while handling an error.
     *
     * @example
     * ```ts
     * let k = 21;
     * let x = Ok('foo');
     * x.map_or_else(() => k * 2, v => v.length); // 3
     * ```
     * @typeParam U - The type to map the `Ok` value to.
     * @param def - The default function to call if `Err`.
     * @param op - The function to apply to the contained `Ok` value.
     * @returns The result of applying `op` to the contained `Ok` value, or the result of calling `default` if it was an `Err`.
     */
    map_or_else<U>(def: () => U, op: (val: T) => U): U;

    /**
     * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value, leaving an `Ok` value untouched.
     * This function can be used to pass through a successful result while handling an error.
     *
     * @example
     * ```ts
     * let x = Err(2);
     * let y = x.map_err(e => Err(`error code: ${e}`));
     * y.is_err(); // false
     * y.unwrap(); // 2
     * ```
     * @typeParam F - The type to map the `Err` value to.
     * @param op - The function to apply to the contained `Err` value.
     * @returns A `Result<T, F>` containing the result of applying `op` to the contained `Err` value, or the original `Ok` value if it was an `Ok`.
     */
    map_err<F>(op: (err: E) => Result<T, F>): Result<T, F>;

    /**
     * Returns `res` if the result is `Ok`, otherwise returns the `Err` value.
     * Arguments passed to `and` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `and_then`, which is lazily evaluated.
     *
     * @example
     * ```ts
     * let x = Ok(2);
     * let y = Err('late error');
     * x.and(y); // Err('late error')
     * ```
     * @typeParam U - Success type of the result to return if `Ok`.
     * @param res - The result to return if `Ok`.
     * @returns `res` if the result is `Ok`, otherwise returns the `Err` value.
     */
    and<U>(res: Result<U, E>): Result<U, E>;

    /**
     * Calls `op` if the result is `Ok`, otherwise returns the `Err` value.
     * This function can be used for control flow based on `Result` values.
     *
     * @example
     * ```ts
     * const parse_num = (s: string) => Number.isNan(Number(s)) ? Err('NaN') : Ok(Number(s));
     *
     * Ok('2').and_then(parse_num); // Ok(2)
     * Ok('foo').and_then(parse_num); // Err('NaN')
     * Err('fail').and_then(parse_num); // Err('fail')
     * ```
     * @typeParam U - Success type of the result to return if `Ok`.
     * @param op - The function to call if `Ok`.
     * @returns The result of calling `op` if the result is `Ok`, otherwise returns the `Err` value.
     */
    and_then<U>(op: (val: T) => Result<U, E>): Result<U, E>;

    /**
     * Returns `res` if the result is `Err`, otherwise returns the `Ok` value.
     * Arguments passed to `or` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `or_else`, which is lazily evaluated.
     *
     * @example
     * ```ts
     * let x = Ok(2);
     * let y = Err('late error');
     * x.or(y); // Ok(2)
     *
     * let x = Err('early error');
     * let y = Ok(2);
     * x.or(y); // Ok(2)
     *
     * let x = Err('not a 2');
     * let y = Err('late error');
     * x.or(y); // Err('late error')
     *
     * let x = Ok(2);
     * let y = Ok(100);
     * x.or(y); // Ok(2)
     * ```
     * @param res - The result to return if `Err`.
     * @returns `res` if `Err`, otherwise `Ok` value.
     */
    or(res: Result<T, E>): Result<T, E>;

    /**
     * Calls `op` if the result is `Err`, otherwise returns the `Ok` value.
     *
     * @example
     * ```ts
     * const sq = (x: number) => Ok(x * x);
     * const err = (x: number) => Err(x);
     *
     * Ok(2).or_else(sq).or_else(sq); // Ok(2)
     * Ok(2).or_else(err).or_else(sq); // Ok(2)
     * Ok(3).or_else(sq).or_else(err); // Ok(9)
     * Ok(3).or_else(err).or_else(err); // Ok(3)
     * ```
     * @typeParam F - Error type of the result to return if `Err`.
     * @param op - The function to call if `Err`.
     * @returns The result of calling `op` if the result is `Err`, otherwise returns the `Ok` value.
     */
    or_else<F>(op: (err: E) => Result<T, F>): Result<T, F>;

    /**
     * Returns the contained `Ok` value.
     * Because this function may throw an exception, its use is generally discouraged. Instead, prefer to call `unwrap_or`, `unwrap_or_else`
     *
     * @example
     * ```ts
     * let x = Ok(2);
     * x.unwrap(); // 2
     *
     * let y = Err('emergency failure');
     * y.unwrap(); // throws 'emergency failure'
     * ```
     * @returns The contained `Ok` value.
     * @throws {Error} If the value is an `Err`, with a message provided by the `Err`'s value.
     */
    unwrap(): T;

    /**
     * Returns the contained `Ok` value or a provided default.
     * Arguments passed to `unwrap_or` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `unwrap_or_else`, which is lazily evaluated.
     *
     * @example
     * ```ts
     * let x = Ok(42);
     * x.unwrap_or(7); // 42
     *
     * let y = Err('error');
     * y.unwrap_or(7); // 7
     * ```
     * @param def - The default value to return if `Err`.
     * @returns The contained `Ok` value or the provided default value if `Err`.
     */
    unwrap_or(def: T): T;

    /**
     * Returns the contained `Ok` value or computes it from a closure.
     *
     * @example
     * ```ts
     * const count = (x: string): number => x.length;
     *
     * let x = Ok(2).unwrap_or_else(count); // 2
     * let y = Err('foo').unwrap_or_else(count); // 3
     * ```
     * @param op - The closure to compute a default value if `Err`.
     * @returns The contained `Ok` value or the result of the closure if `Err`.
     */
    unwrap_or_else(op: (err: E) => T): T;

    /**
     * Returns the contained `Err` value.
     * Throws an exception if the value is an `Ok`.
     *
     * @example
     * ```ts
     * let x = Ok(2);
     * x.unwrap_err(); // throws Error('called `unwrap_err()` on an `Ok` value')
     *
     * let y = Err('emergency failure');
     * y.unwrap_err(); // 'emergency failure'
     * ```
     * @returns The contained `Err` value.
     */
    unwrap_err(): E;

    /**
     * Returns the contained `Ok` value if it exists, otherwise throws an Error with the provided message.
     *
     * @example
     * ```ts
     * let x = Err('emergency failure');
     * x.expect('Testing expect'); // throws Error('Testing expect')
     * ```
     * @param msg - The message to use if the value is an `Err`.
     * @returns The contained `Ok` value.
     * @throws {Error} If the value is an `Err`, with a message provided by `msg`.
     */
    expect(msg: string): T;

    /**
     * Pattern matches over `ok` and `err` variants.
     *
     * @example
     * ```ts
     * let x = Ok(42);
     * let y = x.match({
     *  ok: val => val.toString(),
     *  err: _ => 'Unexpected error'
     * }); // '42'
     * ```
     * @typeParam T - The type of the value contained in the `Result`.
     * @typeParam E - The type of the value contained in the `Err`.
     * @typeParam R - The type of the result of the match pattern.
     * @param pattern - The pattern to match over.
     * @returns The result of the pattern match.
     */
    match<R>(pattern: ResultPattern<T, E, R>): R;
}

/**
 * Result variant that contains the success value.
 *
 * @typeParam T - The type of the value contained in the `Result`.
 * @typeParam E - The type of the value contained in the `Err`.
 */
export class Ok<T, E> implements IResult<T, E> {
    private value: T;
    constructor(val: T) {
        this.value = val;
    }
    is_ok = () => true;
    is_err = () => false;
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
    unwrap_or_else(_: (_: E) => T): T {
        return this.value;
    }
    unwrap_err(): E {
        throw new Error("Called `unwrap_err()` on an `Ok` value");
    }
    expect(_: string): T {
        return this.value;
    }
    match<R>(pattern: ResultPattern<T, E, R>): R {
        return pattern.ok(this.value);
    }
}

/**
 * Result variant that contains the error value.
 *
 * @typeParam T - The type of the value contained in the `Result`.
 * @typeParam E - The type of the value contained in the `Err`.
 */
export class Err<T, E> implements IResult<T, E> {
    private err: E;
    constructor(err: E) {
        this.err = err;
    }
    is_ok = () => false;
    is_err = () => true;
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
        throw new Error("called `unwrap()` on an `Err` value");
    }
    unwrap_or(def: T): T {
        return def;
    }
    unwrap_or_else(op: (err: E) => T): T {
        return op(this.err);
    }
    unwrap_err(): E {
        return this.err;
    }
    expect(msg: string): T {
        throw new Error(msg);
    }
    match<R>(pattern: ResultPattern<T, E, R>): R {
        return pattern.err(this.err);
    }
}

/**
 * A type that represents either success (`Ok`) or failure (`Err`).
 *
 * @typeParam T - The type of the value contained in the `Result`.
 * @typeParam E - The type of the value contained in the `Err`.
 */
export type Result<T, E> = Ok<T, E> | Err<T, E>;

/**
 * `Result` type guard.
 *
 * @typeParam T - The type of the value contained in the `Result`.
 * @typeParam E - The type of the value contained in the `Err`.
 * @param input - The `Result` or `Option` to check.
 * @returns `true` if `input` is a `Result`, `false` otherwise.
 */
export const is_result = <T, E>(
    input: Result<T, E> | Option<T>,
): input is Result<T, E> => (input as Result<T, E>).is_ok !== undefined;
