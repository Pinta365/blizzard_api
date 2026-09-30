/**
 * This module provides the StarCraft II account endpoint (player) using the Blizzard API.
 */

import type { ApiContext } from "../../shared/index.ts";

export interface Sc2Player {
    name: string;
    profileUrl: string;
    avatarUrl: string;
    profileId: string;
    regionId: number;
    realmId: number;
}

/**
 * Returns the StarCraft II players linked to an account.
 *
 * @param accountId - The unique identifier for the account.
 * @returns A promise that resolves to an array of players linked to the account.
 */
export async function player(ctx: ApiContext, accountId: number): Promise<Sc2Player[]> {
    return await ctx.request({
        method: "GET",
        url: `/sc2/player/${accountId}`,
    }) as Sc2Player[];
}
