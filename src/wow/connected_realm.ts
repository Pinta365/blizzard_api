import { KeyNameId, LinkSelfHref, LocalizedString, request, TypeName } from "../shared/index.ts";
import { Search, search, SearchParameters } from "./search.ts";

interface ConnectedRealms extends LinkSelfHref {
    connected_realms: { href: string }[];
}

interface Realm {
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

interface ConnectedRealm extends LinkSelfHref {
    id: number;
    has_queue: boolean;
    status: TypeName;
    population: TypeName;
    realms: Realm[];
    mythic_leaderboards: { href: string };
    auctions: { href: string };
}

/**
 * Returns the Connected Realms Index
 *
 * @returns A promise that resolves to an object representing a list of all Connected Realms.
 */
export async function connectedRealms(): Promise<ConnectedRealms> {
    return await request({
        method: "GET",
        url: "/data/wow/connected-realm/index",
        namespace: "dynamic",
    });
}

/**
 * Returns details about a Connected Realms Id
 *
 * @param connectedRealmId - The unique identifier Azerite Essence.
 * @returns A promise that resolves to an object representing details about an Azerite Essences.
 */
export async function connectedRealm(connectedRealmId: number): Promise<ConnectedRealm> {
    return await request({
        method: "GET",
        url: `/data/wow/connected-realm/${connectedRealmId}`,
        namespace: "dynamic",
    });
}

/**
 * Performs a search of connected realms.
 *
 * @param SearchParameters - Object containing search parameters.
 * @returns A promise that resolves to an object representing details about the connected realms search.
 */
export async function searchConnectedRealm(searchParameters: SearchParameters): Promise<Search> {
    return await search("/connected-realm", "dynamic", searchParameters);
}
