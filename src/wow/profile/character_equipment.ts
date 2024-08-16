import { request } from "../../shared/index.ts";
import type { Character, KeyId, KeyNameId, LinkSelfHref, LocalizedString, TypeName } from "../../shared/index.ts";

export interface Rgba {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface characterEquipments extends LinkSelfHref {
    character: Character;
    equipped_items: {
        item: KeyId;
        sockets?: {
            socket_type: TypeName;
            item: KeyNameId;
            display_string: LocalizedString;
            media: KeyId;
        }[];
        enchantments?: {
            display_string: LocalizedString;
            source_item?: KeyNameId;
            enchantment_id: number;
            enchantment_slot: {
                id: number;
                type: string;
            };
        }[];
        slot: TypeName;
        quantity: number;
        context: number;
        bonus_list: number[];
        quality: TypeName;
        name: LocalizedString;
        modified_appearance_id: number;
        media: KeyId;
        item_class: KeyNameId;
        item_subclass: KeyNameId;
        inventory_type: TypeName;
        binding: TypeName;
        armor: {
            value: number;
            display: {
                display_string: LocalizedString;
                color: Rgba;
            };
        };
        stats: {
            type: TypeName;
            value: number;
            is_negated?: boolean;
            is_equip_bonus?: boolean;
            display: {
                display_string: LocalizedString;
                color: Rgba;
            };
        }[];
        spells?: {
            spell: KeyNameId;
            description: LocalizedString;
        }[];
        sell_price: {
            value: number;
            display_strings: {
                header: LocalizedString;
                gold: string;
                silver: string;
                copper: string;
            };
        };
        requirements: {
            level: {
                value: number;
                display_string: LocalizedString;
            };
            playable_classes: {
                links: KeyNameId[];
                display_string: LocalizedString;
            };
        };
        set: {
            item_set: KeyNameId;
            items: {
                item: KeyNameId;
                is_equipped?: boolean;
            }[];
            effects: {
                display_string: LocalizedString;
                required_count: number;
                is_active?: boolean;
            }[];
            display_string: LocalizedString;
        };
        level: {
            value: number;
            display_string: LocalizedString;
        };
        transmog: {
            item: KeyNameId;
            display_string: LocalizedString;
            item_modified_appearance_id: number;
        };
        durability: {
            value: number;
            display_string: LocalizedString;
        };
        is_subclass_hidden?: boolean;
        name_description: {
            display_string: LocalizedString;
            color: Rgba;
        };
    }[];
    equipped_item_sets: {
        item_set: KeyNameId;
        items: {
            item: KeyNameId;
            is_equipped?: boolean;
        }[];
        effects: {
            display_string: LocalizedString;
            required_count: number;
            is_active: boolean;
        }[];
        display_string: LocalizedString;
    }[];
}
/**
 * Returns a summary of the items equipped by a character.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing details about items equipped by a character.
 */
export async function characterEquipments(
    realmSlug: string,
    characterName: string,
): Promise<characterEquipments> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/equipment`,
        namespace: "profile",
    });
}
