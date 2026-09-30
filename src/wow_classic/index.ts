/**
 * World of Warcraft Classic (progression) endpoints, namespace variant "classic".
 * These are the Retail endpoint functions that the Classic API supports; the client binds them to a "classic" context.
 * Verified against the live API (EU) on 2026-09-30.
 */

export * from "./shared.ts";

// Game Data APIs
export { auctions, commodities } from "../wow/game_data/auction_house.ts";
export {
    mythicKeystonePeriod,
    mythicKeystonePeriods,
    mythicKeystoneSeason,
    mythicKeystoneSeasons,
} from "../wow/game_data/mythic_keystone_dungeon.ts";
export { mythicKeystoneLeaderboard, mythicKeystoneLeaderboards } from "../wow/game_data/mythic_keystone_leaderboard.ts";
export {
    playableSpecialization,
    playableSpecializationMedia,
    playableSpecializations,
} from "../wow/game_data/playable_specialization.ts";
export {
    pvpSeason,
    pvpSeasonLeaderboard,
    pvpSeasonLeaderboards,
    pvpSeasonRewards,
    pvpSeasons,
} from "../wow/game_data/pvp_season.ts";
export { token } from "../wow/game_data/token.ts";

// Profile APIs
export { characterAchievementStatistics, characterAchievementSummary } from "../wow/profile/character_achievements.ts";
export { characterPvpBracketStatistics } from "../wow/profile/character_pvp.ts";
export { characterSpecializations } from "../wow/profile/character_specializations.ts";
