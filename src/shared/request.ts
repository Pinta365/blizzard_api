import type { requestOptions } from "./types.ts";
import { getSetup } from "./config.ts";
import { authenticate, getauthConfig } from "./auth.ts";

export async function request(requestOptions: requestOptions) {
    if (
        !getauthConfig().accessToken || (getauthConfig().accessToken && getauthConfig().tokenExpiration &&
            new Date() < new Date(getauthConfig().tokenExpiration))
    ) {
        await authenticate(true);
    }

    const { method, url, namespace, qs } = requestOptions;

    const params = new URLSearchParams(qs);

    const host = getSetup().region == "cn"
        ? "https://gateway.battlenet.com.cn"
        : `https://${getSetup().region}.api.blizzard.com`;

    const headers: Record<string, string> = {
        "Authorization": "Bearer " + getauthConfig().accessToken,
    };

    if (namespace) {
        headers["Battlenet-Namespace"] = `${namespace}-${getSetup().region}`;
    }

    console.log(headers);
    const response = await fetch(host + encodeURI(url) + (qs ? "?" + params.toString() : ""), {
        method: method,
        headers: headers,
    });

    if (response.ok) {
        return await response.json();
    }

    throw new Error(`Problem fetching data. ${response.status} - ${response.statusText}`);
}
