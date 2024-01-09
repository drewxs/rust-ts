# rust-ts

[![NPM](https://img.shields.io/npm/v/rust-ts?logo=npm)](https://www.npmjs.com/package/rust-ts)
[![Build](https://github.com/drewxs/rust-ts/actions/workflows/release.yml/badge.svg)](https://github.com/drewxs/rust-ts/actions/workflows/release.yml)
[![Docs](https://img.shields.io/github/deployments/drewxs/rust-ts/production?label=Docs&logo=vercel&logoColor=white)](https://rust-ts.vercel.app)

TypeScript implementations of Rust `std` modules and some rust-like wrappers.

This doc only covers basic usage examples, check the documentation for all methods and details.

[Documentation](https://rust-ts.vercel.app)

## Contents

-   [Installation](#installation)
-   [Key differences](#key-differences)
-   [Modules](#modules)
    -   [Result](#Result)
    -   [Option](#Option)
    -   [match](#match)
    -   [fetch](#fetch)

## Installation

```bash
# npm
npm i rust-ts
# yarn
yarn add rust-ts
# pnpm
pnpm i rust-ts
```

## Key differences

All `_then`/`_else` callback variants have been combined with their value counterparts.
For example, if you wanted to do:

```ts
Some(42).unwrap_or_else(() => 5);
```

You can simply do:

```ts
Some(42).unwrap_or(() => 5);
Some(42).unwrap_or(5);
```

`match` and `if let` implementations are also a bit different.

Rust:

```rs
let num = Some(42);
if let Some(x) = num {...}

let res = Ok(10);
match res {
    Ok(x) => {...},
    Err(e) => {...}
}
```

`rust-ts` equivalent:

```ts
let option = Some(42);
option.some(x => {...});
// Also possible with Result values
let result = Ok(42)
result.ok(x => {...})

let res = Ok(10);
match(res, {
    ok: x => {...},
    err: e => {...},
});

// Alternatively
res.match({
    ok: x => {...},
    err: e => {...},
})
```

Methods with callbacks have async variants with the syntax `{name}_async`, allowing passing async callbacks or Promise values.

Example:

```ts
const add_one_async = async (x: number) => x + 1;
const result = await Some(1).map_async(add_one_async); // result = Some(2)
```

## Modules

### Result

`Result<T, E>` is the type used for returning and propagating errors. It is an union type with the variants, `Ok<T, E>`, representing success and containing a value, and `Err<E>`, representing error and containing an error value.

```ts
type Result<T, E> = Ok<T, E> | Err<T, E>;
```

##### Usage

```ts
import {Ok, Err, Result} from "rust-ts";

const divide = (x: number, y: number): Result<number, string> =>
    y === 0 ? Err("Can't divide by zero") : Ok(x / y);

divide(10, 5)
    .and(z => divide(z, 2))
    .map(z => [z, z + 1])
    .match({
        ok: ([v, x]) => console.log(v + x),
        err: e => console.log(e),
    });
```

### Option

`Option<T>` represents an optional value: every `Option` is either `Some` and contains a value, or `None`, and does not.

```ts
type Option<T> = Some<T> | None<T>;
```

##### Usage

```ts
import {Some, None, Option, match} from "rust-ts";

const divide = (x: number, y: number): Option<number> => (y === 0 ? None() : Some(x / y));

const result = divide(2.0, 3.0);

match(result, {
    some: x => console.log(x),
    none: () => console.log("Cannot divide by zero"),
});
```

### match

`match` is available as a standalone function as well as defined methods for `Result` and `Option`.

##### Usage

```ts
import {Some, None, Option, Err, Ok, Result, match} from "rust-ts";

const add = (x: number, y: number): Option<number> => (y === 0 ? None() : Some(x + y));

const divide = (x: number, y: number): Result<number, string> =>
    y === 0 ? Err("Cannot divide by zero") : Ok(x + y);

const option = add(3, 4);
option.match({
    some: x => console.log(x),
    none: () => console.log("none"),
});

const result = option.ok_or("error");
result.map(x => x + 1).and(x => divide(x, 2));
match(result, {
    ok: x => console.log(x),
    err: e => console.log(e),
});
```

### fetch

`fetchr` is a wrapper around `fetch` that returns a `Promise<Result<T, E>>` with the data or error values instead of a `Promise<Response>`.

It also resolves the `json`, `text`, or `blob` accordingly based on the `content-type`.

If you need more granular control, use `fetchx` instead, which returns a `Promise<Result<Response, E>>`.

##### Usage

```ts
const url = "https://yourapiurl.com";
const res = await fetchr<ExpectedType, CustomErrorType>(url); // Optional generics for expected types, defaults to <unknown, Error>

// Fallback data with `unwrap_or`
const data = res.unwrap_or(FALLBACK_DATA);

// Match to handle each case
res.match({
    ok: data => /* do something with data */,
    err: err => /* handle errors */,
});
```

### Contributions

Are welcome!

Refer to the [docs](https://rust-ts.vercel.app) for more details and examples.
