import {Ok, Err, Result} from "../src";

describe("Result", () => {
    describe("constructor", () => {
        it("should create an Ok value", () => {
            const val = Ok(42);
            expect(val.is_ok()).toBe(true);
            expect(val.is_err()).toBe(false);
            expect(val.unwrap()).toBe(42);
        });
        it("should create an Err instance", () => {
            const error = Error("Something went wrong");
            const result = Err(error);
            expect(result.is_ok()).toBe(false);
            expect(result.is_err()).toBe(true);
            expect(result.unwrap_err()).toBe(error);
        });
    });
    describe("map", () => {
        it("should map an Ok value to another Ok value", () => {
            const val = Ok(42);
            const x = val.map(v => v.toString());
            expect(x.is_ok()).toBe(true);
            expect(x.unwrap()).toBe("42");
        });
    });
    describe("map_async", () => {
        it("should map an Ok value to another Ok value", async () => {
            const val = Ok(42);
            const x = await val.map_async(async v => v.toString());
            expect(x.is_ok()).toBe(true);
            expect(x.unwrap()).toBe("42");
        });
    });
    describe("map_or", () => {
        it("should apply a function to the contained value", () => {
            const val = Ok("foo");
            expect(val.map_or(42, v => v.length)).toBe(3);
            const x: Result<string, unknown> = Err("bar");
            expect(x.map_or(42, v => v.length)).toBe(42);
        });
        it("should map a `Result<T, E>` to `U` by applying a function to a contained `Ok` value", () => {
            const val = Ok("foo");
            const x = val.map_or(
                () => 42,
                v => v.length,
            );
            expect(x).toBe(3);
        });
    });
    describe("map_or_async", () => {
        it("should apply a function to the contained value", async () => {
            const val = Ok("foo");
            expect(await val.map_or_async(new Promise(() => 42), async v => v.length)).toBe(3);
            const x: Result<string, unknown> = Err("bar");
            expect(x.map_or(42, v => v.length)).toBe(42);
        });
        it("should map a `Result<T, E>` to `U` by applying a function to a contained `Ok` value", async () => {
            const val = Ok("foo");
            const x = await val.map_or_async(
                async () => 42,
                async v => v.length,
            );
            expect(x).toBe(3);
        });
    });
    describe("map_err", () => {
        it("should map an Ok value to an Err value", () => {
            const val = Ok(2);
            const x = val.map_err(err => Err(`error code: ${err}`));
            expect(x.is_err()).toBe(false);
            expect(x.unwrap()).toBe(2);
        });
    });
    describe("map_err_async", () => {
        it("should map an Ok value to an Err value", async () => {
            const val = Ok(2);
            const x = await val.map_err_async(async err => Err(`error code: ${err}`));
            expect(x.is_err()).toBe(false);
            expect(x.unwrap()).toBe(2);
        });
    });
    describe("and", () => {
        it("should chain Ok values", () => {
            const val1 = Ok(42);
            const val2 = Err("late error");
            const x = val1.and(v => Ok(v.toString()));
            expect(x.unwrap()).toBe("42");
            expect(val1.and(val2).unwrap_err()).toBe(Err("late error").unwrap_err());
        });
    });
    describe("and_async", () => {
        it("should chain Ok values", async () => {
            const val1 = Ok(42);
            const val2 = Promise.resolve(Err("late error"));
            const x = await val1.and_async(async v => Ok(v.toString()));
            expect(x.unwrap()).toBe("42");
            expect((await val1.and_async(val2)).unwrap_err()).toBe(Err("late error").unwrap_err());
        });
    });
    describe("or", () => {
        it("should chain Ok values using or", () => {
            const val1 = Ok(2);
            const val2 = Err("late error");
            expect(val1.or(val2).unwrap()).toBe(2);
            expect(val2.or(() => Ok(42)).unwrap()).toBe(42);
        });
    });
    describe("or_async", () => {
        it("should chain Ok values using or_async", async () => {
            const val1 = Ok(2);
            const val2 = Err("late error");
            const result = await val1.or_async(Promise.resolve(val2));
            expect(result.unwrap()).toBe(2);
            expect((await val2.or_async(async () => Ok(42))).unwrap()).toBe(42);
        });
    });
    describe("unwrap", () => {
        it("should unwrap an Ok value using unwrap", () => {
            const val = Ok(42);
            expect(val.unwrap()).toBe(42);
        });
        it("should throw an error when trying to unwrap an Err", () => {
            const error = Error("Something went wrong");
            const result = Err(error);
            expect(() => result.unwrap()).toThrow("called `unwrap()` on an `Err` value");
            const msg = "Custom error message";
            expect(() => result.expect(msg)).toThrow(msg);
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
            expect(err.unwrap_or(() => 42)).toBe(42);
        });
    });
    describe("unwrap_or_async", () => {
        it("should unwrap an Ok value using unwrap_or_async", async () => {
            const val = Ok(42);
            expect(await val.unwrap_or_async(Promise.resolve(0))).toBe(42);
        });
        it("should return default value using unwrap_or on an Err value", async () => {
            const err = Err(Error("unexpected error"));
            expect(await err.unwrap_or_async(Promise.resolve(0))).toBe(0);
            expect(await err.unwrap_or_async(async () => 42)).toBe(42);
        });
    });
    describe("unwrap_err", () => {
        it("should throw an error when trying to unwrap_err an Ok value", () => {
            const val = Ok(42);
            expect(() => val.unwrap_err()).toThrow("Called `unwrap_err()` on an `Ok` value");
        });
        it("should unwrap an Err value using unwrap_err", () => {
            const error = Error("Something went wrong");
            const x = Err(error);
            expect(x.unwrap_err()).toBe(error);
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
    describe("match", () => {
        it("should match an Ok value to a pattern", () => {
            const val = Ok(42);
            const res = val.match({
                ok: v => String(v),
                err: _ => "Enexpected error",
            });
            expect(res).toBe("42");
        });
        it("should match an Err value to a pattern", () => {
            const val = Err("Something went wrong");
            const res = val.match({
                ok: v => String(v),
                err: _ => "Enexpected error",
            });
            expect(res).toBe("Enexpected error");
        });
    });
    describe("match_async", () => {
        it("should match an Ok value to a pattern", async () => {
            const val = Ok(42);
            const res = await val.match_async({
                ok: async v => String(v),
                err: async _ => "Enexpected error",
            });
            expect(res).toBe("42");
        });
        it("should match an Err value to a pattern", async () => {
            const val = Err("Something went wrong");
            const res = await val.match_async({
                ok: async v => String(v),
                err: async _ => "Enexpected error",
            });
            expect(res).toBe("Enexpected error");
        });
    });
    describe("ok", () => {
        it("should execute a callback with the contained value if the value is Ok", () => {
            const val = Ok(42);
            val.ok(x => expect(x).toBe(42));
        });
    });
    describe("ok_async", () => {
        it("should execute a callback with the contained value if the value is Ok", async () => {
            const val = Ok(42);
            const result = await val.ok_async(async () => 0);
            expect(result).toBe(0);
        });
    });
});
