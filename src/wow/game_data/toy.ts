import { KeyId, KeyNameId, LinkSelfHref, request, TypeName } from "../../shared/index.ts";

interface Toys extends LinkSelfHref {
    toys: KeyNameId[];
}

interface Toy extends LinkSelfHref {
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
    });
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
    });
}
