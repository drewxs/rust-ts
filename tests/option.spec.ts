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
    describe("ok_or", () => {
        it("should map a `Option<T>` to `Result<T, E>` by applying a function to a contained `Some` value", () => {
            const val = Some("foo");
            const x = val.ok_or(0);
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
    describe("or", () => {
        it("should chain Some values using or", () => {
            const val1 = None();
            const val2 = Some(2);
            expect(val1.or(val2).is_some()).toBe(true);
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
    describe("some", () => {
        it("should execute a callback with the contained value if the value is Some", () => {
            const val = Some(42);
            val.some(x => {
                expect(x).toBe(42);
                const y = x * 10;
                expect(y).toBe(420);
            });
        });
    });
});
