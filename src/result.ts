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
 * Represents a pattern for handling the result of a computation that can either succeed
 * with a value of type `T` or fail with an error of type `E`.
 *
 * @typeParam T - The type of the value contained in the `Result`.
 * @typeParam E - The type of the value contained in the `Err`.
 * @typeParam R - The type of the result of the match pattern.
 */
export interface ResultPatternAsync<T, E, R> {
    /**
     * Function to execute if the `Result` is `Ok`.
     *
     * @param v - The successful result value of type `T`.
     * @returns A value of type `R`.
     */
    ok(v: T): Promise<R>;

    /**
     * Function to execute if the `Result` is `Err`.
     *
     * @param e - The error value of type `E`.
     * @returns A value of type `R`.
     */
    err(e: E): Promise<R>;
}

/**
 * Represents the outcome of a computation that can either succeed with a value of type `T`
 * or fail with an error of type `E`.
 *
 * @typeParam T - The type of the value contained in the `Result`.
 * @typeParam E - The type of the value contained in the `Err`.
 */
export interface ResultBase<T, E> {
    /**
     * Checks if the result is an `Ok` value.
     *
     * @example
     * ```ts
     * const x = Ok(2);
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
     * const x = Err("Some error message");
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
     * const x = Ok(2)
     * x.map(x => x + 3); // Ok(5)
     * ```
     * @typeParam U - The type to map the `Ok` value to.
     * @param op - The function to apply to the contained `Ok` value.
     * @returns A `Result<U, E>` containing the result of applying `op` to the contained `Ok` value, or the original `Err` value if it was an `Err`.
     */
    map<U>(op: (val: T) => U): Result<U, E>;

    /**
     * Asynchronous version of `map`.
     *
     * @typeParam U - The type to map the `Ok` value to.
     * @param op - The asynchronous function to apply to the contained `Ok` value.
     * @returns A `Promise<Result<U, E>>` containing the result of applying `op` to the contained `Ok` value, or the original `Err` value if it was an `Err`.
     */
    map_async<U>(op: (val: T) => Promise<U>): Promise<Result<U, E>>;

    /**
     * Returns the provided default value or computes it through the provided callback (if `Err`),
     * or applies a function to the contained value (if `Ok`).
     * This function can be used to unpack a successful result while handling an error.
     *
     * @example
     * ```ts
     * const x = Ok('foo');
     * x.map_or(42, v => v.length); // 3
     *
     * const y: Result<string, unknown> = Err("bar");
     * y.map_or(() => 42, v => v.length); // 42
     * ```
     * @typeParam U - The type to map the `Ok` value to.
     * @param x - The default value to return or function to call if `Err`.
     * @param op - The function to apply to the contained `Ok` value.
     * @returns The result of applying `op` to the contained `Ok` value, or the provided default value if it was an `Err`.
     */
    map_or<U>(x: U | (() => U), op: (val: T) => U): U;

    /**
     * Asynchronous version of `map_or`.
     *
     * @typeParam U - The type to map the `Ok` value to.
     * @param x - The default value to return or asynchronous function to call if `Err`.
     * @param op - The asynchronous function to apply to the contained `Ok` value.
     * @returns A Promise resolving to the result of applying `op` to the contained `Ok` value, or the provided default value if it was an `Err`.
     */
    map_or_async<U>(
        x: Promise<U> | (() => U | Promise<U>),
        op: (val: T) => U | Promise<U>,
    ): Promise<U>;

    /**
     * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value, leaving an `Ok` value untouched.
     * This function can be used to pass through a successful result while handling an error.
     *
     * @example
     * ```ts
     * const x = Err(2);
     * const y = x.map_err(e => Err(`error code: ${e}`));
     * y.is_err(); // false
     * y.unwrap(); // 2
     * ```
     * @typeParam F - The type to map the `Err` value to.
     * @param op - The function to apply to the contained `Err` value.
     * @returns A `Result<T, F>` containing the result of applying `op` to the contained `Err` value, or the original `Ok` value if it was an `Ok`.
     */
    map_err<F>(op: (err: E) => Result<T, F>): Result<T, F>;

    /**
     * Asynchronous version of `map_err`.
     *
     * @typeParam F - The type to map the `Err` value to.
     * @param op - The asynchronous function to apply to the contained `Err` value.
     * @returns A `Promise<Result<T, F>>` containing the result of applying `op` to the contained `Err` value, or the original `Ok` value if it was an `Ok`.
     */
    map_err_async<F>(op: (err: E) => Promise<Result<T, F>>): Promise<Result<T, F>>;

