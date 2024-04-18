import { KeyNameId, LinkSelfHref, LocalizedString, request } from "../../shared/index.ts";

export interface Titles extends LinkSelfHref {
    titles: KeyNameId[];
}

export interface Title extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    gender_name: {
        male: LocalizedString;
        female: LocalizedString;
    };
}

/**
 * Returns an index of titles.
 *
 * @returns A promise that resolves to an object representing a list of titles.
 */
export async function titles(): Promise<Titles> {
    return await request({
        method: "GET",
        url: "/data/wow/title/index",
        namespace: "static",
    });
}

/**
 * Returns a title by ID.
 *
 * @param titleId - The unique identifier for the title.
 * @returns A promise that resolves to an object representing details about a title.
 */
export async function title(titleId: number): Promise<Title> {
    return await request({
        method: "GET",
        url: `/data/wow/title/${titleId}`,
        namespace: "static",
    });
}
