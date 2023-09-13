import { KeyNameId, LinkSelfHref, LocalizedString, request } from "../shared/index.ts";

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
    type: {
        type: string;
        name: LocalizedString;
    };
    is_tournament: boolean;
    slug: string;
}

interface ConnectedRealm extends LinkSelfHref {
    id: number;
    has_queue: boolean;
    status: {
        type: string;
        name: LocalizedString;
    };
    population: {
        type: string;
        name: LocalizedString;
    };
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

export function searchConnectedRealm() {
    //TODO: Placeholder for the Connected Realm Search, will probably be using ./search.ts
    throw new Error("Not implemented yet!");
}
