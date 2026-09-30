/**
 * World of Warcraft Classic Era endpoints (Era, Season of Discovery, Hardcore, Anniversary), namespace variant
 * "classic1x". The client binds them to a "classic1x" context.
 * Verified against the live API (EU) on 2026-09-30.
 */

export * from "./shared.ts";

// Game Data APIs
export { auctionHouse, auctionHouses } from "./auction_house.ts";

// Profile APIs
export { characterSpecializations } from "./character_specializations.ts";
