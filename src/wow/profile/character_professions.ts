import { request } from "../../shared/index.ts";
import type { Character, KeyNameId, LinkSelfHref, NameId } from "../../shared/index.ts";

export interface Tier {
    skill_points: number;
    max_skill_points: number;
    tier: NameId;
    known_recipes: KeyNameId[];
}

export interface Profession {
    profession: KeyNameId;
    skill_points?: number;
    max_skill_points?: number;
    tiers?: Tier[];
}

export interface CharacterProfessions extends LinkSelfHref {
    character: Character;
    primaries: Profession[];
    secondaries: Profession[];
}

/**
 * Returns a summary of professions for a character.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing a summary of professions for a character.
 */
export async function characterProfessions(
    realmSlug: string,
    characterName: string,
): Promise<CharacterProfessions> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/professions`,
        namespace: "profile",
    }) as CharacterProfessions;
}
