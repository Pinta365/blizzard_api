import { search } from "../search.ts";
import type { Search, SearchParameters } from "../search.ts";

/**
 * Performs a search of media.
 *
 * @param SearchParameters - Object containing search parameters.
 * @returns A promise that resolves to an object representing details about a media search.
 */
export async function searchMedia(searchParameters: SearchParameters): Promise<Search> {
    return await search("/media", "static", searchParameters) as Search;
}
