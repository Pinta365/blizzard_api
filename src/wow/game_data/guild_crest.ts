import { request } from "../../shared/index.ts";
import type { Asset, KeyId, LinkSelfHref } from "../../shared/index.ts";

export interface Emblem {
    id: number;
    media: KeyId[];
}

export interface Border {
    id: number;
    media: KeyId[];
}

export interface IdRgba {
    id: number;
    rgba: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
}

export interface GuildCrests extends LinkSelfHref {
    emblems: Emblem[];
    borders: Border[];
    colors: {
        emblems: IdRgba[];
        borders: IdRgba[];
        backgrounds: IdRgba[];
    };
}

export interface GuildCrestBorder extends LinkSelfHref {
    assets: Asset[];
    id: number;
}

export interface GuildCrestEmblem extends LinkSelfHref {
    assets: Asset[];
    id: number;
}

/**
 * Returns the Guild Crest Components Index
 *
 * @returns A promise that resolves to an object representing a list of all Guild Crest Components.
 */
export async function guildCrests(): Promise<GuildCrests> {
    return await request({
        method: "GET",
        url: "/data/wow/guild-crest/index",
        namespace: "static",
    }) as GuildCrests;
}

/**
 * Returns a Guild Crest Border Media
 *
 * @param borderId - The unique identifier for the Covenant
 * @returns A promise that resolves to an object representing details about a Guild Crest Border Media.
 */
export async function guildCrestBorder(borderId: number): Promise<GuildCrestBorder> {
    return await request({
        method: "GET",
        url: `/data/wow/media/guild-crest/border/${borderId}`,
        namespace: "static",
    }) as GuildCrestBorder;
}

/**
 * Returns a Crest Emblem Media
 *
 * @param emblemId - The unique identifier for the Crest Emblem Media
 * @returns A promise that resolves to an object representing details about a Crest Emblem Media.
 */
export async function guildCrestEmblem(emblemId: number): Promise<GuildCrestEmblem> {
    return await request({
        method: "GET",
        url: `/data/wow/media/guild-crest/emblem/${emblemId}`,
        namespace: "static",
    }) as GuildCrestEmblem;
}