    /**
     * Returns the provided Result or computes it from the callback if the result is `Ok`, otherwise returns the `Err` value.
     *
     * @example
     * ```ts
     * const x = Ok(2);
     * const y = Err('late error');
     * x.and(y); // Err('late error')
     *
     * const parse_num = (s: string) => Number.isNan(Number(s)) ? Err('NaN') : Ok(Number(s));
     *
     * Ok('2').and(parse_num); // Ok(2)
     * Ok('foo').and(parse_num); // Err('NaN')
     * Err('fail').and(parse_num); // Err('fail')
     * ```
     * @typeParam U - Success type of the result to return if `Ok`.
     * @param x - The result to return if `Ok`.
     * @returns `x` or the result of `x()` if the result is `Ok`, otherwise returns the `Err` value.
     */
    and<U>(x: Result<U, E> | ((val: T) => Result<U, E>)): Result<U, E>;

    /**
     * Asynchronous version of `and`.
     *
     * @typeParam U - The success type of the result to return if `Ok`.
     * @param x - The result to return if `Ok`, can be a `Result<U, E>` or a callback function that returns a `Result<U, E>` asynchronously.
     * @returns `x` or the result of `x()` if the result is `Ok`, otherwise returns the `Err` value.
     */
    and_async<U>(
        x: Promise<Result<U, E>> | ((val: T) => Promise<Result<U, E>>),
    ): Promise<Result<U, E>>;

    /**
     * Returns the provided result or executes the provided callback if the result is `Err`,
     * otherwise returns the `Ok` value.
     *
     * @example
     * ```ts
     * Ok(1).or(Err('err')); // Ok(1)
     * Err('err').or(Ok(1)); // Ok(1)
     * Err('err').or(Err('err2')); // Err('err2')
     * Ok(1).or(Ok(2)); // Ok(1)
     *
     * const add_one = (x: number): Result<number, number> => Ok(x + 1);
     * const minus_one = (x: number): Result<number, number> => Err(x - 1);
     * const div = (x: number, y: number): Result<number, number> =>
     *   y === 0 ? Ok(x / y) : Err(-1);
     * const r = div(2, 0);
     *
     * r.or(add_one).or(add_one); // Ok(2)
     * r.or(minus_one).or(add_one); // Ok(2)
     * r.or(add_one).or(minus_one); // Ok(9)
     * r.or(minus_one).or(minus_one); // Ok(3)
     *
     * ```
     * @typeParam U - Success type of the result to return if `Err`.
     * @typeParam F - Failure type of the result to return if `Err`.
     * @param x - The result to return or callback to execute if `Err`.
     * @returns `x` or the result of executing `x` if `Err`, otherwise returns the `Ok` value.
     */
    or<U, F>(x: Result<U, F> | ((err: E) => Result<U, F>)): Result<T | U, F>;

    /**
     * Asynchronous version of `or`.
     *
     * @typeParam U - The success type of the result to return if `Err`.
     * @typeParam F - The failure type of the result to return if `Err`.
     * @param x - The result to return or asynchronous callback to execute if `Err`.
     * @returns `x` or the result of executing `x` if `Err`, otherwise returns the `Ok` value.
     */
    or_async<U, F>(
        x: Promise<Result<U, F>> | ((err: E) => Promise<Result<U, F>>),
    ): Promise<Result<T | U, F>>;

    /**
     * Returns the contained `Ok` value.
     * Because this function may throw an exception, its use is generally discouraged. Instead, prefer to call `unwrap_or`.
     *
     * @example
     * ```ts
     * const x = Ok(2);
     * x.unwrap(); // 2
     *
     * const y = Err('emergency failure');
     * y.unwrap(); // throws 'emergency failure'
     * ```
     * @returns The contained `Ok` value.
     * @throws {Error} If the value is an `Err`, with a message provided by the `Err`'s value.
     */
    unwrap(): T;

    /**
     * Returns the contained `Ok` value, or a provided default value or closure that computes a value.
     *
     * @example
     * ```ts
     * const x = Ok(42);
     * x.unwrap_or(7); // 42
     *
     * const y = Err('foo');
     * y.unwrap_or(e => e.length); // 3
     * ```
     * @param x - The default value or callback to execute if `Err`.
     * @returns The contained `Ok` value or the provided default value if `Err`.
     */
    unwrap_or(x: T | ((err: E) => T)): T;

