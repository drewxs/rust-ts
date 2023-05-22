import {Result, Err, Ok} from "./result";

/**
 * Fetch wrapper that returns a `Promise<Result<T, E>>` instead of a `Promise<Response>`.
 *
 * @param url - fetch url.
 * @param opts - fetch options.
 * @returns A `Promise<Result<T, E>>`.
 */
export async function fetchr(
    url: RequestInfo | URL,
    opts?: RequestInit,
): Promise<Result<any, unknown>> {
    try {
        const response = await fetch(url, opts);

        if (!response.ok) {
            return new Err(
                new Error(`Error ${response.status} ${response.statusText}`),
            );
        }

        let data;
        const content_type = response.headers.get("content-type");

        if (content_type && content_type.includes("application/json")) {
            data = await response.json();
        } else if (content_type && content_type.includes("text")) {
            data = await response.text();
        } else {
            data = await response.blob();
        }

        return new Ok(data);
    } catch (error) {
        return new Err(error);
    }
}

/**
 * Fetch wrapper that returns a `Promise<Result<Response, E>>` instead of a `Promise<Response>`.
 *
 * @param url - fetch url.
 * @param opts - fetch options.
 * @returns A `Promise<Result<T, E>>`.
 */
export async function fetchx(
    url: RequestInfo | URL,
    opts?: RequestInit,
): Promise<Result<Response, unknown>> {
    try {
        const response = await fetch(url, opts);

        if (!response.ok) {
            return new Err(
                new Error(`Error ${response.status} ${response.statusText}`),
            );
        }

        return new Ok(response);
    } catch (error) {
        return new Err(error);
    }
}
