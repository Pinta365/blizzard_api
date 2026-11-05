/**
 * WoW: Forever character profile endpoints. Forever is realmless: a character is identified by its two-part name
 * (`name` and `surname`, unique per region), and the URL is `/profile/wow/character/{name}-{surname}`.
 * Characters are only served once they reach level 10; below that the API returns 404.
 * Verified against the live API (EU) on 2026-11-05.
 */

import type { ApiContext, Href, KeyNameId, LocalizedString, TypeName } from "../shared/index.ts";
import type {
    CharacterAchievementStatistics,
    CharacterAchievementSummary,
} from "../wow/profile/character_achievements.ts";
import type { CharacterAppearanceSummary } from "../wow/profile/character_appearance.ts";
import type {
    CharacterCollectionHeirlooms,
    CharacterCollectionMounts,
    CharacterCollectionPets,
    CharacterCollectionToys,
    CharacterCollectionTransmogs,
    CharacterCollectionTypes,
} from "../wow/profile/character_collections.ts";
import type {
    CharacterEncounterDungeons,
    CharacterEncounterRaids,
    CharacterEncounters,
} from "../wow/profile/character_encounters.ts";
import type { characterEquipments as CharacterEquipments } from "../wow/profile/character_equipment.ts";
import type { CharacterMythicKeystoneProfile } from "../wow/profile/character_mythic_keystone_profile.ts";
import type { CharacterProfessions } from "../wow/profile/character_professions.ts";
import type { CharacterProfile, CharacterProfileStatus } from "../wow/profile/character_profile.ts";
import type { CharacterCompletedQuests, CharacterQuests } from "../wow/profile/character_quests.ts";
import type { CharacterReputations } from "../wow/profile/character_reputations.ts";
import type { CharacterStatistics } from "../wow/profile/character_statistics.ts";
import type { CharacterTitles } from "../wow/profile/character_titles.ts";

/** A reference to a Forever character, as found in the `character` field of the character endpoints. */
export interface ForeverCharacterRef {
    key: Href;
    name: string;
    id: number;
    /** The second part of the character's name. */
    surname: string;
    /** The character's URL slug, `{name}-{surname}` in lowercase. */
    slug: string;
}

/** A Retail character response with the realm-based `character` reference replaced by the Forever one. */
export type WithForeverCharacter<T extends { character: unknown }> = Omit<T, "character"> & {
    character: ForeverCharacterRef;
};

/** Character profile summary as returned for Forever. */
export interface ForeverCharacterProfile extends Omit<CharacterProfile, "realm" | "guild" | "covenant_progress"> {
    /** The second part of the character's name. */
    surname: string;
    /** The character's ruleset (Normal, PvP, Roleplay, Roleplay PvP). */
    ruleset: KeyNameId;
    /** Absent when the character is not in a guild. Forever guilds are realmless. */
    guild?: {
        key: Href;
        name: LocalizedString;
        id: number;
        faction: TypeName;
        slug: string;
    };
}

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** A talent in a Forever talent tree. */
export interface ForeverCharacterTalent {
    talent: { name: string; id: number };
    spell_tooltip: {
        spell: { name: string; id: number };
        description: LocalizedString;
        cast_time: LocalizedString;
        power_cost?: LocalizedString | null;
        range?: LocalizedString;
        cooldown?: LocalizedString;
    };
    talent_rank: number;
}

/**
 * Character specializations as returned for Forever: talent trees with points spent per tree, grouped per talent
 * group (like Classic Era), instead of Retail's loadouts.
 */
export interface ForeverCharacterSpecializations {
    _links: { self: Href };
    character: ForeverCharacterRef;
    specialization_groups: {
        is_active: boolean;
        specializations: {
            specialization: KeyNameId;
            specialization_name: string;
            spent_points: number;
            talents: ForeverCharacterTalent[];
        }[];
    }[];
}

/** Character PvP summary as returned for Forever: a Classic-style `pvp_rank`, no honor level or brackets. */
export interface ForeverCharacterPvpSummary {
    _links: { self: Href };
    character: ForeverCharacterRef;
    honorable_kills: number;
    pvp_rank: number;
}

