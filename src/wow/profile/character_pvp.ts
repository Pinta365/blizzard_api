import { request } from "../../shared/index.ts";
import type { Character, KeyId, LinkSelfHref, LocalizedString, TypeName } from "../../shared/index.ts";

export interface MatchStatistic {
    played: number;
    won: number;
    lost: number;
}

export interface CharacterPvpBracketStatistics extends LinkSelfHref {
    character: Character;
    faction: TypeName;
    bracket: {
        id: number;
        type: string;
    };
    rating: number;
    season: KeyId;
    tier: KeyId;
    season_match_statistics: MatchStatistic;
    weekly_match_statistics: MatchStatistic;
}

export interface CharacterPvpSummary extends LinkSelfHref {
    brackets: {
        href: string;
    }[];
    honor_level: number;
    pvp_map_statistics: {
        world_map: {
            name: LocalizedString;
            id: number;
        };
        match_statistics: MatchStatistic;
    }[];
    honorable_kills: number;
    character: Character;
}

/**
 * Returns the PvP bracket statistics for a character.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @param pvpBracket - The PvP bracket type.
 * @returns A promise that resolves to an object representing the PvP bracket statistics for a character.
 */
export async function characterPvpBracketStatistics(
    realmSlug: string,
    characterName: string,
    pvpBracket: string,
): Promise<CharacterPvpBracketStatistics> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/pvp-bracket/${pvpBracket}`,
        namespace: "profile",
    }) as CharacterPvpBracketStatistics;
}

/**
 * Returns a PvP summary for a character.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing the PvP summary for a character.
 */
export async function characterPvpSummary(
    realmSlug: string,
    characterName: string,
): Promise<CharacterPvpSummary> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/pvp-summary`,
        namespace: "profile",
    }) as CharacterPvpSummary;
}
