import { KeyId, KeyNameId, LinkSelfHref, LocalizedString, request } from "../../shared/index.ts";

interface TalentTree {
    key: {
        href: string;
    };
    name?: LocalizedString;
    id: number;
}

interface TechTalentTrees extends LinkSelfHref {
    talent_trees: TalentTree[];
}

interface TechTalentTree extends LinkSelfHref {
    id: number;
    max_tiers: number;
    talents: KeyNameId[];
}

interface TechTalents extends LinkSelfHref {
    talents: KeyNameId[];
}

interface TechTalent extends LinkSelfHref {
    id: number;
    talent_tree: KeyNameId;
    name: LocalizedString;
    description: LocalizedString;
    spell_tooltip: {
        spell: KeyNameId;
        description: LocalizedString;
        cast_time: LocalizedString;
    };
    tier: number;
    display_order: number;
    prerequisite_talent: KeyNameId;
    media: KeyId;
}

interface Asset {
    key: string;
    value: string;
    file_data_id: string;
}
interface TechTalentMedia extends LinkSelfHref {
    assets: Asset[];
}

/**
 * Returns an index of tech talent trees.
 *
 * @returns A promise that resolves to an object representing a list of tech talents trees
 */
export async function techTalentTrees(): Promise<TechTalentTrees> {
    return await request({
        method: "GET",
        url: "/data/wow/tech-talent-tree/index",
        namespace: "static",
    });
}

/**
 * Returns a tech talent tree by ID.
 *
 * @param techTalentTreeId - The unique identifier for the tech talent tree.
 * @returns A promise that resolves to an object representing details about the tech talent tree.
 */
export async function techTalentTree(techTalentTreeId: number): Promise<TechTalentTree> {
    return await request({
        method: "GET",
        url: `/data/wow/tech-talent-tree/${techTalentTreeId}`,
        namespace: "static",
    });
}

/**
 * Returns an index of tech talents.
 *
 * @returns A promise that resolves to an object representing a list of tech talents trees
 */
export async function techTalents(): Promise<TechTalents> {
    return await request({
        method: "GET",
        url: "/data/wow/tech-talent/index",
        namespace: "static",
    });
}

/**
 * Returns a tech talent by ID.
 *
 * @param techTalentId - The unique identifier for the tech talent tree.
 * @returns A promise that resolves to an object representing details about the tech talent tree.
 */
export async function techTalent(techTalentId: number): Promise<TechTalent> {
    return await request({
        method: "GET",
        url: `/data/wow/tech-talent/${techTalentId}`,
        namespace: "static",
    });
}

/**
 * Returns media for a tech talent by ID.
 *
 * @param techTalentId - The unique identifier for the tech talent.
 * @returns A promise that resolves to an object representing details about a tech talent.
 */
export async function techTalentMedia(techTalentId: number): Promise<TechTalentMedia> {
    return await request({
        method: "GET",
        url: `/data/wow/media/tech-talent/${techTalentId}`,
        namespace: "static",
    });
}
