/**
 * WoW: Forever auction house endpoints. Auctions and commodities are listed per auction house (Alliance, Horde and the
 * neutral Blackwater auction house), under a ruleset. As of 2026-11-06 every ruleset of a region lists the same auction
 * houses with the same auctions: the ruleset ID must be valid, but does not filter them.
 * Verified against the live API (EU, US, KR, TW) on 2026-11-06.
 */

import type { ApiContext, Href, LinkSelfHref, NamedRef } from "../shared/index.ts";
import type { AuctionListing, commodity } from "../wow/game_data/auction_house.ts";

/** The index of the auction houses, as listed under a ruleset. */
export interface ForeverAuctionHouses extends LinkSelfHref {
    auctions: NamedRef[];
}

/** The active auctions of one auction house. */
export interface ForeverAuctionHouseAuctions extends LinkSelfHref {
    id: number;
    name: string;
    /** Absent while the auction house has no auctions. */
    auctions?: AuctionListing[];
    commodities: Href;
    ruleset: Href;
}

/** The active commodity auctions of one auction house. */
export interface ForeverAuctionHouseCommodities extends LinkSelfHref {
    /** Absent while the auction house has no commodity auctions. */
    auctions?: commodity[];
}

/**
 * Returns an index of the auction houses (Alliance, Horde and neutral), as listed under a ruleset. Every ruleset of a
 * region currently lists the same auction houses.
 *
 * @param rulesetId - The ID of the ruleset, from rulesets().
 * @returns A promise that resolves to an object listing the auction houses.
 */
export async function auctionHouses(ctx: ApiContext, rulesetId: number): Promise<ForeverAuctionHouses> {
    return await ctx.request({
        method: "GET",
        // The trailing slash is required: without it the API has no route.
        url: `/data/wow/ruleset/${rulesetId}/auctions/`,
        namespace: "dynamic",
    }) as ForeverAuctionHouses;
}

/**
 * Returns all active auctions of one auction house of a ruleset. Commodities are listed separately, see
 * auctionHouseCommodities().
 *
 * NOTE: The response can be large (tens of thousands of auctions).
 *
 * @param rulesetId - The ID of the ruleset.
 * @param auctionHouseId - The ID of the auction house, from auctionHouses().
 * @returns A promise that resolves to an object listing the auctions.
 */
export async function auctionHouse(
    ctx: ApiContext,
    rulesetId: number,
    auctionHouseId: number,
): Promise<ForeverAuctionHouseAuctions> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/ruleset/${rulesetId}/auctions/${auctionHouseId}`,
        namespace: "dynamic",
    }) as ForeverAuctionHouseAuctions;
}

/**
 * Returns all active commodity auctions of one auction house of a ruleset.
 *
 * NOTE: The response can be large (tens of thousands of auctions).
 *
 * @param rulesetId - The ID of the ruleset.
 * @param auctionHouseId - The ID of the auction house, from auctionHouses().
 * @returns A promise that resolves to an object listing the commodity auctions.
 */
export async function auctionHouseCommodities(
    ctx: ApiContext,
    rulesetId: number,
    auctionHouseId: number,
): Promise<ForeverAuctionHouseCommodities> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/ruleset/${rulesetId}/auctions/${auctionHouseId}/commodities`,
        namespace: "dynamic",
    }) as ForeverAuctionHouseCommodities;
}
