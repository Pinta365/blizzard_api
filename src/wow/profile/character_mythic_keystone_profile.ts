import { request } from "../../shared/index.ts";
import type { Character, KeyId, KeyNameId, LinkSelfHref } from "../../shared/index.ts";

export interface MythicRating {
    color: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    rating: number;
}

export interface CharacterMythicKeystoneProfile extends LinkSelfHref {
    current_period: {
        period: KeyId;
    };
    seasons: KeyId[];
    character: Character;
    current_mythic_rating: MythicRating;
}

export interface CharacterMythicKeystoneSeasonDetails extends LinkSelfHref {
    season: KeyId;
    best_runs: {
        completed_timestamp: number;
        duration: number;
        keystone_level: number;
        keystone_affixes: KeyNameId[];
        members: {
            character: Character;
            specialization: KeyNameId;
            race: KeyNameId;
            equipped_item_level: number;
        }[];
        dungeon: KeyNameId;
        is_completed_within_time: boolean;
        mythic_rating: MythicRating;
        map_rating: MythicRating;
    }[];
    character: Character;
    mythic_rating: MythicRating;
}

/**
 * Returns the Mythic Keystone profile index for a character.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing a Mythic Keystone profile.
 */
export async function characterMythicKeystoneProfile(
    realmSlug: string,
    characterName: string,
): Promise<CharacterMythicKeystoneProfile> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/mythic-keystone-profile`,
        namespace: "profile",
    }) as CharacterMythicKeystoneProfile;
}

/**
 * Returns the Mythic Keystone season details for a character.
 *
 * Returns a 404 Not Found for characters that have not yet completed a Mythic Keystone dungeon for the specified season.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @param seasonId - The lowercase name of the character.
 * @returns A promise that resolves to an object representing a Mythic Keystone season details.
 */
export async function characterMythicKeystoneSeasonDetails(
    realmSlug: string,
    characterName: string,
    seasonId: number,
): Promise<CharacterMythicKeystoneSeasonDetails> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/mythic-keystone-profile/season/${seasonId}`,
        namespace: "profile",
    }) as CharacterMythicKeystoneSeasonDetails;
}
