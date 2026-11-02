/**
 * WoW: Forever versions of the Retail account profile endpoints whose Forever responses differ from Retail.
 * Each one makes the same request as the Retail endpoint, but returns a Forever type.
 * Verified against the live API (EU) on 2026-11-02, before launch.
 */

import type { ApiContext } from "../shared/index.ts";
import {
    accountProfileSummary as retailAccountProfileSummary,
    accountTransmogsCollection as retailAccountTransmogsCollection,
} from "../wow/profile/account_profile.ts";
import type {
    AccountCharacter,
    AccountProfileSummary,
    AccountTransmogsCollection,
} from "../wow/profile/account_profile.ts";

/**
 * A Forever character in the account profile. Forever is realmless: characters have a two-part name (`name` and
 * `surname`, unique per region) and no realm. The `character` link is realmless too
 * (`/profile/wow/character/{name}-{surname}`). The hidden realm is the first part of the `protected_character` id.
 */
export interface ForeverAccountCharacter extends Omit<AccountCharacter, "realm"> {
    /** The second part of the character's name. */
    surname: string;
}

/** Account profile summary as returned for Forever. */
export interface ForeverAccountProfileSummary extends Omit<AccountProfileSummary, "wow_accounts" | "houses"> {
    wow_accounts: {
        id: number;
        characters: ForeverAccountCharacter[];
    }[];
}

/** Account transmog collection as returned for Forever. */
export interface ForeverAccountTransmogsCollection extends Omit<AccountTransmogsCollection, "appearance_sets"> {
    /** Absent when the account has collected no appearance sets. */
    appearance_sets?: AccountTransmogsCollection["appearance_sets"];
}

/**
 * Returns a profile summary for an account, including its WoW accounts and Forever characters.
 * Requires a user access token (client.forUser(token)).
 *
 * @returns A promise that resolves to an object representing the account profile summary.
 */
export async function accountProfileSummary(ctx: ApiContext): Promise<ForeverAccountProfileSummary> {
    return await retailAccountProfileSummary(ctx) as unknown as ForeverAccountProfileSummary;
}

/**
 * Returns the transmog appearances and sets collected by an account.
 * Requires a user access token (client.forUser(token)).
 *
 * @returns A promise that resolves to an object representing the account's transmogs.
 */
export async function accountTransmogsCollection(ctx: ApiContext): Promise<ForeverAccountTransmogsCollection> {
    return await retailAccountTransmogsCollection(ctx);
}
