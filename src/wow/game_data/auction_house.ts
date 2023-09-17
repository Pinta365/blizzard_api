import { LinkSelfHref, request } from "../../shared/index.ts";

interface AuctionItem {
    id: number;
    modifiers?: {
        type: number;
        value: number;
    }[];
    pet_breed_id?: number;
    pet_level?: number;
    pet_quality_id?: number;
    pet_species_id?: number;
    bonus_lists?: number[];
    context?: number;
}

interface AuctionListing {
    id: number;
    item: AuctionItem;
    bid?: number;
    buyout?: number;
    quantity: number;
    time_left: "SHORT" | "MEDIUM" | "LONG" | "VERY_LONG";
}

interface Auctions extends LinkSelfHref {
    connected_realm: {
        href: string;
    };
    auctions: AuctionListing[];
    commodities: {
        href: string;
    };
}

interface commodity {
    "id": number;
    "item": {
        "id": number;
    };
    "quantity": number;
    "unit_price": number;
    "time_left": "SHORT" | "MEDIUM" | "LONG" | "VERY_LONG";
}

interface Commodities extends LinkSelfHref {
    auctions: commodity[];
}

/**
 * Returns all active auctions for a connected realm.
 *
 * Auction house data updates at a set interval. The value was initially set at 1 hour; however, it might change over time without notice.
 *
 * NOTE: Depending on the number of active auctions on the specified connected realm, the response from this endpoint may be rather large.
 *
 * @param connectedRealmId - The id of the connected realm to return auctions from.
 * @returns A promise that resolves to an object representing the auctions being listed.
 */
export async function auctions(connectedRealmId: number): Promise<Auctions> {
    return await request({
        method: "GET",
        url: `/data/wow/connected-realm/${connectedRealmId}/auctions`,
        namespace: "dynamic",
    });
}

/**
 * Returns all active auctions for commodity items for the entire game region.
 *
 * Auction house data updates at a set interval. The value was initially set at 1 hour; however, it might change over time without notice.
 *
 * NOTE: Depending on the number of active auctions on the specified region, the response from this endpoint may be rather large.
 *
 * @returns A promise that resolves to an object representing the commodities being listed.
 */
export async function commodities(): Promise<Commodities> {
    return await request({
        method: "GET",
        url: "/data/wow/auctions/commodities",
        namespace: "dynamic",
    });
}
