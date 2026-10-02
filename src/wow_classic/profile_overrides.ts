/**
 * Classic versions of Retail endpoints whose Classic responses lack fields that Retail always returns.
 * Each one makes the same request as the Retail endpoint, but returns a type where those fields are optional,
 * so the Retail types can keep them required.
 * Verified against the live API (EU) on 2026-10-01.
 */

import type { ApiContext } from "../shared/index.ts";
import { achievementCategories as retailAchievementCategories } from "../wow/game_data/achievement.ts";
import type { AchievementCategories } from "../wow/game_data/achievement.ts";
import { commodities as retailCommodities } from "../wow/game_data/auction_house.ts";
import type { Commodities } from "../wow/game_data/auction_house.ts";
import { connectedRealm as retailConnectedRealm } from "../wow/game_data/connected_realm.ts";
import type { ConnectedRealm } from "../wow/game_data/connected_realm.ts";
import { characterAchievementSummary as retailCharacterAchievementSummary } from "../wow/profile/character_achievements.ts";
import type { CharacterAchievementSummary } from "../wow/profile/character_achievements.ts";
import { characterAppearanceSummary as retailCharacterAppearanceSummary } from "../wow/profile/character_appearance.ts";
import type { CharacterAppearanceSummary } from "../wow/profile/character_appearance.ts";
import { characterProfile as retailCharacterProfile } from "../wow/profile/character_profile.ts";
import type { CharacterProfile } from "../wow/profile/character_profile.ts";
import { characterPvpSummary as retailCharacterPvpSummary } from "../wow/profile/character_pvp.ts";
import type { CharacterPvpSummary } from "../wow/profile/character_pvp.ts";
import { characterSpecializations as retailCharacterSpecializations } from "../wow/profile/character_specializations.ts";
import type { CharacterSpecializations } from "../wow/profile/character_specializations.ts";
import { characterStatistics as retailCharacterStatistics } from "../wow/profile/character_statistics.ts";
import type { CharacterStatistics } from "../wow/profile/character_statistics.ts";
import { guildAchievements as retailGuildAchievements } from "../wow/profile/guild.ts";
import type { GuildAchievements } from "../wow/profile/guild.ts";

/** Makes the keys K of T optional. */
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Character profile as returned for Classic: Retail-only links and fields are optional. */
export interface ClassicCharacterProfile extends
    Omit<
        WithOptional<
            CharacterProfile,
            | "active_spec"
            | "achievement_points"
            | "achievements"
            | "encounters"
            | "mythic_keystone_profile"
            | "collections"
            | "quests"
            | "achievements_statistics"
            | "professions"
            | "name_search"
            | "is_remix"
        >,
        "active_title"
    > {
    /** Classic only returns the title name. Absent when the character has no active title. */
    active_title?: { name: string };
}

/** Character appearance as returned for Classic (no active specialization on Era). */
export interface ClassicCharacterAppearanceSummary extends WithOptional<CharacterAppearanceSummary, "active_spec"> {}

/** Character PvP summary as returned for Classic (no honor level). */
export interface ClassicCharacterPvpSummary extends WithOptional<CharacterPvpSummary, "honor_level"> {}

/** Character achievement summary as returned for Classic (no statistics link). */
export interface ClassicCharacterAchievementSummary extends WithOptional<CharacterAchievementSummary, "statistics"> {}

/** Character statistics as returned for Classic: Retail-only secondary stats are optional. */
export interface ClassicCharacterStatistics extends
    WithOptional<
        CharacterStatistics,
        | "speed"
        | "melee_haste"
        | "mastery"
        | "bonus_armor"
        | "lifesteal"
        | "versatility"
        | "versatility_damage_done_bonus"
        | "versatility_healing_done_bonus"
        | "versatility_damage_taken_bonus"
        | "avoidance"
        | "ranged_haste"
        | "spell_haste"
    > {}

