import {Ok, Err, match, Some, None} from "../src";

describe("Match", () => {
    describe("standalone", () => {
        it("should match an Ok value to a pattern", () => {
            const val = Ok(42);
            const res = match(val, {
                ok: v => String(v),
                err: _ => "Enexpected error",
            });
            expect(res).toBe("42");
        });
        it("should match an Err value to a pattern", () => {
            const val = Err("Something went wrong");
            const res = match(val, {
                ok: v => String(v),
                err: _ => "Enexpected error",
            });
            expect(res).toBe("Enexpected error");
        });
    });
    describe("Result.match", () => {
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
    describe("Option.match", () => {
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
});
