import {Err, Ok, Result} from "./result";

/**
 * Represents a pattern for handling the result of a computation that can either produce
 * a value of type `T` or not produce a value.
 *
 * @typeParam T - The type of the value contained in the `Option`.
 * @typeParam R - The type of the result of the match pattern.
 */
export interface OptionPattern<T, R> {
    /**
     * Function to execute if the `Option` is `Some`.
     *
     * @param v - The wrapped value of type `T`.
     * @returns A value of type `R`.
     */
    some(v: T): R;

    /**
     * Function to execute if the `Option` is `None`.
     *
     * @returns A value of type `R`.
     */
    none(): R;
}

/**
 * Represents a pattern for handling the result of a computation that can either produce
 * a value of type `T` or not produce a value.
 *
 * @typeParam T - The type of the value contained in the `Option`.
 * @typeParam R - The type of the result of the match pattern.
 */
export interface OptionPatternAsync<T, R> {
    /**
     * Asynchronous function to execute if the `Option` is `Some`.
     *
     * @param v - The wrapped value of type `T`.
     * @returns A value of type `R`.
     */
    some(v: T): Promise<R>;

    /**
     * Asynchronous function to execute if the `Option` is `None`.
     *
     * @returns A value of type `R`.
     */
    none(): Promise<R>;
}

/**
 * Represents the outcome of a computation that can either produce a value of type `T` or not produce a value.
 *
 * @typeParam T - The type of the contents of the Option.
 */
export interface OptionBase<T> {
    /**
     * Checks if the option is a `Some` value.
     *
     * @example
     * ```ts
     * const x = Some(2);
     * x.is_some(); // true
     * ```
     * @returns `true` if the option is `Some`.
     */
    is_some(): boolean;

    /**
     * Checks if the option is a `None` value.
     *
     * @example
     * ```ts
     * const x = None();
     * x.is_none(); // true
     * ```
     * @returns `true` if the option is `None`.
     */
    is_none(): boolean;

    /**
     * Maps an `Option<T>` to `Option<U>` by applying a function to a contained `Some` value, leaving a `None` value untouched.
     * This is associative: `foo.map(f).map(g)` is the same as `foo.map(x => g(f(x)))`.
     *
     * @example
     * ```ts
     * const x = Some(2);
     * x.map(x => x + 3); // Some(5);
     * ```
     * @typeParam U - The type to map the `Some` value to.
     * @param op - The function to apply to the contained `Some` value.
     * @returns A `Option<U>` containing the result of applying `op` to the contained `Some` value, or the original `None` value if it was an `None`.
     */
    map<U>(op: (val: T) => U): Option<U>;

    /**
     * Returns the provided default value (if `None`), or applies to the contained value (if `Some`).
     *
     * @example
     * ```ts
     * const x = Some('foo');
     * x.map_or(42, v => v.length); // 3
     *
     * const x: Option<string> = None();
     * x.map_or(42, v => v.length); // 42
     *
     * const x = Some('foo');
     * x.map_or(() => 42, v => v.length); // 3
     * ```
     * @typeParam U - The type to map the `Some` value to.
     * @param x - The default value to return or callback to compute one from if `None`.
     * @param op - The function to apply to the contained `Some` value.
     * @returns The result of applying `op` to the contained `Some` value,
     * or the provided default value or callback result if it was an `None`.
     */
    map_or<U>(x: U | (() => U), op: (val: T) => U): U;

    /**
     * Asynchronous version of `map_or`.
     *
     * @typeParam U - The type to map the `Some` value to.
     * @param x - The default value to return or callback to compute one from if `None`.
     * @param op - The function to apply to the contained `Some` value.
     * @returns The result of applying `op` to the contained `Some` value,
     * or the provided default value or callback result if it was an `None`.
     */
    map_or_async<U>(x: Promise<U> | (() => Promise<U>), op: (val: T) => Promise<U>): Promise<U>;

    /**
     * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and `None` to `Err(err)`.
     *
     * @example
     * ```ts
     * const x = Some(26);
     * x.ok_or("error!"); // Ok(26)
     *
     * const y = None();
     * x.ok_or(() => "error!"); // Err("error!")
     * ```
     * @typeParam E - The type of the provided error.
     * @param err - The error to return or compute if `None`.
     * @returns `Ok(v)` if the result is `Some(v)`, otherwise returns `Err(err)`.
     */
    ok_or<E>(err: E | (() => E)): Result<T, E>;

    /**
     * Asynchronous version of `ok_or`.
     *
     * @typeParam E - The type of the provided error.
     * @param err - The error to return or compute if `None`.
     * @returns Promise resolving to `Ok` if the result is `Some(v)`, otherwise `Err`.
     */
    ok_or_async<E>(err: Promise<E> | (() => Promise<E>)): Promise<Result<T, E>>;