/** Character specializations as returned for Classic progression (talent groups instead of loadouts). */
export interface ClassicCharacterSpecializations extends WithOptional<CharacterSpecializations, "specializations"> {}

/** Guild achievements as returned for Classic (totals and achievements may be missing). */
export interface ClassicGuildAchievements
    extends WithOptional<GuildAchievements, "total_quantity" | "total_points" | "achievements"> {}

/** Connected realm as returned for Classic (no mythic leaderboards link). */
export interface ClassicConnectedRealm extends WithOptional<ConnectedRealm, "mythic_leaderboards"> {}

/** Achievement categories as returned for Classic (no guild categories on Era). */
export interface ClassicAchievementCategories extends WithOptional<AchievementCategories, "guild_categories"> {}

/** Commodities as returned for Classic (the auctions list can be missing). */
export interface ClassicCommodities extends WithOptional<Commodities, "auctions"> {}

/**
 * Returns a profile summary for a character.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing a profile summary for a character.
 */
export async function characterProfile(
    ctx: ApiContext,
    realmSlug: string,
    characterName: string,
): Promise<ClassicCharacterProfile> {
    return await retailCharacterProfile(ctx, realmSlug, characterName);
}

/**
 * Returns a summary of a character's appearance settings.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing a summary of a character's appearance settings.
 */
export async function characterAppearanceSummary(
    ctx: ApiContext,
    realmSlug: string,
    characterName: string,
): Promise<ClassicCharacterAppearanceSummary> {
    return await retailCharacterAppearanceSummary(ctx, realmSlug, characterName);
}

/**
 * Returns a PvP summary for a character.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing a PvP summary for a character.
 */
export async function characterPvpSummary(
    ctx: ApiContext,
    realmSlug: string,
    characterName: string,
): Promise<ClassicCharacterPvpSummary> {
    return await retailCharacterPvpSummary(ctx, realmSlug, characterName);
}

/**
 * Returns a summary of the achievements a character has completed.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing a summary of the achievements a character has completed.
 */
export async function characterAchievementSummary(
    ctx: ApiContext,
    realmSlug: string,
    characterName: string,
): Promise<ClassicCharacterAchievementSummary> {
    return await retailCharacterAchievementSummary(ctx, realmSlug, characterName);
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
): Promise<ClassicCharacterStatistics> {
    return await retailCharacterStatistics(ctx, realmSlug, characterName);
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
): Promise<ClassicCharacterSpecializations> {
    return await retailCharacterSpecializations(ctx, realmSlug, characterName);
}

/**
 * Returns a single guild's achievements by name.
 *
 * @param realmSlug - The slug of the realm.
 * @param nameSlug - The slug of the guild.
 * @returns A promise that resolves to an object representing a guild's achievements.
 */
export async function guildAchievements(
    ctx: ApiContext,
    realmSlug: string,
    nameSlug: string,
): Promise<ClassicGuildAchievements> {
    return await retailGuildAchievements(ctx, realmSlug, nameSlug);
}

/**
 * Returns a connected realm by ID.
 *
 * @param connectedRealmId - The ID of the connected realm.
 * @returns A promise that resolves to an object representing details about a connected realm.
 */
export async function connectedRealm(ctx: ApiContext, connectedRealmId: number): Promise<ClassicConnectedRealm> {
    return await retailConnectedRealm(ctx, connectedRealmId);
}

/**
 * Returns an index of achievement categories.
 *
 * @returns A promise that resolves to an object representing a list of the index of achievement categories.
 */
export async function achievementCategories(ctx: ApiContext): Promise<ClassicAchievementCategories> {
    return await retailAchievementCategories(ctx);
}

/**
 * Returns all active auctions for commodity items for the entire game region.
 *
 * @returns A promise that resolves to an object representing the region's commodity auctions.
 */
export async function commodities(ctx: ApiContext): Promise<ClassicCommodities> {
    return await retailCommodities(ctx);
}
