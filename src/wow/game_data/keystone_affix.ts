import { request } from "../../shared/index.ts";
import type { Asset, KeyId, KeyNameId, LinkSelfHref, LocalizedString } from "../../shared/index.ts";

export interface KeystoneAffixes extends LinkSelfHref {
    affixes: KeyNameId[];
}

export interface KeystoneAffix extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    description: LocalizedString;
    media: KeyId;
}

export interface KeystoneAffixMedia extends LinkSelfHref {
    assets: Asset[];
    id: number;
}

/**
 * Returns an index of mythic keystone affixes.
 *
 * @returns A promise that resolves to an object representing a list of the mythic keystone affixes.
 */
export async function keystoneAffixes(): Promise<KeystoneAffixes> {
    return await request({
        method: "GET",
        url: "/data/wow/keystone-affix/index",
        namespace: "static",
    }) as KeystoneAffixes;
}

/**
 * Returns a mythic keystone affix by ID.
 *
 * @param keystoneAffixId - The unique identifier for the mythic keystone affix
 * @returns A promise that resolves to an object representing details about a mythic keystone affix by ID.
 */
export async function keystoneAffix(keystoneAffixId: number): Promise<KeystoneAffix> {
    return await request({
        method: "GET",
        url: `/data/wow/keystone-affix/${keystoneAffixId}`,
        namespace: "static",
    }) as KeystoneAffix;
}

/**
 * Returns media for a mythic keystone affix by ID.
 *
 * @param keystoneAffixId - The unique identifier for the mythic keystone affix
 * @returns A promise that resolves to an object representing media details about a mythic keystone affix.
 */
export async function keystoneAffixMedia(keystoneAffixId: number): Promise<KeystoneAffixMedia> {
    return await request({
        method: "GET",
        url: `/data/wow/media/keystone-affix/${keystoneAffixId}`,
        namespace: "static",
    }) as KeystoneAffixMedia;
}
