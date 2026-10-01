import type { ApiContext } from "../../shared/index.ts";
import type { Character, KeyNameId, LinkSelfHref } from "../../shared/index.ts";

export interface StatRating {
    rating_bonus: number;
    value: number;
    rating_normalized: number;
}

export interface StatRatingBonus {
    rating_bonus: number;
    rating_normalized: number;
}

export interface CharacterStatistics extends LinkSelfHref {
    health: number;
    power: number;
    power_type: KeyNameId;
    speed: StatRatingBonus;
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
    melee_crit: StatRating;
    melee_haste: StatRating;
    mastery: StatRating;
    bonus_armor: number;
    lifesteal: StatRating;
    versatility: number;
    versatility_damage_done_bonus: number;
    versatility_healing_done_bonus: number;
    versatility_damage_taken_bonus: number;
    avoidance: StatRatingBonus;
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
    spell_crit: StatRating;
    mana_regen: number;
    mana_regen_combat: number;
    armor: {
        base: number;
        effective: number;
    };
    dodge: StatRating;
    parry: StatRating;
    block: StatRating;
    ranged_crit: StatRating;
    ranged_haste: StatRating;
    spell_haste: StatRating;
    spirit?: {
        base: number;
        effective: number;
    };
    defense?: {
        base: number;
        effective: number;
    };
    arcane_resistance?: {
        base: number;
        effective: number;
    };
    fire_resistance?: {
        base: number;
        effective: number;
    };
    holy_resistance?: {
        base: number;
        effective: number;
    };
    nature_resistance?: {
        base: number;
        effective: number;
    };
    shadow_resistance?: {
        base: number;
        effective: number;
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
    ctx: ApiContext,
    realmSlug: string,
    characterName: string,
): Promise<CharacterStatistics> {
    return await ctx.request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/statistics`,
        namespace: "profile",
    }) as CharacterStatistics;
}
