import {fetchr, fetchx} from "../src";

const url = "https://jsonplaceholder.typicode.com/todos";
interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

describe("Fetch", () => {
    describe("fetchr", () => {
        it("should fetch a todo", async () => {
            const res = await fetchr<Todo>(`${url}/1`);
            expect(res.unwrap()).toEqual({
                userId: 1,
                id: 1,
                title: "delectus aut autem",
                completed: false,
            });
        });
        it("should handle fallbacks", async () => {
            const fallback: Todo = {
                userId: 1,
                id: 1,
                title: "delectus aut autem",
                completed: false,
            };
            const data = (await fetchr<Todo>(`${url}/0`)).unwrap_or(fallback);
            expect(data).toBe(fallback);
        });
        it("should handle errors", async () => {
            const res = await fetchr<Todo>(`${url}/0`);
            res.match({
                ok: data => expect(data).toBe(0),
                err: err => expect(err.message).toBe("Error 404 Not Found"),
            });
        });
    });
    describe("fetchx", () => {
        it("should fetch a todo", async () => {
            const res = await fetchx(`${url}/1`);
            res.match({
                ok: async resp => {
                    expect(resp).toBeInstanceOf(Response);
                    const data: Todo = await resp.json();
                    expect(data).toEqual({
                        userId: 1,
                        id: 1,
                        title: "delectus aut autem",
                        completed: false,
                    });
                },
                err: async err =>
                    expect(err.message).toBe("Error 404 Not Found"),
            });
        });
    });
});
