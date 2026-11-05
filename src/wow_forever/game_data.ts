/**
 * WoW: Forever versions of Retail game data endpoints whose Forever responses lack fields that Retail always returns:
 * systems Forever doesn't have (hero talents, hunter pet specializations, guild achievements, sources) and indexes
 * that are empty before launch, which the API omits instead of returning an empty list.
 * Each one makes the same request as the Retail endpoint, but returns a type where those fields are optional,
 * so the Retail types can keep them required.
 * Verified against the live API (EU) on 2026-11-02, before launch.
 */

import type { ApiContext } from "../shared/index.ts";
import type { SearchParameters } from "../wow/search.ts";
import { achievementCategories as retailAchievementCategories } from "../wow/game_data/achievement.ts";
import type { AchievementCategories } from "../wow/game_data/achievement.ts";
import { heirlooms as retailHeirlooms } from "../wow/game_data/heirloom.ts";
import type { Heirlooms } from "../wow/game_data/heirloom.ts";
import { searchItemAppearance as retailSearchItemAppearance } from "../wow/game_data/item_appearance.ts";
import type { ItemAppearanceSearch, ItemAppearanceSearchResult } from "../wow/game_data/item_appearance.ts";
import {
    journalEncounters as retailJournalEncounters,
    journalExpansions as retailJournalExpansions,
    journalInstances as retailJournalInstances,
} from "../wow/game_data/journal.ts";
import type { JournalEncounters, JournalExpansions, JournalInstances } from "../wow/game_data/journal.ts";
import { mount as retailMount } from "../wow/game_data/mount.ts";
import type { Mount } from "../wow/game_data/mount.ts";
import { pet as retailPet, petAbilities as retailPetAbilities } from "../wow/game_data/pet.ts";
import type { Pet, PetAbilities } from "../wow/game_data/pet.ts";
import {
    playableSpecialization as retailPlayableSpecialization,
    playableSpecializations as retailPlayableSpecializations,
} from "../wow/game_data/playable_specialization.ts";
import type { PlayableSpecialization, PlayableSpecializations } from "../wow/game_data/playable_specialization.ts";
import { professionRecipie as retailProfessionRecipie } from "../wow/game_data/profession.ts";
import type { ProfessionRecipie } from "../wow/game_data/profession.ts";
import { quest as retailQuest } from "../wow/game_data/quest.ts";
import type { Quest } from "../wow/game_data/quest.ts";
import { reputationFaction as retailReputationFaction } from "../wow/game_data/reputations.ts";
import type { ReputationFaction } from "../wow/game_data/reputations.ts";
import { talentTree as retailTalentTree, talentTrees as retailTalentTrees } from "../wow/game_data/talent.ts";
import type { TalentTree, TalentTrees } from "../wow/game_data/talent.ts";
import { title as retailTitle } from "../wow/game_data/title.ts";
import type { Title } from "../wow/game_data/title.ts";

/** Makes the keys K of T optional. */
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Achievement category index as returned for Forever (no guild achievements). */
export interface ForeverAchievementCategories extends WithOptional<AchievementCategories, "guild_categories"> {}

/** Heirloom index as returned for Forever (omitted while empty). */
export interface ForeverHeirlooms extends WithOptional<Heirlooms, "heirlooms"> {}

/** Item appearance search result as returned for Forever (no slot). */
export interface ForeverItemAppearanceSearchResult extends Omit<ItemAppearanceSearchResult, "data"> {
    data: WithOptional<ItemAppearanceSearchResult["data"], "slot">;
}

/** Item appearance search as returned for Forever. */
export interface ForeverItemAppearanceSearch extends Omit<ItemAppearanceSearch, "results"> {
    results: ForeverItemAppearanceSearchResult[];
}

/** Journal encounter index as returned for Forever (omitted while empty). */
export interface ForeverJournalEncounters extends WithOptional<JournalEncounters, "encounters"> {}

/** Journal expansion index as returned for Forever (omitted while empty). */
export interface ForeverJournalExpansions extends WithOptional<JournalExpansions, "tiers"> {}

/** Journal instance index as returned for Forever (omitted while empty). */
export interface ForeverJournalInstances extends WithOptional<JournalInstances, "instances"> {}

/** Mount as returned for Forever (no source). */
export interface ForeverMount extends WithOptional<Mount, "source"> {}

/** Battle pet as returned for Forever (no abilities or source). */
export interface ForeverPet
    extends Omit<WithOptional<Pet, "abilities" | "source" | "should_exclude_if_uncollected">, "description"> {
    /** null for pets without a description. */
    description: Pet["description"] | null;
}

/** Pet ability index as returned for Forever (omitted while empty). */
export interface ForeverPetAbilities extends WithOptional<PetAbilities, "abilities"> {}

/** Playable specialization as returned for Forever (no role, primary stat or gendered description). */
export interface ForeverPlayableSpecialization
    extends WithOptional<PlayableSpecialization, "gender_description" | "role" | "primary_stat_type"> {}

/** Playable specialization index as returned for Forever (no hunter pet specializations). */
export interface ForeverPlayableSpecializations extends WithOptional<PlayableSpecializations, "pet_specializations"> {}

/** Profession recipe as returned for Forever (no rank). */
export interface ForeverProfessionRecipie extends WithOptional<ProfessionRecipie, "rank"> {}

/** Quest as returned for Forever (requirements can be empty). */
export interface ForeverQuest extends Omit<Quest, "requirements"> {
    requirements: Partial<Quest["requirements"]>;
}

/** Reputation faction as returned for Forever (no description). */
export interface ForeverReputationFaction extends WithOptional<ReputationFaction, "description"> {}

