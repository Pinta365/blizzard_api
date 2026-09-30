//context.ts
import type { Locales, Regions, RequestOptions } from "./types.ts";
import {
    APIError,
    AuthenticationError,
    MissingClientIdError,
    MissingClientSecretError,
    MissingRegionError,
    MissingUserTokenError,
} from "./errors.ts";

/**
 * Represents the configuration of a client.
 * @property {Regions} region - The target Battle.net region for API requests.
 * @property {Locales} [locale] - The desired locale for data. When omitted, localized fields contain every locale.
 * @property {string} clientId - The OAuth client ID.
 * @property {string} clientSecret - The OAuth client secret.
 */
export interface ClientConfig {
    region: Regions;
    locale?: Locales;
    clientId: string;
    clientSecret: string;
}

/**
 * Represents the authentication state of the client credentials token.
 * @property {string} accessToken - The current access token.
 * @property {number} tokenExpiration - The expiration timestamp of the access token (in milliseconds).
 */
export interface AuthConfig {
    accessToken: string;
    tokenExpiration: number;
}

/**
 * Options for building the authorization code flow URL.
 * @property {string} redirectUri - The redirect URI registered for the client.
 * @property {string[]} [scope] - The requested scopes, e.g. ["wow.profile"]. "openid" is always included.
 * @property {string} state - An opaque, unguessable value to protect against CSRF. Verify it on the redirect.
 */
export interface AuthorizeUrlOptions {
    redirectUri: string;
    scope?: string[];
    state: string;
}

/**
 * Options for exchanging an authorization code for a user access token.
 * @property {string} code - The code received on the redirect URI.
 * @property {string} redirectUri - The same redirect URI used to build the authorize URL.
 */
export interface ExchangeCodeOptions {
    code: string;
    redirectUri: string;
}

/**
 * Represents the token response of the OAuth token endpoint.
 */
export interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope?: string;
    sub?: string;
    id_token?: string;
}

interface BlizzardAPIErrorResponse {
    code?: number;
    detail?: string;
    type?: string;
}

interface TokenState extends AuthConfig {
    pending?: Promise<string>;
}

/**
 * Renew the token this long before it actually expires, so in-flight requests don't race the expiry.
 */
const TOKEN_EXPIRY_MARGIN_MS = 60_000;

/**
 * Generates the OAuth base URL based on the specified region.
 * @param {Regions} region - The target Battle.net region.
 * @returns {string} The OAuth base URL.
 */
export function oauthBaseUrl(region: Regions): string {
    return region === "cn" ? "https://oauth.battlenet.com.cn" : "https://oauth.battle.net";
}

/**
 * Generates the base API URL based on the specified region.
 * @param {Regions} region - The target Battle.net region.
 * @returns {string} The constructed base API URL.
 */
export function apiBaseUrl(region: Regions): string {
    return region === "cn" ? "https://gateway.battlenet.com.cn" : `https://${region}.api.blizzard.com`;
}

/**
 * Validates that a configuration has everything needed to make requests.
 * @throws {MissingRegionError | MissingClientIdError | MissingClientSecretError}
 */
export function assertConfig(config: Partial<ClientConfig>): asserts config is ClientConfig {
    if (!config.region) throw new MissingRegionError();
    if (!config.clientId) throw new MissingClientIdError();
    if (!config.clientSecret) throw new MissingClientSecretError();
}

function toQueryParams(qs?: Record<string, string | number | undefined>): Record<string, string> {
    return qs
        ? Object.fromEntries(
            Object.entries(qs).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]),
        )
        : {};
}

/**
 * Holds the configuration and token state of one client and performs its requests.
 * Every endpoint function takes an ApiContext as its first argument.
 */
export class ApiContext {
    readonly #config: Partial<ClientConfig>;
    readonly #token: TokenState;
    readonly #userToken?: string;

    /**
     * @param {Partial<ClientConfig>} config - The client configuration. Shared by reference with contexts made by forUser().
     * @param {TokenState} [token] - Token state to share (used by forUser()).
     * @param {string} [userToken] - A user access token from the authorization code flow.
     */
    constructor(config: Partial<ClientConfig> = {}, token?: TokenState, userToken?: string) {
        this.#config = config;
        this.#token = token ?? { accessToken: "", tokenExpiration: 0 };
        this.#userToken = userToken;
    }

    /**
     * The current configuration (may be partial if not fully set up).
     */
    get config(): Readonly<Partial<ClientConfig>> {
        return this.#config;
    }

