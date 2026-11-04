import type { ApiContext } from "../../shared/index.ts";
import { search } from "../search.ts";
import type { Asset, KeyId, KeyNameId, LinkSelfHref, LocalizedString, NamedRef, TypeName } from "../../shared/index.ts";
import type { Search, SearchParameters } from "../search.ts";

export interface ItemClasses extends LinkSelfHref {
    item_classes: KeyNameId[];
}

export interface ItemClass extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    item_subclasses: KeyNameId[];
}

export interface ItemSets extends LinkSelfHref {
    item_sets: KeyNameId[];
}

export interface ItemSet extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    items: KeyNameId[];
    effects: {
        display_string: LocalizedString;
        required_count: number;
    }[];
}

export interface ItemSubclass extends LinkSelfHref {
    id: number;
    item_class: NamedRef;
    display_name: LocalizedString;
    verbose_name?: string;
    hide_subclass_in_tooltips?: boolean;
}

export interface Item extends LinkSelfHref {
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
        context?: number;
        bonus_list?: number[];
        quality: TypeName;
        name: LocalizedString;
        media: KeyId;
        item_class: KeyNameId;
        item_subclass: KeyNameId;
        inventory_type: TypeName;
        binding: TypeName;
        /** Absent for items that are not unique-equipped. */
        unique_equipped?: string;
        /** Absent for non-weapon items. */
        weapon?: {
            damage: {
                min_value: number;
                max_value: number;
                display_string: LocalizedString;
                damage_class: TypeName;
            };
            additional_damage?: {
                min_value: number;
                max_value: number;
                display_string: LocalizedString;
                damage_class: TypeName;
            }[];
            attack_speed: {
                value: number;
                display_string: LocalizedString;
            };
            dps: {
                value: number;
                display_string: LocalizedString;
            };
        };
        /** Absent for non-armor items. */
        armor?: {
            value: number;
            display: {
                display_string: LocalizedString;
                color: {
                    r: number;
                    g: number;
                    b: number;
                    a: number;
                };
            };
        };
        /** Absent for items without stats, such as non-equippable items. */
        stats?: {
            type: TypeName;
            value: number;
            is_negated?: boolean;
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
        /** Absent for items without spells. */
        spells?: {
            spell: KeyNameId;
            description: LocalizedString;
        }[];
        /** Absent for items without requirements. */
        requirements?: {
            level: {
                value: number;
                display_string: LocalizedString;
            };
        };
        level?: {
            value: number;
            display_string: LocalizedString;
        };
        /** Absent for items without durability, such as non-equippable items. */
        durability?: {
            value: number;
            display_string: LocalizedString;
        };
        /** Present on some items, such as companion pets. */
        is_subclass_hidden?: boolean;
        sell_price?: {
            value: number;
            display_strings: {
                header: LocalizedString;
                gold: string;
                silver: string;
                copper: string;
            };
        };
    };
    purchase_quantity: number;
    appearances?: KeyId[];
}

export interface ItemMedia extends LinkSelfHref {
    assets: Asset[];
    id: number;
}

/**
 * Returns an index of item classes.
 *
 * @returns A promise that resolves to an object representing a list of item classes.
 */
export async function itemClasses(ctx: ApiContext): Promise<ItemClasses> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/item-class/index",
        namespace: "static",
    }) as ItemClasses;
}

/**
 * Returns an item class by ID.
 *
 * @param itemClassId - The unique identifier for the item class by ID.
 * @returns A promise that resolves to an object representing details about an item class by ID.
 */
export async function itemClass(ctx: ApiContext, itemClassId: number): Promise<ItemClass> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/item-class/${itemClassId}`,
        namespace: "static",
    }) as ItemClass;
}

/**
 * Returns an index of item sets.
 *
 * @returns A promise that resolves to an object representing a list of item sets.
 */
export async function itemSets(ctx: ApiContext): Promise<ItemSets> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/item-set/index",
        namespace: "static",
    }) as ItemSets;
}

/**
 * Returns an item set by ID.
 *
 * @param itemSetId - The unique identifier for the item set by ID.
 * @returns A promise that resolves to an object representing details about an item set by ID.
 */
export async function itemSet(ctx: ApiContext, itemSetId: number): Promise<ItemSet> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/item-set/${itemSetId}`,
        namespace: "static",
    }) as ItemSet;
}

/**
 * Returns an item subclass by ID.
 *
 * @param itemClassId - The unique identifier for the item class by ID.
 * @param itemSubclassId - The unique identifier for the item subclass by ID.
 * @returns A promise that resolves to an object representing details about an item set by ID.
 */
export async function itemSubclass(
    ctx: ApiContext,
    itemClassId: number,
    itemSubclassId: number,
): Promise<ItemSubclass> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/item-class/${itemClassId}/item-subclass/${itemSubclassId}`,
        namespace: "static",
    }) as ItemSubclass;
}

/**
 * Returns an item by ID.
 *
 * @param itemId - The unique identifier for the item by ID.
 * @returns A promise that resolves to an object representing details about an item by ID.
 */
export async function item(ctx: ApiContext, itemId: number): Promise<Item> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/item/${itemId}`,
        namespace: "static",
    }) as Item;
}

/**
 * Returns media details about a specific item Id
 *
 * @param itemId - The unique identifier for the item
 * @returns A promise that resolves to an object representing media details about an item.
 */
export async function itemMedia(ctx: ApiContext, itemId: number): Promise<ItemMedia> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/media/item/${itemId}`,
        namespace: "static",
    }) as ItemMedia;
}

/**
 * Performs a search of items.
 *
 * @param SearchParameters - Object containing search parameters.
 * @returns A promise that resolves to an object representing details about an item search.
 */
export async function searchItem(ctx: ApiContext, searchParameters: SearchParameters): Promise<Search> {
    return await search(ctx, "/item", "static", searchParameters) as Search;
}
