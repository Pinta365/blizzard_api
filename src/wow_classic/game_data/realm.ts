import type { ApiContext } from "../../shared/index.ts";
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
export async function realms(ctx: ApiContext): Promise<Realms> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/realm/index",
        namespace: "dynamic-classic1x",
    }) as Realms;
}

/**
 * Returns a single realm by slug or ID.
 *
 * @param realmSlug - The unique identifier for the realm.
 * @returns A promise that resolves to an object representing details about a realm.
 */
export async function realm(ctx: ApiContext, realmSlug: string): Promise<Realm> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/realm/${realmSlug}`,
        namespace: "dynamic-classic1x",
    }) as Realm;
}

/**
 * Performs a search of realms.
 *
 * @param SearchParameters - Object containing search parameters.
 * @returns A promise that resolves to an object representing details about a realm search.
 */
export async function searchRealm(ctx: ApiContext, searchParameters: SearchParameters): Promise<Search> {
    return await search(ctx, "/realm", "dynamic-classic1x", searchParameters) as Search;
}
