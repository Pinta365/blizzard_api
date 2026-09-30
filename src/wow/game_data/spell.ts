import type { ApiContext } from "../../shared/index.ts";
import { search } from "../search.ts";
import type { Asset, KeyId, LinkSelfHref, LocalizedString } from "../../shared/index.ts";
import type { Search, SearchParameters } from "../search.ts";

export interface Spell extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    description: LocalizedString;
    media: KeyId;
}

export interface SpellMedia extends LinkSelfHref {
    assets: Asset[];
    id: number;
}

/**
 * Returns a spell by ID.
 *
 * @param spellId - The unique identifier for the spell.
 * @returns A promise that resolves to an object representing details about a spell.
 */
export async function spell(ctx: ApiContext, spellId: number): Promise<Spell> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/spell/${spellId}`,
        namespace: "static",
    }) as Spell;
}

/**
 * Returns media for a spell by ID.
 *
 * @param spellId - The unique identifier for the spell.
 * @returns A promise that resolves to an object representing details about a spell.
 */
export async function spellMedia(ctx: ApiContext, spellId: number): Promise<SpellMedia> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/media/spell/${spellId}`,
        namespace: "static",
    }) as SpellMedia;
}

/**
 * Performs a search of spells.
 *
 * @param SearchParameters - Object containing search parameters.
 * @returns A promise that resolves to an object representing details about a spell search.
 */
export async function searchSpell(ctx: ApiContext, searchParameters: SearchParameters): Promise<Search> {
    return await search(ctx, "/spell", "static", searchParameters) as Search;
}
