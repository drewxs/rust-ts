import {Some, None, if_let, Option} from "../src";

describe("Match", () => {
    const div = (x: number, y: number): Option<number> => (y === 0 ? None() : Some(x / y));

    describe("standalone", () => {
        it("should match an Ok value to a pattern", () => {
            const val = Some(42);
            const res = if_let(val, {
                some: x => String(x),
                else: () => "Enexpected error",
            });
            expect(res).toBe("42");
        });
        it("should match an Err value to a pattern", () => {
            const val = None();
            const res = if_let(val, {
                some: x => String(x),
                else: () => "Enexpected error",
            });
            expect(res).toBe("Enexpected error");
        });
    });
    describe("Option.if_let", () => {
        it("should match a Some value to a pattern", () => {
            const val = div(4, 2);
            const doubled = val.if_let({
                some: x => x * 2,
                else: () => 0,
            });
            expect(doubled).toBe(4);
        });
        it("should match a None value to a pattern", () => {
            const val = div(2, 0);
            const doubled = val.if_let({
                some: x => x * 2,
                else: () => 0,
            });
            expect(doubled).toBe(0);
        });
    });
});
