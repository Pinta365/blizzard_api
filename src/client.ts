//client.ts
import { ApiContext, assertConfig } from "./shared/context.ts";
import type {
    AuthConfig,
    AuthorizeUrlOptions,
    ClientConfig,
    ExchangeCodeOptions,
    TokenResponse,
} from "./shared/context.ts";
import { bindAll, type Bound } from "./shared/bind.ts";
import * as wowEndpoints from "./wow/index.ts";
import * as wowClassicEndpoints from "./wow_classic/index.ts";
import * as wowClassicEraEndpoints from "./wow_classic/era.ts";
import * as hearthstoneEndpoints from "./hearthstone/index.ts";
import * as sc2Endpoints from "./starcraft2/index.ts";
import * as diablo3Endpoints from "./diablo3/index.ts";

import type { WowApi } from "./generated/wow_api.ts";
import type { WowClassicApi } from "./generated/wow_classic_api.ts";
import type { WowClassicEraApi } from "./generated/wow_classic_era_api.ts";
import type { HearthstoneApi } from "./generated/hearthstone_api.ts";
import type { Sc2Api } from "./generated/sc2_api.ts";
import type { Diablo3Api } from "./generated/diablo3_api.ts";

export type { Diablo3Api, HearthstoneApi, Sc2Api, WowApi, WowClassicApi, WowClassicEraApi };

// Compile-time guard: each generated interface must have exactly the bound endpoint functions, with compatible
// signatures. (One-way assignability: a mapped type can't express generic endpoints such as Hearthstone's
// metadata<T>.) If this fails, run `deno task gen:api`. CI also runs `deno task gen:api --check`.
type Exact<A, B> = [keyof A] extends [keyof B]
    ? ([keyof B] extends [keyof A] ? ([A] extends [B] ? true : false) : false)
    : false;
type Assert<T extends true> = T;
export type _GeneratedApisAreCurrent = [
    Assert<Exact<WowApi, Bound<typeof wowEndpoints>>>,
    Assert<Exact<WowClassicApi, Bound<typeof wowClassicEndpoints>>>,
    Assert<Exact<WowClassicEraApi, Bound<typeof wowClassicEraEndpoints>>>,
    Assert<Exact<HearthstoneApi, Bound<typeof hearthstoneEndpoints>>>,
    Assert<Exact<Sc2Api, Bound<typeof sc2Endpoints>>>,
    Assert<Exact<Diablo3Api, Bound<typeof diablo3Endpoints>>>,
];

/**
 * A Blizzard API client with its own configuration and token state.
 */
export interface BlizzardClient {
    /** World of Warcraft endpoints. */
    readonly wow: WowApi;
    /** World of Warcraft Classic (progression, e.g. Mists of Pandaria Classic) endpoints. */
    readonly wowClassic: WowClassicApi;
    /** World of Warcraft Classic Era endpoints (Era, Season of Discovery, Hardcore, Anniversary). */
    readonly wowClassicEra: WowClassicEraApi;
    /** Hearthstone endpoints. */
    readonly hearthstone: HearthstoneApi;
    /** StarCraft II endpoints. */
    readonly sc2: Sc2Api;
    /** Diablo III endpoints. */
    readonly diablo3: Diablo3Api;
    /** The client configuration. */
    readonly config: Readonly<Partial<ClientConfig>>;

    /**
     * Obtains a client credentials access token, reusing the cached one while it is valid.
     * Requests authenticate automatically; calling this is optional.
     * @param {boolean} [forceNewToken] - If true, fetches a new token even if the cached one is valid.
     */
    authenticate(forceNewToken?: boolean): Promise<string>;
    /** Returns a copy of the client credentials token state. */
    getAuthConfig(): AuthConfig;
    /**
     * Makes an authenticated request to a full href returned in an API response.
     * @param {string} href - The full href URL.
     * @param {Record<string, string | number>} [qs] - Optional query string parameters to append.
     */
    requestHref(href: string, qs?: Record<string, string | number>): Promise<unknown>;
    /**
     * Returns a client that uses the given user access token for user-scoped endpoints (e.g. the WoW account profile).
     * It shares configuration and the client credentials token with this client, so it is cheap to create per request.
     * @param {string} userToken - A user access token, e.g. `access_token` from exchangeCode().
     */
    forUser(userToken: string): BlizzardClient;
    /**
     * Builds the URL to send a user to for the authorization code flow.
     * @param {AuthorizeUrlOptions} options - Redirect URI, scopes (e.g. ["wow.profile"]) and state.
     */
    authorizeUrl(options: AuthorizeUrlOptions): string;
    /**
     * Exchanges an authorization code for a user access token.
     * @param {ExchangeCodeOptions} options - The code and the redirect URI used to obtain it.
     */
    exchangeCode(options: ExchangeCodeOptions): Promise<TokenResponse>;
}

/**
 * Wraps a context in a client object.
 * @param {ApiContext} ctx - The context to wrap.
 * @returns {BlizzardClient} The client.
 */
export function clientFromContext(ctx: ApiContext): BlizzardClient {
    return Object.freeze({
        wow: bindAll(ctx, wowEndpoints),
        wowClassic: bindAll(ctx.withNamespaceVariant("classic"), wowClassicEndpoints),
        wowClassicEra: bindAll(ctx.withNamespaceVariant("classic1x"), wowClassicEraEndpoints),
        // bind() keeps metadata<T> generic at runtime; the mapped Bound type cannot, so use the generated interface.
        hearthstone: bindAll(ctx, hearthstoneEndpoints) as unknown as HearthstoneApi,
        sc2: bindAll(ctx, sc2Endpoints),
        diablo3: bindAll(ctx, diablo3Endpoints),
        get config() {
            return ctx.config;
        },
        authenticate: (forceNewToken?: boolean) => ctx.authenticate(forceNewToken),
        getAuthConfig: () => ctx.getAuthConfig(),
        requestHref: (href: string, qs?: Record<string, string | number>) => ctx.requestHref(href, qs),
        forUser: (userToken: string) => clientFromContext(ctx.forUser(userToken)),
        authorizeUrl: (options: AuthorizeUrlOptions) => ctx.authorizeUrl(options),
        exchangeCode: (options: ExchangeCodeOptions) => ctx.exchangeCode(options),
    });
}

/**
 * Creates a Blizzard API client with its own configuration and token state.
 *
 * @example
 * ```ts
 * const client = createClient({ region: "eu", locale: "en_GB", clientId, clientSecret });
 * const mount = await client.wow.mount(6);
 * ```
 *
 * @param {ClientConfig} config - Region, locale and OAuth client credentials.
 * @returns {BlizzardClient} The client.
 * @throws {MissingRegionError | MissingClientIdError | MissingClientSecretError} If the configuration is incomplete.
 */
export function createClient(config: ClientConfig): BlizzardClient {
    const copy = { ...config };
    assertConfig(copy);
    return clientFromContext(new ApiContext(copy));
}
