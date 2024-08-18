import { request } from "../../shared/index.ts";

interface ItemTypes {
    id: string;
    name: string;
    path: string;
}

interface ItemType {
    id: string;
    slug: string;
    name: string;
    icon: string;
    path: string;
}

/**
 * Returns an index of item types.
 *
 * @returns A promise that resolves to an object representing an index of item types.
 */
export async function itemTypes(): Promise<ItemTypes[]> {
    return await request({
        method: "GET",
        url: "/d3/data/item-type/",
    }) as ItemTypes[];
}

/**
 * Returns a single item type by slug.
 *
 * @param itemTypeSlug - The slug of the item type to retrieve.
 * @returns A promise that resolves to an object representing the data for a single item type by slug.
 */
export async function itemType(itemTypeSlug: string): Promise<ItemType> {
    return await request({
        method: "GET",
        url: `/d3/data/item-type/${itemTypeSlug}`,
    }) as ItemType;
}
