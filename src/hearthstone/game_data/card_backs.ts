import type { ApiContext } from "../../shared/index.ts";
import { search } from "../search.ts";
import type { LocalizedString } from "../../shared/index.ts";
import type { SearchParameters } from "../search.ts";

export interface Cardback {
    id: number;
    sortCategory: number;
    text: LocalizedString;
    name: LocalizedString;
    image: string;
    slug: string;
}

export interface CardbackSearch {
    cardBacks: Cardback[];
    cardCount: number;
    pageCount: number;
    page: number;
}

/**
 * Returns an up-to-date list of all card backs matching the search criteria.
 *
 * @param SearchParameters - Object containing search parameters.
 * @returns A promise that resolves to an object representing an up-to-date list of all card backs matching the search criteria.
 */
export async function searchCardbacks(ctx: ApiContext, searchParameters: SearchParameters): Promise<CardbackSearch> {
    return await search(ctx, "/cardbacks", searchParameters) as unknown as CardbackSearch;
}

/**
 * Returns the card back with an ID or slug that matches the one you specify.
 *
 * @param idorslug - The unique identifier for the card back by slug.
 * @returns A promise that resolves to an object representing details about a card back.
 */
export async function fetchCardback(ctx: ApiContext, idorslug: string): Promise<Cardback> {
    return await ctx.request({
        method: "GET",
        url: `/hearthstone/cardbacks/${idorslug}`,
    }) as Cardback;
}
