import { request } from "../../shared/index.ts";

export interface Match {
    competitionId: string;
    conclusion: string;
    endTimestamp: number;
    games: unknown;
    id: number;
    localTimeZone: string;
    localScheduledDate: string;
    seasonId: string;
    segmentId: string;
    startTimestamp: number;
    actualStartTimestamp: number;
    actualEndTimestamp: number;
    state: string;
    teams: unknown;
    players: unknown;
    winner: number;
    hyperlinks: {
        id: number;
        contentLanguage: string;
        type: string;
        value: string;
        arguments: unknown;
    }[];
}

/**
 * Returns stats for a match
 *
 * @param matchId - The ID of the match for which to retrieve data.
 * @returns A promise that resolves to an object representing stats for a match.
 */
export async function match(matchId: number): Promise<Match> {
    return await request({
        method: "GET",
        url: `/owl/v1/matches/${matchId}`,
    });
}
