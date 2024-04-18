import { KeyId, KeyNameId, LinkSelfHref, LocalizedString, NameId, request } from "../../shared/index.ts";

export interface MythicKeystoneLeaderboards extends LinkSelfHref {
    current_leaderboards: KeyNameId[];
}

export interface MythicKeystoneLeaderboard extends LinkSelfHref {
    map: NameId;
    period: number;
    period_start_timestamp: number;
    period_end_timestamp: number;
    connected_realm: {
        href: string;
    };
    leading_groups: {
        ranking: number;
        duration: number;
        completed_timestamp: number;
        keystone_level: number;
        members: {
            profile: {
                name: string;
                id: number;
                realm: {
                    key: {
                        href: string;
                    };
                    id: number;
                    slug: string;
                };
            };
            faction: {
                type: string;
            };
            specialization: KeyId;
        }[];
    }[];
    keystone_affixes: {
        keystone_affix: KeyNameId;
        starting_level: number;
    }[];
    map_challenge_mode_id: number;
    name: LocalizedString;
}

/**
 * Returns an index of Mythic Keystone Leaderboard dungeon instances for a connected realm.
 *
 * @param connectedRealmId - The unique identifier for the connected realm
 * @returns A promise that resolves to an object representing an index of Mythic Keystone Leaderboard dungeon instances for a connected realm.
 */
export async function mythicKeystoneLeaderboards(connectedRealmId: number): Promise<MythicKeystoneLeaderboards> {
    return await request({
        method: "GET",
        url: `/data/wow/connected-realm/${connectedRealmId}/mythic-leaderboard/index`,
        namespace: "dynamic",
    });
}

/**
 * Returns a weekly Mythic Keystone Leaderboard by period.
 *
 * @param connectedRealmId - The unique identifier for the connected realm
 * @param dungeonId - The unique identifier for the dungeon
 * @param period - The unique identifier for the period
 * @returns A promise that resolves to an object representing details about a weekly Mythic Keystone Leaderboard by period.
 */
export async function mythicKeystoneLeaderboard(
    connectedRealmId: number,
    dungeonId: number,
    period: number,
): Promise<MythicKeystoneLeaderboard> {
    return await request({
        method: "GET",
        url: `/data/wow/connected-realm/${connectedRealmId}/mythic-leaderboard/${dungeonId}/period/${period}`,
        namespace: "dynamic",
    });
}