/** Talent tree as returned for Forever (no hero talents, restriction lines or class talent nodes). */
export interface ForeverTalentTree
    extends WithOptional<TalentTree, "restriction_lines" | "class_talent_nodes" | "hero_talent_trees"> {}

/** Talent tree index as returned for Forever (no hero talents). */
export interface ForeverTalentTrees extends WithOptional<TalentTrees, "hero_talent_trees"> {}

/** Title as returned for Forever (no source). */
export interface ForeverTitle extends WithOptional<Title, "source"> {}

/**
 * Returns an index of achievement categories.
 *
 * @returns A promise that resolves to an object representing an index of achievement categories.
 */
export async function achievementCategories(ctx: ApiContext): Promise<ForeverAchievementCategories> {
    return await retailAchievementCategories(ctx);
}

/**
 * Returns an index of heirlooms.
 *
 * @returns A promise that resolves to an object representing an index of heirlooms.
 */
export async function heirlooms(ctx: ApiContext): Promise<ForeverHeirlooms> {
    return await retailHeirlooms(ctx);
}

/**
 * Performs a search of item appearances.
 *
 * @param searchParameters - Search parameters, e.g. `{ _page: 1, orderby: "id" }`.
 * @returns A promise that resolves to an object representing the search results.
 */
export async function searchItemAppearance(
    ctx: ApiContext,
    searchParameters: SearchParameters,
): Promise<ForeverItemAppearanceSearch> {
    return await retailSearchItemAppearance(ctx, searchParameters);
}

/**
 * Returns an index of journal encounters.
 *
 * @returns A promise that resolves to an object representing an index of journal encounters.
 */
export async function journalEncounters(ctx: ApiContext): Promise<ForeverJournalEncounters> {
    return await retailJournalEncounters(ctx);
}

/**
 * Returns an index of journal expansions.
 *
 * @returns A promise that resolves to an object representing an index of journal expansions.
 */
export async function journalExpansions(ctx: ApiContext): Promise<ForeverJournalExpansions> {
    return await retailJournalExpansions(ctx);
}

/**
 * Returns an index of journal instances.
 *
 * @returns A promise that resolves to an object representing an index of journal instances.
 */
export async function journalInstances(ctx: ApiContext): Promise<ForeverJournalInstances> {
    return await retailJournalInstances(ctx);
}

/**
 * Returns a mount by ID.
 *
 * @param mountId - The ID of the mount.
 * @returns A promise that resolves to an object representing the mount.
 */
export async function mount(ctx: ApiContext, mountId: number): Promise<ForeverMount> {
    return await retailMount(ctx, mountId);
}

/**
 * Returns a battle pet by ID.
 *
 * @param petId - The ID of the pet.
 * @returns A promise that resolves to an object representing the battle pet.
 */
export async function pet(ctx: ApiContext, petId: number): Promise<ForeverPet> {
    return await retailPet(ctx, petId);
}

/**
 * Returns an index of pet abilities.
 *
 * @returns A promise that resolves to an object representing an index of pet abilities.
 */
export async function petAbilities(ctx: ApiContext): Promise<ForeverPetAbilities> {
    return await retailPetAbilities(ctx);
}

/**
 * Returns a playable specialization by ID.
 *
 * @param specId - The ID of the playable specialization.
 * @returns A promise that resolves to an object representing the playable specialization.
 */
export async function playableSpecialization(ctx: ApiContext, specId: number): Promise<ForeverPlayableSpecialization> {
    return await retailPlayableSpecialization(ctx, specId);
}

/**
 * Returns an index of playable specializations.
 *
 * @returns A promise that resolves to an object representing an index of playable specializations.
 */
export async function playableSpecializations(ctx: ApiContext): Promise<ForeverPlayableSpecializations> {
    return await retailPlayableSpecializations(ctx);
}

/**
 * Returns a recipe by ID.
 *
 * @param recipeId - The ID of the recipe.
 * @returns A promise that resolves to an object representing the recipe.
 */
export async function professionRecipie(ctx: ApiContext, recipeId: number): Promise<ForeverProfessionRecipie> {
    return await retailProfessionRecipie(ctx, recipeId);
}

/**
 * Returns a quest by ID.
 *
 * @param questId - The ID of the quest.
 * @returns A promise that resolves to an object representing the quest.
 */
export async function quest(ctx: ApiContext, questId: number): Promise<ForeverQuest> {
    return await retailQuest(ctx, questId);
}

/**
 * Returns a reputation faction by ID.
 *
 * @param reputationFactionId - The ID of the reputation faction.
 * @returns A promise that resolves to an object representing the reputation faction.
 */
export async function reputationFaction(
    ctx: ApiContext,
    reputationFactionId: string,
): Promise<ForeverReputationFaction> {
    return await retailReputationFaction(ctx, reputationFactionId);
}

/**
 * Returns a talent tree by specialization ID.
 *
 * @param talentTreeId - The unique identifier for the talent tree.
 * @param specId - The unique identifier for the specialization.
 * @returns A promise that resolves to an object representing details about a talent tree.
 */
export async function talentTree(ctx: ApiContext, talentTreeId: number, specId: number): Promise<ForeverTalentTree> {
    return await retailTalentTree(ctx, talentTreeId, specId);
}

/**
 * Returns an index of talent trees.
 *
 * @returns A promise that resolves to an object representing an index of talent trees.
 */
export async function talentTrees(ctx: ApiContext): Promise<ForeverTalentTrees> {
    return await retailTalentTrees(ctx);
}

/**
 * Returns a title by ID.
 *
 * @param titleId - The ID of the title.
 * @returns A promise that resolves to an object representing the title.
 */
export async function title(ctx: ApiContext, titleId: number): Promise<ForeverTitle> {
    return await retailTitle(ctx, titleId);
}
