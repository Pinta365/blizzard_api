/**
 * This module provides the WoW Account Profile API. These endpoints require a user access token with the
 * `wow.profile` scope, acquired via the authorization code flow: use `client.forUser(token).wow.*`.
 */

import type { ApiContext } from "../../shared/index.ts";
import type { Href, KeyNameId, LinkSelfHref, TypeName } from "../../shared/index.ts";
import type { DecorItem, Heirloom, Pet, Toy } from "./character_collections.ts";

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

export interface AccountProfileSummary extends LinkSelfHref {
    id: number;
    wow_accounts: {
        id: number;
        characters: AccountCharacter[];
    }[];
    collections: Href;
}

export interface ProtectedCharacterProfile extends LinkSelfHref {
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
}

export interface AccountCollectionsIndex extends LinkSelfHref {
    pets: Href;
    mounts: Href;
    heirlooms: Href;
    toys: Href;
    transmogs: Href;
    decor?: Href;
}

export interface AccountMount {
    mount: KeyNameId;
    is_favorite?: boolean;
    is_useable?: boolean;
}

export interface AccountMountsCollection extends LinkSelfHref {
    mounts: AccountMount[];
}

export interface AccountPetsCollection extends LinkSelfHref {
    pets: Pet[];
    unlocked_battle_pet_slots: number;
}

export interface AccountToysCollection extends LinkSelfHref {
    toys: Toy[];
}

export interface AccountHeirloomsCollection extends LinkSelfHref {
    heirlooms: Heirloom[];
}

export interface AccountTransmogsCollection extends LinkSelfHref {
    appearance_sets: KeyNameId[];
    slots: {
        slot: TypeName;
        appearances: { key: Href; id: number }[];
    }[];
}

export interface AccountDecorCollection extends LinkSelfHref {
    decors: DecorItem[];
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
