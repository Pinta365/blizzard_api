/**
 * This module provides interfaces and API function definitions for fetching World of Warcraft Token prices from the Blizzard API.
 *
 * @author Pinta <https://github.com/Pinta365>
 */

import { request } from "../../shared/index.ts";
import type { LinkSelfHref } from "../../shared/index.ts";

export interface WowToken extends LinkSelfHref {
    last_updated_timestamp: number;
    price: number;
}

/**
 * Fetches and returns last known price and last updated timestamp for a wow token.
 *
 * @returns A promise that resolves to an object representing price and last updated timestamp.
 */
export async function token(): Promise<WowToken> {
    const tokenData = await request({
        method: "GET",
        url: "/data/wow/token/index",
        namespace: "dynamic",
    }) as WowToken;
    return tokenData;
}
