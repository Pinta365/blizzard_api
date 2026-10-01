/**
 * This module provides the WoW Account Profile API. These endpoints require a user access token with the
 * `wow.profile` scope, acquired via the authorization code flow: use `client.forUser(token).wow.*`.
 */

import type { ApiContext } from "../../shared/index.ts";
import type { Href, KeyNameId, TypeName } from "../../shared/index.ts";
import type { CollectedHeirloom, CollectedPet, CollectedToy, DecorItem } from "./character_collections.ts";

/**
 * The links at the top of account profile responses.
 */
export interface AccountLinks {
    _links: {
        self: Href;
        user: Href;
        profile: Href;
    };
}

export interface AccountCharacter {
    character: Href;
    protected_character: Href;
    name: string;
    id: number;
    realm: KeyNameId & { slug: string };
    playable_class: KeyNameId;
    playable_race: KeyNameId;
    gender: TypeName;
    faction: TypeName;
    level: number;
}

export interface AccountProfileSummary extends AccountLinks {
    id: number;
    wow_accounts: {
        id: number;
        characters: AccountCharacter[];
    }[];
    collections: Href;
    /** Links to the account's houses (character house endpoints). Absent when the account has no house. */
    houses?: Href[];
}

export interface ProtectedCharacterProfile extends AccountLinks {
    id: number;
    name: string;
    money: number;
    character: {
        key: Href;
        name: string;
        id: number;
        realm: KeyNameId & { slug: string };
    };
    protected_stats: {
        total_number_deaths: number;
        total_gold_gained: number;
        total_gold_lost: number;
        total_item_value_gained: number;
        level_number_deaths: number;
        level_gold_gained: number;
        level_gold_lost: number;
        level_item_value_gained: number;
    };
    position: {
        zone: { name: string; id: number };
        map: { name: string; id: number };
        x: number;
        y: number;
        z: number;
        facing: number;
    };
    bind_position: {
        zone: { name: string; id: number };
        map: { name: string; id: number };
        x: number;
        y: number;
        z: number;
        facing: number;
    };
    wow_account: number;
    /** Links to this character's houses. Absent when the character has no house. */
    houses?: Href[];
}

export interface AccountCollectionsIndex extends AccountLinks {
    pets: Href;
    mounts: Href;
    heirlooms: Href;
    toys: Href;
    transmogs: Href;
    decors?: Href;
}

export interface AccountMount {
    mount: KeyNameId;
    is_favorite?: boolean;
    is_useable?: boolean;
}

export interface AccountMountsCollection extends AccountLinks {
    mounts: AccountMount[];
}

export interface AccountPetsCollection extends AccountLinks {
    pets: CollectedPet[];
    unlocked_battle_pet_slots: number;
}

export interface AccountToysCollection extends AccountLinks {
    toys: CollectedToy[];
}

export interface AccountHeirloomsCollection extends AccountLinks {
    heirlooms: CollectedHeirloom[];
}

export interface AccountTransmogsCollection extends AccountLinks {
    appearance_sets: KeyNameId[];
    slots: {
        slot: TypeName;
        appearances: { key: Href; id: number }[];
    }[];
}

export interface AccountDecorCollection extends AccountLinks {
    decor_collected: DecorItem[];
}

/**
 * Returns a profile summary for an account, including its WoW accounts and characters.
 * Requires a user access token (client.forUser(token)).
 *
 * @returns A promise that resolves to an object representing the account profile summary.
 */
export async function accountProfileSummary(ctx: ApiContext): Promise<AccountProfileSummary> {
    return await ctx.request({
        method: "GET",
        url: "/profile/user/wow",
        namespace: "profile",
        auth: "user",
    }) as AccountProfileSummary;
}

/**
 * Returns a protected profile summary for a character (money, deaths, position, ...).
 * Requires a user access token (client.forUser(token)).
 *
 * @param realmId - The ID of the character's realm.
 * @param characterId - The ID of the character.
 * @returns A promise that resolves to an object representing the protected character profile.
 */
