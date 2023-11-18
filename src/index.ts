import {Some as _Some, None as _None, Option} from "./option";
import {Ok as _Ok, Err as _Err, Result} from "./result";
import {match} from "./match";
import {fetchr, fetchx} from "./fetch";
import {Box} from "./box";

const Some = <T>(value: T): Option<T> => new _Some(value);
const None = <T>(): Option<T> => new _None();
const Ok = <T, E>(value: T): Result<T, E> => new _Ok(value);
const Err = <T, E>(error: E): Result<T, E> => new _Err(error);

export {Some, None, Option, Ok, Err, Result, Box, match, fetchr, fetchx};
