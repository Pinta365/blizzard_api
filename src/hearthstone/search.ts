import type { ApiContext } from "../shared/index.ts";

export interface SearchParameters {
    searchFields?: Record<string | symbol, string | number>;
    page?: number;
    pageSize?: number;
    sort?: string;
}

export interface Search {
    page: number;
    pageSize: number;
    maxPageSize: number;
    pageCount: number;
    results: unknown[]; // Depends on the search.
}

/**
 * Performs a search.
 *
 * @param SearchParameters - Object containing search parameters.
 * @returns A promise that resolves to an object representing details about the search.
 */
export async function search(ctx: ApiContext, url: string, searchParameters: SearchParameters): Promise<Search> {
    const searchFields = searchParameters.searchFields
        ? Object.fromEntries(
            Object.entries(searchParameters.searchFields).map(([key, value]) => [key, value.toString()]),
        )
        : undefined;

    const qs: Record<string, string | number> = {
        ...searchFields,
    };

    if (searchParameters.sort) {
        qs.sort = searchParameters.sort;
    }

    if (searchParameters.page !== undefined) {
        qs.page = searchParameters.page;
    }

    if (searchParameters.pageSize !== undefined) {
        qs.pageSize = searchParameters.pageSize;
    }

    return await ctx.request({
        method: "GET",
        url: `/hearthstone${url}`,
        qs,
    }) as Search;
}
