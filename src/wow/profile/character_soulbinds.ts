import { request } from "../../shared/index.ts";
import type { Character, KeyNameId, LinkSelfHref, TypeName } from "../../shared/index.ts";

export interface CharacterSoulbinds extends LinkSelfHref {
    character: Character;
    chosen_covenant: KeyNameId;
    renown_level: number;
    soulbinds: {
        soulbind: KeyNameId;
        traits?: {
            trait?: KeyNameId;
            conduit_socket?: {
                type: TypeName;
                socket: {
                    conduit: KeyNameId;
                    rank: number;
                };
            };
            tier: number;
            display_order: number;
        }[];
        is_active?: boolean;
    }[];
}

/**
 * Returns a character's soulbinds.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing a character's soulbinds.
 */
export async function characterSoulbinds(
    realmSlug: string,
    characterName: string,
): Promise<CharacterSoulbinds> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/soulbinds`,
        namespace: "profile",
    }) as CharacterSoulbinds;
}
