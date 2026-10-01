import type { ApiContext } from "../../shared/index.ts";
import type { KeyId, KeyNameId, LinkSelfHref, LocalizedString } from "../../shared/index.ts";

export interface ReputationFactions extends LinkSelfHref {
    factions: KeyNameId[];
    root_factions: KeyNameId[];
}

export interface ReputationFaction extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    description: LocalizedString;
    reputation_tiers: KeyId;
}

export interface ReputationTiers extends LinkSelfHref {
    reputation_tiers: {
        key: {
            href: string;
        };
        name?: LocalizedString;
        id: number;
    }[];
}

export interface ReputationTier extends LinkSelfHref {
    id: number;
    tiers: {
        name: LocalizedString;
        min_value: number;
        max_value: number;
        id: number;
    }[];
    faction?: KeyNameId;
}
/**
 * Returns an index of reputation factions.
 *
 * @returns A promise that resolves to an object representing a list of reputation factions.
 */
export async function reputationFactions(ctx: ApiContext): Promise<ReputationFactions> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/reputation-faction/index",
        namespace: "static",
    }) as ReputationFactions;
}

/**
 * Returns a single reputation faction by ID.
 *
 * @param reputationFactionId - The unique identifier for the reputation faction.
 * @returns A promise that resolves to an object representing details about a reputation faction.
 */
export async function reputationFaction(ctx: ApiContext, reputationFactionId: string): Promise<ReputationFaction> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/reputation-faction/${reputationFactionId}`,
        namespace: "static",
    }) as ReputationFaction;
}

/**
 * Returns an index of reputation tiers.
 *
 * @returns A promise that resolves to an object representing a list of reputation tiers.
 */
export async function reputationTiers(ctx: ApiContext): Promise<ReputationTiers> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/reputation-tiers/index",
        namespace: "static",
    }) as ReputationTiers;
}

/**
 * Returns a single set of reputation tiers by ID.
 *
 * @param reputationTiersId - The unique identifier for the reputation tier.
 * @returns A promise that resolves to an object representing details about a reputation tier.
 */
export async function reputationTier(ctx: ApiContext, reputationTiersId: string): Promise<ReputationTier> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/reputation-tiers/${reputationTiersId}`,
        namespace: "static",
    }) as ReputationTier;
}
