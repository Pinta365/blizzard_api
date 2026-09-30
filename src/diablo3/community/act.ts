import type { ApiContext } from "../../shared/index.ts";

interface Quest {
    id: number;
    name: string;
    slug: string;
}

interface Act {
    slug: string;
    number: number;
    name: string;
    quests: Quest[];
}

interface Acts {
    acts: Act[];
}

/**
 * Returns an index of acts.
 *
 * @returns A promise that resolves to an object representing an index of acts.
 */
export async function acts(ctx: ApiContext): Promise<Acts> {
    return await ctx.request({
        method: "GET",
        url: "/d3/data/act/",
    }) as Acts;
}

/**
 * Returns a single act by ID.
 *
 * @param seasonId - The season for the leaderboard list.
 * @returns A promise that resolves to an object representing the data for a single act by ID.
 */
export async function act(ctx: ApiContext, seasonId: number): Promise<Act> {
    return await ctx.request({
        method: "GET",
        url: `/d3/data/act/${seasonId}`,
    }) as Act;
}
