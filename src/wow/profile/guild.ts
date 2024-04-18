import {
    Character,
    Href,
    KeyId,
    KeyNameId,
    LinkSelfHref,
    LocalizedString,
    request,
    TypeName,
} from "../../shared/index.ts";

export interface Rgba {
    r: number;
    g: number;
    b: number;
    a: number;
}
export interface CrestAsset {
    id?: number;
    media?: KeyId;
    color: {
        id: number;
        rgba: Rgba;
    };
}

export interface Guild extends LinkSelfHref {
    key?: Href;
    id: number;
    name: string;
    faction: TypeName;
    achievement_points?: number;
    member_count?: number;
    realm: {
        key: Href;
        name: LocalizedString;
        id: number;
        slug: string;
    };
    crest?: {
        emblem: CrestAsset;
        border: CrestAsset;
        background: CrestAsset;
    };
    roster?: Href;
    achievements?: Href;
    created_timestamp?: number;
    activity?: Href;
}

export interface GuildActivity extends LinkSelfHref {
    guild: Guild;
    activities: {
        character_achievement: {
            character: Character;
            achievement: KeyNameId;
        };
        activity: {
            type: string;
        };
        timestamp: number;
    }[];
}

export interface Critiera {
    id: number;
    amount?: number;
    is_completed: boolean;
    child_criteria?: Critiera[];
}

export interface GuildAchievements extends LinkSelfHref {
    guild: Guild;
    total_quantity: number;
    total_points: number;
    achievements: {
        id: number;
        achievement: KeyNameId;
        criteria: Critiera;
        completed_timestamp: number;
    }[];
    category_progress: {
        category: KeyNameId;
        quantity: number;
        points: number;
    }[];
    recent_events: {
        achievement: KeyNameId;
        timestamp: number;
    }[];
}

export interface GuildRoster extends LinkSelfHref {
    guild: Guild;
    members: {
        character: Character;
        rank: number;
    }[];
}

/**
 * Returns a single guild by its name and realm.
 *
 * @param realmSlug - The slug of the realm.
 * @param nameSlug - The slug of the guild.
 * @returns A promise that resolves to an object representing a single guild by its name and realm.
 */
export async function guild(
    realmSlug: string,
    nameSlug: string,
): Promise<Guild> {
    return await request({
        method: "GET",
        url: `/data/wow/guild/${realmSlug}/${nameSlug}`,
        namespace: "profile",
    });
}

/**
 * Returns a single guild's activity by name and realm.
 *
 * @param realmSlug - The slug of the realm.
 * @param nameSlug - The slug of the guild.
 * @returns A promise that resolves to an object representing a single guild's activity by its name and realm.
 */
export async function guildActivity(
    realmSlug: string,
    nameSlug: string,
): Promise<GuildActivity> {
    return await request({
        method: "GET",
        url: `/data/wow/guild/${realmSlug}/${nameSlug}/activity`,
        namespace: "profile",
    });
}

/**
 * Returns a single guild's achievements by name and realm.
 *
 * @param realmSlug - The slug of the realm.
 * @param nameSlug - The slug of the guild.
 * @returns A promise that resolves to an object representing a single guild's achievements by its name and realm.
 */
export async function guildAchievements(
    realmSlug: string,
    nameSlug: string,
): Promise<GuildAchievements> {
    return await request({
        method: "GET",
        url: `/data/wow/guild/${realmSlug}/${nameSlug}/achievements`,
        namespace: "profile",
    });
}

/**
 * Returns a single guild's roster by its name and realm.
 *
 * @param realmSlug - The slug of the realm.
 * @param nameSlug - The slug of the guild.
 * @returns A promise that resolves to an object representing a single guild's roster by its name and realm.
 */
export async function guildRoster(
    realmSlug: string,
    nameSlug: string,
): Promise<GuildRoster> {
    return await request({
        method: "GET",
        url: `/data/wow/guild/${realmSlug}/${nameSlug}/roster`,
        namespace: "profile",
    });
}
