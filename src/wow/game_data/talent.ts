import { request } from "../../shared/index.ts";
import type { KeyName, KeyNameId, LinkSelfHref, LocalizedString } from "../../shared/index.ts";

export interface TalentTrees extends LinkSelfHref {
    spec_talent_trees: KeyNameId;
    class_talent_trees: KeyName;
}

export interface SpellTooltip {
    spell: KeyNameId;
    description: string;
    cast_time: string;
    power_cost?: string;
    range?: string;
}

export interface Tooltip {
    talent: KeyNameId;
    spell_tooltip: SpellTooltip;
}

export interface Rank {
    rank: number;
    tooltip?: Tooltip;
    choice_of_tooltips?: Tooltip[];
}

export interface NodeType {
    id: number;
    type: string;
}

export interface TalentNode {
    id: number;
    locked_by?: number[];
    unlocks?: number[];
    node_type: NodeType;
    ranks: Rank[];
    display_row: number;
    display_col: number;
    raw_position_x: number;
    raw_position_y: number;
}

export interface TalentTree extends LinkSelfHref {
    id: number;
    playable_class: KeyNameId;
    playable_specialization: KeyNameId;
    name: LocalizedString;
    media: {
        key: {
            href: string;
        };
    };
    restriction_lines: {
        required_points: number;
        restricted_row: number;
        is_for_class: boolean;
    }[];
    class_talent_nodes: TalentNode[];
}

export interface TalentTreeNodes extends LinkSelfHref {
    id: number;
    spec_talent_trees?: KeyName[];
    talent_nodes?: TalentNode[];
}

export interface Talents extends LinkSelfHref {
    talents: KeyNameId[];
}

export interface Talent extends LinkSelfHref {
    id: number;
    rank_descriptions: {
        rank: number;
        description: LocalizedString;
    }[];
    spell: KeyNameId;
    playable_class: KeyNameId;
    playable_specialization: KeyNameId;
}

export interface PvpTalents extends LinkSelfHref {
    pvp_talents: KeyNameId[];
}

export interface PvpTalent extends LinkSelfHref {
    id: number;
    spell: KeyNameId;
    playable_specialization: KeyNameId;
    description: LocalizedString;
    unlock_player_level: number;
    compatible_slots: number[];
}

/**
 * Returns an index of talent trees.
 *
 * @returns A promise that resolves to an object representing a list of talent trees.
 */
export async function talentTrees(): Promise<TalentTrees> {
    return await request({
        method: "GET",
        url: "/data/wow/talent-tree/index",
        namespace: "static",
    }) as TalentTrees;
}

/**
 * Returns a talent tree by specialization ID.
 *
 * @param talentTreeId - The unique identifier for the talent tree.
 * @param specId - The unique identifier for the specialization.
 * @returns A promise that resolves to an object representing details about a talent tree.
 */
export async function talentTree(talentTreeId: number, specId: number): Promise<TalentTree> {
    return await request({
        method: "GET",
        url: `/data/wow/talent-tree/${talentTreeId}/playable-specialization/${specId}`,
        namespace: "static",
    }) as TalentTree;
}

/**
 * Returns all talent tree nodes as well as links to associated playable specializations given a talent tree id. This is useful to generate loadout export codes.
 *
 * @param talentTreeId - The unique identifier for the talent tree.
 * @returns A promise that resolves to an object representing details about the talent tree nodes.
 */
export async function talentTreeNodes(talentTreeId: number): Promise<TalentTreeNodes> {
    return await request({
        method: "GET",
        url: `/data/wow/talent-tree/${talentTreeId}`,
        namespace: "static",
    }) as TalentTreeNodes;
}

/**
 * Returns an index of talents.
 *
 * @returns A promise that resolves to an object representing a list of talents.
 */
export async function talents(): Promise<Talents> {
    return await request({
        method: "GET",
        url: "/data/wow/talent/index",
        namespace: "static",
    }) as Talents;
}

/**
 * Returns a talent by ID.
 *
 * @param talentId - The unique identifier for the talent.
 * @returns A promise that resolves to an object representing details about the talent.
 */
export async function talent(talentId: number): Promise<Talent> {
    return await request({
        method: "GET",
        url: `/data/wow/talent/${talentId}`,
        namespace: "static",
    }) as Talent;
}

/**
 * Returns an index of PvP talents.
 *
 * @returns A promise that resolves to an object representing a list of PvP talents.
 */
export async function pvpTalents(): Promise<PvpTalents> {
    return await request({
        method: "GET",
        url: "/data/wow/pvp-talent/index",
        namespace: "static",
    }) as PvpTalents;
}

/**
 * Returns a PvP talent by ID.
 *
 * @param pvpTalentId - The unique identifier for the PvP talent.
 * @returns A promise that resolves to an object representing details about the PvP talent.
 */
export async function pvpTalent(pvpTalentId: number): Promise<PvpTalent> {
    return await request({
        method: "GET",
        url: `/data/wow/pvp-talent/${pvpTalentId}`,
        namespace: "static",
    }) as PvpTalent;
}
