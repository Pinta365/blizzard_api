import { request } from "../../shared/index.ts";
import type { Asset, KeyNameId, LinkSelfHref, LocalizedString, NameId, TypeName } from "../../shared/index.ts";

export interface Covenants extends LinkSelfHref {
    covenants: KeyNameId[];
}

export interface SpellTooltip {
    spell: KeyNameId;
    description: LocalizedString;
    cast_time: string;
    power_cost: number | null;
    range: string;
    cooldown: string;
}

export interface SignatureAbility {
    id: number;
    spell_tooltip: SpellTooltip;
}

export interface ClassAbility {
    id: number;
    playable_class: KeyNameId;
    spell_tooltip: SpellTooltip;
}

export interface Covenant extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    description: LocalizedString;
    signature_ability: SignatureAbility;
    class_abilities: ClassAbility[];
}

export interface CovenantMedia extends LinkSelfHref {
    assets: Asset[];
}

export interface CovenantSoulbinds extends LinkSelfHref {
    soulbinds: KeyNameId;
}

export interface CovenantSoulbind extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    covenant: KeyNameId;
    creature: KeyNameId;
    follower: NameId;
    talent_tree: KeyNameId;
}

export interface CovenantConduits extends LinkSelfHref {
    conduits: KeyNameId;
}

export interface SpellTooltip {
    spell: KeyNameId;
    description: LocalizedString;
    cast_time: string;
}

export interface Rank {
    id: number;
    tier: number;
    spell_tooltip: SpellTooltip;
}

export interface CovenantConduit extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    item: KeyNameId;
    socket_type: TypeName;
    ranks: Rank[];
}

/**
 * Returns an index of Covenants.
 *
 * @returns A promise that resolves to an object representing a list of all Covenants.
 */
export async function covenants(): Promise<Covenants> {
    return await request({
        method: "GET",
        url: "/data/wow/covenant/index",
        namespace: "static",
    });
}

/**
 * Returns details about a Covenant
 *
 * @param covenantId - The unique identifier for the Covenant
 * @returns A promise that resolves to an object representing details about a Covenant.
 */
export async function covenant(covenantId: number): Promise<Covenant> {
    return await request({
        method: "GET",
        url: `/data/wow/covenant/${covenantId}`,
        namespace: "static",
    });
}

/**
 * Returns media details about a Covenant
 *
 * @param covenantId - The unique identifier for the Covenant.
 * @returns A promise that resolves to an object representing media details about a Covenant.
 */
export async function azeriteEssenceMedia(covenantId: number): Promise<CovenantMedia> {
    return await request({
        method: "GET",
        url: `/data/wow/media/covenant/${covenantId}`,
        namespace: "static",
    });
}

/**
 * Returns an index of Covenant Soulbinds.
 *
 * @returns A promise that resolves to an object representing a list of all Covenant Soulbinds.
 */
export async function covenantSoulbinds(): Promise<CovenantSoulbinds> {
    return await request({
        method: "GET",
        url: "/data/wow/covenant/soulbind/index",
        namespace: "static",
    });
}

/**
 * Returns details about a Covenant Soulbind
 *
 * @param soulbindId - The unique identifier for the Covenant Soulbind
 * @returns A promise that resolves to an object representing details about a Covenant Soulbind.
 */
export async function covenantSoulbind(soulbindId: number): Promise<CovenantSoulbind> {
    return await request({
        method: "GET",
        url: `/data/wow/covenant/soulbind/${soulbindId}`,
        namespace: "static",
    });
}

/**
 * Returns an index of Covenant Conduits.
 *
 * @returns A promise that resolves to an object representing a list of all Covenant Conduits.
 */
export async function covenantConduits(): Promise<CovenantConduits> {
    return await request({
        method: "GET",
        url: "/data/wow/covenant/conduit/index",
        namespace: "static",
    });
}

/**
 * Returns details about a Covenant Conduit
 *
 * @param conduitId - The unique identifier for the Covenant Conduit
 * @returns A promise that resolves to an object representing details about a Covenant Conduit.
 */
export async function covenantConduit(conduitId: number): Promise<CovenantConduit> {
    return await request({
        method: "GET",
        url: `/data/wow/covenant/conduit/${conduitId}`,
        namespace: "static",
    });
}
