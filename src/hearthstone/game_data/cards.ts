import { LocalizedString, request, RequestOptions } from "../../shared/index.ts";
import { Search, search, SearchParameters } from "../search.ts";

interface Card {
    id: number;
    collectible: number;
    slug: string;
    classId: number;
    multiClassIds: number[];
    cardTypeId: number;
    cardSetId: number;
    rarityId: number;
    artistName: string;
    health: number;
    attack: number;
    manaCost: number;
    name: LocalizedString;
    text: LocalizedString;
    image: string;
    imageGold: string;
    flavorText: LocalizedString;
    cropImage: string;
    keywordIds: number[];
}

/**
 * Returns an up-to-date list of all cards matching the search criteria.
 *
 * @param SearchParameters - Object containing search parameters.
 * @returns A promise that resolves to an object representing an up-to-date list of all cards matching the search criteria.
 */
export async function searchCards(searchParameters: SearchParameters): Promise<Search> {
    return await search("/cards", searchParameters);
}

/**
 * Returns the card with an ID or slug that matches the one you specify.
 *
 * @param idorslug - The unique identifier for the card by slug.
 * @returns A promise that resolves to an object representing details about a card.
 */
export async function fetchCard(idorslug: string, gameMode?: string): Promise<Card> {
    const reqOptions: RequestOptions = {
        method: "GET",
        url: `/hearthstone/cards/${idorslug}`,
    };

    if (gameMode) {
        reqOptions["qs"] = { gameMode };
    }

    return await request(reqOptions);
}
