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

export function setup(userConfig: Partial<Config>) {
    config = { ...config, ...userConfig };
}

export function getSetup(): Config {
    return config;
}
