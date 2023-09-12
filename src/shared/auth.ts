import { getSetup, tokenUrl } from "./config.ts";
import { AuthenticationError, MissingClientIdError, MissingClientSecretError } from "./errors.ts";

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
    if (!getSetup().clientId) {
        throw new MissingClientIdError();
    }

    if (!getSetup().clientSecret) {
        throw new MissingClientSecretError();
    }

    if (
        !force && authConfig.accessToken && authConfig.tokenExpiration &&
        new Date() < new Date(authConfig.tokenExpiration)
    ) {
        return authConfig.accessToken;
    }

    const response = await fetch(tokenUrl(getSetup().region), {
        method: "POST",
        headers: {
            "Authorization": "Basic " + btoa(`${getSetup().clientId}:${getSetup().clientSecret}`),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
    });

    if (response.ok) {
        const data = await response.json();
        authConfig.accessToken = data.access_token;
        authConfig.tokenExpiration = Date.now() + data.expires_in * 1000;
        return true;
    } else {
        throw new AuthenticationError("Problem with Authentication", response.status, response.statusText);
    }
}