export async function protectedCharacterProfile(
    ctx: ApiContext,
    realmId: number,
    characterId: number,
): Promise<ProtectedCharacterProfile> {
    return await ctx.request({
        method: "GET",
        url: `/profile/user/wow/protected-character/${realmId}-${characterId}`,
        namespace: "profile",
        auth: "user",
    }) as ProtectedCharacterProfile;
}

/**
 * Returns an index of collection types for an account.
 * Requires a user access token (client.forUser(token)).
 *
 * @returns A promise that resolves to an object with links to the account's collections.
 */
export async function accountCollectionsIndex(ctx: ApiContext): Promise<AccountCollectionsIndex> {
    return await ctx.request({
        method: "GET",
        url: "/profile/user/wow/collections",
        namespace: "profile",
        auth: "user",
    }) as AccountCollectionsIndex;
}

/**
 * Returns the mounts collected by an account.
 * Requires a user access token (client.forUser(token)).
 *
 * @returns A promise that resolves to an object representing the account's mounts.
 */
export async function accountMountsCollection(ctx: ApiContext): Promise<AccountMountsCollection> {
    return await ctx.request({
        method: "GET",
        url: "/profile/user/wow/collections/mounts",
        namespace: "profile",
        auth: "user",
    }) as AccountMountsCollection;
}

/**
 * Returns the battle pets collected by an account.
 * Requires a user access token (client.forUser(token)).
 *
 * @returns A promise that resolves to an object representing the account's pets.
 */
export async function accountPetsCollection(ctx: ApiContext): Promise<AccountPetsCollection> {
    return await ctx.request({
        method: "GET",
        url: "/profile/user/wow/collections/pets",
        namespace: "profile",
        auth: "user",
    }) as AccountPetsCollection;
}

/**
 * Returns the toys collected by an account.
 * Requires a user access token (client.forUser(token)).
 *
 * @returns A promise that resolves to an object representing the account's toys.
 */
export async function accountToysCollection(ctx: ApiContext): Promise<AccountToysCollection> {
    return await ctx.request({
        method: "GET",
        url: "/profile/user/wow/collections/toys",
        namespace: "profile",
        auth: "user",
    }) as AccountToysCollection;
}

/**
 * Returns the heirlooms collected by an account.
 * Requires a user access token (client.forUser(token)).
 *
 * @returns A promise that resolves to an object representing the account's heirlooms.
 */
export async function accountHeirloomsCollection(ctx: ApiContext): Promise<AccountHeirloomsCollection> {
    return await ctx.request({
        method: "GET",
        url: "/profile/user/wow/collections/heirlooms",
        namespace: "profile",
        auth: "user",
    }) as AccountHeirloomsCollection;
}

/**
 * Returns the transmog appearances and sets collected by an account.
 * Requires a user access token (client.forUser(token)).
 *
 * @returns A promise that resolves to an object representing the account's transmogs.
 */
export async function accountTransmogsCollection(ctx: ApiContext): Promise<AccountTransmogsCollection> {
    return await ctx.request({
        method: "GET",
        url: "/profile/user/wow/collections/transmogs",
        namespace: "profile",
        auth: "user",
    }) as AccountTransmogsCollection;
}

/**
 * Returns the housing decor collected by an account.
 *
 * Note: as of 2026-10-01 this returns 404 even for accounts with decor, although the collections index links to it.
 * characterCollectionDecor works.
 * Requires a user access token (client.forUser(token)).
 *
 * @returns A promise that resolves to an object representing the account's decor.
 */
export async function accountDecorCollection(ctx: ApiContext): Promise<AccountDecorCollection> {
    return await ctx.request({
        method: "GET",
        url: "/profile/user/wow/collections/decor",
        namespace: "profile",
        auth: "user",
    }) as AccountDecorCollection;
}
