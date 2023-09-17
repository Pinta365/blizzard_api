import { KeyId, KeyNameId, LinkSelfHref, LocalizedString, request } from "../shared/index.ts";
import { Search, search, SearchParameters } from "./search.ts";

interface AzeriteEssences extends LinkSelfHref {
    azerite_essences: KeyNameId[];
}

interface AzeritePower {
    id: number;
    rank: number;
    main_power_spell: KeyNameId;
    passive_power_spell: KeyNameId;
}

interface AzeriteEssenceDetails extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    allowed_specializations: KeyNameId[];
    powers: AzeritePower[];
    media: KeyId;
}

interface Asset {
    key: string;
    value: string;
    file_data_id: number;
}

interface AzeritEessenceMedia extends LinkSelfHref {
    assets: Asset[];
    id: number;
}

/**
 * Returns Azerite Essences Index
 *
 * @returns A promise that resolves to an object representing a list of all Azerite Essences.
 */
export async function azeriteEssences(): Promise<AzeriteEssences> {
    return await request({
        method: "GET",
        url: "/data/wow/azerite-essence/index",
        namespace: "static",
    });
}

/**
 * Returns details about a specific Azerite Essence Id
 *
 * @param azeriteEssenceId - The unique identifier Azerite Essence.
 * @returns A promise that resolves to an object representing details about an Azerite Essences.
 */
export async function azeriteEssence(azeriteEssenceId: number): Promise<AzeriteEssenceDetails> {
    return await request({
        method: "GET",
        url: `/data/wow/azerite-essence/${azeriteEssenceId}`,
        namespace: "static",
    });
}

/**
 * Performs a search of azerite essences.
 *
 * @param SearchParameters - Object containing search parameters.
 * @returns A promise that resolves to an object representing details about a Azerite Essences search.
 */
export async function searchAzeriteEssence(searchParameters: SearchParameters): Promise<Search> {
    return await search("/azerite-essence", "static", searchParameters);
}

/**
 * Returns media details about a specific Azerite Essence Id
 *
 * @param azeriteEssenceId - The unique identifier Azerite Essence.
 * @returns A promise that resolves to an object representing media details about an Azerite Essences.
 */
export async function azeriteEssenceMedia(azeriteEssenceId: number): Promise<AzeritEessenceMedia> {
    return await request({
        method: "GET",
        url: `/data/wow/media/azerite-essence/${azeriteEssenceId}`,
        namespace: "static",
    });
}