    /**
     * Merges configuration into this context. Changing the region or credentials discards the cached token.
     * @param {Partial<ClientConfig>} config - The configuration properties to update.
     */
    configure(config: Partial<ClientConfig>): void {
        const invalidatesToken = (["region", "clientId", "clientSecret"] as const).some((key) =>
            key in config && config[key] !== this.#config[key]
        );
        Object.assign(this.#config, config);
        if (invalidatesToken) {
            this.#token.accessToken = "";
            this.#token.tokenExpiration = 0;
        }
    }

    /**
     * Returns a copy of the client credentials token state.
     */
    getAuthConfig(): AuthConfig {
        return { accessToken: this.#token.accessToken, tokenExpiration: this.#token.tokenExpiration };
    }

    /**
     * Returns a context that uses the given user access token for user-scoped endpoints
     * (e.g. the WoW account profile). It shares configuration and the client credentials token with this context.
     * @param {string} userToken - A user access token from the authorization code flow.
     */
    forUser(userToken: string): ApiContext {
        return new ApiContext(this.#config, this.#token, userToken);
    }

    /**
     * Obtains a client credentials access token, reusing the cached one while it is valid.
     * Concurrent callers share a single token request.
     * @param {boolean} forceNewToken - If true, fetches a new token even if the cached one is valid.
     * @returns {Promise<string>} The access token.
     * @throws {MissingRegionError | MissingClientIdError | MissingClientSecretError} If the client is not configured.
     * @throws {AuthenticationError} If there is a problem during the authentication process.
     */
    authenticate(forceNewToken = false): Promise<string> {
        const config = this.#config;
        assertConfig(config);
        const token = this.#token;

        if (!forceNewToken && token.accessToken && Date.now() < token.tokenExpiration - TOKEN_EXPIRY_MARGIN_MS) {
            return Promise.resolve(token.accessToken);
        }
        if (token.pending) {
            return token.pending;
        }

        token.pending = this.#requestToken(config, "grant_type=client_credentials")
            .then((data) => {
                token.accessToken = data.access_token;
                token.tokenExpiration = Date.now() + data.expires_in * 1000;
                return token.accessToken;
            })
            .finally(() => {
                token.pending = undefined;
            });
        return token.pending;
    }

    /**
     * Builds the URL to send a user to for the authorization code flow.
     * @param {AuthorizeUrlOptions} options - Redirect URI, scopes and state.
     * @returns {string} The authorize URL.
     */
    authorizeUrl(options: AuthorizeUrlOptions): string {
        const config = this.#config;
        assertConfig(config);
        const scope = new Set(["openid", ...(options.scope ?? [])]);
        const params = new URLSearchParams({
            response_type: "code",
            client_id: config.clientId,
            redirect_uri: options.redirectUri,
            scope: [...scope].join(" "),
            state: options.state,
        });
        return `${oauthBaseUrl(config.region)}/authorize?${params}`;
    }

    /**
     * Exchanges an authorization code for a user access token.
     * @param {ExchangeCodeOptions} options - The code and the redirect URI used to obtain it.
     * @returns {Promise<TokenResponse>} The token response; pass `access_token` to forUser().
     * @throws {AuthenticationError} If the exchange fails.
     */
    exchangeCode(options: ExchangeCodeOptions): Promise<TokenResponse> {
        const config = this.#config;
        assertConfig(config);
        const body = new URLSearchParams({
            grant_type: "authorization_code",
            code: options.code,
            redirect_uri: options.redirectUri,
        });
        return this.#requestToken(config, body.toString());
    }

    /**
     * Makes an authenticated request to the API.
     * @param {RequestOptions} requestOptions - Method, path, namespace, query string and auth mode.
     * @returns {Promise<unknown>} The parsed JSON response.
     * @throws {APIError} If the response is not successful.
     * @throws {MissingUserTokenError} If the endpoint needs a user token and this context has none.
     */
    request(requestOptions: RequestOptions): Promise<unknown> {
        const config = this.#config;
        assertConfig(config);
        const { url, namespace, qs, auth } = requestOptions;
        const params = new URLSearchParams(toQueryParams({ locale: config.locale, ...qs }));
        const query = params.size ? `?${params}` : "";
        const fullUrl = apiBaseUrl(config.region) + encodeURI(url) + query;
        return this.#send(fullUrl, namespace ? `${namespace}-${config.region}` : undefined, auth === "user");
    }

    /**
     * Makes an authenticated request to a full href returned in an API response.
     * @param {string} href - The full href URL from a Blizzard API response.
     * @param {Record<string, string | number>} [qs] - Optional query string parameters to append.
     * @returns {Promise<unknown>} The parsed JSON response.
     * @throws {APIError} If the response is not successful.
     */
    requestHref(href: string, qs?: Record<string, string | number>): Promise<unknown> {
        const config = this.#config;
        assertConfig(config);
        const url = new URL(href);
        for (const [key, value] of Object.entries(toQueryParams({ locale: config.locale, ...qs }))) {
            if (!url.searchParams.has(key)) url.searchParams.set(key, value);
        }
        // Hrefs from the API already carry their full namespace in the query string.
        return this.#send(url.toString(), undefined, url.pathname.startsWith("/profile/user/"));
    }

    async #send(url: string, namespaceHeader: string | undefined, userScoped: boolean): Promise<unknown> {
        if (userScoped && !this.#userToken) {
            throw new MissingUserTokenError();
        }

        const doFetch = async (forceNewToken: boolean) => {
            const token = userScoped ? this.#userToken! : await this.authenticate(forceNewToken);
            const headers: Record<string, string> = { "Authorization": `Bearer ${token}` };
            if (namespaceHeader) headers["Battlenet-Namespace"] = namespaceHeader;
            return await fetch(url, { method: "GET", headers });
        };

        let response = await doFetch(false);
        if (response.status === 401 && !userScoped) {
            // The cached token may have been revoked or expired early; retry once with a fresh one.
            await response.body?.cancel();
            response = await doFetch(true);
        }

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

    async #requestToken(config: ClientConfig, body: string): Promise<TokenResponse> {
        const response = await fetch(`${oauthBaseUrl(config.region)}/token`, {
            method: "POST",
            headers: {
                "Authorization": "Basic " + btoa(`${config.clientId}:${config.clientSecret}`),
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
        });

        if (!response.ok) {
            throw new AuthenticationError("Problem with Authentication", response.status, await response.text());
        }
        return await response.json() as TokenResponse;
    }
}
