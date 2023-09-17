import { KeyId, KeyNameId, LinkSelfHref, LocalizedString, request, TypeName } from "../shared/index.ts";
import { Search, search, SearchParameters } from "./search.ts";

interface ItemClasses extends LinkSelfHref {
    item_classes: KeyNameId[];
}

interface ItemClass extends LinkSelfHref {
    class_id: number;
    name: LocalizedString;
    item_subclasses: KeyNameId[];
}

interface ItemSets extends LinkSelfHref {
    item_sets: KeyNameId[];
}

interface ItemSet extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    items: KeyNameId[];
    effects: {
        display_string: LocalizedString;
        required_count: number;
    };
    is_effect_active: boolean;
}

interface ItemSubclass extends LinkSelfHref {
    class_id: number;
    subclass_id: number;
    display_name: LocalizedString;
    hide_subclass_in_tooltips?: boolean;
}

interface Item extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    quality: TypeName;
    level: number;
    required_level: number;
    media: KeyId;
    item_class: KeyNameId;
    item_subclass: KeyNameId;
    inventory_type: TypeName;
    purchase_price: number;
    sell_price: number;
    max_count: number;
    is_equippable: boolean;
    is_stackable: boolean;
    preview_item: {
        item: KeyId;
        context: number;
        bonus_list: number[];
        quality: TypeName;
        name: LocalizedString;
        media: KeyId;
        item_class: KeyNameId;
        item_subclass: KeyNameId;
        inventory_type: TypeName;
        binding: TypeName;
        unique_equipped: string;
        weapon: {
            damage: {
                min_value: number;
                max_value: number;
                display_string: LocalizedString;
                damage_class: TypeName;
            };
            attack_speed: {
                value: number;
                display_string: LocalizedString;
            };
            dps: {
                value: number;
                display_string: LocalizedString;
            };
        };
        stats: {
            type: TypeName;
            value: number;
            is_negated: boolean;
            display: {
                display_string: LocalizedString;
                color: {
                    r: number;
                    g: number;
                    b: number;
                    a: number;
                };
            };
        }[];
        spells: {
            spell: KeyNameId;
            description: LocalizedString;
        }[];
        requirements: {
            level: {
                value: number;
                display_string: LocalizedString;
            };
        };
        level: {
            value: number;
            display_string: LocalizedString;
        };
        durability: {
            value: number;
            display_string: LocalizedString;
        };
    };
    purchase_quantity: number;
}

interface Asset {
    key: string;
    value: string;
    file_data_id: number;
}
interface ItemMedia extends LinkSelfHref {
    assets: Asset[];
    id: number;
}

/**
 * Returns an index of item classes.
 *
 * @returns A promise that resolves to an object representing a list of item classes.
 */
export async function itemClasses(): Promise<ItemClasses> {
    return await request({
        method: "GET",
        url: "/data/wow/item-class/index",
        namespace: "static",
    });
}

/**
 * Returns an item class by ID.
 *
 * @param itemClassId - The unique identifier for the item class by ID.
 * @returns A promise that resolves to an object representing details about an item class by ID.
 */
export async function itemClass(itemClassId: number): Promise<ItemClass> {
    return await request({
        method: "GET",
        url: `/data/wow/item-class/${itemClassId}`,
        namespace: "static",
    });
}

/**
 * Returns an index of item sets.
 *
 * @returns A promise that resolves to an object representing a list of item sets.
 */
export async function itemSets(): Promise<ItemSets> {
    return await request({
        method: "GET",
        url: "/data/wow/item-set/index",
        namespace: "static",
    });
}

/**
 * Returns an item set by ID.
 *
 * @param itemSetId - The unique identifier for the item set by ID.
 * @returns A promise that resolves to an object representing details about an item set by ID.
 */
export async function itemSet(itemSetId: number): Promise<ItemSet> {
    return await request({
        method: "GET",
        url: `/data/wow/item-set/${itemSetId}`,
        namespace: "static",
    });
}

/**
 * Returns an item subclass by ID.
 *
 * @param itemClassId - The unique identifier for the item class by ID.
 * @param itemSubclassId - The unique identifier for the item subclass by ID.
 * @returns A promise that resolves to an object representing details about an item set by ID.
 */
export async function itemSubclass(itemClassId: number, itemSubclassId: number): Promise<ItemSubclass> {
    return await request({
        method: "GET",
        url: `/data/wow/item-class/${itemClassId}/item-subclass/${itemSubclassId}`,
        namespace: "static",
    });
}

/**
 * Returns an item by ID.
 *
 * @param itemId - The unique identifier for the item by ID.
 * @returns A promise that resolves to an object representing details about an item by ID.
 */
export async function item(itemId: number): Promise<Item> {
    return await request({
        method: "GET",
        url: `/data/wow/item/${itemId}`,
        namespace: "static",
    });
}

/**
 * Returns media details about a specific item Id
 *
 * @param itemId - The unique identifier for the item
 * @returns A promise that resolves to an object representing media details about an item.
 */
export async function itemMedia(itemId: number): Promise<ItemMedia> {
    return await request({
        method: "GET",
        url: `/data/wow/media/item/${itemId}`,
        namespace: "static",
    });
}

/**
 * Performs a search of items.
 *
 * @param SearchParameters - Object containing search parameters.
 * @returns A promise that resolves to an object representing details about an item search.
 */
export async function searchItem(searchParameters: SearchParameters): Promise<Search> {
    return await search("/item", "static", searchParameters);
}
