import type { ApiContext } from "../../shared/index.ts";
import { search } from "../search.ts";
import type { Href, KeyId, NamedRef } from "../../shared/index.ts";
import type { Search, SearchParameters } from "../search.ts";

export interface AppearanceSlot {
    type: string;
    name: string;
}

export interface ItemAppearance {
    "_links": { self: Href };
    id: number;
    slot: AppearanceSlot;
    item_class: NamedRef;
    item_subclass: NamedRef;
    item_display_info_id: number;
    items: NamedRef[];
    media: KeyId;
}

export interface ItemAppearanceSets {
    "_links": { self: Href };
    appearance_sets: NamedRef[];
}

export interface ItemAppearanceSet {
    "_links": { self: Href };
    id: number;
    set_name: string;
    appearances: KeyId[];
}

export interface ItemAppearanceSlotRef {
    key: Href;
}

export interface ItemAppearanceSlots {
    "_links": { self: Href };
    slots: ItemAppearanceSlotRef[];
}

export interface ItemAppearanceSlot {
    "_links": { self: Href };
    appearances: KeyId[];
}

export interface ItemAppearanceSearchResult {
    key: Href;
    data: {
        id: number;
        item_display_info_id: number;
        slot: {
            type: string;
            name: string | Record<string, string>;
        };
    };
}

export interface ItemAppearanceSearch extends Search {
    results: ItemAppearanceSearchResult[];
}

/**
 * Returns an item appearance by ID.
 *
 * @param appearanceId - The unique identifier for the item appearance by ID.
 * @returns A promise that resolves to an object representing details about an item appearance.
 */
export async function itemAppearance(ctx: ApiContext, appearanceId: number): Promise<ItemAppearance> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/item-appearance/${appearanceId}`,
        namespace: "static",
    }) as ItemAppearance;
}

/**
 * Returns a index of item appearance sets.
 *
 * @returns A promise that resolves to an object representing a list of the index of item appearance sets.
 */
export async function itemAppearanceSets(ctx: ApiContext): Promise<ItemAppearanceSets> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/item-appearance/set/index",
        namespace: "static",
    }) as ItemAppearanceSets;
}

/**
 * Returns an item appearance set by ID.
 *
 * @param appearanceSetId - The unique identifier for the item appearance set by ID.
 * @returns A promise that resolves to an object representing details about an item appearance set.
 */
export async function itemAppearanceSet(ctx: ApiContext, appearanceSetId: number): Promise<ItemAppearanceSet> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/item-appearance/set/${appearanceSetId}`,
        namespace: "static",
    }) as ItemAppearanceSet;
}

/**
 * Returns a index of item appearance slots.
 *
 * @returns A promise that resolves to an object representing a list of the index of item appearance slots.
 */
export async function itemAppearanceSlots(ctx: ApiContext): Promise<ItemAppearanceSlots> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/item-appearance/slot/index",
        namespace: "static",
    }) as ItemAppearanceSlots;
}

/**
 * Returns an item appearance slot by slot type.
 *
 * @param slotType - The slot type (e.g. "HEAD", "SHOULDER", "BODY").
 * @returns A promise that resolves to an object representing details about an item appearance slot.
 */
export async function itemAppearanceSlot(ctx: ApiContext, slotType: string): Promise<ItemAppearanceSlot> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/item-appearance/slot/${slotType}`,
        namespace: "static",
    }) as ItemAppearanceSlot;
}

/**
 * Performs a search of item appearances.
 *
 * @param searchParameters - Object containing search parameters.
 * @returns A promise that resolves to an object representing details about an item appearance search.
 */
export async function searchItemAppearance(
    ctx: ApiContext,
    searchParameters: SearchParameters,
): Promise<ItemAppearanceSearch> {
    return await search(ctx, "/item-appearance", "static", searchParameters) as ItemAppearanceSearch;
}
