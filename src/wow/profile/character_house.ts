/**
 * This module provides the API function for fetching a character's house summary using the Blizzard API.
 */

import { request } from "../../shared/index.ts";
import type { LinkSelfHref } from "../../shared/index.ts";

export interface CharacterHouse extends LinkSelfHref {
    id?: number;
}

/**
 * Returns a summary of a house a character has built.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @param houseNumber - The number of the character's house (e.g. 1 for house-1).
 */
export async function characterHouse(
    realmSlug: string,
    characterName: string,
    houseNumber: number,
): Promise<CharacterHouse> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/house/house-${houseNumber}`,
        namespace: "profile",
    }) as CharacterHouse;
}
