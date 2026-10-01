/**
 * This module provides the Classic Era character specializations endpoint. Era characters have talent trees with
 * points spent per tree (and dual-spec groups) instead of Retail's loadouts, so the response has its own shape.
 */

import type { ApiContext } from "../shared/index.ts";
import type { Character, Href } from "../shared/index.ts";

export interface ClassicEraTalent {
    talent: { id: number };
    spell_tooltip: {
        spell: { name: string; id: number };
        description: string;
        cast_time: string;
        power_cost?: string | null;
        range?: string;
        cooldown?: string;
    };
    talent_rank: number;
}

export interface ClassicEraCharacterSpecializations {
    _links: { self: Href };
    character: Character;
    specialization_groups: {
        is_active: boolean;
        specializations: {
            specialization_name: string;
            spent_points: number;
            talents: ClassicEraTalent[];
        }[];
    }[];
}

/**
 * Returns a summary of a character's talent trees (Classic Era).
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing the character's talent groups.
 */
export async function characterSpecializations(
    ctx: ApiContext,
    realmSlug: string,
    characterName: string,
): Promise<ClassicEraCharacterSpecializations> {
    return await ctx.request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/specializations`,
        namespace: "profile",
    }) as ClassicEraCharacterSpecializations;
}
