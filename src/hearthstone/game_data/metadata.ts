import { request } from "../../shared/index.ts";
import type { LocalizedString } from "../../shared/index.ts";

export interface Metadata {
    sets: {
        id: number;
        name: LocalizedString;
        slug: string;
        aliasSetIds?: number[];
        type: string;
        collectibleCount: number;
        collectibleRevealedCount: number;
        nonCollectibleCount: number;
        nonCollectibleRevealedCount: number;
    }[];
    setGroups: {
        slug: string;
        year?: number;
        svg?: string;
        cardSets: string[];
        name: LocalizedString;
        standard?: boolean;
        yearRange?: string;
        icon?: string;
    }[];
    gameModes: {
        slug: string;
        id: number;
        name: LocalizedString;
    }[];
    arenaIds: number[];
    types: {
        slug: string;
        id: number;
        name: LocalizedString;
        gameModes: number[];
    }[];
    rarities: {
        slug: string;
        id: number;
        craftingCost: number[];
        dustValue: number[];
        name: LocalizedString;
    }[];
    classes: {
        slug: string;
        id: number;
        name: LocalizedString;
        cardId?: number;
        heroPowerCardId?: number;
        alternateHeroCardIds?: number[];
    }[];
    minionTypes: {
        slug: string;
        id: number;
        name: LocalizedString;
        gameModes: number[];
    }[];
    spellSchools: {
        slug: string;
        id: number;
        name: LocalizedString;
    }[];
    mercenaryRoles: {
        slug: string;
        id: number;
        name: LocalizedString;
    }[];
    mercenaryFactions: {
        slug: string;
        id: number;
        name: LocalizedString;
    }[];
    keywords: {
        id: number;
        slug: string;
        name: LocalizedString;
        refText: LocalizedString;
        text: LocalizedString;
        gameModes: number[];
    }[];
    filterableFields: string[];
    numericFields: string[];
    cardBackCategories: {
        slug: string;
        id: number;
        name: LocalizedString;
    }[];
}
type MetaTypes = "sets" | "setGroups" | "types" | "rarities" | "classes" | "minionTypes" | "keywords";

/**
 * Returns information about the categorization of cards. Metadata includes the card set, set group (for example, Standard or Year of the Dragon), rarity, class, card type, minion type, and keywords.
 *
 * @returns A promise that resolves to an object representing the Metadata.
 */
export async function metadata(type: MetaTypes): Promise<Partial<Metadata>> {
    return await request({
        method: "GET",
        url: `/hearthstone/metadata/${type}`,
    });
}
