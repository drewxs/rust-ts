import {Option, OptionPattern} from "./option";
import {is_result, Result, ResultPattern} from "./result";

/**
 * Pattern matches over `Result` variants.
 *
 * @typeParam T - The type of the value contained in the `Result`.
 * @typeParam E - The type of the error value.
 * @typeParam R - The type of the result of the match pattern.
 * @param input - The `Result` to match on.
 */
export function match<T, E, R>(input: Result<T, E>, pattern: ResultPattern<T, E, R>): R;

/**
 * Pattern matches over `Option` variants.
 *
 * @typeParam T - The type of the value contained in the `Option`.
 * @typeParam R - The type of the result of the match pattern.
 * @param input - The `Option` to match on.
 */
export function match<T, R>(input: Option<T>, pattern: OptionPattern<T, R>): R;

/**
 * @deprecated Prefer to use the `match` method on the `Result` or `Option` instance.
 * @param pattern - The pattern to match over.
 * @returns the result of the pattern match.
 */
export function match<T, E, R>(
    input: Result<T, E> | Option<T>,
    pattern: ResultPattern<T, E, R> | OptionPattern<T, R>,
): R {
    if (is_result(input)) {
        const result = input as Result<T, E>;
        const result_pattern = pattern as ResultPattern<T, E, R>;
        if (result.is_ok()) return result_pattern.ok(result.unwrap());
        return result_pattern.err(result.unwrap_err());
    } else {
        const option = input as Option<T>;
        const option_pattern = pattern as OptionPattern<T, R>;
        if (option.is_some()) return option_pattern.some(option.unwrap());
        return option_pattern.none();
    }
}
