import { request } from "../../shared/index.ts";
import type { Character, KeyId, KeyNameId, LinkSelfHref, TypeName } from "../../shared/index.ts";

export interface Href {
    href: string;
}

export interface CharacterCollectionTypes extends LinkSelfHref {
    pets: Href;
    mounts: Href;
    heirlooms: Href;
    toys: Href;
    character: Character;
}

export interface Mount {
    mounts: KeyNameId;
    is_character_specific?: boolean;
    is_useable: boolean;
}
export interface CharacterCollectionMounts extends LinkSelfHref {
    mounts: Mount[];
}

export interface Pet {
    species: KeyNameId;
    level: number;
    quality: TypeName;
    stats: {
        breed_id: number;
        health: number;
        power: number;
        speed: number;
    };
    creature_display: KeyId;
    id: number;
}

export interface CharacterCollectionPets extends LinkSelfHref {
    pets: Pet[];
    unlocked_battle_pet_slots: number;
}

export interface Toy {
    toy: KeyNameId;
    is_favorite?: boolean;
}

export interface CharacterCollectionToys extends LinkSelfHref {
    toys: Toy[];
}

export interface Heirloom {
    heirloom: KeyNameId;
    upgrade: {
        level: number;
    };
}

export interface CharacterCollectionHeirlooms extends LinkSelfHref {
    heirlooms: Heirloom[];
}

/**
 * Returns an index of collection types for a character.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing details about collection types for a character.
 */
export async function characterCollectionTypes(
    realmSlug: string,
    characterName: string,
): Promise<CharacterCollectionTypes> {
    return await request({
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
    realmSlug: string,
    characterName: string,
): Promise<CharacterCollectionMounts> {
    return await request({
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
    realmSlug: string,
    characterName: string,
): Promise<CharacterCollectionPets> {
    return await request({
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
    realmSlug: string,
    characterName: string,
): Promise<CharacterCollectionToys> {
    return await request({
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
    realmSlug: string,
    characterName: string,
): Promise<CharacterCollectionHeirlooms> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/collections/heirlooms`,
        namespace: "profile",
    }) as CharacterCollectionHeirlooms;
}
