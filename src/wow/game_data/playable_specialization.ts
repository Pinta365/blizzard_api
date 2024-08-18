import { request } from "../../shared/index.ts";
import type { Asset, KeyId, KeyName, KeyNameId, LinkSelfHref, LocalizedString, TypeName } from "../../shared/index.ts";

export interface PlayableSpecializations extends LinkSelfHref {
    character_specializations: KeyNameId;
}

export interface PlayableSpecialization {
    id: number;
    playable_class: KeyNameId;
    name: LocalizedString;
    gender_description: {
        male: LocalizedString;
        female: LocalizedString;
    };
    media: KeyId;
    role: TypeName;
    pvp_talents: {
        talent: KeyNameId;
        spell_tooltip: {
            description: LocalizedString;
            cast_time?: LocalizedString;
            range?: LocalizedString;
            cooldown?: LocalizedString;
            power_cost?: LocalizedString;
        };
    }[];
    spec_talent_tree: KeyName;
    power_type: KeyNameId;
    primary_stat_type: TypeName;
}

export interface PlayableSpecializationMedia extends LinkSelfHref {
    assets: Asset[];
    id: number;
}

/**
 * Returns an index of playable specializations.
 *
 * @returns A promise that resolves to an object representing a list of the index of playable specializations.
 */
export async function playableSpecializations(): Promise<PlayableSpecializations> {
    return await request({
        method: "GET",
        url: "/data/wow/playable-specialization/index",
        namespace: "static",
    }) as PlayableSpecializations;
}

/**
 * Returns a playable specialization by ID.
 *
 * @param specId - The unique identifier for the playable specialization
 * @returns A promise that resolves to an object representing details about a playable specialization.
 */
export async function playableSpecialization(specId: number): Promise<PlayableSpecialization> {
    return await request({
        method: "GET",
        url: `/data/wow/playable-specialization/${specId}`,
        namespace: "static",
    }) as PlayableSpecialization;
}

/**
 * Returns media for a playable specialization by ID.
 *
 * @param specId - The unique identifier for the playable specialization
 * @returns A promise that resolves to an object representing media details about a playable specialization.
 */
export async function playableSpecializationMedia(specId: number): Promise<PlayableSpecializationMedia> {
    return await request({
        method: "GET",
        url: `/data/wow/media/playable-specialization/${specId}`,
        namespace: "static",
    }) as PlayableSpecializationMedia;
}
