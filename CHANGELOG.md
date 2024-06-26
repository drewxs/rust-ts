## [6.0.3](https://github.com/drewxs/rust-ts/compare/v6.0.2...v6.0.3) (2024-05-27)


### ⚠ BREAKING CHANGES

* `fetchx` removed, `fetchr` now resolves to the raw response if there is no content headers match.

### Code Refactoring

* rm `fetchx` ([a1b932e](https://github.com/drewxs/rust-ts/commit/a1b932e205806ead547ac4ba45cfda8ee671d121))

## [6.0.2](https://github.com/drewxs/rust-ts/compare/v6.0.1...v6.0.2) (2024-02-03)

## [6.0.1](https://github.com/drewxs/rust-ts/compare/v6.0.0...v6.0.1) (2024-01-09)


### ⚠ BREAKING CHANGES

* CHANGE: `match` function removed, prefer to use `Result`/`Option` instance methods `match` and `match_async` instead.
* CHANGE: `Box` removed, not necessary in TS.

### Code Refactoring

* rm `Box` ([3d52f33](https://github.com/drewxs/rust-ts/commit/3d52f3327bb5bc557ce4b350a42acbbbab08023f))
* rm `match` ([ee4607d](https://github.com/drewxs/rust-ts/commit/ee4607d355b369d4149e603ac5a147073766acd6))

## [6.0.0](https://github.com/drewxs/rust-ts/compare/v5.1.0...v6.0.0) (2023-11-21)


### ⚠ BREAKING CHANGES

* **box:** CHANGE: `map` signature/functionality replaced with `map_mut`. Use constructor with the result instead if new `Box` instances are needed after `map`.

### Bug Fixes

* **box:** replace `map` w/ `map_mut` ([f3b106b](https://github.com/drewxs/rust-ts/commit/f3b106b5f0ea430622bfd233be6d50210f4bba53))

## [5.1.0](https://github.com/drewxs/rust-ts/compare/v5.0.0...v5.1.0) (2023-11-18)


### Features

* create `Box` implementation ([db7662c](https://github.com/drewxs/rust-ts/commit/db7662c753608105924e4f3caf36dc6d546a7841))

## [5.0.0](https://github.com/drewxs/rust-ts/compare/v4.2.1...v5.0.0) (2023-11-11)


### ⚠ BREAKING CHANGES

* **result,option:** CHANGE: Result.ok fallback arg removed.

### Features

* **result,option:** add async support ([609533e](https://github.com/drewxs/rust-ts/commit/609533eff4d88704bc9df943c7af08843aa780ee))

## [4.2.1](https://github.com/drewxs/rust-ts/compare/v4.2.0...v4.2.1) (2023-10-24)

## [4.2.0](https://github.com/drewxs/rust-ts/compare/v4.1.5...v4.2.0) (2023-10-21)


### Features

* **result:** create method `ok` ([b501823](https://github.com/drewxs/rust-ts/commit/b5018232e97c54bd8246810371af569925fd8d37))

## [4.1.5](https://github.com/drewxs/rust-ts/compare/v4.1.4...v4.1.5) (2023-10-17)

## [4.1.4](https://github.com/drewxs/rust-ts/compare/v4.1.3...v4.1.4) (2023-10-12)

## [4.1.3](https://github.com/drewxs/rust-ts/compare/v4.1.2...v4.1.3) (2023-10-10)

## [4.1.2](https://github.com/drewxs/rust-ts/compare/v4.1.1...v4.1.2) (2023-10-03)

## [4.1.1](https://github.com/drewxs/rust-ts/compare/v4.1.0...v4.1.1) (2023-09-25)

## [4.1.0](https://github.com/drewxs/rust-ts/compare/v4.0.0...v4.1.0) (2023-09-15)


### Features

* **option:** create method `some` ([61ed5ec](https://github.com/drewxs/rust-ts/commit/61ed5ec0357fc531c34de3a9ff2e5f853ac22aeb))

## [4.0.0](https://github.com/drewxs/rust-ts/compare/v3.0.2...v4.0.0) (2023-09-12)


### ⚠ BREAKING CHANGES

* CHANGE: `_then`/`_else` methods removed, functionality combined with their value variants (e.g. and_then->and).
* CHANGE: if_let removed, prefer to use match or `x.and_then(v => /** do something with v */)` instead.

### Features

* combine _then/_else methods ([c0c8a79](https://github.com/drewxs/rust-ts/commit/c0c8a79a55fc309e3192100f390a6721c5df1db5))
* rm if_let ([be97874](https://github.com/drewxs/rust-ts/commit/be97874ecf4ee4d6618ed36785dfeb9483c770e6))

## [3.0.2](https://github.com/drewxs/rust-ts/compare/v3.0.1...v3.0.2) (2023-09-07)

## [3.0.1](https://github.com/drewxs/rust-ts/compare/v3.0.0...v3.0.1) (2023-08-26)

## [3.0.0](https://github.com/drewxs/rust-ts/compare/v2.3.3...v3.0.0) (2023-07-10)


### ⚠ BREAKING CHANGES

* **if_let:** CHANGE: Result.if_let removed, result matching removed in if_let.

### Features

* **if_let:** rm matching over results ([c984f77](https://github.com/drewxs/rust-ts/commit/c984f77709f886e36a00ae466ab90ccaf0290411))

## [2.3.3](https://github.com/drewxs/rust-ts/compare/v2.3.2...v2.3.3) (2023-07-10)

## [2.3.2](https://github.com/drewxs/rust-ts/compare/v2.3.1...v2.3.2) (2023-05-28)


### Bug Fixes

* **fetch:** add error generics ([67dd729](https://github.com/drewxs/rust-ts/commit/67dd72971f46ef4962f474fd7e6d9a34c1c9d6e0))
* **fetch:** handle `formData`/`arrayBuffer` content types ([35dde1d](https://github.com/drewxs/rust-ts/commit/35dde1df01786f99b79fe5e103e666ad10a85041))

## [2.3.1](https://github.com/drewxs/rust-ts/compare/v2.3.0...v2.3.1) (2023-05-28)


### Bug Fixes

* **fetch:** add generics for response data ([b8e5ee2](https://github.com/drewxs/rust-ts/commit/b8e5ee22dfdfa51789f8ade715525bc238caa32d))
* **lib:** missing fetchx export ([151e529](https://github.com/drewxs/rust-ts/commit/151e529a7b48357119fedb11f9524ca20b129142))

## [2.3.0](https://github.com/drewxs/rust-ts/compare/v2.2.0...v2.3.0) (2023-05-22)


### Features

* **lib:** create fetch wrapper ([e68230f](https://github.com/drewxs/rust-ts/commit/e68230fef0c032ce349ad6da134b1d24ab0652f7))

## [2.2.0](https://github.com/drewxs/rust-ts/compare/v2.1.0...v2.2.0) (2023-03-20)


### Features

* **lib:** implement `if_let` ([db84d64](https://github.com/drewxs/rust-ts/commit/db84d64cd2fa6c2143bf28a55709aaa9aecd7c39))

## [2.1.0](https://github.com/drewxs/rust-ts/compare/v2.0.0...v2.1.0) (2023-03-17)


### Features

* create standalone match function ([20f7e49](https://github.com/drewxs/rust-ts/commit/20f7e496dcc41e3a681d53b85b7e07d3089a5c7f))
* create type guards for `Result` & `Option` ([63d05df](https://github.com/drewxs/rust-ts/commit/63d05df302067a33b2210e958d76798ee5762668))

## [2.0.0](https://github.com/drewxs/rust-ts/compare/v1.1.0...v2.0.0) (2023-03-15)

### ⚠ BREAKING CHANGES

- CHANGE: Variant class exports replaced with wrapper functions.

### Features

- create constructor wrapper functions ([b3b4845](https://github.com/drewxs/rust-ts/commit/b3b4845b16d9cb85343cb9df86cacf33577eab51))

### Bug Fixes

- remove helper type exports ([02c067e](https://github.com/drewxs/rust-ts/commit/02c067e5bfe7d001ba1f9cfaebabe926b53136f0))

## [1.1.0](https://github.com/drewxs/rust-ts/compare/v1.0.2...v1.1.0) (2023-03-15)

### Features

- create Option type ([8be2578](https://github.com/drewxs/rust-ts/commit/8be2578a60a55a3126758abf2e97b95c0a822319))

### Bug Fixes

- **result:** various doc/type fixes, remove clone ([61c1da8](https://github.com/drewxs/rust-ts/commit/61c1da85c2800c1e3db9cb8cb23456a2febe3e76))

## [1.0.2](https://github.com/drewxs/rust-ts/compare/v1.0.1...v1.0.2) (2023-03-14)

### Bug Fixes

- **npm:** repo url ([29a2faa](https://github.com/drewxs/rust-ts/commit/29a2faaceb99d0c31b222d0fae9b5d8444688d2b))

## [1.0.1](https://github.com/drewxs/rs-ts/compare/v1.0.0...v1.0.1) (2023-03-14)

### Bug Fixes

- **result:** mising generic `U` in `and` method for `Result` value type ([2f132d0](https://github.com/drewxs/rs-ts/commit/2f132d0ca0c4283161737742b5445e5f950c0d8c))
- **result:** remove unchecked methods ([7754237](https://github.com/drewxs/rs-ts/commit/775423729f7fd168e5e4321094ae938ce37deab3))

## 1.0.0 (2023-03-13)

### Features

- **functions:** create match ([1555b58](https://github.com/drewxs/rs-ts/commit/1555b589954996767fef4313fa238da85b8849f0))
- create Result class ([4a2181a](https://github.com/drewxs/rs-ts/commit/4a2181a8bedbc5d15f433962686c19992489e69d))
- **result:** update impl separate classes ([03af0ad](https://github.com/drewxs/rs-ts/commit/03af0adaef12cbffa587a980b223932979f019d2))
