import { KeyId, KeyNameId, LinkSelfHref, request, TypeName } from "../../shared/index.ts";

interface PvpSeasons extends LinkSelfHref {
    seasons: KeyId[];
    current_season: KeyId;
}

interface PvpSeason extends LinkSelfHref {
    id: number;
    leaderboards: {
        href: string;
    };
    rewards: {
        href: string;
    };
    season_start_timestamp: number;
    season_end_timestamp: number;
}

interface PvpSeasonLeaderboards extends LinkSelfHref {
    season: KeyId;
    leaderboards: KeyNameId[];
}

interface PvpSeasonLeaderboard extends LinkSelfHref {
    season: KeyId;
    name: string;
    bracket: {
        id: number;
        type: string;
    };
    entries: {
        character: {
            name: string;
            id: number;
            realm: {
                key: {
                    href: string;
                };
                id: number;
                slug: string;
            };
        };
        faction: {
            type: string;
        };
        rank: number;
        rating: number;
        season_match_statistics: {
            played: number;
            won: number;
            lost: number;
        };
        tier: KeyId;
    }[];
}

interface PvpSeasonRewards extends LinkSelfHref {
    season: KeyId;
    rewards: {
        bracket: {
            id: number;
            type: string;
        };
        achievement: KeyNameId;
        rating_cutoff: number;
        faction: TypeName;
    }[];
}

/**
 * Returns an index of PvP seasons.
 *
 * @returns A promise that resolves to an object representing a list of PvP seasons.
 */
export async function pvpSeasons(): Promise<PvpSeasons> {
    return await request({
        method: "GET",
        url: "/data/wow/pvp-season/index",
        namespace: "dynamic",
    });
}

/**
 * Returns a PvP season by ID.
 *
 * @param pvpSeasonId - The unique identifier for the PvP season.
 * @returns A promise that resolves to an object representing details about a PvP season.
 */
export async function pvpSeason(pvpSeasonId: number): Promise<PvpSeason> {
    return await request({
        method: "GET",
        url: `/data/wow/pvp-season/${pvpSeasonId}`,
        namespace: "dynamic",
    });
}

/**
 * Returns an index of PvP leaderboards for a PvP season.
 *
 * @param pvpSeasonId - The unique identifier for the PvP season.
 * @returns A promise that resolves to an object representing details about the PvP leaderboards.
 */
export async function pvpSeasonLeaderboards(pvpSeasonId: number): Promise<PvpSeasonLeaderboards> {
    return await request({
        method: "GET",
        url: `/data/wow/pvp-season/${pvpSeasonId}/pvp-leaderboard/index`,
        namespace: "dynamic",
    });
}

/**
 * Returns the PvP leaderboard of a specific PvP bracket for a PvP season.
 *
 * @param pvpSeasonId - The unique identifier for the PvP season.
 * @param pvpBracket - The unique identifier for the PvP bracket.
 * @returns A promise that resolves to an object representing details about the PvP bracket.
 */
export async function pvpSeasonLeaderboard(pvpSeasonId: number, pvpBracket: number): Promise<PvpSeasonLeaderboard> {
    return await request({
        method: "GET",
        url: `/data/wow/pvp-season/${pvpSeasonId}/pvp-leaderboard/${pvpBracket}`,
        namespace: "dynamic",
    });
}

/**
 * Returns an index of PvP rewards for a PvP season.
 *
 * @param pvpSeasonId - The unique identifier for the PvP season.
 * @returns A promise that resolves to an object representing details about the PvP rewards.
 */
export async function pvpSeasonRewards(pvpSeasonId: number): Promise<PvpSeasonRewards> {
    return await request({
        method: "GET",
        url: `/data/wow/pvp-season/${pvpSeasonId}/pvp-leaderboard/index`,
        namespace: "dynamic",
    });
}
