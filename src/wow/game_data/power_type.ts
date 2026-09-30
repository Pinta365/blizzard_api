import type { ApiContext } from "../../shared/index.ts";
import type { KeyNameId, LinkSelfHref, LocalizedString } from "../../shared/index.ts";

export interface PowerTypes extends LinkSelfHref {
    power_types: KeyNameId[];
}

export interface PowerType extends LinkSelfHref {
    id: number;
    name: LocalizedString;
}

/**
 * Returns an index of power types.
 *
 * @returns A promise that resolves to an object representing a list of power types.
 */
export async function powerTypes(ctx: ApiContext): Promise<PowerTypes> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/power-type/index",
        namespace: "static",
    }) as PowerTypes;
}

/**
 * Returns a power type by ID.
 *
 * @param powerTypeId - The unique identifier for the power type.
 * @returns A promise that resolves to an object representing details about a power type.
 */
export async function powerType(ctx: ApiContext, powerTypeId: number): Promise<PowerType> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/power-type/${powerTypeId}`,
        namespace: "static",
    }) as PowerType;
}
