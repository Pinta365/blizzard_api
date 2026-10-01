/**
 * This module provides the API function for fetching a character's house summary using the Blizzard API.
 */

import type { ApiContext } from "../../shared/index.ts";

import type { LinkSelfHref } from "../../shared/index.ts";

export interface CharacterHouse extends LinkSelfHref {
    id?: number;
}

/**
 * Returns a summary of a house a character has built.
 *
 * Note: Blizzard disabled this endpoint in early 2026 over player privacy concerns, and it currently returns 404 even
 * for characters that own a house. The function is kept for when it returns; the response type is unverified.
 * See https://us.forums.blizzard.com/en/blizzard/t/new-housing-apis/56815
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @param houseNumber - The number of the character's house (e.g. 1 for house-1).
 */
export async function characterHouse(
    ctx: ApiContext,
    realmSlug: string,
    characterName: string,
    houseNumber: number,
): Promise<CharacterHouse> {
    return await ctx.request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/house/house-${houseNumber}`,
        namespace: "profile",
    }) as CharacterHouse;
}
