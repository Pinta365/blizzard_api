import type { ApiContext } from "../../shared/index.ts";
import { search } from "../search.ts";
import type { KeyId, KeyNameId, LinkSelfHref, LocalizedString, TypeName } from "../../shared/index.ts";
import type { Search, SearchParameters } from "../search.ts";

export interface Mounts extends LinkSelfHref {
    mounts: KeyNameId[];
}

export interface Mount extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    creature_displays: KeyId[];
    description: LocalizedString;
    source: TypeName;
    faction?: TypeName;
    should_exclude_if_uncollected?: boolean;
    requirements?: {
        faction: TypeName;
    };
}

/**
 * Returns a index of mounts.
 *
 * @returns A promise that resolves to an object representing a list of the index of mounts.
 */
export async function mounts(ctx: ApiContext): Promise<Mounts> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/mount/index",
        namespace: "static",
    }) as Mounts;
}

/**
 * Returns a mount by ID.
 *
 * @param mountId - The unique identifier for the mount by ID.
 * @returns A promise that resolves to an object representing details about a mount.
 */
export async function mount(ctx: ApiContext, mountId: number): Promise<Mount> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/mount/${mountId}`,
        namespace: "static",
    }) as Mount;
}

/**
 * Performs a search of mounts.
 *
 * @param searchParameters - Object containing search parameters.
 * @returns A promise that resolves to an object representing details about a mount search.
 */
export async function searchMount(ctx: ApiContext, searchParameters: SearchParameters): Promise<Search> {
    return await search(ctx, "/mount", "static", searchParameters) as Search;
}
