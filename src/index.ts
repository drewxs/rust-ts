import {Some as _Some, None as _None, Option} from "./lib/option";
import {Ok as _Ok, Err as _Err, Result} from "./lib/result";
import {match} from "./lib/match";
import {fetchr, fetchx} from "./lib/fetch";

const Some = <T>(value: T): Option<T> => new _Some(value);
const None = <T>(): Option<T> => new _None();
const Ok = <T, E>(value: T): Result<T, E> => new _Ok(value);
const Err = <T, E>(error: E): Result<T, E> => new _Err(error);

export {Some, None, Option, Ok, Err, Result, match, fetchr, fetchx};
