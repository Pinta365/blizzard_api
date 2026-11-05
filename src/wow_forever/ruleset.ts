/**
 * WoW: Forever ruleset endpoints. Forever is realmless: players pick a ruleset (Normal, PvP, Roleplay, Roleplay PvP)
 * instead of a realm, and each ruleset has its own auction house. The ruleset index replaces the realm index.
 * Verified against the live API (EU, US, KR, TW) on 2026-11-05.
 */

import type { ApiContext, Href, KeyId, LinkSelfHref, LocalizedString, TypeName } from "../shared/index.ts";

/** The index of rulesets in a region. */
export interface ForeverRulesets extends LinkSelfHref {
    rulesets: KeyId[];
}

/** A Forever ruleset. */
export interface ForeverRuleset extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    /** The ruleset's auction house. */
    auctions: Href;
    /** The ruleset's status, e.g. `UP`. */
    status: TypeName;
}

/**
 * Returns an index of the rulesets in the region.
 *
 * @returns A promise that resolves to an object representing the ruleset index.
 */
export async function rulesets(ctx: ApiContext): Promise<ForeverRulesets> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/ruleset/index",
        namespace: "dynamic",
    }) as ForeverRulesets;
}

/**
 * Returns a ruleset by ID.
 *
 * @param rulesetId - The ID of the ruleset.
 * @returns A promise that resolves to an object representing the ruleset.
 */
export async function ruleset(ctx: ApiContext, rulesetId: number): Promise<ForeverRuleset> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/ruleset/${rulesetId}`,
        namespace: "dynamic",
    }) as ForeverRuleset;
}