    /**
     * Returns `x` or the result of executing `x` if the option is `Some`, otherwise returns the `None` value.
     * This function can be used for control flow based on `Option` values.
     * This is a monadic bind operation:
     *     `x.and(v => v)` is equivalent to `x`.
     *     `x.and(f).and(g)` is equivalent to `x.and(x => f(x).and(g))`.
     *
     * @example
     * ```ts
     * const x = Some(2);
     * const y = None();
     * x.and(y); // None()
     * ```
     * @typeParam U - Success type of the option to return if `Some`.
     * @param x - The result to return or compute if `Some`.
     * @returns The passed option or the result of the callback if the result is `Some`, otherwise `None`.
     */
    and<U>(x: Option<U> | ((val: T) => Option<U>)): Option<U>;

    /**
     * Asynchronous version of `and_async`.
     *
     * @typeParam U - Success type of the option to return if `Some`.
     * @param x - The result to return or compute if `Some`.
     * @returns Promise containing the passed option or the result of `x()` if the result is `Some`, otherwise `None`.
     */
    and_async<U>(x: Promise<Option<U>> | ((val: T) => Promise<Option<U>>)): Promise<Option<U>>;

    /**
     * Returns the option if it contains a value, otherwise returns the provided option or computes it from a callback.
     *
     * @example
     * ```ts
     * Some(1).or(None()); // Some(1)
     * None().or(Some(1)); // Some(1)
     * None().or(None()); // None()
     * Some(0).or(Some(1)); // Some(1)
     * Some(0).or(() => Some(1)); // Some(0)
     * None().or(() => Some(1)); // Some(1)
     * ```
     * @param x - The result to return or compute if `None`.
     * @returns the passed in option or the result of `x()` if `None`, otherwise `Some` value.
     */
    or(x: Option<T> | (() => Option<T>)): Option<T>;

    /**
     * Asynchronous version of `or`.
     *
     * @param x - The result to return or compute if `None`.
     * @returns `x` or the result of `x()` if `None`, otherwise `Some` value.
     */
    or_async(x: Promise<Option<T>> | (() => Promise<Option<T>>)): Promise<Option<T>>;

    /**
     * Returns the contained `Some` value.
     * Because this function may throw an exception, its use is generally discouraged. Instead, prefer to call `unwrap_or`.
     *
     * @example
     * ```ts
     * const x = Some(2);
     * x.unwrap(); // 2
     *
     * const y = None();
     * y.unwrap(); // throws error
     * ```
     * @returns The contained `Some` value.
     * @throws {Error} If the value is `None`.
     */
    unwrap(): T;

    /**
     * Returns the contained `Some` value or returns the provided value or computes it from a closure.
     *
     * @example
     * ```ts
     * const x = Some(42);
     * x.unwrap_or(7); // 42
     *
     * const y = None();
     * y.unwrap_or(7); // 7
     *
     * const k = 10;
     * Some(4).unwrap_or(() => 2 * k); // 4
     * None().unwrap_or(() => 2 * k); // 20
     * ```
     * @param x - The default value to return or closure to compute if `None`.
     * @returns The contained `Some` value or the provided default value if `None`.
     */
    unwrap_or(x: T | (() => T)): T;

    /**
     * Asynchronous version of `unwrap_or`.
     *
     * @param x - The default value to return or closure to compute if `None`.
     * @returns The contained `Some` value or the provided default value if `None`.
     */
    unwrap_or_async(x: Promise<T> | (() => Promise<T>)): Promise<T>;

    /**
     * Returns the contained `Some` value if it exists, otherwise throws an Error with the provided message.
     *
     * @example
     * ```ts
     * const x = None();
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
     * const x = Some(42);
     * const y = x.match({
     *     some: v => v.toString(),
     *     none: () => 'Unexpected error'
     * }); // '42'
     * ```
     * @typeParam T - The type of the value contained in the `Option`.
     * @typeParam R - The type of the result of the match pattern.
     * @param pattern - The pattern to match over.
     * @returns The result of the pattern match.
     */
    match<R>(pattern: OptionPattern<T, R>): R;

    /**
     * Asynchronous version of `match`.
     *
     * @typeParam T - The type of the value contained in the `Option`.
     * @typeParam R - The type of the result of the match pattern.
     * @param pattern - The pattern to match over.
     * @returns The result of the pattern match.
     */
    match_async<R>(pattern: OptionPatternAsync<T, R>): Promise<R>;

    /**
     * Applies a function to the contained value (if `Some`).
     * This function can be used similarly to using `if const Some(x)` in rust.
     *
     * @example
     * ```ts
     * const x = Some(2);
     * x.some(x => x + 3); // 5
     * ```
     * @typeParam R - The type of the result of the function.
     * @param f - The function to apply to the contained value.
     * @returns The result of applying `f` to the contained value, or returns self if it was a `None`.
     */
    some<U>(f: (x: T) => U): U | None<T>;

    /**
     * Asynchronous version of `some`.
     *
     * @typeParam R - The type of the result of the function.
     * @param f - The function to apply to the contained value.
     * @returns The result of applying `f` to the contained value, or returns self if it was a `None`.
     */
    some_async<U>(f: (x: T) => Promise<U>): Promise<U | None<T>>;
}

/**
 * Option variant that contains a value.
 *
 * @typeParam T - The type of the wrapped value.
 */
