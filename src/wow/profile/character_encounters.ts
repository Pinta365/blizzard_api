import { request } from "../../shared/index.ts";
import type { Character, KeyNameId, LinkSelfHref, TypeName } from "../../shared/index.ts";

export interface CharacterEncounters extends LinkSelfHref {
    character: Character;
    dungeons: {
        href: string;
    };
    raids: {
        href: string;
    };
}

export interface CharacterEncounterDungeons extends LinkSelfHref {
    expansions: {
        expansion: KeyNameId;
        instances: {
            instance: KeyNameId;
            modes: {
                difficulty: TypeName;
                status: TypeName;
                progress: {
                    completed_count: number;
                    total_count: number;
                    encounters: {
                        encounter: KeyNameId;
                        completed_count: number;
                        last_kill_timestamp: number;
                    }[];
                };
            }[];
        }[];
    }[];
}

export interface CharacterEncounterRaids extends LinkSelfHref {
    character: Character;
    expansions: {
        expansion: KeyNameId;
        instances: {
            instance: KeyNameId;
            modes: {
                difficulty: TypeName;
                status: TypeName;
                progress: {
                    completed_count: number;
                    total_count: number;
                    encounters: {
                        encounter: KeyNameId;
                        completed_count: number;
                        last_kill_timestamp: number;
                    }[];
                };
            }[];
        }[];
    }[];
}

/**
 * Returns a summary of a character's encounters.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing details about character's encounters.
 */
export async function characterEncounters(
    realmSlug: string,
    characterName: string,
): Promise<CharacterEncounters> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/encounters`,
        namespace: "profile",
    }) as CharacterEncounters;
}

/**
 * Returns a summary of a character's completed dungeons.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing details about character's completed dungeons.
 */
export async function characterEncounterDungeons(
    realmSlug: string,
    characterName: string,
): Promise<CharacterEncounterDungeons> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/encounters/dungeons`,
        namespace: "profile",
    }) as CharacterEncounterDungeons;
}

/**
 * Returns a summary of a character's completed raids.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing details about character's completed raids.
 */
export async function characterEncounterRaids(
    realmSlug: string,
    characterName: string,
): Promise<CharacterEncounterRaids> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/encounters/raids`,
        namespace: "profile",
    }) as CharacterEncounterRaids;
}
