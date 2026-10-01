import type { ApiContext } from "../../shared/index.ts";
import { search } from "../search.ts";
import type { LocalizedString, RequestOptions } from "../../shared/index.ts";
import type { SearchParameters } from "../search.ts";

export interface Card {
    id: number;
    collectible: number;
    slug: string;
    classId: number;
    multiClassIds: number[];
    cardTypeId: number;
    cardSetId: number;
    rarityId: number;
    artistName: string | null;
    health?: number;
    attack?: number;
    manaCost: number;
    name: LocalizedString;
    text: LocalizedString;
    image: string;
    imageGold: string;
    flavorText: LocalizedString;
    cropImage: string;
    keywordIds?: number[];
    childIds?: number[];
    parentId?: number;
    copyOfCardId?: number[];
    spellSchoolId?: number;
    minionTypeId?: number;
    isZilliaxCosmeticModule?: boolean;
    isZilliaxFunctionalModule?: boolean;
    duels?: {
        relevant: boolean;
        constructed: boolean;
    };
}

export interface CardSearch {
    cards: Card[];
    cardCount: number;
    pageCount: number;
    page: number;
}

/**
 * Returns an up-to-date list of all cards matching the search criteria.
 *
 * @param SearchParameters - Object containing search parameters.
 * @returns A promise that resolves to an object representing an up-to-date list of all cards matching the search criteria.
 */
export async function searchCards(ctx: ApiContext, searchParameters: SearchParameters): Promise<CardSearch> {
    return await search(ctx, "/cards", searchParameters) as unknown as CardSearch;
}

/**
 * Returns the card with an ID or slug that matches the one you specify.
 *
 * @param idorslug - The unique identifier for the card by slug.
 * @returns A promise that resolves to an object representing details about a card.
 */
export async function fetchCard(ctx: ApiContext, idorslug: string, gameMode?: string): Promise<Card> {
    const reqOptions: RequestOptions = {
        method: "GET",
        url: `/hearthstone/cards/${idorslug}`,
    };

    if (gameMode) {
        reqOptions["qs"] = { gameMode };
    }

    return await ctx.request(reqOptions) as Card;
}
