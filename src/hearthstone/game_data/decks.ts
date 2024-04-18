import { LocalizedString, request } from "../../shared/index.ts";

export interface Options {
    code?: string;
    ids?: string;
    hero?: string;
}

export interface Deck {
    deckCode: string;
    version: number;
    format: string;
    hero: {
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
        manaCost: number;
        name: LocalizedString;
        text: LocalizedString;
        image: string;
        imageGold: string;
        flavorText: LocalizedString;
        cropImage: string;
        childIds: number[];
    };
    heroPower: {
        id: number;
        collectible: number;
        slug: string;
        classId: number;
        multiClassIds: number[];
        cardTypeId: number;
        cardSetId: number;
        rarityId: number;
        artistName: null;
        manaCost: number;
        name: LocalizedString;
        text: LocalizedString;
        image: string;
        imageGold: string;
        flavorText: LocalizedString;
        cropImage: string;
        parentId: number;
    };
    class: {
        slug: string;
        id: number;
        name: LocalizedString;
    };
    cards: {
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
        copyOfCardId: number;
        duels: {
            relevant: boolean;
            constructed: boolean;
        };
    }[];
    cardCount: number;
}

/**
 * Returns the card with an ID or slug that matches the one you specify.
 *
 * @param options - find parameters fort the search.
 * @returns A promise that resolves to an object representing details about a card.
 */
export async function fetchDeck(options?: Options): Promise<Deck> {
    return await request({
        method: "GET",
        url: `/hearthstone/deck`,
        qs: options as Record<string, string | number>,
    });
}
