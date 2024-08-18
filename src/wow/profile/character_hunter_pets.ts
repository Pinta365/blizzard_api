import { request } from "../../shared/index.ts";
import type { Character, KeyId, KeyNameId, LinkSelfHref, LocalizedString } from "../../shared/index.ts";

export interface CharacterHunterPets extends LinkSelfHref {
    character: Character;
    hunter_pets: {
        name: LocalizedString;
        level: number;
        creature: KeyNameId;
        slot: number;
        is_active?: boolean;
        is_summoned?: boolean;
        creature_display: KeyId;
    }[];
}
/**
 * If the character is a hunter, returns a summary of the character's hunter pets. Otherwise, returns an HTTP 404 Not Found error.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing a summary of the character's hunter pets.
 */
export async function characterHunterPets(
    realmSlug: string,
    characterName: string,
): Promise<CharacterHunterPets> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/hunter-pets`,
        namespace: "profile",
    }) as CharacterHunterPets;
}
