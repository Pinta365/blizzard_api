import type { ApiContext } from "../../shared/index.ts";
import type { KeyNameId, LinkSelfHref, LocalizedString, NamedRef } from "../../shared/index.ts";

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
    source: {
        type: {
            type: string;
            name: string;
        };
        achievements: NamedRef[];
    };
}

/**
 * Returns an index of titles.
 *
 * @returns A promise that resolves to an object representing a list of titles.
 */
export async function titles(ctx: ApiContext): Promise<Titles> {
    return await ctx.request({
        method: "GET",
        url: "/data/wow/title/index",
        namespace: "static",
    }) as Titles;
}

/**
 * Returns a title by ID.
 *
 * @param titleId - The unique identifier for the title.
 * @returns A promise that resolves to an object representing details about a title.
 */
export async function title(ctx: ApiContext, titleId: number): Promise<Title> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/title/${titleId}`,
        namespace: "static",
    }) as Title;
}
