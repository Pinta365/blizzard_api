import type { ApiContext } from "../../shared/index.ts";
import type { Asset, KeyId, KeyNameId, LinkSelfHref, LocalizedString, TypeName } from "../../shared/index.ts";

export interface Professions extends LinkSelfHref {
    professions: KeyNameId[];
}

export interface Profession extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    description: LocalizedString;
    type: TypeName;
    media: KeyId;
    skill_tiers: KeyNameId[];
}

export interface ProfessionMedia extends LinkSelfHref {
    assets: Asset[];
    id: number;
}

export interface ProfessionSkillTier extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    minimum_skill_level: number;
    maximum_skill_level: number;
    categories: {
        name: LocalizedString;
        recipes: KeyNameId[];
    }[];
}

export interface ProfessionRecipie extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    rank: number;
    media: KeyId;
    crafted_item: KeyNameId;
    reagents: {
        reagent: KeyNameId;
        quantity: number;
    }[];
    crafted_quantity: {
        value: number;
    };
}

export interface professionRecipieMedia extends LinkSelfHref {
    assets: Asset[];
    id: number;
}

/**
 * Returns an index of professions.
 *
 * @returns A promise that resolves to an object representing a list of professions.
 */
export async function professions(ctx: ApiContext): Promise<Professions> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/profession/index",
        namespace: "static",
    }) as Professions;
}

/**
 * Returns a profession by ID.
 *
 * @param professionId - The unique identifier for the profession.
 * @returns A promise that resolves to an object representing details about a profession.
 */
export async function profession(ctx: ApiContext, professionId: number): Promise<Profession> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/profession/${professionId}`,
        namespace: "static",
    }) as Profession;
}

/**
 * Returns media for a profession by ID.
 *
 * @param professionId - The unique identifier for the profession
 * @returns A promise that resolves to an object representing media details about a profession.
 */
export async function professionMedia(ctx: ApiContext, professionId: number): Promise<ProfessionMedia> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/media/profession/${professionId}`,
        namespace: "static",
    }) as ProfessionMedia;
}

/**
 * Returns a skill tier for a profession by ID.
 *
 * @param professionId - The unique identifier for the profession
 * @param skillTierId - The unique identifier for the skill tier
 * @returns A promise that resolves to an object representing details about a skill tier.
 */
export async function professionSkillTier(
    ctx: ApiContext,
    professionId: number,
    skillTierId: number,
): Promise<ProfessionSkillTier> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/profession/${professionId}/skill-tier/${skillTierId}`,
        namespace: "static",
    }) as ProfessionSkillTier;
}

/**
 * Returns a recipe by ID.
 *
 * @param recipeId - The unique identifier for the recipe.
 * @returns A promise that resolves to an object representing details about a recipe.
 */
export async function professionRecipie(ctx: ApiContext, recipeId: number): Promise<ProfessionRecipie> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/recipe/${recipeId}`,
        namespace: "static",
    }) as ProfessionRecipie;
}

/**
 * Returns media for a recipe by ID.
 *
 * @param recipeId - The unique identifier for the recipe
 * @returns A promise that resolves to an object representing media details about a recipe.
 */
export async function professionRecipieMedia(ctx: ApiContext, recipeId: number): Promise<professionRecipieMedia> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/media/recipe/${recipeId}`,
        namespace: "static",
    }) as professionRecipieMedia;
}
