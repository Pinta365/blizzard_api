import type { Locales, Regions } from "./types.ts";

interface Config {
    region: Regions;
    locale: Locales;
    clientId: string;
    ClientSecret: string;
}

let config: Config = {
    region: "eu",
    locale: "en_GB",
    clientId: "",
    ClientSecret: "",
};

export function tokenUrl(region: Regions) {
    return region === "cn" ? "https://www.battlenet.com.cn/oauth/token" : `https://${region}.battle.net/oauth/token`;
}

export function apiBaseUrl(region: Regions) {
    return region === "cn" ? "https://gateway.battlenet.com.cn" : `https://${region}.api.blizzard.com`;
}

export function setup(userConfig: Partial<Config>) {
    config = { ...config, ...userConfig };
}

export function getSetup(): Config {
    return config;
}
