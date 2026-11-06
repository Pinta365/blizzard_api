/**
 * World of Warcraft: Forever endpoints, namespace variant "forever". These are the Retail endpoint functions that
 * the Forever API supports; the client binds them to a "forever" context. Forever runs on the Retail game data
 * (specializations, talents, mounts, pets, toys, ...) with Classic-era content.
 *
 * Forever is realmless: players pick a ruleset (Normal, PvP, Roleplay, Roleplay PvP), not a realm, and characters are
 * looked up by `name` and `surname`. The realm endpoints are left out (the realm index was taken down at launch);
 * use `rulesets()`. Guilds are looked up by name slug alone. Each ruleset has several auction houses (Alliance, Horde,
 * neutral): `auctionHouses()`, then `auctionHouse()` and `auctionHouseCommodities()`.
 * Verified against the live API (EU) on 2026-11-06.
 */

// Game Data APIs
export { achievement, achievementCategory, achievementMedia, achievements } from "../wow/game_data/achievement.ts";
export {
    creature,
    creatureDisplayMedia,
    creatureFamilies,
    creatureFamily,
    creatureFamilyMedia,
    creatureType,
    creatureTypes,
    searchCreature,
} from "../wow/game_data/creature.ts";
export { guildCrestBorder, guildCrestEmblem, guildCrests } from "../wow/game_data/guild_crest.ts";
export { heirloom } from "../wow/game_data/heirloom.ts";
export {
    item,
    itemClass,
    itemClasses,
    itemMedia,
    itemSet,
    itemSets,
    itemSubclass,
    searchItem,
} from "../wow/game_data/item.ts";
export {
    itemAppearance,
    itemAppearanceSet,
    itemAppearanceSets,
    itemAppearanceSlot,
    itemAppearanceSlots,
} from "../wow/game_data/item_appearance.ts";
export {
    journalEncounter,
    journalExpansion,
    journalInstance,
    journalInstanceMedia,
    searchJournalEncounter,
} from "../wow/game_data/journal.ts";
export { searchMedia } from "../wow/game_data/media_search.ts";
export { mounts, searchMount } from "../wow/game_data/mount.ts";
export { petAbility, petAbilityMedia, petMedia, pets } from "../wow/game_data/pet.ts";
export { playableClass, playableClasses, playableClassMedia } from "../wow/game_data/playable_class.ts";
export { playableSpecializationMedia } from "../wow/game_data/playable_specialization.ts";
export { playableRace, playableRaces } from "../wow/game_data/playable_race.ts";
export { powerType, powerTypes } from "../wow/game_data/power_type.ts";
export {
    profession,
    professionMedia,
    professionRecipieMedia,
    professions,
    professionSkillTier,
} from "../wow/game_data/profession.ts";
export {
    questArea,
    questAreas,
    questCategories,
    questCategory,
    quests,
    questType,
    questTypes,
} from "../wow/game_data/quest.ts";
export { region, regions } from "../wow/game_data/region.ts";
export { reputationFactions, reputationTier, reputationTiers } from "../wow/game_data/reputations.ts";
export { searchSpell, spell, spellMedia } from "../wow/game_data/spell.ts";
export { talent, talents, talentTreeNodes } from "../wow/game_data/talent.ts";
export { titles } from "../wow/game_data/title.ts";
export { toy, toys } from "../wow/game_data/toy.ts";

// Forever-typed versions of Retail endpoints (fields Retail always returns are optional here)
export {
    achievementCategories,
    heirlooms,
    journalEncounters,
    journalExpansions,
    journalInstances,
    mount,
    pet,
    petAbilities,
    playableSpecialization,
    playableSpecializations,
    professionRecipie,
    quest,
    reputationFaction,
    searchItemAppearance,
    talentTree,
    talentTrees,
    title,
} from "./game_data.ts";

// Rulesets (replace realms)
export { ruleset, rulesets } from "./ruleset.ts";

// Auction houses (per ruleset)
export { auctionHouse, auctionHouseCommodities, auctionHouses } from "./auction_house.ts";

// Character Profile APIs (realmless: name and surname)
export {
    characterAchievementStatistics,
    characterAchievementSummary,
    characterAppearanceSummary,
    characterCollectionHeirlooms,
    characterCollectionMounts,
    characterCollectionPets,
    characterCollectionToys,
    characterCollectionTransmogs,
    characterCollectionTypes,
    characterCompletedQuests,
    characterEncounterDungeons,
    characterEncounterRaids,
    characterEncounters,
    characterEquipments,
    characterMedia,
    characterMythicKeystoneProfile,
    characterProfessions,
    characterProfile,
    characterProfileStatus,
    characterPvpSummary,
    characterQuests,
    characterReputations,
    characterSpecializations,
    characterStatistics,
    characterTitles,
} from "./character.ts";

// Guild APIs (realmless: name slug)
export { guild, guildAchievements, guildActivity, guildRoster } from "./guild.ts";

// Account Profile APIs (user token)
export {
    accountCollectionsIndex,
    accountHeirloomsCollection,
    accountMountsCollection,
    accountPetsCollection,
    accountToysCollection,
} from "../wow/profile/account_profile.ts";
export { accountProfileSummary, accountTransmogsCollection } from "./account.ts";
