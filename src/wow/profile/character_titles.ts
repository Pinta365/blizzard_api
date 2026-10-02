import type { ApiContext } from "../../shared/index.ts";
import type { Character, Href, KeyNameId, LinkSelfHref } from "../../shared/index.ts";

/**
 * A character's active title. `display_string` has a `{name}` placeholder for the character name.
 */
export interface CharacterActiveTitle {
    key: Href;
    name: string;
    id: number;
    display_string: string;
}

export interface CharacterTitles extends LinkSelfHref {
    character: Character;
    /** Absent when the character has no active title. */
    active_title?: CharacterActiveTitle;
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
    ctx: ApiContext,
    realmSlug: string,
    characterName: string,
): Promise<CharacterTitles> {
    return await ctx.request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/titles`,
        namespace: "profile",
    }) as CharacterTitles;
}
