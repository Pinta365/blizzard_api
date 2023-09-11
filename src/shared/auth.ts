import { getSetup } from "./config.ts";

interface AuthConfig {
    accessToken: string;
    tokenExpiration: number;
}

const authConfig: AuthConfig = {
    accessToken: "",
    tokenExpiration: 0,
};

export function getauthConfig(): AuthConfig {
    return authConfig;
}

export async function authenticate(force = false) {
    if (!getSetup().clientId || !getSetup().ClientSecret) {
        throw new Error("clientId and ClientSecret must be set using setup() before calling authenticate.");
    }

    if (
        !force && authConfig.accessToken && authConfig.tokenExpiration &&
        new Date() < new Date(authConfig.tokenExpiration)
    ) {
        return authConfig.accessToken;
    }

    const url = getSetup().region === "cn"
        ? "https://www.battlenet.com.cn/oauth/token"
        : `https://${getSetup().region}.battle.net/oauth/token`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": "Basic " + btoa(`${getSetup().clientId}:${getSetup().ClientSecret}`),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
    });

    if (response.ok) {
        const data = await response.json();

        console.log("Auth successful");
        authConfig.accessToken = data.access_token;
        authConfig.tokenExpiration = Date.now() + data.expires_in * 1000;
        return true;
    } else {
        console.error("Auth failed:", response.status, response.statusText);
        return false;
    }
}
