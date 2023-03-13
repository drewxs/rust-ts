# rust-ts

![GitHub deployments](https://img.shields.io/github/deployments/drewxs/rust-ts/production?label=docs&logo=vercel&logoColor=white)
![release](https://github.com/drewxs/rust-ts/actions/workflows/release.yml/badge.svg)

TypeScript implementations of Rust `std` modules like `Result<T, E>` and `Option<T>`.

Should you use this in production? Probably not.

## Contents

- [Installation](#Installation)
- [Modules](#Modules)
  - [Result](#Result)
  - [Option](#Option)

## Installation

```bash
# npm
npm i rs-ts
# yarn
yarn add rs-ts
# pnpm
pnpm i rs-ts
```

## Modules

### Result

`Result<T,E>` is an union type that is either `Ok<T, E>` or `Err<T, E>` representing success and error values.

#### Usage

```ts
import { Ok, Err, Result } from 'rs-ts';

const divide = (x: number, y: number): Result<number, string> =>
  y === 0 ? new Err("Can't divide by zero") : new Ok(x / y);

divide(10, 5) // 10 / 5 -> 2
  .and_then((z) => divide(z, 2)) // 2 / 2 -> 1
  .map((z) => [z, z + 1]) // 1 -> 1 + 1 -> 2
  .match({
    ok: ([v, x]) => console.log(v + x), // 1 + 2 -> 3
    err: (e) => console.log(e),
  });
```
