import { Character, LinkSelfHref, request } from "../../shared/index.ts";

interface Asset {
    key: string;
    value: string;
}
interface CharacterMedia extends LinkSelfHref {
    character: Character;
    assets: Asset[];
}
/**
 * Returns a summary of the media assets available for a character (such as an avatar render).
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing a summary of the media assets available for a character.
 */
export async function characterMedia(
    realmSlug: string,
    characterName: string,
): Promise<CharacterMedia> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/character-media`,
        namespace: "profile",
    });
}
