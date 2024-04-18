import { LocalizedString, request } from "../../shared/index.ts";

export interface Segment {
    id: string;
    name: LocalizedString;
    competitionId: string;
    seasonId: string;
    matches: unknown;
    players: unknown;
    teams: unknown;
    divisions: string[];
    standings: {
        teamId: number;
        gameWins: number;
        gameLosses: number;
        gameTies: number;
        gameDifferential: number;
        matchLosses: number;
        matchWins: number;
        divisions: unknown;
        points: number;
    }[];
    firstMatchStart: number;
    lastMatchStart: number;
    minimumTimePlayed: number;
}

/**
 * Returns stats for a segment
 *
 * @param segment - The slug of the segment for which to retrieve data.
 * @returns A promise that resolves to an object representing stats for a segment.
 */
export async function segment(segment: string): Promise<Segment> {
    return await request({
        method: "GET",
        url: `/owl/v1/segments/${segment}`,
    });
}
