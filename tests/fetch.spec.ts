import {fetchr} from "../src";

describe("Fetch", () => {
    describe("fetchr", () => {
        const url = "https://jsonplaceholder.typicode.com/todos";
        it("should fetch a todo", async () => {
            const data = (await fetchr(`${url}/1`)).unwrap();
            expect(data).toEqual({
                userId: 1,
                id: 1,
                title: "delectus aut autem",
                completed: false,
            });
        });
        it("should handle fallbacks", async () => {
            const data = (await fetchr(`${url}/0`)).unwrap_or(0);
            expect(data).toBe(0);
        });
        it("should handle errors", async () => {
            const res = await fetchr(`${url}/0`);
            res.match({
                ok: data => expect(data).toBe(0),
                err: err => expect(err).toBeInstanceOf(Error),
            });
        });
    });
});