    /**
     * Asynchronous version of `unwrap_or`.
     *
     * @param x - The default Promise or asynchronous callback to execute if `Err`.
     * @returns A Promise containing the `Ok` value or the provided default value if `Err`.
     */
    unwrap_or_async(x: Promise<T> | ((err: E) => Promise<T>)): Promise<T>;

    /**
     * Returns the contained `Err` value.
     * Throws an exception if the value is an `Ok`.
     *
     * @example
     * ```ts
     * const x = Ok(2);
     * x.unwrap_err(); // throws Error('called `unwrap_err()` on an `Ok` value')
     *
     * const y = Err('emergency failure');
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
     * const x = Err('emergency failure');
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
     * const x = Ok(42);
     * const y = x.match({
     *     ok: val => val.toString(),
     *     err: _ => 'Unexpected error'
     * }); // '42'
     * ```
     * @typeParam T - The type of the value contained in the `Result`.
     * @typeParam E - The type of the value contained in the `Err`.
     * @typeParam R - The type of the result of the match pattern.
     * @param pattern - The pattern to match over.
     * @returns The result of the pattern match.
     */
    match<R>(pattern: ResultPattern<T, E, R>): R;

    /**
     * Asynchronous version of `match`.
     *
     * @typeParam T - The type of the value contained in the `Result`.
     * @typeParam E - The type of the value contained in the `Err`.
     * @typeParam R - The type of the result of the match pattern.
     * @param pattern - The pattern to match over.
     * @returns The result of the pattern match.
     */
    match_async<R>(pattern: ResultPatternAsync<T, E, R>): Promise<R>;

    /**
     * Applies a function to the contained value (if `Ok`).
     * This function can be used similarly to using `if const Some(x)` in rust, except for Result values.
     *
     * @example
     * ```ts
     * const x = Ok(0);
     * x.ok(x => x + 3); // 3
     * const y = Err("Something went wrong.");
     * const a = x.ok(x => x + 3, Some(42)) // 42
     * const b = x.ok(x => x + 3) // Err("Something went wrong.")
     * ```
     * @typeParam R - The type of the result of the function.
     * @param f - The function to apply to the contained value.
     * @returns The result of applying `f` to the contained value, or returns self if it was a `None`.
     */
    ok<U>(f: (x: T) => U, or?: U): U | Err<T, E>;

    /**
     * Asynchronous version of `ok`.
     *
     * @typeParam R - The type of the result of the function.
     * @param f - The function to apply to the contained value.
     * @returns The result of applying `f` to the contained value, or returns self if it was a `None`.
     */
    ok_async<U>(f: (x: T) => Promise<U>): Promise<U | Err<T, E>>;
}

/**
 * Result variant that contains the success value.
 *
 * @typeParam T - The type of the value contained in the `Result`.
 * @typeParam E - The type of the value contained in the `Err`.
 */
export class Ok<T, E> implements ResultBase<T, E> {
    private value: T;
    constructor(val: T) {
        this.value = val;
    }
    is_ok = () => true;
    is_err = () => false;
    map<U>(op: (v: T) => U): Result<U, E> {
        return new Ok<U, E>(op(this.value));
    }
    async map_async<U>(op: (v: T) => Promise<U>): Promise<Result<U, E>> {
        return new Ok<U, E>(await op(this.value));
    }
    map_or<U>(_: U | (() => U), op: (v: T) => U): U {
        return op(this.value);
    }
    async map_or_async<U>(
        _: Promise<U> | (() => Promise<U>),
        op: (v: T) => Promise<U>,
    ): Promise<U> {
        return op(this.value);
    }
    map_err<F>(_: (err: E) => Result<T, F>): Result<T, F> {
        return new Ok<T, F>(this.value);
    }
    async map_err_async<F>(_: (err: E) => Promise<Result<T, F>>): Promise<Result<T, F>> {
        return new Ok<T, F>(this.value);
    }
    and<U>(x: Result<U, E> | ((val: T) => Result<U, E>)): Result<U, E> {
        return x instanceof Function ? x(this.value) : x;
    }
    async and_async<U>(
        x: Promise<Result<U, E>> | ((val: T) => Promise<Result<U, E>>),
    ): Promise<Result<U, E>> {
        return x instanceof Function ? x(this.value) : x;
    }
    or<U, F>(_: Result<U, F> | ((err: E) => Result<U, F>)): Result<T, F> {
        return new Ok(this.value);
    }
    async or_async<U, F>(
        _: Promise<Result<U, F>> | ((err: E) => Promise<Result<U, F>>),
    ): Promise<Result<T, F>> {
        return new Ok(this.value);
    }
    unwrap(): T {
        return this.value;
    }
    unwrap_or(_: T | ((_: E) => T)): T {
        return this.value;
    }
    async unwrap_or_async(_: Promise<T> | ((_: E) => Promise<T>)): Promise<T> {
        return this.value;
    }
    unwrap_err(): E {
        throw Error("Called `unwrap_err()` on an `Ok` value");
    }
    expect(_: string): T {
        return this.value;
    }
    match<R>(pattern: ResultPattern<T, E, R>): R {
        return pattern.ok(this.value);
    }
    async match_async<R>(pattern: ResultPatternAsync<T, E, R>): Promise<R> {
        return pattern.ok(this.value);
    }
    ok<U>(f: (x: T) => U, _?: U): U {
        return f(this.value);
    }
    async ok_async<U>(f: (x: T) => Promise<U>): Promise<U> {
        return f(this.value);
    }
}

