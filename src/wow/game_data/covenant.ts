import type { ApiContext } from "../../shared/index.ts";
import type {
    Asset,
    KeyId,
    KeyNameId,
    LinkSelfHref,
    LocalizedString,
    NamedRef,
    NameId,
    TypeName,
} from "../../shared/index.ts";

export interface Covenants extends LinkSelfHref {
    covenants: KeyNameId[];
}

export interface CovenantAbilitySpellTooltip {
    spell: KeyNameId;
    description: LocalizedString;
    cast_time: string;
    power_cost: number | null;
    range: string;
    cooldown: string;
}

export interface SignatureAbility {
    id: number;
    spell_tooltip: CovenantAbilitySpellTooltip;
}

export interface ClassAbility {
    id: number;
    playable_class: KeyNameId;
    spell_tooltip: CovenantAbilitySpellTooltip;
}

export interface Covenant extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    description: LocalizedString;
    signature_ability: SignatureAbility;
    class_abilities: ClassAbility[];
    renown_rewards: {
        level: number;
        reward: NamedRef;
    }[];
    media: KeyId;
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

export interface CovenantConduitSpellTooltip {
    spell: KeyNameId;
    description: LocalizedString;
    cast_time: string;
}

export interface CovenantConduitRank {
    id: number;
    tier: number;
    spell_tooltip: CovenantConduitSpellTooltip;
}

export interface CovenantConduit extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    item: KeyNameId;
    socket_type: TypeName;
    ranks: CovenantConduitRank[];
}

/**
 * Returns an index of Covenants.
 *
 * @returns A promise that resolves to an object representing a list of all Covenants.
 */
export async function covenants(ctx: ApiContext): Promise<Covenants> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/covenant/index",
        namespace: "static",
    }) as Covenants;
}

/**
 * Returns details about a Covenant
 *
 * @param covenantId - The unique identifier for the Covenant
 * @returns A promise that resolves to an object representing details about a Covenant.
 */
export async function covenant(ctx: ApiContext, covenantId: number): Promise<Covenant> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/covenant/${covenantId}`,
        namespace: "static",
    }) as Covenant;
}

/**
 * Returns media details about a Covenant
 *
 * @param covenantId - The unique identifier for the Covenant.
 * @returns A promise that resolves to an object representing media details about a Covenant.
 */
export async function azeriteEssenceMedia(ctx: ApiContext, covenantId: number): Promise<CovenantMedia> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/media/covenant/${covenantId}`,
        namespace: "static",
    }) as CovenantMedia;
}

/**
 * Returns an index of Covenant Soulbinds.
 *
 * @returns A promise that resolves to an object representing a list of all Covenant Soulbinds.
 */
export async function covenantSoulbinds(ctx: ApiContext): Promise<CovenantSoulbinds> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/covenant/soulbind/index",
        namespace: "static",
    }) as CovenantSoulbinds;
}

/**
 * Returns details about a Covenant Soulbind
 *
 * @param soulbindId - The unique identifier for the Covenant Soulbind
 * @returns A promise that resolves to an object representing details about a Covenant Soulbind.
 */
export async function covenantSoulbind(ctx: ApiContext, soulbindId: number): Promise<CovenantSoulbind> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/covenant/soulbind/${soulbindId}`,
        namespace: "static",
    }) as CovenantSoulbind;
}

/**
 * Returns an index of Covenant Conduits.
 *
 * @returns A promise that resolves to an object representing a list of all Covenant Conduits.
 */
export async function covenantConduits(ctx: ApiContext): Promise<CovenantConduits> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/covenant/conduit/index",
        namespace: "static",
    }) as CovenantConduits;
}

/**
 * Returns details about a Covenant Conduit
 *
 * @param conduitId - The unique identifier for the Covenant Conduit
 * @returns A promise that resolves to an object representing details about a Covenant Conduit.
 */
export async function covenantConduit(ctx: ApiContext, conduitId: number): Promise<CovenantConduit> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/covenant/conduit/${conduitId}`,
        namespace: "static",
    }) as CovenantConduit;
}
