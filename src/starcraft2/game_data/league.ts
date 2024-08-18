import { request } from "../../shared/index.ts";
import type { LinkSelfHref } from "../../shared/index.ts";

export interface League extends LinkSelfHref {
    key: {
        league_id: number;
        season_id: number;
        queue_id: number;
        team_type: number;
    };
    tier: {
        id: number;
        division: {
            id: number;
            ladder_id: number;
            member_count: number;
        }[];
    }[];
}

/**
 * Returns data for the specified season, queue, team, and league.
 *
 * Notes from the battle.net docs:
 * queueId: the standard available queueIds are: 1=WoL 1v1, 2=WoL 2v2, 3=WoL 3v3, 4=WoL 4v4, 101=HotS 1v1, 102=HotS 2v2, 103=HotS 3v3, 104=HotS 4v4, 201=LotV 1v1, 202=LotV 2v2, 203=LotV 3v3, 204=LotV 4v4, 206=LotV Archon. Note that other available queues may not be listed here.
 * teamType: there are two available teamTypes: 0=arranged, 1=random.
 * leagueId: available leagueIds are: 0=Bronze, 1=Silver, 2=Gold, 3=Platinum, 4=Diamond, 5=Master, 6=Grandmaster.
 *
 * @param seasonId - The season ID of the data to retrieve.
 * @param queueId - The queue ID of the data to retrieve.
 * @param teamType - The team type of the data to retrieve.
 * @param leagueId - The league ID of the data to retrieve.
 * @returns A promise that resolves to an object representing the data for a league.
 */
export async function leagueData(
    seasonId: number,
    queueId: number,
    teamType: number,
    leagueId: number,
): Promise<League> {
    return await request({
        method: "GET",
        url: `/data/sc2/league/${seasonId}/${queueId}/${teamType}/${leagueId}`,
    }) as League;
}
