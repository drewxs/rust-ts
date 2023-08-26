import {Result, Err, Ok} from "./result";

/**
 * Fetch wrapper that returns a `Promise<Result<T, E>>` instead of a `Promise<Response>`.
 *
 * @example
 * ```ts
 * const url = "https://jsonplaceholder.typicode.com/todos";
 * interface Todo {
 *     userId: number;
 *     id: number;
 *     title: string;
 *     completed: boolean;
 * }
 * const res = await fetchr<Todo>(`${url}/1`);
 *
 * // Fallback data with `unwrap_or`
 * const data = res.unwrap_or({
 *     userId: 0,
 *     id: 0,
 *     title: "",
 *     completed: false,
 * });
 *
 * // Match to handle each case
 * res.match({
 *     ok: data => /do something with data/,
 *     err: err => /handle errors/,
 * });
 * ```
 * @param url - fetch url.
 * @param opts - fetch options.
 * @returns A promise containing the fetch `Response` data wrapped in a `Result`.
 */
export async function fetchr<T = unknown, E = Error>(
    url: RequestInfo | URL,
    opts?: RequestInit,
): Promise<Result<T, E>> {
    try {
        const response = await fetch(url, opts);

        if (!response.ok) {
            return new Err(Error(`${response.status} ${response.statusText}`) as E);
        }

        let data;
        const content_type = response.headers.get("content-type");

        if (!content_type) {
            return new Err(Error("Content-Type header is missing") as E);
        }

        if (content_type.includes("json")) {
            data = await response.json();
        } else if (content_type.includes("text")) {
            data = await response.text();
        } else if (content_type.includes("form")) {
            data = await response.formData();
        } else if (content_type.includes("octet-stream")) {
            data = await response.blob();
        } else {
            data = await response.arrayBuffer();
        }

        return new Ok(data);
    } catch (error) {
        return new Err(error as E);
    }
}

/**
 * Fetch wrapper that returns a `Promise<Result<Response, E>>` instead of a `Promise<Response>`.
 *
 * @example
 * ```ts
 * const url = "https://jsonplaceholder.typicode.com/todos";
 * const result = await fetchx(`${url}/1`);
 *
 * res.match({
 *     ok: async response => {
 *         // do someting with response
 *         const data: Todo = await response.json();
 *         // do someting with data
 *     },
 *     err: async error => {
 *         // handle errors
 *     },
 * });
 * ```
 * @param url - fetch url.
 * @param opts - fetch options.
 * @returns A promise containing the fetch `Response` wrapped in a `Result`.
 */
export async function fetchx<E = Error>(
    url: RequestInfo | URL,
    opts?: RequestInit,
): Promise<Result<Response, E>> {
    try {
        const response = await fetch(url, opts);

        if (!response.ok) {
            return new Err(Error(`${response.status} ${response.statusText}`) as E);
        }

        return new Ok(response);
    } catch (error) {
        return new Err(error as E);
    }
}
