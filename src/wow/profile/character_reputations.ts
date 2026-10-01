import type { ApiContext } from "../../shared/index.ts";
import type { Character, KeyNameId, LinkSelfHref, LocalizedString } from "../../shared/index.ts";

export interface CharacterReputations extends LinkSelfHref {
    character: Character;
    reputations: {
        faction: KeyNameId;
        standing: {
            raw: number;
            value: number;
            max: number;
            tier?: number;
            renown_level?: number;
            name: LocalizedString;
        };
        /** Paragon progress, for factions at maximum standing that have a paragon track. */
        paragon?: {
            raw: number;
            value: number;
            max: number;
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
    ctx: ApiContext,
    realmSlug: string,
    characterName: string,
): Promise<CharacterReputations> {
    return await ctx.request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/reputations`,
        namespace: "profile",
    }) as CharacterReputations;
}
