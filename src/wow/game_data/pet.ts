import { KeyId, KeyNameId, LinkSelfHref, LocalizedString, request, TypeName } from "../../shared/index.ts";

interface Pets extends LinkSelfHref {
    pets: KeyNameId[];
}

interface Pet extends LinkSelfHref {
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

interface Asset {
    key: string;
    value: string;
    file_data_id: number;
}
interface PetMedia extends LinkSelfHref {
    assets: Asset[];
    id: number;
}

interface PetAbilities extends LinkSelfHref {
    abilities: KeyNameId[];
}

interface PetAbility extends LinkSelfHref {
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

interface PetAbilityMedia extends LinkSelfHref {
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
    });
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
    });
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
    });
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
    });
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
    });
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
    });
}
