import type { ApiContext } from "../../shared/index.ts";
import type {
    Character,
    KeyId,
    KeyName,
    KeyNameId,
    LinkSelfHref,
    LocalizedString,
    NamedRef,
    NameId,
} from "../../shared/index.ts";

export interface Detail {
    talent: KeyId & { name?: string };
    spell_tooltip: {
        spell: KeyId & { name?: string };
        description?: LocalizedString | null;
        cast_time?: LocalizedString;
        /** null for abilities without a cost. */
        power_cost?: LocalizedString | null;
        cooldown?: LocalizedString;
        range?: LocalizedString;
    };
}

export interface CharacterSpecializationTalent {
    id: number;
    rank: number;
    tooltip?: Detail;
    default_points?: number;
}

export interface ClassicSpecializationTalent {
    talent: {
        name: string;
        id: number;
    };
    spell_tooltip: {
        spell: {
            name: string;
            id: number;
        };
        description: string;
        cast_time: string;
        cooldown?: string;
        power_cost?: string | null;
        range?: string;
    };
}

export interface CharacterSpecializations extends LinkSelfHref {
    specializations: {
        specialization: KeyNameId;
        specialization_name?: string;
        glyphs?: KeyNameId[];
        talents?: ClassicSpecializationTalent[];
        pvp_talent_slots?: {
            selected: Detail;
            slot_number: number;
        }[];
        loadouts?: {
            is_active: boolean;
            talent_loadout_code: string;
            selected_class_talents: CharacterSpecializationTalent[];
            selected_spec_talents: CharacterSpecializationTalent[];
            selected_hero_talents?: CharacterSpecializationTalent[];
            selected_class_talent_tree?: KeyName;
            selected_spec_talent_tree?: KeyName;
            selected_hero_talent_tree?: KeyNameId;
        }[];
    }[];
    specialization_groups?: {
        is_active: boolean;
        glyphs?: NameId[];
        specializations?: {
            specialization?: KeyNameId;
            specialization_name: string;
            talents: ClassicSpecializationTalent[];
        }[];
    }[];
    active_specialization: KeyNameId;
    active_hero_talent_tree?: NamedRef;
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
    ctx: ApiContext,
    realmSlug: string,
    characterName: string,
): Promise<CharacterSpecializations> {
    return await ctx.request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/specializations`,
        namespace: "profile",
    }) as CharacterSpecializations;
}
