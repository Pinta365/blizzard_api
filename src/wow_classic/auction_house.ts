/**
 * This module provides the Classic Era auction house endpoints. Classic Era realms have separate Alliance, Horde and
 * neutral auction houses, so auctions are listed per auction house instead of per connected realm.
 */

import type { ApiContext } from "../shared/index.ts";
import type { Href, LinkSelfHref, NamedRef } from "../shared/index.ts";

export interface AuctionHouses extends LinkSelfHref {
    auctions: NamedRef[];
}

export interface AuctionHouseAuctions extends LinkSelfHref {
    connected_realm: Href;
    auctions: {
        id: number;
        item: { id: number; rand?: number; seed?: number };
        bid?: number;
        buyout?: number;
        quantity: number;
        time_left: string;
    }[];
    id: number;
    name: string;
}

/**
 * Returns an index of the auction houses (Alliance, Horde, neutral) of a Classic Era connected realm.
 *
 * @param connectedRealmId - The ID of the connected realm.
 * @returns A promise that resolves to an object listing the auction houses.
 */
export async function auctionHouses(ctx: ApiContext, connectedRealmId: number): Promise<AuctionHouses> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/connected-realm/${connectedRealmId}/auctions/index`,
        namespace: "dynamic",
    }) as AuctionHouses;
}

/**
 * Returns all active auctions of one auction house of a Classic Era connected realm.
 *
 * @param connectedRealmId - The ID of the connected realm.
 * @param auctionHouseId - The ID of the auction house, from auctionHouses().
 * @returns A promise that resolves to an object listing the auctions.
 */
export async function auctionHouse(
    ctx: ApiContext,
    connectedRealmId: number,
    auctionHouseId: number,
): Promise<AuctionHouseAuctions> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/connected-realm/${connectedRealmId}/auctions/${auctionHouseId}`,
        namespace: "dynamic",
    }) as AuctionHouseAuctions;
}
