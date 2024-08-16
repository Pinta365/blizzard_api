import { request } from "../../shared/index.ts";
import type { Character, KeyNameId, LinkSelfHref } from "../../shared/index.ts";

export interface CharacterTitles extends LinkSelfHref {
    character: Character;
    titles: KeyNameId[];
}

/**
 * Returns a summary of titles a character has obtained.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing a summary of titles a character has obtained.
 */
export async function characterTitles(
    realmSlug: string,
    characterName: string,
): Promise<CharacterTitles> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/titles`,
        namespace: "profile",
    });
}
