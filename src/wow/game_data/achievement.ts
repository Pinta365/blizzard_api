/**
 * This module provides interfaces and API function definitions for fetching World of Warcraft achievement data using the Blizzard API.
 *
 * @author Pinta <https://github.com/Pinta365>
 */

import { request } from "../../shared/index.ts";
import type { Asset, KeyId, KeyNameId, LinkSelfHref, LocalizedString } from "../../shared/index.ts";

export interface AchievementCategories extends LinkSelfHref {
    categories: KeyNameId[];
}

export interface AggregatesByFaction {
    alliance: {
        quantity: number;
        points: number;
    };
    horde: {
        quantity: number;
        points: number;
    };
}

export interface AchievementCategory extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    achievements: KeyNameId[];
    parent_category: KeyNameId;
    is_guild_category: boolean;
    aggregates_by_faction: AggregatesByFaction;
    display_order: number;
}

export interface Achievements extends LinkSelfHref {
    achievements: KeyNameId[];
}

export interface Achievement extends LinkSelfHref {
    id: number;
    category: KeyNameId;
    name: LocalizedString;
    description: LocalizedString;
    points: number;
    is_account_wide: boolean;
    criteria: {
        id: number;
        description: LocalizedString;
        amount: number;
    };
    next_achievement: KeyNameId;
    media: KeyId;
    display_order: number;
}

export interface AchievementMedia extends LinkSelfHref {
    assets: Asset[];
    id: number;
}

/**
 * Fetches and returns an index of achievement categories.
 *
 * @returns A promise that resolves to an object representing the index of achievement categories.
 */
export async function achievementCategories(): Promise<AchievementCategories> {
    return await request({
        method: "GET",
        url: "/data/wow/achievement-category/index",
        namespace: "static",
    });
}

/**
 * Fetches and returns details of a specific achievement category identified by its ID.
 *
 * @param achievementCategoryId - The unique identifier of the achievement category to retrieve.
 * @returns A promise that resolves to an object representing the achievement category details.
 */
export async function achievementCategory(achievementCategoryId: number): Promise<AchievementCategory> {
    return await request({
        method: "GET",
        url: `/data/wow/achievement-category/${achievementCategoryId}`,
        namespace: "static",
    });
}

/**
 * Fetches and returns an index of achievements.
 *
 * @returns A promise that resolves to an object representing the index of achievements.
 */
export async function achievements(): Promise<Achievements> {
    return await request({
        method: "GET",
        url: "/data/wow/achievement/index",
        namespace: "static",
    });
}

/**
 * Fetches and returns details of a specific achievement identified by its ID.
 *
 * @param achievementId - The unique identifier of the achievement to retrieve.
 * @returns A promise that resolves to an object representing the achievement details.
 */
export async function achievement(achievementId: number): Promise<Achievement> {
    return await request({
        method: "GET",
        url: `/data/wow/achievement/${achievementId}`,
        namespace: "static",
    });
}

/**
 * Fetches and returns media details for a specific achievement identified by its ID.
 *
 * @param achievementId - The unique identifier of the achievement to retrieve media details for.
 * @returns A promise that resolves to an object representing the achievement media details.
 */
export async function achievementMedia(achievementId: number): Promise<AchievementMedia> {
    return await request({
        method: "GET",
        url: `/data/wow/media/achievement/${achievementId}`,
        namespace: "static",
    });
}