export class Some<T> implements OptionBase<T> {
    private value: T;
    constructor(val: T) {
        this.value = val;
    }
    is_some = () => true;
    is_none = () => false;
    map<U>(op: (val: T) => U): Option<U> {
        return new Some<U>(op(this.value));
    }
    async map_async<U>(op: (val: T) => Promise<U>): Promise<Option<U>> {
        return new Some<U>(await op(this.value));
    }
    map_or<U>(_: U | (() => U), op: (val: T) => U): U {
        return op(this.value);
    }
    async map_or_async<U>(
        _: Promise<U> | (() => Promise<U>),
        op: (val: T) => Promise<U>,
    ): Promise<U> {
        return op(this.value);
    }
    ok_or<E>(_: E | (() => E)): Result<T, E> {
        return new Ok<T, E>(this.value);
    }
    async ok_or_async<E>(_: Promise<E> | (() => Promise<E>)): Promise<Result<T, E>> {
        return new Ok<T, E>(this.value);
    }
    and<U>(x: Option<U> | ((val: T) => Option<U>)): Option<U> {
        return x instanceof Function ? x(this.value) : x;
    }
    async and_async<U>(
        x: Promise<Option<U>> | ((val: T) => Promise<Option<U>>),
    ): Promise<Option<U>> {
        return x instanceof Function ? x(this.value) : x;
    }
    or(_: Option<T> | (() => Option<T>)): Option<T> {
        return new Some<T>(this.value);
    }
    async or_async(_: Promise<Option<T>> | (() => Promise<Option<T>>)): Promise<Option<T>> {
        return new Some<T>(this.value);
    }
    unwrap(): T {
        return this.value;
    }
    unwrap_or(_: T | (() => T)) {
        return this.value;
    }
    async unwrap_or_async(_: Promise<T> | (() => Promise<T>)) {
        return this.value;
    }
    expect(_: string): T {
        return this.value;
    }
    match<R>(pattern: OptionPattern<T, R>): R {
        return pattern.some(this.value);
    }
    async match_async<R>(pattern: OptionPatternAsync<T, R>): Promise<R> {
        return pattern.some(this.value);
    }
    some<U>(f: (x: T) => U): U {
        return f(this.value);
    }
    async some_async<U>(f: (x: T) => Promise<U>): Promise<U> {
        return f(this.value);
    }
}

/**
 * Option variant that contains the error value.
 *
 * @typeParam T - The type of the value contained in the `Option`.
 */
export class None<T> implements OptionBase<T> {
    is_some = () => false;
    is_none = () => true;
    map<U>(_: (val: T) => U): Option<U> {
        return new None<U>();
    }
    async map_async<U>(_: (val: T) => Promise<U>): Promise<Option<U>> {
        return new None<U>();
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
    ok_or<E>(x: E | (() => E)): Result<T, E> {
        return new Err<T, E>(x instanceof Function ? x() : x);
    }
    async ok_or_async<E>(x: Promise<E> | (() => Promise<E>)): Promise<Result<T, E>> {
        return new Err<T, E>(x instanceof Function ? await x() : await Promise.resolve(x));
    }
    and<U>(_: Option<U> | ((val: T) => Option<U>)): Option<U> {
        return new None<U>();
    }
    async and_async<U>(
        _: Promise<Option<U>> | ((val: T) => Promise<Option<U>>),
    ): Promise<Option<U>> {
        return new None<U>();
    }
    or(res: Option<T> | (() => Option<T>)): Option<T> {
        return res instanceof Function ? res() : res;
    }
    async or_async(x: Promise<Option<T>> | (() => Promise<Option<T>>)): Promise<Option<T>> {
        return x instanceof Function ? x() : x;
    }
    unwrap(): T {
        throw Error("called `unwrap()` on a `None` value");
    }
    unwrap_or(x: T | (() => T)): T {
        return x instanceof Function ? x() : x;
    }
    async unwrap_or_async(x: Promise<T> | (() => Promise<T>)): Promise<T> {
        return x instanceof Function ? x() : x;
    }
    expect(msg: string): T {
        throw Error(msg);
    }
    match<R>(pattern: OptionPattern<T, R>): R {
        return pattern.none();
    }
    async match_async<R>(pattern: OptionPatternAsync<T, R>): Promise<R> {
        return pattern.none();
    }
    some<U>(_: (x: T) => U): None<T> {
        return this;
    }
    async some_async<U>(_: (x: T) => Promise<U>): Promise<None<T>> {
        return this;
    }
}

/**
 * A type that represents either success (`Some`) or failure (`None`).
 *
 * @typeParam T - The type of the value contained in the `Option`.
 */
export type Option<T> = Some<T> | None<T>;

/**
 * `Option` type guard.
 *
 * @typeParam T - The type of the value contained in the`Option`.
 * @typeParam E - The type of the value contained in the`Err`.
 * @param input - The`Result` or `Option` to check.
 * @returns`true` if `input` is a`Option`, `false` otherwise.
 */
export const is_option = <T, E>(input: Result<T, E> | Option<T>): input is Option<T> =>
    (input as Option<T>).is_some !== undefined;
