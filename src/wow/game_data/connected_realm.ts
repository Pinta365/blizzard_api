import type { ApiContext } from "../../shared/index.ts";
import { search } from "../search.ts";
import type { KeyNameId, LinkSelfHref, LocalizedString, TypeName } from "../../shared/index.ts";
import type { Search, SearchParameters } from "../search.ts";

export interface ConnectedRealms extends LinkSelfHref {
    connected_realms: { href: string }[];
}

export interface ConnectedRealmRealm {
    id: number;
    region: KeyNameId;
    connected_realm: { href: string };
    name: LocalizedString;
    category: LocalizedString;
    locale: string;
    timezone: string;
    type: TypeName;
    is_tournament: boolean;
    slug: string;
}

export interface ConnectedRealm extends LinkSelfHref {
    id: number;
    has_queue: boolean;
    status: TypeName;
    population: TypeName;
    realms: ConnectedRealmRealm[];
    mythic_leaderboards: { href: string };
    auctions: { href: string };
    pvp_season?: { href: string };
    realm_locked_status?: {
        is_locked_for_pct: boolean;
        is_locked_for_new_characters: boolean;
    };
}

/**
 * Returns the Connected Realms Index
 *
 * @returns A promise that resolves to an object representing a list of all Connected Realms.
 */
export async function connectedRealms(ctx: ApiContext): Promise<ConnectedRealms> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/connected-realm/index",
        namespace: "dynamic",
    }) as ConnectedRealms;
}

/**
 * Returns details about a Connected Realms Id
 *
 * @param connectedRealmId - The unique identifier Connected Realms.
 * @returns A promise that resolves to an object representing details about an Connected Realms.
 */
export async function connectedRealm(ctx: ApiContext, connectedRealmId: number): Promise<ConnectedRealm> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/connected-realm/${connectedRealmId}`,
        namespace: "dynamic",
    }) as ConnectedRealm;
}

/**
 * Performs a search of connected realms.
 *
 * @param SearchParameters - Object containing search parameters.
 * @returns A promise that resolves to an object representing details about the connected realms search.
 */
export async function searchConnectedRealm(ctx: ApiContext, searchParameters: SearchParameters): Promise<Search> {
    return await search(ctx, "/connected-realm", "dynamic", searchParameters as Search);
}
