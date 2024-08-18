import { request } from "../../shared/index.ts";

interface ItemType {
    twoHanded: boolean;
    id: string;
}

interface Attribute {
    textHtml: string;
    text: string;
}

interface RandomAffix {
    oneOf: Attribute[];
}

interface Item {
    id: string;
    slug: string;
    name: string;
    icon: string;
    tooltipParams: string;
    requiredLevel: number;
    stackSizeMax: number;
    accountBound: boolean;
    flavorText: string;
    flavorTextHtml: string;
    typeName: string;
    type: ItemType;
    damage: string;
    dps: string;
    damageHtml: string;
    color: string;
    isSeasonRequiredToDrop: boolean;
    seasonRequiredToDrop: number;
    slots: string[];
    attributes: {
        primary: Attribute[];
        secondary: Attribute[];
        other: Attribute[];
    };
    randomAffixes: RandomAffix[];
    setItems: unknown[]; // Expand when possible.
}

/**
 * Returns a single item by item slug and ID.
 *
 * @param itemSlugAndId - The slug and ID of the item to retrieve.
 * @returns A promise that resolves to an object representing the data for a single item by item slug and ID.
 */
export async function item(itemSlugAndId: string): Promise<Item> {
    return await request({
        method: "GET",
        url: `/d3/data/item/${itemSlugAndId}`,
    }) as Item;
}
