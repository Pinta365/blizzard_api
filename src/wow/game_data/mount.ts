import { request } from "../../shared/index.ts";
import type { KeyId, KeyNameId, LinkSelfHref, LocalizedString, TypeName } from "../../shared/index.ts";

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
export async function mounts(): Promise<Mounts> {
    return await request({
        method: "GET",
        url: "/data/wow/mount/index",
        namespace: "static",
    });
}

/**
 * Returns a mount by ID.
 *
 * @param mountId - The unique identifier for the mount by ID.
 * @returns A promise that resolves to an object representing details about a mount.
 */
export async function mount(mountId: number): Promise<Mount> {
    return await request({
        method: "GET",
        url: `/data/wow/mount/${mountId}`,
        namespace: "static",
    });
}

export function searchMount() {
    //TODO: Placeholder for the mount Search, will probably be using ./search.ts
    throw new Error("Not implemented yet!");
}
