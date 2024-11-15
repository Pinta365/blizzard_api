//request.ts
import type { RequestOptions } from "./types.ts";
import { apiBaseUrl, getSetup } from "./config.ts";
import { authenticate, getauthConfig } from "./auth.ts";

import { APIError } from "./errors.ts";

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

    const errorData = await response.json();
    const statusCode = errorData.code || response.status;
    const errorMessage = JSON.stringify(errorData) || "Problem fetching data from API";
    throw new APIError(errorMessage, statusCode, response.statusText);
}
