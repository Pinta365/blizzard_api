import { request } from "../../shared/index.ts";

export interface Player {
    number: number;
    preferredSlot: number;
    givenName: string;
    teams: unknown;
    currentTeams: number[];
    name: string;
    familyName: string;
    competitions: string[];
    role: string;
    id: number;
    headshotUrl: string;
    stats: unknown;
    segmentStats: unknown;
    heroes: unknown;
    alternateIds: unknown;
}

/**
 * Returns stats for a player
 *
 * @param playerId - ID of the player for which to retrieve data.
 * @returns A promise that resolves to an object representing stats for a player.
 */
export async function player(playerId: number): Promise<Player> {
    return await request({
        method: "GET",
        url: `/owl/v1/players/${playerId}`,
    });
}
