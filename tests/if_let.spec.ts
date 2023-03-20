import {Ok, Err, if_let, Some, None} from "../src";

describe("Match", () => {
    describe("standalone", () => {
        it("should match an Ok value to a pattern", () => {
            const val = Ok(42);
            const res = if_let(val, {
                ok: v => String(v),
                else: _ => "Enexpected error",
            });
            expect(res).toBe("42");
        });
        it("should match an Err value to a pattern", () => {
            const val = Err("Something went wrong");
            const res = if_let(val, {
                ok: v => String(v),
                else: _ => "Enexpected error",
            });
            expect(res).toBe("Enexpected error");
        });
    });
    describe("Result.if_let", () => {
        it("should match an Ok value to a pattern", () => {
            const val = Ok(42);
            const res = val.if_let({
                ok: v => String(v),
                else: _ => "Enexpected error",
            });
            expect(res).toBe("42");
        });
        it("should match an Err value to a pattern", () => {
            const val = Err("Something went wrong");
            const res = val.if_let({
                ok: v => String(v),
                else: e => e,
            });
            expect(res).toBe("Something went wrong");
        });
    });
    describe("Option.if_let", () => {
        it("should match a Some value to a pattern", () => {
            const val = Some(42);
            const res = val.if_let({
                some: v => String(v),
                else: () => "Enexpected error",
            });
            expect(res).toBe("42");
        });
        it("should match a None value to a pattern", () => {
            const val = None();
            const res = val.if_let({
                some: v => String(v),
            });
            expect(res).toBe(0);
        });
    });
});
