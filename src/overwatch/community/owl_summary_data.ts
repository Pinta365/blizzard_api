import { LocalizedString, request } from "../../shared/index.ts";

interface Segment {
    id: string;
    name: LocalizedString;
    competitionId: string;
    seasonId: string;
    firstMatchStart?: number;
    lastMatchStart?: number;
}

interface SummaryData {
    players: unknown;
    teams: unknown;
    segments: {
        [key: string]: Segment;
    };
    matches: unknown;
    currentSegments: string[];
    futureSegments: string[];
}

/**
 * Returns a summary of OWL stats where you can get entity IDs (playerId, matchId, segmentId, and teamId)
 *
 * @returns A promise that resolves to an object representing the summary of OWL stats.
 */
export async function owlSummaryData(): Promise<SummaryData> {
    return await request({
        method: "GET",
        url: "/owl/v1/owl2",
    });
}