export type ForeverCharacterProfileStatus = CharacterProfileStatus;
/** `category_progress` and `recent_events` are absent while the character has no achievement points. */
export interface ForeverCharacterAchievementSummary extends
    WithOptional<
        WithForeverCharacter<CharacterAchievementSummary>,
        "category_progress" | "recent_events"
    > {}
export type ForeverCharacterAchievementStatistics = WithForeverCharacter<CharacterAchievementStatistics>;
export type ForeverCharacterAppearanceSummary = WithForeverCharacter<CharacterAppearanceSummary>;
export type ForeverCharacterCollectionTypes = WithForeverCharacter<CharacterCollectionTypes>;
export type ForeverCharacterCollectionMounts = CharacterCollectionMounts;
export type ForeverCharacterCollectionPets = CharacterCollectionPets;
export type ForeverCharacterCollectionToys = CharacterCollectionToys;
export type ForeverCharacterCollectionHeirlooms = CharacterCollectionHeirlooms;
/** `appearance_sets` is absent when the character has collected no appearance sets. */
export interface ForeverCharacterCollectionTransmogs
    extends WithOptional<CharacterCollectionTransmogs, "appearance_sets"> {}
export type ForeverCharacterEncounters = WithForeverCharacter<CharacterEncounters>;
/** `expansions` is absent when the character has completed no dungeons. */
export interface ForeverCharacterEncounterDungeons extends WithOptional<CharacterEncounterDungeons, "expansions"> {}
/** `expansions` is absent when the character has completed no raids. */
export interface ForeverCharacterEncounterRaids
    extends WithOptional<WithForeverCharacter<CharacterEncounterRaids>, "expansions"> {}
export type ForeverCharacterEquipment = WithForeverCharacter<CharacterEquipments>;
/** `seasons` is absent when the character has no Mythic Keystone seasons. */
export interface ForeverCharacterMythicKeystoneProfile
    extends WithOptional<WithForeverCharacter<CharacterMythicKeystoneProfile>, "seasons"> {}
export type ForeverCharacterProfessions = WithForeverCharacter<CharacterProfessions>;
export type ForeverCharacterQuests = WithForeverCharacter<CharacterQuests>;
export type ForeverCharacterCompletedQuests = WithForeverCharacter<CharacterCompletedQuests>;
export type ForeverCharacterReputations = WithForeverCharacter<CharacterReputations>;
export type ForeverCharacterStatistics = WithForeverCharacter<CharacterStatistics>;
/** `titles` is absent when the character has no titles. */
export interface ForeverCharacterTitles extends WithOptional<WithForeverCharacter<CharacterTitles>, "titles"> {}

/** Builds the realmless character path, `/profile/wow/character/{name}-{surname}`. */
function characterPath(name: string, surname: string, path = ""): string {
    // The request layer encodes the URL, so non-ASCII names (e.g. "Pröudmoore") are passed as they are.
    return `/profile/wow/character/${`${name}-${surname}`.toLowerCase()}${path}`;
}

async function request<T>(ctx: ApiContext, name: string, surname: string, path = ""): Promise<T> {
    return await ctx.request({
        method: "GET",
        url: characterPath(name, surname, path),
        namespace: "profile",
    }) as T;
}

/**
 * Returns a profile summary for a character.
 *
 * @param name - The character's name (first part), e.g. "Anduin". Case-insensitive.
 * @param surname - The character's surname (second part), e.g. "Wrynn". Case-insensitive.
 * @returns A promise that resolves to an object representing a profile summary.
 */
