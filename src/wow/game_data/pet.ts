import { request } from "../../shared/index.ts";
import type { Asset, KeyId, KeyNameId, LinkSelfHref, LocalizedString, TypeName } from "../../shared/index.ts";

export interface Pets extends LinkSelfHref {
    pets: KeyNameId[];
}

export interface Pet extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    battle_pet_type: {
        id: number;
        type: string;
        name: LocalizedString;
    };
    description: LocalizedString;
    is_capturable: boolean;
    is_tradable: boolean;
    is_battlepet: boolean;
    is_alliance_only: boolean;
    is_horde_only: boolean;
    abilities: {
        ability: KeyNameId;
        slot: number;
        required_level: number;
    }[];
    source: TypeName;
    icon: string;
    creature: KeyNameId;
    is_random_creature_display: boolean;
    media: KeyId;
}

export interface PetMedia extends LinkSelfHref {
    assets: Asset[];
    id: number;
}

export interface PetAbilities extends LinkSelfHref {
    abilities: KeyNameId[];
}

export interface PetAbility extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    battle_pet_type: {
        id: number;
        type: string;
        name: LocalizedString;
    };
    rounds: number;
    media: KeyId;
}

export interface PetAbilityMedia extends LinkSelfHref {
    assets: Asset[];
    id: number;
}

/**
 * Returns an index of battle pets.
 *
 * @returns A promise that resolves to an object representing a list of the index of battle pets.
 */
export async function pets(): Promise<Pets> {
    return await request({
        method: "GET",
        url: "/data/wow/pet/index",
        namespace: "static",
    }) as Pets;
}

/**
 * Returns a battle pet by ID.
 *
 * @param petId - The unique identifier for the battle pet
 * @returns A promise that resolves to an object representing details about a battle pet.
 */
export async function pet(petId: number): Promise<Pet> {
    return await request({
        method: "GET",
        url: `/data/wow/pet/${petId}`,
        namespace: "static",
    }) as Pet;
}

/**
 * Returns media for a battle pet by ID.
 *
 * @param petId - The unique identifier for the battle pet
 * @returns A promise that resolves to an object representing media details about a battle pet.
 */
export async function petMedia(petId: number): Promise<PetMedia> {
    return await request({
        method: "GET",
        url: `/data/wow/media/pet/${petId}`,
        namespace: "static",
    }) as PetMedia;
}

/**
 * Returns an index of pet abilities.
 *
 * @returns A promise that resolves to an object representing a list of the index of pet abilities.
 */
export async function petAbilities(): Promise<PetAbilities> {
    return await request({
        method: "GET",
        url: "/data/wow/pet-ability/index",
        namespace: "static",
    }) as PetAbilities;
}

/**
 * Returns a pet ability by ID.
 *
 * @param petAbilityId - The unique identifier for the battle pet ability
 * @returns A promise that resolves to an object representing details about a battle pet ability.
 */
export async function petAbility(petAbilityId: number): Promise<PetAbility> {
    return await request({
        method: "GET",
        url: `/data/wow/pet-ability/${petAbilityId}`,
        namespace: "static",
    }) as PetAbility;
}

/**
 * Returns media for a battle pet by ID.
 *
 * @param petAbilityId - The unique identifier for the battle pet
 * @returns A promise that resolves to an object representing media details about a battle pet.
 */
export async function petAbilityMedia(petAbilityId: number): Promise<PetAbilityMedia> {
    return await request({
        method: "GET",
        url: `/data/wow/media/pet-ability${petAbilityId}`,
        namespace: "static",
    }) as PetAbilityMedia;
}
