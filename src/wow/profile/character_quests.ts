import { request } from "../../shared/index.ts";
import type { Character, KeyNameId, LinkSelfHref } from "../../shared/index.ts";

export interface CharacterQuests extends LinkSelfHref {
    character: Character;
    in_progress: KeyNameId[];
    completed: {
        href: string;
    };
}

export interface CharacterCompletedQuests extends LinkSelfHref {
    character: Character;
    quests: KeyNameId[];
}

/**
 * Returns a character's active quests as well as a link to the character's completed quests.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing a character's active quests as well as a link to the character's completed quests.
 */
export async function characterQuests(
    realmSlug: string,
    characterName: string,
): Promise<CharacterQuests> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/quests`,
        namespace: "profile",
    });
}

/**
 * Returns a list of quests that a character has completed.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing a list of quests that a character has completed.
 */
export async function characterCompletedQuests(
    realmSlug: string,
    characterName: string,
): Promise<CharacterCompletedQuests> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/quests/completed`,
        namespace: "profile",
    });
}

/*
Character Quests API
GET
Character Quests
/profile/wow/character/{realmSlug}/{characterName}/quests

GET
Character Completed Quests
/profile/wow/character/{realmSlug}/{characterName}/quests/completed
*/
