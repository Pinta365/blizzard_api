//request.ts
import type { Namespaces, RequestOptions } from "./types.ts";
import { apiBaseUrl, getSetup } from "./config.ts";
import { authenticate, getauthConfig } from "./auth.ts";

import { APIError } from "./errors.ts";

interface BlizzardAPIErrorResponse {
    code?: number;
    detail?: string;
    type?: string;
}

/**
 * Makes an authenticated request to the API and handles potential errors.
 * @param {RequestOptions} requestOptions - An object containing the following:
 *      * method: The HTTP method (e.g., "GET", "POST")
 *      * url:  The API endpoint path.
 *      * namespace (optional):  The Battlenet namespace for the request.
 *      * qs (optional): An object representing query string parameters.
 * @returns {Promise<any>} The parsed JSON response from the API.
 * @throws {APIError} If there is a problem fetching or the response is not successful.
 * @throws {AuthenticationError} (Potentially) If authentication fails during the process.
 */
export async function request(requestOptions: RequestOptions) {
    if (
        !getauthConfig().accessToken || (getauthConfig().accessToken && getauthConfig().tokenExpiration &&
            new Date() < new Date(getauthConfig().tokenExpiration))
    ) {
        await authenticate(true);
    }

    const { method, url, namespace } = requestOptions;
    let { qs } = requestOptions;

    if (getSetup().locale) {
        qs = { ...{ locale: getSetup().locale! }, ...qs };
    }

    const qsString: Record<string, string> = qs
        ? Object.fromEntries(
            Object.entries(qs).filter(([, value]) => value !== undefined).map((
                [key, value],
            ) => [key, value.toString()]),
        )
        : {};

    const params = new URLSearchParams(qsString);

    const headers: Record<string, string> = {
        "Authorization": "Bearer " + getauthConfig().accessToken,
    };

    if (namespace) {
        headers["Battlenet-Namespace"] = `${namespace}-${getSetup().region}`;
    }

    const response = await fetch(
        apiBaseUrl(getSetup().region!) + encodeURI(url) + (qsString ? "?" + params.toString() : ""),
        {
            method: method,
            headers: headers,
        },
    );

    if (response.ok) {
        return await response.json();
    }

    const text = await response.text();
    let errorData: BlizzardAPIErrorResponse | null = null;
    try {
        errorData = text ? (JSON.parse(text) as BlizzardAPIErrorResponse) : null;
    } catch {
        // Empty or non-JSON body (e.g. 404 with no body)
    }
    const statusCode = errorData?.code ?? response.status;
    const errorMessage = errorData
        ? JSON.stringify(errorData)
        : response.statusText || "Problem fetching data from API";

    throw new APIError(errorMessage, statusCode, response.statusText);
}

/**
 * Makes an authenticated request to an arbitrary Blizzard API href URL.
 * This function is useful for following href links returned in API responses.
 * @param {string} href - The full href URL from a Blizzard API response.
 * @param {Record<string, string | number>} [qs] - Optional query string parameters to append.
 * @returns {Promise<unknown>} The parsed JSON response from the API.
 * @throws {APIError} If there is a problem fetching or the response is not successful.
 * @throws {AuthenticationError} (Potentially) If authentication fails during the process.
 */
export async function requestHref(href: string, qs?: Record<string, string | number>): Promise<unknown> {
    if (
        !getauthConfig().accessToken || (getauthConfig().accessToken && getauthConfig().tokenExpiration &&
            new Date() < new Date(getauthConfig().tokenExpiration))
    ) {
        await authenticate(true);
    }

    const url = new URL(href);

    const namespaceMatch = url.searchParams.get("namespace");
    const namespace = namespaceMatch ? namespaceMatch.split("-")[0] as Namespaces : undefined;

    const additionalQs = qs
        ? Object.fromEntries(
            Object.entries(qs).filter(([, value]) => value !== undefined).map((
                [key, value],
            ) => [key, value.toString()]),
        )
        : {};

    if (getSetup().locale) {
        additionalQs.locale = getSetup().locale!;
    }

    const params = new URLSearchParams(additionalQs);
    const queryString = params.toString();

    const headers: Record<string, string> = {
        "Authorization": "Bearer " + getauthConfig().accessToken,
    };

    if (namespace) {
        headers["Battlenet-Namespace"] = `${namespace}-${getSetup().region}`;
    }

    const fullUrl = href + (queryString ? (href.includes("?") ? "&" : "?") + queryString : "");

    const response = await fetch(fullUrl, {
        method: "GET",
        headers: headers,
    });

    if (response.ok) {
        return await response.json();
    }

    const text = await response.text();
    let errorData: BlizzardAPIErrorResponse | null = null;
    try {
        errorData = text ? (JSON.parse(text) as BlizzardAPIErrorResponse) : null;
    } catch {
        // Empty or non-JSON body
    }
    const statusCode = errorData?.code ?? response.status;
    const errorMessage = errorData
        ? JSON.stringify(errorData)
        : response.statusText || "Problem fetching data from API";

    throw new APIError(errorMessage, statusCode, response.statusText);
}
