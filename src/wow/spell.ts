import { KeyId, LinkSelfHref, LocalizedString, request } from "../shared/index.ts";

interface Spell extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    description: LocalizedString;
    media: KeyId;
}

interface Asset {
    key: string;
    value: string;
    file_data_id: string;
}
interface SpellMedia extends LinkSelfHref {
    assets: Asset[];
    id: number;
}

/**
 * Returns a spell by ID.
 *
 * @param spellId - The unique identifier for the spell.
 * @returns A promise that resolves to an object representing details about a spell.
 */
export async function spell(spellId: number): Promise<Spell> {
    return await request({
        method: "GET",
        url: `/data/wow/spell/${spellId}`,
        namespace: "static",
    });
}

/**
 * Returns media for a spell by ID.
 *
 * @param spellId - The unique identifier for the spell.
 * @returns A promise that resolves to an object representing details about a spell.
 */
export async function spellMedia(spellId: number): Promise<SpellMedia> {
    return await request({
        method: "GET",
        url: `/data/wow/media/spell/${spellId}`,
        namespace: "static",
    });
}

export function searchSpell() {
    //TODO: Placeholder for the spell Search, will probably be using ./search.ts
    throw new Error("Not implemented yet!");
}
