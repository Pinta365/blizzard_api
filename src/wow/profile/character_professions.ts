import type { ApiContext } from "../../shared/index.ts";
import type { Character, KeyNameId, LinkSelfHref, NameId } from "../../shared/index.ts";

export interface Tier {
    skill_points: number;
    max_skill_points: number;
    tier: NameId;
    known_recipes?: KeyNameId[];
}

export interface CharacterProfession {
    profession: KeyNameId;
    skill_points?: number;
    max_skill_points?: number;
    tiers?: Tier[];
}

export interface CharacterProfessions extends LinkSelfHref {
    character: Character;
    /** Absent when the character has no primary professions. */
    primaries?: CharacterProfession[];
    /** Absent when the character has no secondary professions. */
    secondaries?: CharacterProfession[];
}

/**
 * Returns a summary of professions for a character.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing a summary of professions for a character.
 */
export async function characterProfessions(
    ctx: ApiContext,
    realmSlug: string,
    characterName: string,
): Promise<CharacterProfessions> {
    return await ctx.request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/professions`,
        namespace: "profile",
    }) as CharacterProfessions;
}
