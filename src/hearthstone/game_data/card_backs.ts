import { LocalizedString, request } from "../../shared/index.ts";
import { Search, search, SearchParameters } from "../search.ts";

export interface Cardback {
    id: number;
    sortCategory: number;
    text: LocalizedString;
    name: LocalizedString;
}

/**
 * Returns an up-to-date list of all card backs matching the search criteria.
 *
 * @param SearchParameters - Object containing search parameters.
 * @returns A promise that resolves to an object representing an up-to-date list of all card backs matching the search criteria.
 */
export async function searchCardbacks(searchParameters: SearchParameters): Promise<Search> {
    return await search("/cardback", searchParameters);
}

/**
 * Returns the card back with an ID or slug that matches the one you specify.
 *
 * @param idorslug - The unique identifier for the card back by slug.
 * @returns A promise that resolves to an object representing details about a card back.
 */
export async function fetchCardback(idorslug: string): Promise<Cardback> {
    return await request({
        method: "GET",
        url: `/hearthstone/cardback/${idorslug}`,
    });
}
