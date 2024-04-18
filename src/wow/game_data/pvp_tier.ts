import { Asset, KeyId, KeyNameId, LinkSelfHref, LocalizedString, request } from "../../shared/index.ts";

export interface PvpTierMedia extends LinkSelfHref {
    assets: Asset[];
    id: number;
}

export interface PvpTiers extends LinkSelfHref {
    tiers: KeyNameId[];
}

export interface PvpTier extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    min_rating: number;
    max_rating: number;
    media: KeyId;
    bracket: {
        id: number;
        type: string;
    };
    rating_type: number;
}

/**
 * Returns media for a PvP tier by ID.
 *
 * @param pvpTierId - The unique identifier for the PvP tier
 * @returns A promise that resolves to an object representing media details about a PvP tier.
 */
export async function pvpTierMedia(pvpTierId: number): Promise<PvpTierMedia> {
    return await request({
        method: "GET",
        url: `/data/wow/media/pvp-tier/${pvpTierId}`,
        namespace: "static",
    });
}

/**
 * Returns an index of PvP tiers.
 *
 * @returns A promise that resolves to an object representing a list of PvP tiers.
 */
export async function pvpTiers(): Promise<PvpTiers> {
    return await request({
        method: "GET",
        url: "/data/wow/pvp-tier/index",
        namespace: "static",
    });
}

/**
 * Returns a PvP tier by ID.
 *
 * @param pvpTierId - The unique identifier for the PvP tier.
 * @returns A promise that resolves to an object representing details about a PvP tier.
 */
export async function pvpTier(pvpTierId: number): Promise<PvpTier> {
    return await request({
        method: "GET",
        url: `/data/wow/pvp-tier/${pvpTierId}`,
        namespace: "static",
    });
}
