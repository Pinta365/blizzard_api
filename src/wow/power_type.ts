import { KeyNameId, LinkSelfHref, LocalizedString, request } from "../shared/index.ts";

interface PowerTypes extends LinkSelfHref {
    power_types: KeyNameId[];
}

interface PowerType extends LinkSelfHref {
    id: number;
    name: LocalizedString;
}

/**
 * Returns an index of power types.
 *
 * @returns A promise that resolves to an object representing a list of power types.
 */
export async function powerTypes(): Promise<PowerTypes> {
    return await request({
        method: "GET",
        url: "/data/wow/power-type/index",
        namespace: "static",
    });
}

/**
 * Returns a power type by ID.
 *
 * @param powerTypeId - The unique identifier for the power type.
 * @returns A promise that resolves to an object representing details about a power type.
 */
export async function powerType(powerTypeId: number): Promise<PowerType> {
    return await request({
        method: "GET",
        url: `/data/wow/power-type/${powerTypeId}`,
        namespace: "static",
    });
}
