import type { ApiContext } from "../../shared/index.ts";
import type { KeyNameId, LinkSelfHref, LocalizedString, TypeName } from "../../shared/index.ts";

export interface Quests extends LinkSelfHref {
    categories: {
        href: string;
    };
    areas: {
        href: string;
    };
    types: {
        href: string;
    };
}

export interface Quest extends LinkSelfHref {
    id: number;
    title: LocalizedString;
    category?: KeyNameId;
    area?: KeyNameId;
    description: LocalizedString;
    requirements: {
        min_character_level: number;
        max_character_level: number;
        faction?: TypeName;
    };
    rewards: {
        experience: number;
        reputations: {
            reward: KeyNameId;
            value: number;
        }[];
        money?: {
            value: number;
            units: {
                gold: number;
                silver: number;
                copper: number;
            };
        };
    };
}

export interface QuestCategories extends LinkSelfHref {
    categories: KeyNameId[];
}

export interface QuestCategory extends LinkSelfHref {
    id: number;
    category: LocalizedString;
    quests: KeyNameId[];
}

export interface QuestAreas extends LinkSelfHref {
    areas: KeyNameId[];
}

export interface QuestArea extends LinkSelfHref {
    id: number;
    area: LocalizedString;
    quests: KeyNameId[];
}

export interface QuestTypes extends LinkSelfHref {
    types: KeyNameId[];
}

export interface QuestType extends LinkSelfHref {
    id: number;
    type: LocalizedString;
    quests: KeyNameId[];
}

/**
 * Returns the parent index for quests.
 *
 * @returns A promise that resolves to an object representing a list of quests.
 */
export async function quests(ctx: ApiContext): Promise<Quests> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/quest/index",
        namespace: "static",
    }) as Quests;
}

/**
 * Returns a quest by ID.
 *
 * @param questId - The unique identifier for the quest.
 * @returns A promise that resolves to an object representing details about a quest.
 */
export async function quest(ctx: ApiContext, questId: number): Promise<Quest> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/quest/${questId}`,
        namespace: "static",
    }) as Quest;
}

/**
 * Returns an index of quest categories (such as quests for a specific class, profession, or storyline).
 *
 * @returns A promise that resolves to an object representing a list of quest categories.
 */
export async function questCategories(ctx: ApiContext): Promise<QuestCategories> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/quest/category/index",
        namespace: "static",
    }) as QuestCategories;
}

/**
 * Returns a quest category by ID.
 *
 * @param questCategoryId - The unique identifier for the quest category.
 * @returns A promise that resolves to an object representing details about a quest category.
 */
export async function questCategory(ctx: ApiContext, questCategoryId: number): Promise<QuestCategory> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/quest/category/${questCategoryId}`,
        namespace: "static",
    }) as QuestCategory;
}

/**
 * Returns an index of quest areas.
 *
 * @returns A promise that resolves to an object representing a list of quest areas.
 */
export async function questAreas(ctx: ApiContext): Promise<QuestAreas> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/quest/area/index",
        namespace: "static",
    }) as QuestAreas;
}

/**
 * Returns a quest area by ID.
 *
 * @param questAreaId - The unique identifier for the quest area.
 * @returns A promise that resolves to an object representing details about a quest area.
 */
export async function questArea(ctx: ApiContext, questAreaId: number): Promise<QuestArea> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/quest/area/${questAreaId}`,
        namespace: "static",
    }) as QuestArea;
}

/**
 * Returns an index of quest types (such as PvP quests, raid quests, or account quests).
 *
 * @returns A promise that resolves to an object representing a list of quest types.
 */
export async function questTypes(ctx: ApiContext): Promise<QuestTypes> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/quest/type/index",
        namespace: "static",
    }) as QuestTypes;
}

/**
 * Returns a quest type by ID.
 *
 * @param questTypeId - The unique identifier for the quest type.
 * @returns A promise that resolves to an object representing details about a quest type.
 */
export async function questType(ctx: ApiContext, questTypeId: number): Promise<QuestType> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/quest/type/${questTypeId}`,
        namespace: "static",
    }) as QuestType;
}
