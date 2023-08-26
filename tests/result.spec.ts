import {Ok, Err, Result} from "../src";

describe("Result", () => {
    describe("Ok", () => {
        describe("constructor", () => {
            it("should create an Ok value", () => {
                const val = Ok(42);
                expect(val.is_ok()).toBe(true);
                expect(val.is_err()).toBe(false);
                expect(val.unwrap()).toBe(42);
            });
        });
        describe("map", () => {
            it("should map an Ok value to another Ok value", () => {
                const val = Ok(42);
                const res = val.map(v => v.toString());
                expect(res.is_ok()).toBe(true);
                expect(res.unwrap()).toBe("42");
            });
        });
        describe("map_err", () => {
            it("should map an Ok value to an Err value", () => {
                const val = Ok(2);
                const res = val.map_err(err => Err(`error code: ${err}`));
                expect(res.is_err()).toBe(false);
                expect(res.unwrap()).toBe(2);
            });
        });
        describe("map_or", () => {
            it("should apply a function to the contained value", () => {
                const val = Ok("foo");
                expect(val.map_or(42, v => v.length)).toBe(3);
                const res: Result<string, unknown> = Err("bar");
                expect(res.map_or(42, v => v.length)).toBe(42);
            });
        });
        describe("map_or_else", () => {
            it("should map a `Result<T, E>` to `U` by applying a function to a contained `Ok` value", () => {
                const k = 21;
                const val = Ok("foo");
                expect(
                    val.map_or_else(
                        () => k * 2,
                        val => val.length,
                    ),
                ).toBe(3);
            });
        });
        describe("and", () => {
            it("should chain Ok values using and", () => {
                const val1 = Ok(2);
                const val2 = Err("late error");
                expect(val1.and(val2).unwrap_err()).toBe(Err("late error").unwrap_err());
            });
        });
        describe("and_then", () => {
            it("should chain Ok values using and_then", () => {
                const val = Ok(42);
                const res = val.and_then(v => Ok(v.toString()));
                expect(res.is_ok()).toBe(true);
                expect(res.unwrap()).toBe("42");
            });
        });
        describe("unwrap_or", () => {
            it("should unwrap an Ok value using unwrap_or", () => {
                const val = Ok(42);
                expect(val.unwrap_or(0)).toBe(42);
            });
            it("should return default value using unwrap_or on an Err value", () => {
                const err = Err(Error("unexpected error"));
                expect(err.unwrap_or(0)).toBe(0);
            });
        });
        describe("unwrap_or_else", () => {
            it("should return default value using unwrap_or_else on an Err value", () => {
                const err = Err(Error("unexpected error"));
                expect(err.unwrap_or_else(() => 0)).toBe(0);
            });
        });
        describe("expect", () => {
            it("should panic with the provided message when provided an `Err`", () => {
                const x = Err("emergency failure");
                try {
                    x.expect("Testing expect");
                } catch (error) {
                    expect(error).toStrictEqual(Error("Testing expect"));
                }
            });
        });
    });

    describe("Err", () => {
        describe("constructor", () => {
            it("should create an Err instance", () => {
                const error = Error("Something went wrong");
                const result = Err(error);
                expect(result.is_ok()).toBe(false);
                expect(result.is_err()).toBe(true);
                expect(result.unwrap_err()).toBe(error);
            });
        });
        describe("unwrap", () => {
            it("should throw an error when trying to unwrap an Err", () => {
                const error = Error("Something went wrong");
                const result = Err(error);
                expect(() => result.unwrap()).toThrowError("called `unwrap()` on an `Err` value");
                expect(() => result.expect("Custom error message")).toThrowError(
                    "Custom error message",
                );
            });
        });
    });
});
