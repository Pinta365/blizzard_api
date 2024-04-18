import { Character, KeyNameId, LinkSelfHref, LocalizedString, request } from "../../shared/index.ts";

export interface Detail {
    talent: KeyNameId;
    spell_tooltip: {
        spell: KeyNameId;
        description: LocalizedString;
        cast_time: LocalizedString;
        power_cost?: LocalizedString;
        cooldown?: LocalizedString;
        range?: LocalizedString;
    };
}

export interface Talent {
    id: number;
    rank: number;
    tooltip: Detail;
    default_points?: number;
}

export interface CharacterSpecializations extends LinkSelfHref {
    specializations: {
        specialization: KeyNameId;
        glyphs?: KeyNameId[];
        pvp_talent_slots: {
            selected: Detail;
            slot_number: number;
        }[];
        loadouts: {
            is_active: boolean;
            talent_loadout_code: string;
            selected_class_talents: Talent[];
            selected_spec_talents: Talent[];
        }[];
    }[];
    active_specialization: KeyNameId;
    character: Character;
}

/**
 * Returns a summary of a character's specializations.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing a summary of a character's specializations.
 */
export async function characterSpecializations(
    realmSlug: string,
    characterName: string,
): Promise<CharacterSpecializations> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/specializations`,
        namespace: "profile",
    });
}
