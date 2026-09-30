/**
 * This module provides interfaces and API function definitions for fetching World of Warcraft neighborhood map data using the Blizzard API.
 */

import type { ApiContext } from "../../shared/index.ts";

import type { LinkSelfHref, NamedRef } from "../../shared/index.ts";

export interface NeighborhoodMaps extends LinkSelfHref {
    maps: NamedRef[];
}

export interface NeighborhoodMap extends LinkSelfHref {
    id: number;
    name: string;
}

export interface Neighborhood extends LinkSelfHref {
    id: number;
    /** The neighborhood map this neighborhood belongs to. */
    neighborhood_map: NamedRef;
    /** Plot/address identifier (e.g. "63-74-67"). */
    neighborhood_name: string;
}

/**
 * Returns an index of neighborhood maps.
 */
export async function neighborhoodMaps(ctx: ApiContext): Promise<NeighborhoodMaps> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/neighborhood-map/index",
        namespace: "dynamic",
    }) as NeighborhoodMaps;
}

/**
 * Returns a neighborhood map by ID.
 *
 * @param neighborhoodMapId - The ID of the neighborhood map.
 */
export async function neighborhoodMap(ctx: ApiContext, neighborhoodMapId: number): Promise<NeighborhoodMap> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/neighborhood-map/${neighborhoodMapId}`,
        namespace: "dynamic",
    }) as NeighborhoodMap;
}

/**
 * Returns a neighborhood by ID within a neighborhood map.
 *
 * @param neighborhoodMapId - The ID of the neighborhood map.
 * @param neighborhoodId - The ID of the neighborhood.
 */
export async function neighborhood(
    ctx: ApiContext,
    neighborhoodMapId: number,
    neighborhoodId: number,
): Promise<Neighborhood> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/neighborhood-map/${neighborhoodMapId}/neighborhood/${neighborhoodId}`,
        namespace: "dynamic",
    }) as Neighborhood;
}
