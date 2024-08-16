import { request } from "../shared/index.ts";
import type { Namespaces } from "../shared/index.ts";

export interface SearchParameters {
    searchFields?: Record<string | symbol, string | number>;
    orderBy?: string;
    page?: number;
    pageSize?: number;
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
export async function search(url: string, namespace: Namespaces, searchParameters: SearchParameters): Promise<Search> {
    const searchFields = searchParameters.searchFields
        ? Object.fromEntries(
            Object.entries(searchParameters.searchFields).map(([key, value]) => [key, value.toString()]),
        )
        : undefined;

    const qs: Record<string, string | number> = {
        ...searchFields,
    };

    if (searchParameters.orderBy) {
        qs.orderby = searchParameters.orderBy;
    }

    if (searchParameters.page !== undefined) {
        qs._page = searchParameters.page;
    }

    if (searchParameters.pageSize !== undefined) {
        qs._pageSize = searchParameters.pageSize;
    }

    return await request({
        method: "GET",
        url: `/data/wow/search${url}`,
        qs,
        namespace,
    });
}
