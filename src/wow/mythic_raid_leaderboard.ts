import { LinkSelfHref, request } from "../shared/index.ts";

interface MythicRaidLeaderboard extends LinkSelfHref {
    slug: string;
    criteria_type: string;
    entries: {
        guild: {
            name: string;
            id: number;
            realm: {
                name: null;
                id: number;
                slug: string;
            };
        };
        faction: {
            type: string;
        };
        timestamp: number;
        region: string;
        rank: number;
    }[];
    journal_instance: {
        key: {
            href: string;
        };
        name: null;
        id: number;
    };
}
/**
 * Returns the leaderboard for a given raid and faction.
 *
 * @param raid - The unique identifier for the raid
 * @param faction - The unique identifier for the faction
 * @returns A promise that resolves to an object representing the leaderboard for a given raid and faction.
 */
export async function mythicRaidLeaderboard(raid: number, faction: number): Promise<MythicRaidLeaderboard> {
    return await request({
        method: "GET",
        url: `/data/wow/leaderboard/hall-of-fame/${raid}/${faction}`,
        namespace: "dynamic",
    });
}
