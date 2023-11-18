/**
 * A container for a single value.
 * The `Box` instance itself is mutable (contained value can be modified)
 * but the value it points to is immutable (properties of the object can't be modified directly)
 *
 * @typeParam T - Type of the value.
 */
export class Box<T> {
    private value: T;

    /**
     * Creates a new `Box` instance.
     *
     * @example
     * ```ts
     * const x = new Box({data: "hello"});
     * x.get(); // {data: "hello"}
     * x.set({data: "world"});
     * x.get(); // {data: "world"}
     * ```
     *
     * @param value - Value to be contained.
     */
    constructor(value: T) {
        this.value = value;
    }

    /**
     * Returns the contained value.
     *
     * @example
     * ```ts
     * const x = new Box({data: "hello"});
     * x.get(); // {data: "hello"}
     * ```
     */
    get(): T {
        return this.value;
    }

    /**
     * Sets the contained value.
     *
     * @example
     * ```ts
     * const x = new Box({data: "hello"});
     * x.get(); // {data: "hello"}
     * ```
     */
    set(value: T): void {
        this.value = value;
    }

    /**
     * Returns a new `Box` instance with the same value.
     *
     * @example
     * ```ts
     * const x = new Box({data: "hello"});
     * x.clone(); // Box {value: {data: "hello"}}
     * ```
     */
    clone(): Box<T> {
        return new Box(this.value);
    }

    /**
     * Returns a new Box instance with the result of applying the function to the contained value.
     * This function does not mutate the original box or its value.
     * If you want to mutate the value in place, use `map_mut` instead.
     *
     * @example
     * ```ts
     * const x = new Box(3);
     * x.map(x => x + 2); // Box {value: 5}
     * ```
     */
    map<U>(f: (value: T) => U): Box<U> {
        return new Box(f(this.value));
    }

    /**
     * Same as `map` but mutates the original box and its value.
     */
    map_mut(f: (value: T) => T): Box<T> {
        this.set(f(this.value));
        return this;
    }

    /**
     * Returns a new `Box` instance with the result of applying the function to the contained value.
     * The transformer function must return a `Box` instance.
     *
     * @example
     * ```ts
     * const x = new Box(2);
     * x.flat_map(x => new Box(x * 2)); // Box {value: 4}
     * ```
     */
    flat_map<U>(transformer: (value: T) => Box<U>): Box<U> {
        return transformer(this.value);
    }

    /**
     * Returns `true` if the contained value is equal to the value contained in the other box.
     *
     * @example
     * ```ts
     * const x = new Box(2);
     * const y = new Box(2);
     * x.equals(y); // true
     * ```
     */
    equals(other: Box<T>): boolean {
        return this.value === other.value;
    }

    /**
     * Compares the contained value to the value contained in the other box.
     * Returns `-1` if the value is less than the other value, `1` if it's greater and `0` if they are equal.
     *
     * @example
     * ```ts
     * const x = new Box(2);
     * const y = new Box(3);
     * x.compare_to(y); // -1
     * ```
     */
    compare_to(other: Box<T>): number {
        if (this.value < other.value) {
            return -1;
        } else if (this.value > other.value) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Returns a string representation of the box.
     *
     * @example
     * ```ts
     * const x = new Box(2);
     * x.to_string(); // "Box(2)"
     * ```
     */
    to_string(): string {
        return `Box(${JSON.stringify(this.value)})`;
    }

    /**
     * Returns `true` if the contained value passes the validator function, `false` otherwise.
     *
     * @example
     * ```ts
     * const x = new Box(2);
     * x.validate(x => x > 1); // true
     * ```
     */
    validate(validator: (value: T) => boolean): boolean {
        return validator(this.value);
    }

    /**
     * Returns a JSON representation of the box.
     * This is the same as calling `JSON.stringify` on the contained value.
     *
     * @example
     * ```ts
     * const x = new Box({data: "hello"});
     * x.serialize(); // '{"data":"hello"}'
     * ```
     */
    serialize(): string {
        return JSON.stringify(this.value);
    }

    /**
     * Creates a new `Box` instance from a JSON string.
     * This is the same as calling `JSON.parse` on the string and then creating a new `Box` instance.
     *
     * @example
     * ```ts
     * const x = '{"data":"hello"}';
     * Box.deserialize(x); // Box {value: {data: "hello"}}
     * ```
     */
    static deserialize<T>(value: string): Box<T> {
        return new Box(JSON.parse(value));
    }
}
