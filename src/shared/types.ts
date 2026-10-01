//types.ts

/**
 * Represents the configuration options for an API request.
 * @property {string} method - The HTTP method to use (currently restricted to "GET").
 * @property {string} url - The API endpoint path.
 * @property {Namespaces} [namespace] - The optional Battle.net namespace for the request.
 * @property {Record<string, string | number>} [qs] - An optional object for query string parameters.
 * @property {"user"} [auth] - Set to "user" for endpoints that require a user access token (authorization code flow).
 */
export interface RequestOptions {
    method: "GET";
    url: string;
    namespace?: Namespaces;
    qs?: Record<string, string | number>;
    auth?: "user";
}

/**
 * Supported Battle.net regions.
 */
export type Regions = "us" | "eu" | "kr" | "tw" | "cn";

/**
 * Supported locales for data.
 */
export type Locales =
    | "en_US"
    | "es_MX"
    | "pt_BR"
    | "en_GB"
    | "es_ES"
    | "fr_FR"
    | "ru_RU"
    | "de_DE"
    | "pt_PT"
    | "it_IT"
    | "ko_KR"
    | "zh_TW"
    | "zh_CN";

/**
 * Available Battle.net namespaces.
 */
export type Namespaces =
    | "static"
    | "dynamic"
    | "profile"
    | //Retail
    "static-classic1x"
    | "dynamic-classic1x"
    | "profile-classic1x"
    | //Classic
    "static-classic"
    | "dynamic-classic"
    | "profile-classic"; //Classic Cataclysm

/**
 * Represents a reference (link) with a URL.
 */
export interface Href {
    /**
     * The URL or address of the reference.
     */
    href: string;
}

/**
 * Represents the self link found at the top of most API responses.
 */
export interface LinkSelfHref {
    _links: {
        self: Href;
    };
}

/**
 * Represents localized text. The client always sends a locale (the configured one, or the region's default), so
 * localized fields are plain strings.
 */
export type LocalizedString = string;

/**
 * Represents an object with a key (link), ID and LocalizedString name.
 */
export interface KeyNameId {
    key: {
        href: string;
    };
    name: LocalizedString;
    id: number;
}

/**
 * Represents a reference to another resource: a key (link), a name and an ID.
 */
export interface NamedRef {
    key: Href;
    name: string;
    id: number;
}

/**
 * Represents an object with a key (link) and LocalizedString name.
 */
export interface KeyName {
    key: {
        href: string;
    };
    name: LocalizedString;
}

/**
 * Represents an object with a key (link) and ID.
 */
export interface KeyId {
    key: {
        href: string;
    };
    id: number;
}

/**
 * Represents an object with LocalizedString name and ID.
 */
export interface NameId {
    name: LocalizedString;
    id: number;
}

/**
 * Represents an object with a type and a LocalizedString name.
 */
export interface TypeName {
    type: string;
    name: LocalizedString;
}

/**
 * Represents a character profile.
 */
export interface Character {
    key?: {
        href: string;
    };
    name: string;
    id: number;
    realm: {
        key: {
            href: string;
        };
        name: LocalizedString;
        id: number;
        slug: string;
    };
    level?: number;
    playable_class?: KeyId;
    playable_race?: KeyId;
}

/**
 * Represents a generic asset within a system.
 * @property {string} key - A unique identifier for the asset.
 * @property {string} value - The value associated with the asset.
 * @property {number} [file_data_id] - (Optional) The ID of the file data associated with the asset (if any).
 */
export interface Asset {
    key: string;
    value: string;
    file_data_id?: number;
}
