import type { ApiContext } from "../../shared/index.ts";
import type { LocalizedString } from "../../shared/index.ts";
import type { Card } from "./cards.ts";

export interface Options {
    code?: string;
    ids?: string;
    hero?: string;
}

export interface Deck {
    deckCode: string;
    version: number;
    format: string;
    hero: Card;
    heroPower: Card;
    class: {
        slug: string;
        id: number;
        name: LocalizedString;
    };
    cards: Card[];
    cardCount: number;
}

/**
 * Returns the card with an ID or slug that matches the one you specify.
 *
 * @param options - find parameters fort the search.
 * @returns A promise that resolves to an object representing details about a card.
 */
export async function fetchDeck(ctx: ApiContext, options?: Options): Promise<Deck> {
    return await ctx.request({
        method: "GET",
        url: `/hearthstone/deck`,
        qs: options as Record<string, string | number>,
    }) as Deck;
}
