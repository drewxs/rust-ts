import {IfLetOptionPattern, Option} from "./option";
import {IfLetResultPattern, is_result, Result} from "./result";

/**
 * Pattern matches over `Result` variants with a conditional `else` defaulting to `0` that can optionally contain the `Err` value.
 *
 * @typeParam T - The type of the value contained in the `Result`.
 * @typeParam E - The type of the error value.
 * @typeParam R - The type of the result of the match pattern.
 * @param input - The `Result` to match on.
 * @param pattern - The pattern to match over.
 * @returns the result of the pattern match.
 */
export function if_let<T, E, R>(
    input: Result<T, E>,
    pattern: IfLetResultPattern<T, E, R>,
): R;

/**
 * Pattern matches over `Option` variants with a conditional `else` defaulting to `0`.
 *
 * @typeParam T - The type of the value contained in the `Option`.
 * @typeParam R - The type of the result of the if_let pattern.
 * @param input - The `Option` to match on.
 * @param pattern - The pattern to match over.
 * @returns the result of the pattern matchif_let
 */
export function if_let<T, R>(
    input: Option<T>,
    pattern: IfLetOptionPattern<T, R>,
): R;

export function if_let<T, E, R>(
    input: Result<T, E> | Option<T>,
    pattern: IfLetResultPattern<T, E, R> | IfLetOptionPattern<T, R>,
): R {
    if (is_result(input)) {
        const result = input as Result<T, E>;
        const result_pattern = pattern as IfLetResultPattern<T, E, R>;
        if (result.is_ok()) return result_pattern.ok(result.unwrap());
        if (result_pattern.else) return result_pattern.else();
        return 0 as R;
    } else {
        const option = input as Option<T>;
        const option_pattern = pattern as IfLetOptionPattern<T, R>;
        if (option.is_some()) return option_pattern.some(option.unwrap());
        if (option_pattern.else) return option_pattern.else();
        return 0 as R;
    }
}
