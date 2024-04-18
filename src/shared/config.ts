//config.ts
import type { Locales, Regions } from "./types.ts";
import { MissingClientIdError, MissingClientSecretError, MissingRegionError } from "./errors.ts";

/**
 * Represents the required application configuration.
 * @property {Regions} region - The target Battle.net region for API requests.
 * @property {Locales} locale - The desired locale for data.
 * @property {string} clientId - The OAuth client ID.
 * @property {string} clientSecret - The OAuth client secret.
 */
export interface Config {
    region: Regions;
    locale: Locales;
    clientId: string;
    clientSecret: string;
}

/**
 * Holds the partially loaded application configuration.
 */
let config: Partial<Config> = {};

/**
 * Generates the OAuth token URL based on the specified region.
 * @param {Regions} region - The target Battle.net region.
 * @returns {string} The constructed token URL.
 */
export function tokenUrl(region: Regions) {
    return region === "cn" ? "https://www.battlenet.com.cn/oauth/token" : `https://${region}.battle.net/oauth/token`;
}

/**
 * Generates the base API URL based on the specified region.
 * @param {Regions} region - The target Battle.net region.
 * @returns {string} The constructed base API URL.
 */
export function apiBaseUrl(region: Regions) {
    return region === "cn" ? "https://gateway.battlenet.com.cn" : `https://${region}.api.blizzard.com`;
}

/**
 * Updates the application configuration and performs basic validation.
 * @param {Partial<Config>} userConfig - An object containing configuration properties to update.
 * @throws {MissingRegionError} If the region is not provided in the update.
 * @throws {MissingClientIdError} If the client ID is not provided in the update.
 * @throws {MissingClientSecretError} If the client secret is not provided in the update.
 */
export function setup(userConfig: Partial<Config>) {
    config = { ...config, ...userConfig };

    if (!config.region) {
        throw new MissingRegionError();
    }

    if (!config.clientId) {
        throw new MissingClientIdError();
    }

    if (!config.clientSecret) {
        throw new MissingClientSecretError();
    }
}

/**
 * Retrieves the current application configuration.
 * Note: The configuration may be partial if not fully setup.
 * @returns {Config | Partial<Config>} The full or partially loaded configuration object.
 */
export function getSetup(): Config | Partial<Config> {
    return config;
}
