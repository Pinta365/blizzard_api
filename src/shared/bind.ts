//bind.ts
import type { ApiContext } from "./context.ts";

/**
 * Turns a module of endpoint functions `(ctx, ...args) => R` into the same functions without the context argument.
 */
export type Bound<T> = {
    // deno-lint-ignore no-explicit-any
    [K in keyof T as T[K] extends (ctx: ApiContext, ...args: any[]) => unknown ? K : never]: T[K] extends (
        ctx: ApiContext,
        ...args: infer A
    ) => infer R ? (...args: A) => R
        : never;
};

/**
 * Binds every endpoint function of a module to a context.
 * @param {ApiContext} ctx - The context the endpoints will use.
 * @param {T} endpoints - A module namespace of endpoint functions.
 * @returns {Bound<T>} The bound endpoints.
 */
export function bindAll<T extends object>(ctx: ApiContext, endpoints: T): Bound<T> {
    const bound: Record<string, unknown> = {};
    for (const [name, value] of Object.entries(endpoints)) {
        if (typeof value === "function") {
            bound[name] = value.bind(undefined, ctx);
        }
    }
    return Object.freeze(bound) as Bound<T>;
}
