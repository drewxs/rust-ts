import {Some, None, Option} from "../src";

describe("Option", () => {
    describe("constructor", () => {
        it("should create a Some value", () => {
            const val = Some(42);
            expect(val.is_some()).toBe(true);
            expect(val.is_none()).toBe(false);
            expect(val.unwrap()).toBe(42);
        });
        it("should create a None instance", () => {
            const val = None();
            expect(val.is_some()).toBe(false);
            expect(val.is_none()).toBe(true);
        });
    });
    describe("map", () => {
        it("should map a Some value to another Some value", () => {
            const val = Some(42);
            const x = val.map(v => v.toString());
            expect(x.is_some()).toBe(true);
            expect(x.unwrap()).toBe("42");
        });
    });
    describe("map_async", () => {
        it("should map a Some value to another Some value", async () => {
            const val = Some(42);
            const x = await val.map_async(async v => v.toString());
            expect(x.is_some()).toBe(true);
            expect(x.unwrap()).toBe("42");
        });
    });
    describe("map_or", () => {
        it("should apply a function to the contained value", () => {
            const val = Some("foo");
            expect(val.map_or(42, v => v.length)).toBe(3);
            const x: Option<string> = None();
            const len = (v: string) => v.length;
            const y = x.map_or(() => 42, len);
            expect(y).toBe(42);
        });
    });
    describe("map_or_async", () => {
        it("should apply a function to the contained value", async () => {
            const val = Some("foo");
            expect(await val.map_or_async(Promise.resolve(42), async v => v.length)).toBe(3);
            const x: Option<string> = None();
            const len = async (v: string) => v.length;
            const y = await x.map_or_async(async () => 42, len);
            expect(y).toBe(42);
        });
    });
    describe("ok_or", () => {
        it("should map a `Option<T>` to `Result<T, E>` by applying a function to a contained `Some` value", () => {
            const val = Some("foo");
            const x = val.ok_or(0);
            expect(x.is_ok()).toBe(true);
            expect(x.unwrap()).toBe("foo");
        });
    });
    describe("ok_or_async", () => {
        it("should map a `Option<T>` to `Result<T, E>` by applying a function to a contained `Some` value", async () => {
            const val = Some("foo");
            const x = await val.ok_or_async(Promise.resolve(0));
            expect(x.is_ok()).toBe(true);
            expect(x.unwrap()).toBe("foo");
        });
    });
    describe("and", () => {
        it("should chain Some values", () => {
            const val1 = Some(42);
            const val2 = None();
            const x = val1.and(v => Some(v.toString()));
            expect(x.unwrap()).toBe("42");
            expect(val1.and(val2).is_none()).toBe(true);
        });
    });
    describe("and_async", () => {
        it("should chain Some values", async () => {
            const val1 = Some(42);
            const val2 = None();
            const x = await val1.and_async(async v => Some(v.toString()));
            expect(x.unwrap()).toBe("42");
            expect((await val1.and_async(Promise.resolve(val2))).is_none()).toBe(true);
        });
    });
    describe("or", () => {
        it("should chain Some values using or", () => {
            const val1 = None();
            const val2 = Some(2);
            expect(val1.or(val2).is_some()).toBe(true);
        });
    });
    describe("or_async", () => {
        it("should chain Some values using or", async () => {
            const val1 = None();
            const val2 = Some(2);
            expect((await val1.or_async(Promise.resolve(val2))).is_some()).toBe(true);
        });
    });
    describe("unwrap", () => {
        it("should unwrap a Some value using unwrap", () => {
            const val = Some(42);
            expect(val.unwrap()).toBe(42);
        });
        it("should throw an error when unwrapping a None value", () => {
            const val = None();
            expect(() => val.unwrap()).toThrow();
        });
    });
    describe("unwrap_or", () => {
        it("should unwrap a Some value using unwrap_or", () => {
            const val = Some(42);
            expect(val.unwrap_or(0)).toBe(42);
        });
        it("should return the default value when unwrapping a None value", () => {
            const val = None();
            expect(val.unwrap_or(0)).toBe(0);
        });
    });
    describe("unwrap_or_async", () => {
        it("should unwrap a Some value using unwrap_or", async () => {
            const val = Some(42);
            expect(await val.unwrap_or_async(Promise.resolve(0))).toBe(42);
        });
        it("should return the default value when unwrapping a None value", async () => {
            const val = None();
            expect(await val.unwrap_or_async(Promise.resolve(0))).toBe(0);
        });
    });
    describe("expect", () => {
        it("should unwrap a Some value using expect", () => {
            const val = Some(42);
            expect(val.expect("error")).toBe(42);
        });
        it("should throw an error when unwrapping a None value", () => {
            const val = None();
            expect(() => val.expect("error")).toThrow();
        });
    });
    describe("match", () => {
        it("should match a Some value to a pattern", () => {
            const val = Some(42);
            const res = val.match({
                some: v => String(v),
                none: () => "Enexpected error",
            });
            expect(res).toBe("42");
        });
        it("should match a None value to a pattern", () => {
            const val = None();
            const res = val.match({
                some: v => String(v),
                none: () => "Enexpected error",
            });
            expect(res).toBe("Enexpected error");
        });
    });
    describe("match_async", () => {
        it("should match a Some value to a pattern", async () => {
            const val = Some(42);
            const res = await val.match_async({
                some: async v => String(v),
                none: async () => "Enexpected error",
            });
            expect(res).toBe("42");
        });
        it("should match a None value to a pattern", async () => {
            const val = None();
            const res = await val.match_async({
                some: async v => String(v),
                none: async () => "Enexpected error",
            });
            expect(res).toBe("Enexpected error");
        });
    });
    describe("some", () => {
        it("should execute a callback with the contained value if the value is Some", () => {
            const val = Some(42);
            val.some(x => expect(x).toBe(42));
        });
    });
    describe("some_async", () => {
        it("should execute a callback with the contained value if the value is Some", async () => {
            const val = Some(42);
            val.some(async x => expect(x).toBe(42));
        });
    });
});