export async function characterProfile(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterProfile> {
    return await request(ctx, name, surname);
}

/**
 * Returns the status and a unique ID for a character. Use the ID to check whether a character with the same name is
 * still the same character.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the character's status.
 */
export async function characterProfileStatus(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterProfileStatus> {
    return await request(ctx, name, surname, "/status");
}

/**
 * Returns a summary of the achievements a character has completed.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the achievement summary.
 */
export async function characterAchievementSummary(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterAchievementSummary> {
    return await request(ctx, name, surname, "/achievements");
}

/**
 * Returns a character's statistics as they pertain to achievements.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the achievement statistics.
 */
export async function characterAchievementStatistics(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterAchievementStatistics> {
    return await request(ctx, name, surname, "/achievements/statistics");
}

/**
 * Returns a summary of a character's appearance settings.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the appearance summary.
 */
export async function characterAppearanceSummary(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterAppearanceSummary> {
    return await request(ctx, name, surname, "/appearance");
}

/**
 * Returns an index of collection types for a character.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the collection index.
 */
export async function characterCollectionTypes(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterCollectionTypes> {
    return await request(ctx, name, surname, "/collections");
}

/**
 * Returns the mounts a character has collected.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the collected mounts.
 */
export async function characterCollectionMounts(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterCollectionMounts> {
    return await request(ctx, name, surname, "/collections/mounts");
}

/**
 * Returns the battle pets a character has collected.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the collected pets.
 */
export async function characterCollectionPets(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterCollectionPets> {
    return await request(ctx, name, surname, "/collections/pets");
}

/**
 * Returns the toys a character has collected.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the collected toys.
 */
export async function characterCollectionToys(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterCollectionToys> {
    return await request(ctx, name, surname, "/collections/toys");
}

/**
 * Returns the heirlooms a character has collected.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the collected heirlooms.
 */
export async function characterCollectionHeirlooms(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterCollectionHeirlooms> {
    return await request(ctx, name, surname, "/collections/heirlooms");
}

/**
 * Returns the transmog appearances a character has collected.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the collected transmogs.
 */
export async function characterCollectionTransmogs(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterCollectionTransmogs> {
    return await request(ctx, name, surname, "/collections/transmogs");
}

/**
 * Returns a summary of a character's encounters.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the encounter summary.
 */
export async function characterEncounters(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterEncounters> {
    return await request(ctx, name, surname, "/encounters");
}

/**
 * Returns a summary of a character's completed dungeons.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the completed dungeons.
 */
export async function characterEncounterDungeons(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterEncounterDungeons> {
    return await request(ctx, name, surname, "/encounters/dungeons");
}

/**
 * Returns a summary of a character's completed raids.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the completed raids.
 */
export async function characterEncounterRaids(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterEncounterRaids> {
    return await request(ctx, name, surname, "/encounters/raids");
}

/**
 * Returns a summary of the items equipped by a character.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the equipped items.
 */
export async function characterEquipments(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterEquipment> {
    return await request(ctx, name, surname, "/equipment");
}

/**
 * Returns the Mythic Keystone profile index for a character.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the Mythic Keystone profile.
 */
export async function characterMythicKeystoneProfile(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterMythicKeystoneProfile> {
    return await request(ctx, name, surname, "/mythic-keystone-profile");
}

/**
 * Returns a summary of a character's professions.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the professions.
 */
export async function characterProfessions(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterProfessions> {
    return await request(ctx, name, surname, "/professions");
}

/**
 * Returns a PvP summary for a character.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the PvP summary.
 */
export async function characterPvpSummary(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterPvpSummary> {
    return await request(ctx, name, surname, "/pvp-summary");
}

/**
 * Returns a character's active quests and links to its completed quests.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the quests.
 */
export async function characterQuests(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterQuests> {
    return await request(ctx, name, surname, "/quests");
}

/**
 * Returns the quests a character has completed.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the completed quests.
 */
export async function characterCompletedQuests(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterCompletedQuests> {
    return await request(ctx, name, surname, "/quests/completed");
}

/**
 * Returns a summary of a character's reputations.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the reputations.
 */
export async function characterReputations(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterReputations> {
    return await request(ctx, name, surname, "/reputations");
}

/**
 * Returns a summary of a character's specializations.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the specializations.
 */
export async function characterSpecializations(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterSpecializations> {
    return await request(ctx, name, surname, "/specializations");
}

/**
 * Returns a statistics summary for a character.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the statistics.
 */
export async function characterStatistics(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterStatistics> {
    return await request(ctx, name, surname, "/statistics");
}

/**
 * Returns a summary of the titles a character has obtained.
 *
 * @param name - The character's name (first part). Case-insensitive.
 * @param surname - The character's surname (second part). Case-insensitive.
 * @returns A promise that resolves to an object representing the titles.
 */
export async function characterTitles(
    ctx: ApiContext,
    name: string,
    surname: string,
): Promise<ForeverCharacterTitles> {
    return await request(ctx, name, surname, "/titles");
}
