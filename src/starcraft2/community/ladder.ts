/**
 * This module provides the StarCraft II ladder endpoints (grandmaster leaderboard and season) using the Blizzard API.
 */

import type { ApiContext } from "../../shared/index.ts";
import type { Sc2LadderTeam } from "./profile.ts";

export interface Sc2GrandmasterLeaderboard {
    ladderTeams: Sc2LadderTeam[];
}

export interface Sc2Season {
    seasonId: number;
    number: number;
    year: number;
    startDate: string;
    endDate: string;
}

/**
 * Returns the grandmaster leaderboard for a region.
 *
 * @param regionId - The region: 1=US, 2=EU, 3=KR/TW, 5=CN.
 * @returns A promise that resolves to an object representing the grandmaster leaderboard.
 */
export async function grandmasterLeaderboard(
    ctx: ApiContext,
    regionId: number,
): Promise<Sc2GrandmasterLeaderboard> {
    return await ctx.request({
        method: "GET",
        url: `/sc2/ladder/grandmaster/${regionId}`,
    }) as Sc2GrandmasterLeaderboard;
}

/**
 * Returns the current season for a region.
 *
 * @param regionId - The region: 1=US, 2=EU, 3=KR/TW, 5=CN.
 * @returns A promise that resolves to an object representing the season.
 */
export async function season(ctx: ApiContext, regionId: number): Promise<Sc2Season> {
    return await ctx.request({
        method: "GET",
        url: `/sc2/ladder/season/${regionId}`,
    }) as Sc2Season;
}
