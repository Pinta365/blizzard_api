import type { Locales, Regions } from "./types.ts";
import { MissingClientIdError, MissingClientSecretError, MissingRegionError } from "./errors.ts";

interface Config {
    region: Regions;
    locale: Locales;
    clientId: string;
    clientSecret: string;
}

let config: Partial<Config> = {};

export function tokenUrl(region: Regions) {
    return region === "cn" ? "https://www.battlenet.com.cn/oauth/token" : `https://${region}.battle.net/oauth/token`;
}

export function apiBaseUrl(region: Regions) {
    return region === "cn" ? "https://gateway.battlenet.com.cn" : `https://${region}.api.blizzard.com`;
}

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

export function getSetup(): Config | Partial<Config> {
    return config;
}
