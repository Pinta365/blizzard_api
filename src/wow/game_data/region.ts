import { request } from "../../shared/index.ts";
import type { LinkSelfHref, LocalizedString } from "../../shared/index.ts";

export interface Regions extends LinkSelfHref {
    regions: {
        href: string;
    }[];
}

export interface Region extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    tag: string;
}

/**
 * Returns an index of regions.
 *
 * @returns A promise that resolves to an object representing a list of regions.
 */
export async function regions(): Promise<Regions> {
    return await request({
        method: "GET",
        url: "/data/wow/region/index",
        namespace: "dynamic",
    }) as Regions;
}

/**
 * Returns a region by ID.
 *
 * @param regionId - The unique identifier for the region.
 * @returns A promise that resolves to an object representing details about a region.
 */
export async function region(regionId: number): Promise<Region> {
    return await request({
        method: "GET",
        url: `/data/wow/region/${regionId}`,
        namespace: "dynamic",
    }) as Region;
}
