/**
 * Endpoints that work for both Classic flavors (progression and Era). They are the Retail endpoint functions;
 * the client binds them to a context whose namespaces carry the "classic" or "classic1x" variant.
 * Verified against the live API (EU) on 2026-09-30.
 */

// Game Data APIs
export {
    achievement,
    achievementCategories,
    achievementCategory,
    achievementMedia,
    achievements,
} from "../wow/game_data/achievement.ts";
export { connectedRealm, connectedRealms, searchConnectedRealm } from "../wow/game_data/connected_realm.ts";
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
export { item, itemClass, itemClasses, itemMedia, itemSubclass, searchItem } from "../wow/game_data/item.ts";
export { searchMedia } from "../wow/game_data/media_search.ts";
export { playableClass, playableClasses, playableClassMedia } from "../wow/game_data/playable_class.ts";
export { playableRace, playableRaces } from "../wow/game_data/playable_race.ts";
export { powerType, powerTypes } from "../wow/game_data/power_type.ts";
export { realm, realms, searchRealm } from "../wow/game_data/realm.ts";
export { region, regions } from "../wow/game_data/region.ts";

// Profile APIs
export { characterAppearanceSummary } from "../wow/profile/character_appearance.ts";
export { characterEquipments } from "../wow/profile/character_equipment.ts";
export { characterHunterPets } from "../wow/profile/character_hunter_pets.ts";
export { characterMedia } from "../wow/profile/character_media.ts";
export { characterProfile, characterProfileStatus } from "../wow/profile/character_profile.ts";
export { characterPvpSummary } from "../wow/profile/character_pvp.ts";
export { characterReputations } from "../wow/profile/character_reputations.ts";
export { characterStatistics } from "../wow/profile/character_statistics.ts";
export { guild, guildAchievements, guildActivity, guildRoster } from "../wow/profile/guild.ts";
