import {fetchr} from "../src";

interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

const url = "https://jsonplaceholder.typicode.com/todos";
const todo: Todo = {
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    completed: false,
};

describe("Fetch", () => {
    describe("fetchr", () => {
        it("should fetch a todo", async () => {
            const res = await fetchr<Todo>(`${url}/1`);
            expect(res.unwrap()).toEqual(todo);
        });
        it("should handle fallbacks", async () => {
            const data = (await fetchr<Todo>(`${url}/0`)).unwrap_or(todo);
            expect(data).toBe(todo);
        });
        it("should handle errors", async () => {
            const res = await fetchr<Todo>(`${url}/0`);
            res.match({
                ok: data => expect(data).toBe(0),
                err: err => expect(err.message).toBe("404 Not Found"),
            });
        });
    });
});
