import {Box} from "../src";

describe("Box", () => {
    it("should create a new Box instance", () => {
        const x = new Box({data: "hello"});
        expect(x).toBeInstanceOf(Box);
    });
    it("should get the contained value", () => {
        const x = new Box({data: "hello"});
        expect(x.get()).toEqual({data: "hello"});
    });
    it("should set the contained value", () => {
        const x = new Box({data: "hello"});
        x.set({data: "world"});
        expect(x.get()).toEqual({data: "world"});
    });
    it("should clone the Box instance", () => {
        const x = new Box({data: "hello"});
        const y = x.clone();
        expect(x).not.toBe(y);
        expect(x.get()).toEqual(y.get());
    });
    it("should map the contained value", () => {
        const x = new Box(1);
        x.map(v => v + 1);
        expect(x.get()).toEqual(2);
    });
    it("should flat_map the contained value", () => {
        const x = new Box(1);
        const y = x.flat_map(v => new Box(v + 1));
        expect(y.get()).toEqual(2);
    });
    it("should check if 2 boxes contain the same value", () => {
        const x = new Box(1);
        const y = new Box(1);
        expect(x.equals(y)).toBe(true);
    });
    it("should compare 2 boxes", () => {
        const x = new Box(1);
        const y = new Box(2);
        expect(x.compare_to(y)).toBe(-1);
    });
    it("should return a string representation of the box", () => {
        const x = new Box(1);
        expect(x.to_string()).toBe("Box(1)");
    });
    it("should validate the contained value", () => {
        const x = new Box(1);
        expect(x.validate(v => v === 1)).toBe(true);
    });
    it("should serialize the contained value", () => {
        const x = new Box({data: "hello"});
        expect(x.serialize()).toBe('{"data":"hello"}');
    });
    it("should deserialize the contained value", () => {
        const x = Box.deserialize('{"data":"hello"}');
        expect(x.get()).toEqual({data: "hello"});
    });
});
