import {Ok, Err, match} from "../src";

describe("Match", () => {
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
