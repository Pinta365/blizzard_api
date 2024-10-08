import { request } from "../../shared/index.ts";
import type { LinkSelfHref, LocalizedString } from "../../shared/index.ts";

export interface Seasons extends LinkSelfHref {
    season: {
        href: string;
    }[];
    current_season: number;
    service_current_season: number;
    service_season_state: string;
    last_update_time: string;
    generated_by: string;
}

export interface Season extends LinkSelfHref {
    leaderboard: {
        team_size?: number;
        ladder: {
            href: string;
        };
        hardcore?: boolean;
        hero_class_string?: LocalizedString;
    }[];
    season_id: number;
    last_update_time: string;
    generated_by: string;
}

export interface LeaderboardData {
    id: string;
    string?: string;
    number?: number;
    timestamp?: number;
}

export interface LeaderboardBase extends LinkSelfHref {
    row: {
        player: {
            key: string;
            accountId: number;
            data: LeaderboardData[];
        }[];
        order: 1;
        data: LeaderboardData[];
    }[];
    key: string;
    title: LocalizedString;
    column: {
        id: string;
        hidden: boolean;
        order: number;
        label: LocalizedString;
        type: string;
    }[];
    last_update_time: string;
    generated_by: string;
}

export interface SeasonLeaderboard extends LeaderboardBase {
    achievement_points: boolean;
    season: number;
}

export interface EraLeaderboard extends LeaderboardBase {
    greater_rift: boolean;
    greater_rift_solo_class: string;
    era: number;
}

export interface Eras extends LinkSelfHref {
    era: {
        href: string;
    }[];
    current_era: number;
    last_update_time: string;
    generated_by: string;
}

export interface Era extends LinkSelfHref {
    leaderboard: {
        team_size?: number;
        ladder: {
            href: string;
        };
        hardcore?: boolean;
        hero_class_string?: LocalizedString;
    }[];
    era_id: number;
    era_start_date: number;
    last_update_time: string;
    generated_by: string;
}

/**
 * Returns an index of available seasons.
 *
 * @returns A promise that resolves to an object representing an index of available seasons.
 */
export async function seasons(): Promise<Seasons> {
    return await request({
        method: "GET",
        url: "/data/d3/season/",
    }) as Seasons;
}

/**
 * Returns an index of available seasons.
 *
 * @param seasonId - The season for the leaderboard list.
 * @returns A promise that resolves to an object representing the data for a league.
 */
export async function season(seasonId: number): Promise<Season> {
    return await request({
        method: "GET",
        url: `/data/d3/season/${seasonId}`,
    }) as Season;
}

/**
 * Returns a the specified leaderboard for the specified season.
 *
 * @param seasonId - The season for the leaderboard.
 * @param leaderboard - The leaderboard to retrieve.
 * @returns A promise that resolves to an object representing the data for a the specified leaderboard for the specified season.
 */
export async function seasonLeaderboard(seasonId: number, leaderboard: string): Promise<SeasonLeaderboard> {
    return await request({
        method: "GET",
        url: `/data/d3/season/${seasonId}/leaderboard/${leaderboard}`,
    }) as SeasonLeaderboard;
}

/**
 * Returns an index of available eras.
 *
 * @returns A promise that resolves to an object representing an index of available eras.
 */
export async function eras(): Promise<Eras> {
    return await request({
        method: "GET",
        url: "/data/d3/era/",
    }) as Eras;
}

/**
 * Returns a leaderboard list for a particular era.
 *
 * @param eraId - The era to retrieve.
 * @returns A promise that resolves to an object representing a leaderboard list for a particular era.
 */
export async function era(eraId: number): Promise<Era> {
    return await request({
        method: "GET",
        url: `/data/d3/era/${eraId}`,
    }) as Era;
}

/**
 * Returns the specified leaderboard for the specified era.
 *
 * @param eraId - The era for the leaderboard.
 * @param leaderboard - The leaderboard to retrieve.
 * @returns A promise that resolves to an object representing the data for a the specified leaderboard for the specified era.
 */
export async function eraLeaderboard(eraId: number, leaderboard: string): Promise<EraLeaderboard> {
    return await request({
        method: "GET",
        url: `/data/d3/era/${eraId}/leaderboard/${leaderboard}`,
    }) as EraLeaderboard;
}
