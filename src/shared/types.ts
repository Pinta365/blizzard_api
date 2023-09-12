export interface requestOptions {
    method: "GET";
    url: string;
    namespace?: Namespaces;
    qs?: Record<string, string>;
}

export type Regions = "us" | "eu" | "kr" | "tw" | "cn";

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

export type Namespaces = "static" | "dynamic" | "profile";

/** Self-referential link */
export interface LinkSelfHref {
    self: {
        href: string;
    };
}

/** Represents a single string if localization was supplied in request or an object of localized key-value strings if not */
export interface LocalizedString {
    name: string | Record<Locales, string>;
}

export interface KeyNameId {
    key: {
        href: string;
    };
    name: LocalizedString;
    id: number;
}

export interface KeyId {
    key: {
        href: string;
    };
    id: number;
}

export interface NameId {
    name: LocalizedString;
    id: number;
}
