export interface requestOptions {
    method: "GET";
    url: string;
    namespace?: Namespaces;
    qs?: Record<string, string>;
}

export interface LinkSelfHref {
    self: {
        href: string;
    };
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



