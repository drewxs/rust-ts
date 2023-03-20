import {Option, OptionPattern} from "./option";
import {is_result, Result, ResultPattern} from "./result";

/**
 * Pattern matches over `Result` variants.
 *
 * @typeParam T - The type of the value contained in the `Result`.
 * @typeParam E - The type of the error value.
 * @typeParam R - The type of the result of the match pattern.
 * @param input - The `Result` to match on.
 * @param pattern - The pattern to match over.
 * @returns the result of the pattern match.
 */
export function match<T, E, R>(
    input: Result<T, E>,
    pattern: ResultPattern<T, E, R>,
): R;

/**
 * Pattern matches over `Option` variants.
 *
 * @typeParam T - The type of the value contained in the `Option`.
 * @typeParam R - The type of the result of the match pattern.
 * @param input - The `Option` to match on.
 * @param pattern - The pattern to match over.
 * @returns the result of the pattern match.
 */
export function match<T, R>(input: Option<T>, pattern: OptionPattern<T, R>): R;

export function match<T, E, R>(
    input: Result<T, E> | Option<T>,
    pattern: ResultPattern<T, E, R> | OptionPattern<T, R>,
): R {
    if (is_result(input)) {
        const result = input as Result<T, E>;
        if (result.is_ok()) {
            return (pattern as ResultPattern<T, E, R>).ok(result.unwrap());
        } else {
            return (pattern as ResultPattern<T, E, R>).err(result.unwrap_err());
        }
    } else {
        const option = input as Option<T>;
        if (option.is_some()) {
            return (pattern as OptionPattern<T, R>).some(option.unwrap());
        } else {
            return (pattern as OptionPattern<T, R>).none();
        }
    }
}