/**
 * Result variant that contains the error value.
 *
 * @typeParam T - The type of the value contained in the `Result`.
 * @typeParam E - The type of the value contained in the `Err`.
 */
export class Err<T, E> implements ResultBase<T, E> {
    private err: E;
    constructor(err: E) {
        this.err = err;
    }
    is_ok = () => false;
    is_err = () => true;
    map<U>(_: (val: T) => U): Result<U, E> {
        return new Err<U, E>(this.err);
    }
    async map_async<U>(_: (val: T) => Promise<U>): Promise<Result<U, E>> {
        return new Err<U, E>(this.err);
    }
    map_or<U>(x: U | (() => U), _: (val: T) => U): U {
        return x instanceof Function ? x() : x;
    }
    async map_or_async<U>(
        x: Promise<U> | (() => Promise<U>),
        _: (val: T) => Promise<U>,
    ): Promise<U> {
        return x instanceof Function ? x() : x;
    }
    map_err<F>(op: (err: E) => Result<T, F>): Result<T, F> {
        return op(this.err);
    }
    async map_err_async<F>(op: (err: E) => Promise<Result<T, F>>): Promise<Result<T, F>> {
        return op(this.err);
    }
    and<U>(_: Result<U, E> | ((val: T) => Result<U, E>)): Result<U, E> {
        return new Err<U, E>(this.err);
    }
    async and_async<U>(
        _: Promise<Result<U, E>> | ((val: T) => Promise<Result<U, E>>),
    ): Promise<Result<U, E>> {
        return new Err<U, E>(this.err);
    }
    or<U, F>(x: Result<U, F> | ((err: E) => Result<U, F>)): Result<U, F> {
        return x instanceof Function ? x(this.err) : x;
    }
    async or_async<U, F>(
        x: Promise<Result<U, F>> | ((err: E) => Promise<Result<U, F>>),
    ): Promise<Result<U, F>> {
        return x instanceof Function ? x(this.err) : x;
    }
    unwrap(): T {
        throw Error("called `unwrap()` on an `Err` value");
    }
    unwrap_or(x: T | ((err: E) => T)): T {
        return x instanceof Function ? x(this.err) : x;
    }
    async unwrap_or_async(x: Promise<T> | ((err: E) => Promise<T>)): Promise<T> {
        return x instanceof Function ? x(this.err) : x;
    }
    unwrap_err(): E {
        return this.err;
    }
    expect(msg: string): T {
        throw Error(msg);
    }
    match<R>(pattern: ResultPattern<T, E, R>): R {
        return pattern.err(this.err);
    }
    async match_async<R>(pattern: ResultPatternAsync<T, E, R>): Promise<R> {
        return pattern.err(this.err);
    }
    ok<U>(_: (x: T) => U, or?: U): U | Err<T, E> {
        return or ?? this;
    }
    async ok_async<U>(_: (x: T) => Promise<U>): Promise<Err<T, E>> {
        return this;
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
export const is_result = <T, E>(input: Result<T, E> | Option<T>): input is Result<T, E> =>
    (input as Result<T, E>).is_ok !== undefined;
