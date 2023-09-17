import { KeyName, KeyNameId, LinkSelfHref, LocalizedString, request, TypeName } from "../shared/index.ts";

interface RealmList extends KeyNameId {
    slug: string;
}
interface Realms extends LinkSelfHref {
    realms: RealmList[];
}

interface Realm extends LinkSelfHref {
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
    });
}

/**
 * Returns a single realm by slug or ID.
 *
 * @param realmSlug - The unique identifier for the realm.
 * @returns A promise that resolves to an object representing details about a realm.
 */
export async function realm(realmSlug: string): Promise<Realm> {
    return await request({
        method: "GET",
        url: `/data/wow/realm/${realmSlug}`,
        namespace: "dynamic",
    });
}

export function searchRealm() {
    //TODO: Placeholder for the realm Search, will probably be using ./search.ts
    throw new Error("Not implemented yet!");
}
