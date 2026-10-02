import type {
    ApiContext,
    Character,
    Href,
    KeyId,
    KeyNameId,
    LinkSelfHref,
    NamedRef,
    TypeName,
} from "../../shared/index.ts";

export interface CharacterCollectionTypes extends LinkSelfHref {
    pets: Href;
    mounts: Href;
    heirlooms: Href;
    toys: Href;
    character: Character;
    transmogs: Href;
    decors?: Href;
}

export interface CollectedMount {
    mount: KeyNameId;
    is_character_specific?: boolean;
    is_useable: boolean;
    is_favorite?: boolean;
}
export interface CharacterCollectionMounts extends LinkSelfHref {
    mounts: CollectedMount[];
}

export interface CollectedPet {
    species: KeyNameId;
    level: number;
    quality: TypeName;
    stats: {
        breed_id: number;
        health: number;
        power: number;
        speed: number;
    };
    creature_display?: KeyId;
    id: number;
    is_active?: boolean;
    active_slot?: number;
    is_favorite?: boolean;
    /** The custom name, if the player renamed the pet. */
    name?: string;
}

export interface CharacterCollectionPets extends LinkSelfHref {
    pets: CollectedPet[];
    unlocked_battle_pet_slots: number;
}

export interface CollectedToy {
    toy: KeyNameId;
    is_favorite?: boolean;
}

export interface CharacterCollectionToys extends LinkSelfHref {
    toys: CollectedToy[];
}

export interface CollectedHeirloom {
    heirloom: KeyNameId;
    upgrade: {
        level: number;
    };
}

export interface CharacterCollectionHeirlooms extends LinkSelfHref {
    heirlooms: CollectedHeirloom[];
}

export interface DecorItem {
    decor: NamedRef;
    /** How many of this decor are owned. */
    quantity: number;
}

export interface CharacterCollectionDecor extends LinkSelfHref {
    decor_collected: DecorItem[];
}

export interface TransmogrifiedSlot {
    slot: {
        type: string;
        name: string;
    };
    appearances: KeyId[];
}

export interface CharacterCollectionTransmogs {
    "_links": { self: Href };
    appearance_sets: NamedRef[];
    slots: TransmogrifiedSlot[];
}

/**
 * Returns an index of collection types for a character.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing details about collection types for a character.
 */
export async function characterCollectionTypes(
    ctx: ApiContext,
    realmSlug: string,
    characterName: string,
): Promise<CharacterCollectionTypes> {
    return await ctx.request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/collections`,
        namespace: "profile",
    }) as CharacterCollectionTypes;
}

/**
 * Returns a summary of the mounts a character has obtained.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing details about mounts a character has obtained.
 */
export async function characterCollectionMounts(
    ctx: ApiContext,
    realmSlug: string,
    characterName: string,
): Promise<CharacterCollectionMounts> {
    return await ctx.request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/collections/mounts`,
        namespace: "profile",
    }) as CharacterCollectionMounts;
}

/**
 * Returns a summary of the pets a character has obtained.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing details about pets a character has obtained.
 */
export async function characterCollectionPets(
    ctx: ApiContext,
    realmSlug: string,
    characterName: string,
): Promise<CharacterCollectionPets> {
    return await ctx.request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/collections/pets`,
        namespace: "profile",
    }) as CharacterCollectionPets;
}

/**
 * Returns a summary of the toys a character has obtained.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing details about toys a character has obtained.
 */
export async function characterCollectionToys(
    ctx: ApiContext,
    realmSlug: string,
    characterName: string,
): Promise<CharacterCollectionToys> {
    return await ctx.request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/collections/toys`,
        namespace: "profile",
    }) as CharacterCollectionToys;
}

/**
 * Returns a summary of the heirlooms a character has obtained.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing details about heirlooms a character has obtained.
 */
export async function characterCollectionHeirlooms(
    ctx: ApiContext,
    realmSlug: string,
    characterName: string,
): Promise<CharacterCollectionHeirlooms> {
    return await ctx.request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/collections/heirlooms`,
        namespace: "profile",
    }) as CharacterCollectionHeirlooms;
}

/**
 * Returns a summary of the housing decor collection a character has obtained.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing details about decor a character has collected.
 */
export async function characterCollectionDecor(
    ctx: ApiContext,
    realmSlug: string,
    characterName: string,
): Promise<CharacterCollectionDecor> {
    return await ctx.request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/collections/decor`,
        namespace: "profile",
    }) as CharacterCollectionDecor;
}

/**
 * Returns a summary of the transmog appearances a character has obtained.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing details about transmog appearances a character has collected.
 */
export async function characterCollectionTransmogs(
    ctx: ApiContext,
    realmSlug: string,
    characterName: string,
): Promise<CharacterCollectionTransmogs> {
    return await ctx.request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/collections/transmogs`,
        namespace: "profile",
    }) as CharacterCollectionTransmogs;
}
