/**
 * TS library for the Blizzard Battle.net API: World of Warcraft, World of Warcraft Classic, Hearthstone,
 * StarCraft II and Diablo III.
 *
 * @example
 * ```ts
 * import { createClient } from "@pinta365/blizzard-api";
 *
 * const client = createClient({ region: "eu", locale: "en_GB", clientId, clientSecret });
 * const mount = await client.wow.mount(6);
 * ```
 *
 * @module
 */
import { ApiContext, assertConfig } from "./src/shared/index.ts";
import type { AuthConfig, ClientConfig } from "./src/shared/index.ts";
import { clientFromContext } from "./src/client.ts";
import type {
    BlizzardClient,
    Diablo3Api,
    HearthstoneApi,
    Sc2Api,
    WowApi,
    WowClassicApi,
    WowClassicEraApi,
} from "./src/client.ts";
import * as errors from "./src/shared/errors.ts";

export { createClient } from "./src/client.ts";
export type {
    BlizzardClient,
    Diablo3Api,
    HearthstoneApi,
    Sc2Api,
    WowApi,
    WowClassicApi,
    WowClassicEraApi,
} from "./src/client.ts";
export type {
    AuthConfig,
    AuthorizeUrlOptions,
    ClientConfig,
    ExchangeCodeOptions,
    Locales,
    Namespaces,
    Regions,
    TokenResponse,
} from "./src/shared/index.ts";
export { errors };

// Default client behind the module-level API (setup() + wow.*, hearthstone.*, ...).
const defaultContext = new ApiContext();
const defaultClient: BlizzardClient = clientFromContext(defaultContext);

/**
 * Configures the default client used by the module-level API. Prefer createClient() for new code.
 * @param {Partial<ClientConfig>} userConfig - Configuration properties to update.
 * @throws {MissingRegionError | MissingClientIdError | MissingClientSecretError} If the resulting configuration is incomplete.
 */
export function setup(userConfig: Partial<ClientConfig>): void {
    defaultContext.configure(userConfig);
    assertConfig({ ...defaultContext.config });
}

/**
 * Obtains a client credentials access token for the default client.
 * @param {boolean} [forceNewToken] - If true, fetches a new token even if the cached one is valid.
 */
export function authenticate(forceNewToken?: boolean): Promise<string> {
    return defaultContext.authenticate(forceNewToken);
}

/**
 * Returns the default client's current access token, or an empty string if not authenticated.
 */
export function getAccessToken(): string {
    return defaultContext.getAuthConfig().accessToken;
}

/**
 * Returns a copy of the default client's token state.
 */
export function getAuthConfig(): AuthConfig {
    return defaultContext.getAuthConfig();
}

/**
 * Makes an authenticated request with the default client to a full href returned in an API response.
 * @param {string} href - The full href URL.
 * @param {Record<string, string | number>} [qs] - Optional query string parameters to append.
 */
export function requestHref(href: string, qs?: Record<string, string | number>): Promise<unknown> {
    return defaultContext.requestHref(href, qs);
}

/** World of Warcraft endpoints on the default client. */
export const wow: WowApi = defaultClient.wow;
/** World of Warcraft Classic (progression) endpoints on the default client. */
export const wowClassic: WowClassicApi = defaultClient.wowClassic;
/** World of Warcraft Classic Era endpoints on the default client. */
export const wowClassicEra: WowClassicEraApi = defaultClient.wowClassicEra;
/** Hearthstone endpoints on the default client. */
export const hearthstone: HearthstoneApi = defaultClient.hearthstone;
/** StarCraft II endpoints on the default client. */
export const sc2: Sc2Api = defaultClient.sc2;
/** Diablo III endpoints on the default client. */
export const diablo3: Diablo3Api = defaultClient.diablo3;
