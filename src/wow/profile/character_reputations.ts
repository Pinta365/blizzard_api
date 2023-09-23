import { Character, KeyNameId, LinkSelfHref, LocalizedString, request } from "../../shared/index.ts";

interface CharacterReputations extends LinkSelfHref {
    character: Character;
    reputations: {
        faction: KeyNameId;
        standing: {
            raw: number;
            value: number;
            max: number;
            tier: number;
            name: LocalizedString;
        };
    }[];
}

/**
 * Returns a summary of a character's reputations.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing a character's reputations.
 */
export async function characterReputations(
    realmSlug: string,
    characterName: string,
): Promise<CharacterReputations> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/reputations`,
        namespace: "profile",
    });
}
