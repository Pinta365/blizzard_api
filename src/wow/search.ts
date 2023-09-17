import { Namespaces, request } from "../shared/index.ts";

export interface SearchParameters {
    searchFields?: Record<string, string | number>;
    orderBy?: string;
    Page?: number;
    _pageSize: number;
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
        qs.orderBy = searchParameters.orderBy;
    }

    if (searchParameters.Page !== undefined) {
        qs.Page = searchParameters.Page;
    }

    return await request({
        method: "GET",
        url: `/data/wow/search${url}`,
        qs,
        namespace,
    });
}
