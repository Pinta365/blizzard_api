import { KeyId, KeyNameId, LinkSelfHref, LocalizedString, request, TypeName } from "../../shared/index.ts";

interface CharacterAppearanceSummary extends LinkSelfHref {
    character: {
        key: {
            href: string;
        };
        name: LocalizedString;
        id: number;
        realm: {
            key: {
                href: string;
            };
            name: LocalizedString;
            id: number;
            slug: string;
        };
    };
    playable_race: KeyNameId;
    playable_class: KeyNameId;
    active_spec: KeyNameId;
    gender: TypeName;
    faction: TypeName;
    guild_crest: {
        emblem: {
            id: number;
            media: KeyId;
            color: {
                id: number;
                rgba: {
                    r: number;
                    g: number;
                    b: number;
                    a: number;
                };
            };
        };
        border: {
            id: number;
            media: KeyId;
            color: {
                id: number;
                rgba: {
                    r: number;
                    g: number;
                    b: number;
                    a: number;
                };
            };
        };
        background: {
            color: {
                id: number;
                rgba: {
                    r: number;
                    g: number;
                    b: number;
                    a: number;
                };
            };
        };
    };
    items: {
        id: number;
        slot: TypeName;
        enchant: number;
        item_appearance_modifier_id: number;
        internal_slot_id: number;
        subclass: number;
    }[];
    customizations: {
        option: {
            name: LocalizedString;
            id: number;
        };
        choice: {
            name?: LocalizedString;
            id: number;
            display_order: number;
        };
    }[];
}
/**
 * Returns a summary of a character's appearance settings.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing details about a character's appearance settings.
 */
export async function characterAppearanceSummary(
    realmSlug: string,
    characterName: string,
): Promise<CharacterAppearanceSummary> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/appearance`,
        namespace: "profile",
    });
}
