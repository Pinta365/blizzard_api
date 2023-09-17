import { KeyId, KeyNameId, LinkSelfHref, LocalizedString, request } from "../../shared/index.ts";

interface ReputationFactions extends LinkSelfHref {
    factions: KeyNameId[];
    root_factions: KeyNameId[];
}

interface ReputationFaction extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    description: LocalizedString;
    reputation_tiers: KeyId;
}

interface ReputationTiers extends LinkSelfHref {
    reputation_tiers: KeyNameId[];
}

interface ReputationTier extends LinkSelfHref {
    id: number;
    tiers: {
        name: LocalizedString;
        min_value: number;
        max_value: number;
        id: number;
    }[];
    faction: KeyNameId;
}
/**
 * Returns an index of reputation factions.
 *
 * @returns A promise that resolves to an object representing a list of reputation factions.
 */
export async function reputationFactions(): Promise<ReputationFactions> {
    return await request({
        method: "GET",
        url: "/data/wow/reputation-faction/index",
        namespace: "static",
    });
}

/**
 * Returns a single reputation faction by ID.
 *
 * @param reputationFactionId - The unique identifier for the reputation faction.
 * @returns A promise that resolves to an object representing details about a reputation faction.
 */
export async function reputationFaction(reputationFactionId: string): Promise<ReputationFaction> {
    return await request({
        method: "GET",
        url: `/data/wow/reputation-faction/${reputationFactionId}`,
        namespace: "static",
    });
}

/**
 * Returns an index of reputation tiers.
 *
 * @returns A promise that resolves to an object representing a list of reputation tiers.
 */
export async function reputationTiers(): Promise<ReputationTiers> {
    return await request({
        method: "GET",
        url: "/data/wow/reputation-tiers/index",
        namespace: "static",
    });
}

/**
 * Returns a single set of reputation tiers by ID.
 *
 * @param reputationTiersId - The unique identifier for the reputation tier.
 * @returns A promise that resolves to an object representing details about a reputation tier.
 */
export async function reputationTier(reputationTiersId: string): Promise<ReputationTier> {
    return await request({
        method: "GET",
        url: `/data/wow/reputation-tiers/${reputationTiersId}`,
        namespace: "static",
    });
}
