/**
 * WoW: Forever guild endpoints. Forever guilds are realmless: a guild is identified by its name slug alone
 * (`/data/wow/guild/{nameSlug}`) and belongs to a ruleset instead of a realm.
 * Verified against the live API (EU) on 2026-11-05.
 */

import type { ApiContext, Href, KeyId, KeyNameId, LinkSelfHref, LocalizedString, TypeName } from "../shared/index.ts";
import type { Guild, GuildAchievements, GuildActivity } from "../wow/profile/guild.ts";
import type { ForeverCharacterRef } from "./character.ts";

/** A reference to a Forever guild, as found in the `guild` field of the guild endpoints. */
export interface ForeverGuildRef {
    key: Href;
    name: LocalizedString;
    id: number;
    faction: TypeName;
    slug: string;
}

/** Guild as returned for Forever. */
export interface ForeverGuild extends Omit<Guild, "key" | "realm"> {
    slug: string;
    /** The guild's ruleset (Normal, PvP, Roleplay, Roleplay PvP). */
    ruleset: KeyNameId;
}

/**
 * Guild achievements as returned for Forever. `total_quantity`, `total_points` and `achievements` are absent while
 * the guild has no achievement progress.
 */
export interface ForeverGuildAchievements
    extends
        Partial<Pick<GuildAchievements, "total_quantity" | "total_points" | "achievements">>,
        Pick<GuildAchievements, "category_progress" | "recent_events"> {
    _links: { self: Href };
    guild: ForeverGuildRef;
}

/** Guild activity as returned for Forever. */
export interface ForeverGuildActivity extends Omit<GuildActivity, "guild" | "activities"> {
    guild: ForeverGuildRef;
    /** Absent while the guild has no recent activity. */
    activities?: (Omit<NonNullable<GuildActivity["activities"]>[number], "character_achievement"> & {
        character_achievement?: {
            character: ForeverCharacterRef;
            achievement: KeyNameId;
        };
    })[];
}

/** A guild member in the Forever guild roster. */
export interface ForeverGuildRosterMemberCharacter extends ForeverCharacterRef {
    level: number;
    playable_class: KeyId;
    playable_race: KeyId;
    faction: {
        type: string;
    };
}

/** Guild roster as returned for Forever. */
export interface ForeverGuildRoster extends LinkSelfHref {
    guild: ForeverGuildRef;
    members: {
        character: ForeverGuildRosterMemberCharacter;
        rank: number;
    }[];
}

/**
 * Returns a single guild by its name slug.
 *
 * @param nameSlug - The slug of the guild, e.g. "unbound".
 * @returns A promise that resolves to an object representing the guild.
 */
export async function guild(ctx: ApiContext, nameSlug: string): Promise<ForeverGuild> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/guild/${nameSlug}`,
        namespace: "profile",
    }) as ForeverGuild;
}

/**
 * Returns a guild's recent activity.
 *
 * @param nameSlug - The slug of the guild.
 * @returns A promise that resolves to an object representing the guild's activity.
 */
export async function guildActivity(ctx: ApiContext, nameSlug: string): Promise<ForeverGuildActivity> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/guild/${nameSlug}/activity`,
        namespace: "profile",
    }) as ForeverGuildActivity;
}

/**
 * Returns a guild's achievements.
 *
 * @param nameSlug - The slug of the guild.
 * @returns A promise that resolves to an object representing the guild's achievements.
 */
export async function guildAchievements(ctx: ApiContext, nameSlug: string): Promise<ForeverGuildAchievements> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/guild/${nameSlug}/achievements`,
        namespace: "profile",
    }) as ForeverGuildAchievements;
}

/**
 * Returns a guild's roster.
 *
 * @param nameSlug - The slug of the guild.
 * @returns A promise that resolves to an object representing the guild's roster.
 */
export async function guildRoster(ctx: ApiContext, nameSlug: string): Promise<ForeverGuildRoster> {
    return await ctx.request({
        method: "GET",
        url: `/data/wow/guild/${nameSlug}/roster`,
        namespace: "profile",
    }) as ForeverGuildRoster;
}
