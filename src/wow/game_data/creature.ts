import { KeyId, KeyNameId, LinkSelfHref, LocalizedString, request } from "../../shared/index.ts";
import { Search, search, SearchParameters } from "../search.ts";

export interface CreatureFamilies extends LinkSelfHref {
    creature_families: KeyNameId[];
}

export interface CreatureFamily extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    specialization: KeyNameId;
    media: KeyId;
}

export interface CreatureTypes extends LinkSelfHref {
    creature_types: KeyNameId[];
}

export interface CreatureType extends LinkSelfHref {
    id: number;
    name: LocalizedString;
}

export interface Creature extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    type: KeyNameId;
    family: KeyNameId;
    creature_displays: KeyId[];
    is_tameable: boolean;
}

export interface CreatureDisplayAssets {
    key: string;
    value: string;
}

export interface CreatureDisplayMedia extends LinkSelfHref {
    assets: CreatureDisplayAssets[];
    id: number;
}

export interface CreatureFamilyAssets {
    key: string;
    value: string;
    file_data_id: number;
}

export interface CreatureFamilyMedia extends LinkSelfHref {
    assets: CreatureFamilyAssets[];
    id: number;
}

/**
 * Returns an index of creature families.
 *
 * @returns A promise that resolves to an object representing a list of all creature families.
 */
export async function creatureFamilies(): Promise<CreatureFamilies> {
    return await request({
        method: "GET",
        url: "/data/wow/creature-family/index",
        namespace: "static",
    });
}

/**
 * Returns details about a creature family
 *
 * @param creatureFamilyId - The unique identifier for the creature family
 * @returns A promise that resolves to an object representing details about a creature family.
 */
export async function creatureFamily(creatureFamilyId: number): Promise<CreatureFamily> {
    return await request({
        method: "GET",
        url: `/data/wow/creature-family/${creatureFamilyId}`,
        namespace: "static",
    });
}

/**
 * Returns an index of creature types.
 *
 * @returns A promise that resolves to an object representing a list of all creature types.
 */
export async function creatureTypes(): Promise<CreatureTypes> {
    return await request({
        method: "GET",
        url: "/data/wow/creature-type/index",
        namespace: "static",
    });
}

/**
 * Returns details about a creature types
 *
 * @param creatureTypeId - The unique identifier for the creature types
 * @returns A promise that resolves to an object representing details about a creature types.
 */
export async function creatureType(creatureTypeId: number): Promise<CreatureType> {
    return await request({
        method: "GET",
        url: `/data/wow/creature-type/${creatureTypeId}`,
        namespace: "static",
    });
}

/**
 * Returns details about a creature
 *
 * @param creatureId - The unique identifier for the creature
 * @returns A promise that resolves to an object representing details about a creature.
 */
export async function creature(creatureId: number): Promise<Creature> {
    return await request({
        method: "GET",
        url: `/data/wow/creature/${creatureId}`,
        namespace: "static",
    });
}

/**
 * Performs a search of creatures.
 *
 * @param SearchParameters - Object containing search parameters.
 * @returns A promise that resolves to an object representing details about a creature search.
 */
export async function searchCreature(searchParameters: SearchParameters): Promise<Search> {
    return await search("/creature", "static", searchParameters);
}

/**
 * Returns media details about a specific Creature display
 *
 * @param creatureDisplayId - The unique identifier Creature display Id.
 * @returns A promise that resolves to an object representing media details about a Creature display.
 */
export async function creatureDisplayMedia(creatureDisplayId: number): Promise<CreatureDisplayMedia> {
    return await request({
        method: "GET",
        url: `/data/wow/media/creature-display/${creatureDisplayId}`,
        namespace: "static",
    });
}

/**
 * Returns media details about a specific Creature family
 *
 * @param creatureFamilyId - The unique identifier Creature family Id.
 * @returns A promise that resolves to an object representing media details about a Creature family.
 */
export async function creatureFamilyMedia(creatureFamilyId: number): Promise<CreatureFamilyMedia> {
    return await request({
        method: "GET",
        url: `/data/wow/media/creature-family/${creatureFamilyId}`,
        namespace: "static",
    });
}
