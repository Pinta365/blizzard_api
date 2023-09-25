import { request } from "../../shared/index.ts";

interface Team {
    id: number;
    competitions: string[];
    name: string;
    roster: number[];
    code: string;
    segments: {
        [key: string]: {
            id: number;
            teamStats: {
                heroDamageDone: number;
                healingDone: number;
                damageTaken: number;
                finalBlows: number;
                eliminations: number;
                deaths: number;
            };
            logo: string;
            icon: string;
            primaryColor: string;
            secondaryColor: string;
            name: string;
        };
    };
    teamStats: unknown;
    alternateIds: number[];
    logo: string;
    icon: string;
    primaryColor: string;
    secondaryColor: string;
}

/**
 * Returns stats for a team
 *
 * @param teamId - The ID of the team for which to retrieve data.
 * @returns A promise that resolves to an object representing stats for a team.
 */
export async function team(teamId: number): Promise<Team> {
    return await request({
        method: "GET",
        url: `/owl/v1/teams/${teamId}`,
    });
}
