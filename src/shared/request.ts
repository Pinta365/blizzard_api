import type { RequestOptions } from "./types.ts";
import { apiBaseUrl, getSetup } from "./config.ts";
import { authenticate, getauthConfig } from "./auth.ts";

import { APIError } from "./errors.ts";

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

    throw new APIError("Problem fetching data from API", response.status, response.statusText);
}
