import { request } from "../../shared/index.ts";
import { search } from "../search.ts";
import type { KeyName, KeyNameId, LinkSelfHref, LocalizedString, TypeName } from "../../shared/index.ts";
import type { Search, SearchParameters } from "../search.ts";

export interface RealmList extends KeyNameId {
    slug: string;
}
export interface Realms extends LinkSelfHref {
    realms: RealmList[];
}

export interface Realm extends LinkSelfHref {
    id: number;
    region: KeyName;
    connected_realm: {
        href: string;
    };
    name: LocalizedString;
    category: LocalizedString;
    locale: string;
    timezone: string;
    type: TypeName;
    is_tournament: boolean;
    slug: string;
}

/**
 * Returns an index of realms.
 *
 * @returns A promise that resolves to an object representing a list of realms.
 */
export async function realms(): Promise<Realms> {
    return await request({
        method: "GET",
        url: "/data/wow/realm/index",
        namespace: "dynamic",
    }) as Realms;
}

/**
 * Returns a single realm by slug or ID.
 *
 * @param realmSlugOrId - The unique identifier for the realm.
 * @returns A promise that resolves to an object representing details about a realm.
 */
export async function realm(realmSlugOrId: string | number): Promise<Realm> {
    return await request({
        method: "GET",
        url: `/data/wow/realm/${realmSlugOrId}`,
        namespace: "dynamic",
    }) as Realm;
}

/**
 * Performs a search of realms.
 *
 * @param SearchParameters - Object containing search parameters.
 * @returns A promise that resolves to an object representing details about a realm search.
 */
export async function searchRealm(searchParameters: SearchParameters): Promise<Search> {
    return await search("/realm", "dynamic", searchParameters) as Search;
}
