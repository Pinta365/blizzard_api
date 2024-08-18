//auth.ts
import { getSetup, tokenUrl } from "./config.ts";
import { AuthenticationError, MissingClientIdError, MissingClientSecretError, MissingRegionError } from "./errors.ts";

/**
 * Represents the configuration data for authentication.
 * @property {string} accessToken - The current access token.
 * @property {number} tokenExpiration - The expiration timestamp of the access token (in milliseconds).
 */
export interface AuthConfig {
    accessToken: string;
    tokenExpiration: number;
}

/**
 * Represents the data for the token reponse.
 */
interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    sub: string;
}

/**
 * Global storage for authentication configuration data.
 */
const authConfig: AuthConfig = {
    accessToken: "",
    tokenExpiration: 0,
};

/**
 * Retrieves the global authentication configuration.
 * @returns {AuthConfig} The authentication configuration object.
 */
export function getauthConfig(): AuthConfig {
    return authConfig;
}

/**
 * Handles authentication and obtains an access token if needed.
 * @param {boolean} forceNewToken - If true, forces the retrieval of a new token, ignoring any existing one.
 * @returns {Promise<string>} Returns the access token (string).
 * @throws {MissingRegionError} If the region is not configured.
 * @throws {MissingClientIdError} If the client ID is not configured.
 * @throws {MissingClientSecretError} If the client secret is not configured.
 * @throws {AuthenticationError} If there is a problem during the authentication process.
 */
export async function authenticate(forceNewToken = false): Promise<string> {
    if (!getSetup().region) {
        throw new MissingRegionError();
    }

    if (!getSetup().clientId) {
        throw new MissingClientIdError();
    }

    if (!getSetup().clientSecret) {
        throw new MissingClientSecretError();
    }

    if (
        !forceNewToken && authConfig.accessToken && authConfig.tokenExpiration &&
        new Date() < new Date(authConfig.tokenExpiration)
    ) {
        return authConfig.accessToken;
    }

    const response = await fetch(tokenUrl(getSetup().region!), {
        method: "POST",
        headers: {
            "Authorization": "Basic " + btoa(`${getSetup().clientId}:${getSetup().clientSecret}`),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
    });

    if (response.ok) {
        const data = await response.json() as TokenResponse;
        authConfig.accessToken = data.access_token;
        authConfig.tokenExpiration = Date.now() + data.expires_in * 1000;
        return authConfig.accessToken;
    } else {
        throw new AuthenticationError("Problem with Authentication", response.status, response.statusText);
    }
}
