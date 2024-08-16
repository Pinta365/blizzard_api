import { request } from "../../shared/index.ts";
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
    area: KeyNameId;
    description: LocalizedString;
    requirements: {
        min_character_level: number;
        max_character_level: number;
        faction: TypeName;
    };
    rewards: {
        experience: number;
        reputations: {
            reward: KeyNameId;
            value: number;
        }[];
        money: {
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
export async function quests(): Promise<Quests> {
    return await request({
        method: "GET",
        url: "/data/wow/quest/index",
        namespace: "static",
    });
}

/**
 * Returns a quest by ID.
 *
 * @param questId - The unique identifier for the quest.
 * @returns A promise that resolves to an object representing details about a quest.
 */
export async function quest(questId: number): Promise<Quest> {
    return await request({
        method: "GET",
        url: `/data/wow/quest/${questId}`,
        namespace: "static",
    });
}

/**
 * Returns an index of quest categories (such as quests for a specific class, profession, or storyline).
 *
 * @returns A promise that resolves to an object representing a list of quest categories.
 */
export async function questCategories(): Promise<QuestCategories> {
    return await request({
        method: "GET",
        url: "/data/wow/quest/category/index",
        namespace: "static",
    });
}

/**
 * Returns a quest category by ID.
 *
 * @param questCategoryId - The unique identifier for the quest category.
 * @returns A promise that resolves to an object representing details about a quest category.
 */
export async function questCategory(questCategoryId: number): Promise<QuestCategory> {
    return await request({
        method: "GET",
        url: `/data/wow/quest/category/${questCategoryId}`,
        namespace: "static",
    });
}

/**
 * Returns an index of quest areas.
 *
 * @returns A promise that resolves to an object representing a list of quest areas.
 */
export async function questAreas(): Promise<QuestAreas> {
    return await request({
        method: "GET",
        url: "/data/wow/quest/area/index",
        namespace: "static",
    });
}

/**
 * Returns a quest area by ID.
 *
 * @param questAreaId - The unique identifier for the quest area.
 * @returns A promise that resolves to an object representing details about a quest area.
 */
export async function questArea(questAreaId: number): Promise<QuestArea> {
    return await request({
        method: "GET",
        url: `/data/wow/quest/area/${questAreaId}`,
        namespace: "static",
    });
}

/**
 * Returns an index of quest types (such as PvP quests, raid quests, or account quests).
 *
 * @returns A promise that resolves to an object representing a list of quest types.
 */
export async function questTypes(): Promise<QuestTypes> {
    return await request({
        method: "GET",
        url: "/data/wow/quest/type/index",
        namespace: "static",
    });
}

/**
 * Returns a quest type by ID.
 *
 * @param questTypeId - The unique identifier for the quest type.
 * @returns A promise that resolves to an object representing details about a quest type.
 */
export async function questType(questTypeId: number): Promise<QuestType> {
    return await request({
        method: "GET",
        url: `/data/wow/quest/type/${questTypeId}`,
        namespace: "static",
    });
}
