import type { ApiContext } from "../../shared/index.ts";
import type { LocalizedString } from "../../shared/index.ts";

export interface MetadataSet {
    id: number;
    name: LocalizedString;
    slug: string;
    hyped: boolean;
    type: string;
    collectibleCount: number;
    collectibleRevealedCount: number;
    nonCollectibleCount: number;
    nonCollectibleRevealedCount: number;
    aliasSetIds?: number[];
}

export interface MetadataSetGroup {
    slug: string;
    year?: number;
    svg?: string;
    cardSets: string[];
    name: LocalizedString;
    standard?: boolean;
    yearRange?: string;
    icon?: string;
}

export interface MetadataType {
    slug: string;
    id: number;
    name: LocalizedString;
    gameModes: number[];
}

export interface MetadataRarity {
    slug: string;
    id: number;
    craftingCost: number[];
    dustValue: number[];
    name: LocalizedString;
}

export interface MetadataClass {
    slug: string;
    id: number;
    name: LocalizedString;
    cardId?: number;
    heroPowerCardId?: number;
    alternateHeroCardIds?: number[];
}

export interface MetadataMinionType {
    slug: string;
    id: number;
    name: LocalizedString;
    gameModes: number[];
}

export interface MetadataKeyword {
    id: number;
    slug: string;
    name: LocalizedString;
    refText: LocalizedString;
    text: LocalizedString;
    gameModes: number[];
}

/**
 * The response of metadata(type) for each metadata type.
 */
export interface MetadataByType {
    sets: MetadataSet[];
    setGroups: MetadataSetGroup[];
    types: MetadataType[];
    rarities: MetadataRarity[];
    classes: MetadataClass[];
    minionTypes: MetadataMinionType[];
    keywords: MetadataKeyword[];
}

/**
 * Any metadata response.
 */
export type Metadata = MetadataByType[keyof MetadataByType];

export type MetaTypes = keyof MetadataByType;

/**
 * Returns information about the categorization of cards. Metadata includes the card set, set group (for example, Standard or Year of the Dragon), rarity, class, card type, minion type, and keywords.
 *
 * @returns A promise that resolves to an object representing the Metadata.
 */
export async function metadata<T extends MetaTypes>(ctx: ApiContext, type: T): Promise<MetadataByType[T]> {
    return await ctx.request({
        method: "GET",
        url: `/hearthstone/metadata/${type}`,
    }) as MetadataByType[T];
}
