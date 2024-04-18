import { Character, KeyNameId, LinkSelfHref, request } from "../../shared/index.ts";

export interface CharacterStatistics extends LinkSelfHref {
    health: number;
    power: number;
    power_type: KeyNameId;
    speed: {
        rating: number;
        rating_bonus: number;
    };
    strength: {
        base: number;
        effective: number;
    };
    agility: {
        base: number;
        effective: number;
    };
    intellect: {
        base: number;
        effective: number;
    };
    stamina: {
        base: number;
        effective: number;
    };
    melee_crit: {
        rating: number;
        rating_bonus: number;
        value: number;
    };
    melee_haste: {
        rating: number;
        rating_bonus: number;
        value: number;
    };
    mastery: {
        rating: number;
        rating_bonus: number;
        value: number;
    };
    bonus_armor: number;
    lifesteal: {
        rating: number;
        rating_bonus: number;
        value: number;
    };
    versatility: number;
    versatility_damage_done_bonus: number;
    versatility_healing_done_bonus: number;
    versatility_damage_taken_bonus: number;
    avoidance: {
        rating: number;
        rating_bonus: number;
    };
    attack_power: number;
    main_hand_damage_min: number;
    main_hand_damage_max: number;
    main_hand_speed: number;
    main_hand_dps: number;
    off_hand_damage_min: number;
    off_hand_damage_max: number;
    off_hand_speed: number;
    off_hand_dps: number;
    spell_power: number;
    spell_penetration: number;
    spell_crit: {
        rating: number;
        rating_bonus: number;
        value: number;
    };
    mana_regen: number;
    mana_regen_combat: number;
    armor: {
        base: number;
        effective: number;
    };
    dodge: {
        rating: number;
        rating_bonus: number;
        value: number;
    };
    parry: {
        rating: number;
        rating_bonus: number;
        value: number;
    };
    block: {
        rating: number;
        rating_bonus: number;
        value: number;
    };
    ranged_crit: {
        rating: number;
        rating_bonus: number;
        value: number;
    };
    ranged_haste: {
        rating: number;
        rating_bonus: number;
        value: number;
    };
    spell_haste: {
        rating: number;
        rating_bonus: number;
        value: number;
    };
    character: Character;
}

/**
 * Returns a statistics summary for a character.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing a statistics summary for a character.
 */
export async function characterStatistics(
    realmSlug: string,
    characterName: string,
): Promise<CharacterStatistics> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/statistics`,
        namespace: "profile",
    });
}
