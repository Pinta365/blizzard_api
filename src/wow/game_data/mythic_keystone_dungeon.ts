import { request } from "../../shared/index.ts";
import type { KeyId, KeyNameId, LinkSelfHref, LocalizedString, NameId } from "../../shared/index.ts";

export interface MythicKeystoneDungeons extends LinkSelfHref {
    dungeons: KeyNameId[];
}

export interface MythicKeystoneDungeon extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    map: NameId;
    zone: {
        slug: string;
    };
    dungeon: KeyNameId;
    keystone_updates: {
        upgrade_level: number;
        qualifying_duration: number;
    }[];
    is_traacked: boolean;
}

export interface MythicKeystoneIndex extends LinkSelfHref {
    seasons: {
        href: string;
    };
    dungeons: {
        href: string;
    };
}

export interface MythicKeystonePeriods extends LinkSelfHref {
    periods: KeyId[];
    current_period: KeyId;
}

export interface MythicKeystonePeriod extends LinkSelfHref {
    id: number;
    start_timestamp: number;
    end_timestamp: number;
}

export interface MythicKeystoneSeason extends LinkSelfHref {
    id: number;
    start_timestamp: number;
    end_timestamp?: number;
    periods: KeyId[];
    season_name: LocalizedString;
}

/**
 * Returns an index of Mythic Keystone dungeons.
 *
 * @returns A promise that resolves to an object representing a list of the Mythic Keystone dungeons.
 */
export async function mythicKeystoneDungeons(): Promise<MythicKeystoneDungeons> {
    return await request({
        method: "GET",
        url: "/data/wow/mythic-keystone/dungeon/index",
        namespace: "dynamic",
    }) as MythicKeystoneDungeons;
}

/**
 * Returns a Mythic Keystone dungeon by ID.
 *
 * @param dungeonId - The unique identifier for the Mythic Keystone dungeon
 * @returns A promise that resolves to an object representing details about a Mythic Keystone dungeon by ID.
 */
export async function mythicKeystoneDungeon(dungeonId: number): Promise<MythicKeystoneDungeon> {
    return await request({
        method: "GET",
        url: `/data/wow/mythic-keystone/dungeon/${dungeonId}`,
        namespace: "dynamic",
    }) as MythicKeystoneDungeon;
}

/**
 * Returns an index of links to other documents related to Mythic Keystone dungeons.
 *
 * @returns A promise that resolves to an object representing a index of links to other documents related to Mythic Keystone dungeons.
 */
export async function mythicKeystoneIndex(): Promise<MythicKeystoneIndex> {
    return await request({
        method: "GET",
        url: "/data/wow/mythic-keystone/index",
        namespace: "dynamic",
    }) as MythicKeystoneIndex;
}

/**
 * Returns an index of Mythic Keystone periods.
 *
 * @returns A promise that resolves to an object representing a index of Mythic Keystone periods.
 */
export async function mythicKeystonePeriods(): Promise<MythicKeystonePeriods> {
    return await request({
        method: "GET",
        url: "/data/wow/mythic-keystone/period/index",
        namespace: "dynamic",
    }) as MythicKeystonePeriods;
}

/**
 * Returns a Mythic Keystone period by ID.
 *
 * @param periodId - The unique identifier for the Mythic Keystone period
 * @returns A promise that resolves to an object representing details about a Mythic Keystone period by ID.
 */
export async function mythicKeystonePeriod(periodId: number): Promise<MythicKeystonePeriod> {
    return await request({
        method: "GET",
        url: `/data/wow/mythic-keystone/period/${periodId}`,
        namespace: "dynamic",
    }) as MythicKeystonePeriod;
}

export interface MythicKeystoneSeasons extends LinkSelfHref {
    "seasons": KeyId[];
    "current_season": KeyId;
}
/**
 * Returns an index of Mythic Keystone seasons.
 *
 * @returns A promise that resolves to an object representing a index of Mythic Keystone seasons
 */
export async function mythicKeystoneSeasons(): Promise<MythicKeystoneSeasons> {
    return await request({
        method: "GET",
        url: "/data/wow/mythic-keystone/season/index",
        namespace: "dynamic",
    }) as MythicKeystoneSeasons;
}

/**
 * Returns a Mythic Keystone season by ID.
 *
 * @param seasonId - The unique identifier for the Mythic Keystone season
 * @returns A promise that resolves to an object representing details about a Mythic Keystone season by ID.
 */
export async function mythicKeystoneSeason(seasonId: number): Promise<MythicKeystoneSeason> {
    return await request({
        method: "GET",
        url: `/data/wow/mythic-keystone/season/${seasonId}`,
        namespace: "dynamic",
    }) as MythicKeystoneSeason;
}
