import type { ApiContext } from "../../shared/index.ts";
import type { Href, KeyNameId, LinkSelfHref, LocalizedString } from "../../shared/index.ts";

export interface ModifiedCraftingParents extends LinkSelfHref {
    categories: {
        href: string;
    };
    slot_types: {
        href: string;
    };
}

export interface ModifiedCraftingCategories extends LinkSelfHref {
    categories: {
        key: Href;
        name?: string;
        id: number;
    }[];
}

export interface ModifiedCraftingCategory extends LinkSelfHref {
    id: number;
    name: LocalizedString;
}

export interface ModifiedCraftingSlotTypes extends LinkSelfHref {
    slot_types: {
        key: Href;
        name?: string;
        id: number;
    }[];
}

export interface ModifiedCraftingSlotType extends LinkSelfHref {
    id: number;
    description: LocalizedString;
    compatible_categories: KeyNameId[];
}

/**
 * Returns the parent index for Modified Crafting.
 *
 * @returns A promise that resolves to an object representing a list of the parent index for Modified Crafting.
 */
export async function modifiedCraftingParents(ctx: ApiContext): Promise<ModifiedCraftingParents> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/modified-crafting/index",
        namespace: "static",
    }) as ModifiedCraftingParents;
}

/**
 * Returns the index of Modified Crafting categories.
 *
 * @returns A promise that resolves to an object representing a list of the index of Modified Crafting categories.
 */
export async function modifiedCraftingCategories(ctx: ApiContext): Promise<ModifiedCraftingCategories> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/modified-crafting/category/index",
        namespace: "static",
    }) as ModifiedCraftingCategories;
}

/**
 * Returns a Modified Crafting category by ID.
 *
 * @param categoryId - The unique identifier for the Modified Crafting category
 * @returns A promise that resolves to an object representing details about a Modified Crafting category.
 */
export async function modifiedCraftingCategory(ctx: ApiContext, categoryId: number): Promise<ModifiedCraftingCategory> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/modified-crafting/category/${categoryId}`,
        namespace: "static",
    }) as ModifiedCraftingCategory;
}

/**
 * Returns the index of Modified Crafting reagent slot types.
 *
 * @returns A promise that resolves to an object representing a list of the index of Modified Crafting reagent slot types
 */
export async function modifiedCraftingSlotTypes(ctx: ApiContext): Promise<ModifiedCraftingSlotTypes> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/modified-crafting/reagent-slot-type/index",
        namespace: "static",
    }) as ModifiedCraftingSlotTypes;
}

/**
 * Returns a Modified Crafting reagent slot type by ID.
 *
 * @param slotTypeId - The unique identifier for the Modified Crafting reagent slot type
 * @returns A promise that resolves to an object representing details about a Modified Crafting reagent slot type by ID.
 */
export async function modifiedCraftingSlotType(ctx: ApiContext, slotTypeId: number): Promise<ModifiedCraftingSlotType> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/modified-crafting/reagent-slot-type/${slotTypeId}`,
        namespace: "static",
    }) as ModifiedCraftingSlotType;
}
