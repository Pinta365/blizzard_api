import { request } from "../../shared/index.ts";
import type { KeyId, KeyNameId, LinkSelfHref, TypeName } from "../../shared/index.ts";

export interface Toys extends LinkSelfHref {
    toys: KeyNameId[];
}

export interface Toy extends LinkSelfHref {
    id: number;
    item: KeyNameId;
    source: TypeName;
    should_exclude_if_uncollected: boolean;
    media: KeyId;
}

/**
 * Returns an index of toys.
 *
 * @returns A promise that resolves to an object representing a list of toys.
 */
export async function toys(): Promise<Toys> {
    return await request({
        method: "GET",
        url: "/data/wow/toy/index",
        namespace: "static",
    }) as Toys;
}

/**
 * Returns a toy by id.
 *
 * @param toyId - The unique identifier for the toy.
 * @returns A promise that resolves to an object representing details about a toy.
 */
export async function toy(toyId: number): Promise<Toy> {
    return await request({
        method: "GET",
        url: `/data/wow/toy/${toyId}`,
        namespace: "static",
    }) as Toy;
}
