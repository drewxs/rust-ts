import {IfLetOptionPattern, Option} from "./option";

/**
 * Pattern matches over `Option` variants with a conditional `else` defaulting to undefined.
 *
 * @typeParam T - The type of the value contained in the `Option`.
 * @typeParam R - The type of the result of the if_let pattern.
 * @param input - The `Option` to match on.
 * @param pattern - The pattern to match over.
 * @returns the result of the pattern matchif_let
 */
export function if_let<T, R>(
    option: Option<T>,
    pattern: IfLetOptionPattern<T, R>,
): R {
    if (option.is_some()) return pattern.some(option.unwrap());
    if (pattern.else) return pattern.else();
    return undefined as R;
}
