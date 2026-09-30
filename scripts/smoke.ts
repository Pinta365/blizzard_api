// scripts/smoke.ts
//
// Live smoke test for the Blizzard API library.
//
// Usage:
//   deno run --env-file=.env -A scripts/smoke.ts [filter]
//
// Reads BLIZZARD_CLIENT_ID / BLIZZARD_CLIENT_SECRET from the environment plus
// the optional BLIZZARD_REGION (default "eu"), BLIZZARD_LOCALE (default
// "en_GB") and BLIZZARD_USER_TOKEN (for the account profile cases, which are
// skipped when it is unset). Successful raw responses are written to
// fixtures/<case>.json.

import { createClient, errors, setup, wow as legacyWow } from "../mod.ts";
import type { BlizzardClient } from "../mod.ts";
import type { Locales, Regions } from "../src/shared/types.ts";

const REALM_SLUG = "silvermoon";
const ITEM_ID = 19019;
const MOUNT_ID = 6;
const ARTISAN_SLUG = "blacksmith";
const FOLLOWER_SLUG = "templar";
const HERO_SLUG = "barbarian";
const USER_TOKEN = Deno.env.get("BLIZZARD_USER_TOKEN");

// The primary client is created in main() from the environment configuration.
let config: Parameters<typeof createClient>[0];
let client!: ReturnType<typeof createClient>;
let userClient: ReturnType<typeof createClient> | undefined;

function requireUserClient(): ReturnType<typeof createClient> {
    if (!userClient) throw new Error("needs BLIZZARD_USER_TOKEN");
    return userClient;
}

// ---------------------------------------------------------------------------
// Small shared helpers
// ---------------------------------------------------------------------------

type JsonObject = Record<string, unknown>;

interface Case {
    name: string;
    fn: () => Promise<unknown>;
    skip?: string;
    allow404?: string;
}

interface Result {
    name: string;
    status: "ok" | "pass" | "failed" | "skipped";
    durationMs: number;
    detail?: string;
}

/** Thrown by a case when its prerequisites aren't available; counted as skipped, not failed. */
class SkipError extends Error {
    constructor(reason: string) {
        super(reason);
        this.name = "SkipError";
    }
}

function isObject(value: unknown): value is JsonObject {
    return typeof value === "object" && value !== null;
}

function asNumber(value: unknown): number {
    const parsed = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(parsed)) {
        throw new Error(`expected a numeric id, got ${JSON.stringify(value)}`);
    }
    return parsed;
}

function idFromHref(href: string): number {
    const match = href.match(/\/(\d+)(?:[/?#]|$)/);
    if (!match) {
        throw new Error(`could not find a numeric id in href: ${href}`);
    }
    return Number(match[1]);
}

function lastSegment(href: string): string {
    const clean = href.split("?")[0].replace(/\/+$/, "");
    const segment = clean.split("/").pop();
    if (!segment) {
        throw new Error(`could not find a path segment in href: ${href}`);
    }
    return segment;
}

function localize(value: unknown): string {
    if (typeof value === "string") return value;
    if (isObject(value)) {
        if (typeof value.name === "string") return value.name;
        if (isObject(value.name)) {
            for (const localized of Object.values(value.name)) {
                if (typeof localized === "string") return localized;
            }
        }
    }
    throw new Error(`could not localize value: ${JSON.stringify(value)}`);
}

function isAscii(value: string): boolean {
    for (const char of value) {
        if ((char.codePointAt(0) ?? 0) > 0x7f) return false;
    }
    return true;
}

interface TalentTreeLink {
    id?: number;
    key?: { href?: string };
}

function talentTreeLinks(source: unknown, key: string): TalentTreeLink[] {
    if (isObject(source)) {
        const value = source[key];
        if (Array.isArray(value)) return value as TalentTreeLink[];
        if (isObject(value)) return [value as TalentTreeLink];
    }
    return [];
}

function talentTreeIds(href: string): { treeId: number; specId: number } {
    const match = href.match(/\/talent-tree\/(\d+)\/playable-specialization\/(\d+)/);
    if (!match) throw new Error(`unexpected talent tree href: ${href}`);
    return { treeId: Number(match[1]), specId: Number(match[2]) };
}

function findFirstArray(value: unknown): unknown[] | undefined {
    if (Array.isArray(value)) return value;
    if (isObject(value)) {
        for (const nested of Object.values(value)) {
            const found = findFirstArray(nested);
            if (found) return found;
        }
    }
    return undefined;
}

function pick(source: unknown, key: string): unknown {
    if (isObject(source)) {
        const value = source[key];
        if (Array.isArray(value) && value.length > 0) return value[0];
    }
    throw new Error(`index has no entries at "${key}"`);
}

function firstEntry(source: unknown, arrayKey?: string): unknown {
    if (arrayKey) return pick(source, arrayKey);
    const array = findFirstArray(source);
    if (!array || array.length === 0) {
        throw new Error("index contained no entries");
    }
    return array[0];
}

function entryIdNum(entry: unknown): number {
    if (isObject(entry)) {
        const raw = entry.id;
        if (typeof raw === "number") return raw;
        if (typeof raw === "string") return asNumber(raw);
        if (isObject(entry.key) && typeof entry.key.href === "string") {
            return idFromHref(entry.key.href);
        }
        if (typeof entry.href === "string") return idFromHref(entry.href);
    }
    throw new Error(`could not determine id from entry: ${JSON.stringify(entry)}`);
}

function entryIdStr(entry: unknown): string {
    if (isObject(entry)) {
        const raw = entry.id ?? entry.slug ?? entry.href;
        if (typeof raw === "string" || typeof raw === "number") return String(raw);
        if (isObject(entry.key) && typeof entry.key.href === "string") {
            return lastSegment(entry.key.href);
        }
    }
    throw new Error(`could not determine slug from entry: ${JSON.stringify(entry)}`);
}

function indexId(source: unknown, arrayKey?: string): number {
    return entryIdNum(firstEntry(source, arrayKey));
}

function firstResult(result: unknown): unknown {
    if (isObject(result) && Array.isArray(result.results) && result.results.length > 0) {
        const first = result.results[0];
        return isObject(first) && isObject(first.data) ? first.data : first;
    }
    const array = findFirstArray(result);
    if (!array || array.length === 0) throw new Error("response contained no results");
    return array[0];
}

function searchFirstId(result: unknown): number {
    return entryIdNum(firstResult(result));
}

function searchFirstStr(result: unknown): string {
    return entryIdStr(firstResult(result));
}

// ---------------------------------------------------------------------------
// Memoization (avoids refetching the same index for dozens of detail cases)
// ---------------------------------------------------------------------------

const onceCache = new Map<string, Promise<unknown>>();

function once<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const cached = onceCache.get(key);
    if (cached) return cached as Promise<T>;
    const value = fn();
    onceCache.set(key, value);
    return value;
}

function detail(
    key: string,
    indexFn: () => Promise<unknown>,
    fn: (id: number) => Promise<unknown>,
    arrayKey?: string,
): () => Promise<unknown> {
    return async () => {
        const source = await once(key, indexFn);
        return await fn(indexId(source, arrayKey));
    };
}

function detailStr(
    key: string,
    indexFn: () => Promise<unknown>,
    fn: (id: string) => Promise<unknown>,
    arrayKey?: string,
): () => Promise<unknown> {
    return async () => {
        const source = await once(key, indexFn);
        return await fn(String(indexId(source, arrayKey)));
    };
}

function connectedRealmId(): Promise<number> {
    return once("wow.connectedRealms", () => client.wow.connectedRealms()).then((source) => indexId(source));
}

function searchedSpellId(): Promise<number> {
    return once("wow.searchSpell", () => client.wow.searchSpell({ pageSize: 1 })).then((result) =>
        searchFirstId(result)
    );
}

function firstRecipeId(): Promise<number> {
    return once("wow.firstRecipe", async () => {
        const professions = await client.wow.professions();
        const professionId = indexId(professions);
        const profession = await client.wow.profession(professionId);
        const tierId = profession.skill_tiers[0]?.id;
        if (tierId === undefined) throw new Error("profession has no skill tiers");
        const tier = await client.wow.professionSkillTier(professionId, tierId);
        const recipe = tier.categories[0]?.recipes[0];
        if (!recipe) throw new Error("skill tier has no recipes");
        return recipe.id;
    });
}

function newestPvpSeasonId(): Promise<number> {
    return once("wow.pvpSeasons", () => client.wow.pvpSeasons()).then((seasons) => {
        const list = seasons.seasons;
        const last = list[list.length - 1];
        const id = seasons.current_season?.id ?? last?.id;
        if (id === undefined) throw new Error("pvp season index contained no seasons");
        return id;
    });
}

// ---------------------------------------------------------------------------
// Real character / guild discovery (chained at runtime)
// ---------------------------------------------------------------------------

interface SmokeContext {
    realm: string;
    name: string;
    guildRealm: string;
    guildSlug: string;
}

let contextPromise: Promise<SmokeContext> | undefined;

function getContext(): Promise<SmokeContext> {
    contextPromise ??= discoverContext();
    return contextPromise;
}

async function discoverContext(): Promise<SmokeContext> {
    const realm = await client.wow.realm(REALM_SLUG);
    const realmId = idFromHref(realm.connected_realm.href);
    const periods = await client.wow.mythicKeystonePeriods();
    const period = periods.current_period.id;
    const leaderboards = await client.wow.mythicKeystoneLeaderboards(realmId);
    const dungeon = leaderboards.current_leaderboards[0];
    if (!dungeon) throw new Error("no current mythic keystone leaderboards available");
    const leaderboard = await client.wow.mythicKeystoneLeaderboard(realmId, dungeon.id, period);

    const ascii: SmokeContext[] = [];
    const any: SmokeContext[] = [];
    let characterOnly: SmokeContext | undefined;

    // Members on REALM_SLUG first, and at most MAX_PROFILE_LOOKUPS profile fetches:
    // this runs sequentially and blocks every profile/guild case.
    const MAX_PROFILE_LOOKUPS = 20;
    const members = leaderboard.leading_groups.flatMap((group) => group.members)
        .sort((a, b) => Number(b.profile.realm.slug === REALM_SLUG) - Number(a.profile.realm.slug === REALM_SLUG))
        .slice(0, MAX_PROFILE_LOOKUPS);

    for (const member of members) {
        const memberRealm = member.profile.realm.slug;
        const memberName = member.profile.name.toLowerCase();
        let profile: Awaited<ReturnType<typeof client.wow.characterProfile>>;
        try {
            profile = await client.wow.characterProfile(memberRealm, memberName);
        } catch {
            continue;
        }
        const character: SmokeContext = {
            realm: memberRealm,
            name: memberName,
            guildRealm: memberRealm,
            guildSlug: "",
        };
        characterOnly ??= character;

        const guild = profile.guild as unknown as
            | { key?: { href?: string }; name?: unknown; realm?: { slug?: string } }
            | null;
        const href = guild?.key?.href;
        if (!href || !guild?.realm || typeof guild.realm.slug !== "string" || guild.name === undefined) {
            continue;
        }
        const entry: SmokeContext = {
            realm: memberRealm,
            name: memberName,
            guildRealm: guild.realm.slug,
            guildSlug: decodeURIComponent(lastSegment(href)),
        };
        if (memberRealm === REALM_SLUG && isAscii(localize(guild.name))) {
            return entry;
        } else if (isAscii(localize(guild.name))) {
            ascii.push(entry);
        } else {
            any.push(entry);
        }
    }

    const chosen = ascii[0] ?? any[0] ?? characterOnly;
    if (chosen) return chosen;
    throw new Error("could not discover a character/guild from the mythic keystone leaderboard");
}

async function profileCall(fn: (realm: string, name: string) => Promise<unknown>): Promise<unknown> {
    const ctx = await getContext();
    return await fn(ctx.realm, ctx.name);
}

async function guildCall(fn: (realm: string, name: string) => Promise<unknown>): Promise<unknown> {
    const ctx = await getContext();
    return await fn(ctx.guildRealm, ctx.guildSlug);
}

// ---------------------------------------------------------------------------
// Cases
// ---------------------------------------------------------------------------

function c(name: string, fn: () => Promise<unknown>, allow404?: string): Case {
    return { name, fn, allow404 };
}

function skipped(name: string, reason: string): Case {
    return { name, fn: () => Promise.resolve(), skip: reason };
}

function userCase(name: string, fn: () => Promise<unknown>): Case {
    return USER_TOKEN ? { name, fn } : { name, fn: () => Promise.resolve(), skip: "needs BLIZZARD_USER_TOKEN" };
}

// ---------------------------------------------------------------------------
// WoW Classic (progression "classic" + Era "classic1x")
// ---------------------------------------------------------------------------

type SharedClassicApi = Pick<
    BlizzardClient["wowClassic"],
    Exclude<
        keyof BlizzardClient["wowClassic"] & keyof BlizzardClient["wowClassicEra"],
        // Era returns a different shape for specializations (talent trees, not loadouts).
        "characterSpecializations"
    >
>;

interface ClassicContext {
    realm: string;
    name: string;
    guildRealm: string;
    guildSlug: string;
}

function guildFromProfile(profile: { guild?: unknown }): { guildRealm: string; guildSlug: string } | undefined {
    const guild = profile.guild as unknown as
        | { key?: { href?: string }; realm?: { slug?: string } }
        | null;
    const href = guild?.key?.href;
    if (!href || !guild?.realm || typeof guild.realm.slug !== "string") return undefined;
    return { guildRealm: guild.realm.slug, guildSlug: decodeURIComponent(lastSegment(href)) };
}

function getProgressionContext(): Promise<ClassicContext> {
    return once("wowClassic.context", async () => {
        const api = client.wowClassic;
        const seasons = await api.pvpSeasons();
        const seasonId = seasons.current_season?.id ?? seasons.seasons[seasons.seasons.length - 1]?.id;
        if (seasonId === undefined) throw new SkipError("no Classic progression PvP season available");
        const leaderboards = await api.pvpSeasonLeaderboards(seasonId);
        let character: { realm: string; name: string } | undefined;
        for (const board of leaderboards.leaderboards) {
            let leaderboard;
            try {
                leaderboard = await api.pvpSeasonLeaderboard(seasonId, board.name);
            } catch {
                continue;
            }
            const entry = leaderboard.entries[0];
            if (!entry) continue;
            const realm = entry.character.realm.slug;
            const name = entry.character.name.toLowerCase();
            character ??= { realm, name };
            let profile;
            try {
                profile = await api.characterProfile(realm, name);
            } catch {
                continue;
            }
            const guild = guildFromProfile(profile);
            if (guild) return { realm, name, ...guild };
        }
        if (character) return { ...character, guildRealm: character.realm, guildSlug: "" };
        throw new SkipError("could not discover a Classic progression character from PvP leaderboards");
    });
}

function getEraContext(): Promise<ClassicContext> {
    return once("wowClassicEra.context", async () => {
        const api = client.wowClassicEra;
        const realm = "dragonfang";
        const name = "aragorn";
        let profile;
        try {
            profile = await api.characterProfile(realm, name);
        } catch {
            throw new SkipError("could not load the Classic Era reference character");
        }
        const guild = guildFromProfile(profile);
        return guild ? { realm, name, ...guild } : { realm, name, guildRealm: realm, guildSlug: "" };
    });
}

function buildSharedClassicCases(
    label: string,
    api: SharedClassicApi,
    getContext: () => Promise<ClassicContext>,
): Case[] {
    const key = (name: string) => `${label}.${name}`;
    const detailCase = (
        name: string,
        indexFn: () => Promise<unknown>,
        fn: (id: number) => Promise<unknown>,
        arrayKey?: string,
    ): Case => c(key(name), detail(key(name), indexFn, fn, arrayKey));
    const profileCase = (
        name: string,
        fn: (realm: string, name: string) => Promise<unknown>,
        allow404?: string,
    ): Case =>
        c(key(name), async () => {
            const ctx = await getContext();
            return await fn(ctx.realm, ctx.name);
        }, allow404);
    const guildCase = (name: string, fn: (realm: string, name: string) => Promise<unknown>): Case =>
        c(key(name), async () => {
            const ctx = await getContext();
            if (!ctx.guildSlug) throw new SkipError("no guild discovered for the reference character");
            return await fn(ctx.guildRealm, ctx.guildSlug);
        });

    return [
        c(key("achievementCategories"), () => api.achievementCategories()),
        detailCase("achievementCategory", () => api.achievementCategories(), api.achievementCategory),
        c(key("achievements"), () => api.achievements()),
        detailCase("achievement", () => api.achievements(), api.achievement),
        detailCase("achievementMedia", () => api.achievements(), api.achievementMedia),
        c(key("connectedRealms"), () => api.connectedRealms()),
        detailCase("connectedRealm", () => api.connectedRealms(), api.connectedRealm),
        c(key("searchConnectedRealm"), () => api.searchConnectedRealm({ pageSize: 1 })),
        c(key("creatureFamilies"), () => api.creatureFamilies()),
        detailCase("creatureFamily", () => api.creatureFamilies(), api.creatureFamily),
        detailCase("creatureFamilyMedia", () => api.creatureFamilies(), api.creatureFamilyMedia),
        c(key("creatureTypes"), () => api.creatureTypes()),
        detailCase("creatureType", () => api.creatureTypes(), api.creatureType),
        c(key("creature"), async () => await api.creature(searchFirstId(await api.searchCreature({ pageSize: 1 })))),
        c(key("searchCreature"), () => api.searchCreature({ pageSize: 1 })),
        c(key("creatureDisplayMedia"), async () => {
            const creature = await api.creature(searchFirstId(await api.searchCreature({ pageSize: 1 })));
            const display = creature.creature_displays[0];
            if (!display) throw new Error("creature has no displays");
            return await api.creatureDisplayMedia(display.id);
        }),
        c(key("guildCrests"), () => api.guildCrests()),
        detailCase("guildCrestBorder", () => api.guildCrests(), api.guildCrestBorder, "borders"),
        detailCase("guildCrestEmblem", () => api.guildCrests(), api.guildCrestEmblem, "emblems"),
        c(key("item"), () => api.item(ITEM_ID)),
        c(key("itemClasses"), () => api.itemClasses()),
        detailCase("itemClass", () => api.itemClasses(), api.itemClass),
        c(key("itemMedia"), () => api.itemMedia(ITEM_ID)),
        c(key("itemSubclass"), async () => {
            const classes = await api.itemClasses();
            const classId = indexId(classes);
            const cls = await api.itemClass(classId);
            const subclass = cls.item_subclasses[0];
            if (!subclass) throw new Error("item class has no subclasses");
            return await api.itemSubclass(classId, subclass.id);
        }),
        c(key("searchItem"), () => api.searchItem({ pageSize: 1 })),
        c(key("searchMedia"), () => api.searchMedia({ pageSize: 1 })),
        c(key("playableClasses"), () => api.playableClasses()),
        detailCase("playableClass", () => api.playableClasses(), api.playableClass),
        detailCase("playableClassMedia", () => api.playableClasses(), api.playableClassMedia),
        c(key("playableRaces"), () => api.playableRaces()),
        detailCase("playableRace", () => api.playableRaces(), api.playableRace),
        c(key("powerTypes"), () => api.powerTypes()),
        detailCase("powerType", () => api.powerTypes(), api.powerType),
        c(key("realms"), () => api.realms()),
        c(key("realm"), async () => {
            const realms = await api.realms();
            const realm = realms.realms[0];
            if (!realm) throw new Error("no realms available");
            return await api.realm(realm.slug);
        }),
        c(key("searchRealm"), () => api.searchRealm({ pageSize: 1 })),
        c(key("regions"), () => api.regions()),
        detailCase("region", () => api.regions(), api.region),
        profileCase("characterProfile", api.characterProfile),
        profileCase("characterProfileStatus", api.characterProfileStatus),
        profileCase("characterAppearanceSummary", api.characterAppearanceSummary),
        profileCase("characterEquipments", api.characterEquipments),
        profileCase("characterHunterPets", api.characterHunterPets, "character-dependent"),
        profileCase("characterMedia", api.characterMedia),
        profileCase("characterPvpSummary", api.characterPvpSummary),
        profileCase("characterReputations", api.characterReputations),
        profileCase("characterStatistics", api.characterStatistics),
        guildCase("guild", api.guild),
        guildCase("guildAchievements", api.guildAchievements),
        guildCase("guildActivity", api.guildActivity),
        guildCase("guildRoster", api.guildRoster),
    ];
}

function buildProgressionCases(getContext: () => Promise<ClassicContext>): Case[] {
    const api = client.wowClassic;
    const label = "wowClassic";
    const key = (name: string) => `${label}.${name}`;
    const detailCase = (
        name: string,
        indexFn: () => Promise<unknown>,
        fn: (id: number) => Promise<unknown>,
    ): Case => c(key(name), detail(key(name), indexFn, fn));
    const connectedRealm = () =>
        once(key("connectedRealms"), () => api.connectedRealms()).then((source) => indexId(source));
    const newestPvpSeasonId = () =>
        once(key("pvpSeasons"), () => api.pvpSeasons()).then((seasons) => {
            const last = seasons.seasons[seasons.seasons.length - 1];
            const id = seasons.current_season?.id ?? last?.id;
            if (id === undefined) throw new SkipError("no Classic progression PvP season available");
            return id;
        });

    return [
        c(key("auctions"), async () => await api.auctions(await connectedRealm())),
        c(key("commodities"), () => api.commodities()),
        c(key("mythicKeystonePeriods"), () => api.mythicKeystonePeriods()),
        detailCase("mythicKeystonePeriod", () => api.mythicKeystonePeriods(), api.mythicKeystonePeriod),
        c(key("mythicKeystoneSeasons"), () => api.mythicKeystoneSeasons()),
        detailCase("mythicKeystoneSeason", () => api.mythicKeystoneSeasons(), api.mythicKeystoneSeason),
        c(key("mythicKeystoneLeaderboards"), async () => await api.mythicKeystoneLeaderboards(await connectedRealm())),
        c(key("mythicKeystoneLeaderboard"), async () => {
            const realmId = await connectedRealm();
            const leaderboards = await api.mythicKeystoneLeaderboards(realmId);
            const dungeon = leaderboards.current_leaderboards?.[0];
            if (!dungeon) throw new SkipError("no current Classic progression mythic keystone leaderboards");
            const periods = await api.mythicKeystonePeriods();
            return await api.mythicKeystoneLeaderboard(realmId, dungeon.id, periods.current_period.id);
        }),
        c(key("playableSpecializations"), () => api.playableSpecializations()),
        detailCase("playableSpecialization", () => api.playableSpecializations(), api.playableSpecialization),
        detailCase(
            "playableSpecializationMedia",
            () => api.playableSpecializations(),
            api.playableSpecializationMedia,
        ),
        c(key("pvpSeasons"), () => api.pvpSeasons()),
        c(key("pvpSeason"), async () => await api.pvpSeason(await newestPvpSeasonId())),
        c(key("pvpSeasonLeaderboards"), async () => await api.pvpSeasonLeaderboards(await newestPvpSeasonId())),
        c(key("pvpSeasonLeaderboard"), async () => {
            const seasonId = await newestPvpSeasonId();
            const leaderboards = await api.pvpSeasonLeaderboards(seasonId);
            const leaderboard = leaderboards.leaderboards[0];
            if (!leaderboard) throw new SkipError("no Classic progression PvP leaderboards for the season");
            return await api.pvpSeasonLeaderboard(seasonId, leaderboard.name);
        }),
        c(key("pvpSeasonRewards"), async () => await api.pvpSeasonRewards(await newestPvpSeasonId())),
        c(key("token"), () => api.token()),
        c(key("characterSpecializations"), async () => {
            const ctx = await getContext();
            return await api.characterSpecializations(ctx.realm, ctx.name);
        }),
        c(key("characterAchievementSummary"), async () => {
            const ctx = await getContext();
            return await api.characterAchievementSummary(ctx.realm, ctx.name);
        }, "character-dependent"),
        c(key("characterAchievementStatistics"), async () => {
            const ctx = await getContext();
            return await api.characterAchievementStatistics(ctx.realm, ctx.name);
        }, "character-dependent"),
        c(key("characterPvpBracketStatistics"), async () => {
            const ctx = await getContext();
            return await api.characterPvpBracketStatistics(ctx.realm, ctx.name, "2v2");
        }, "character-dependent"),
    ];
}

function buildEraCases(): Case[] {
    const api = client.wowClassicEra;
    const key = (name: string) => `wowClassicEra.${name}`;
    const connectedRealm = () =>
        once(key("connectedRealms"), () => api.connectedRealms()).then((source) => indexId(source));

    return [
        c(key("auctionHouses"), async () => await api.auctionHouses(await connectedRealm())),
        c(key("auctionHouse"), async () => {
            const realmId = await connectedRealm();
            const houses = await api.auctionHouses(realmId);
            const house = houses.auctions[0];
            if (!house) throw new SkipError("no Classic Era auction houses for the connected realm");
            return await api.auctionHouse(realmId, house.id);
        }, "known Blizzard issue: Classic Era auction houses"),
        c(key("characterSpecializations"), async () => {
            const ctx = await getEraContext();
            return await api.characterSpecializations(ctx.realm, ctx.name);
        }),
    ];
}

function buildCases(): Case[] {
    return [
        // ----- wow: game data ------------------------------------------------
        c("wow.achievementCategories", () => client.wow.achievementCategories()),
        c(
            "wow.achievementCategory",
            detail(
                "wow.achievementCategories",
                () => client.wow.achievementCategories(),
                client.wow.achievementCategory,
            ),
        ),
        c("wow.achievements", () => client.wow.achievements()),
        c("wow.achievement", detail("wow.achievements", () => client.wow.achievements(), client.wow.achievement)),
        c(
            "wow.achievementMedia",
            detail("wow.achievements", () => client.wow.achievements(), client.wow.achievementMedia),
        ),
        c("wow.auctions", async () => await client.wow.auctions(await connectedRealmId())),
        c("wow.commodities", () => client.wow.commodities()),
        c("wow.azeriteEssences", () => client.wow.azeriteEssences()),
        c(
            "wow.azeriteEssence",
            detail("wow.azeriteEssences", () => client.wow.azeriteEssences(), client.wow.azeriteEssence),
        ),
        c(
            "wow.azeriteEssenceMedia",
            detail("wow.azeriteEssences", () => client.wow.azeriteEssences(), client.wow.azeriteEssenceMedia),
        ),
        c("wow.searchAzeriteEssence", () => client.wow.searchAzeriteEssence({ pageSize: 1 })),
        c("wow.connectedRealms", () => client.wow.connectedRealms()),
        c(
            "wow.connectedRealm",
            detail("wow.connectedRealms", () => client.wow.connectedRealms(), client.wow.connectedRealm),
        ),
        c("wow.searchConnectedRealm", () => client.wow.searchConnectedRealm({ pageSize: 1 })),
        c("wow.covenants", () => client.wow.covenants()),
        c("wow.covenant", detail("wow.covenants", () => client.wow.covenants(), client.wow.covenant)),
        c("wow.covenantConduits", () => client.wow.covenantConduits()),
        c(
            "wow.covenantConduit",
            detail("wow.covenantConduits", () => client.wow.covenantConduits(), client.wow.covenantConduit),
        ),
        c("wow.covenantSoulbinds", () => client.wow.covenantSoulbinds()),
        c(
            "wow.covenantSoulbind",
            detail("wow.covenantSoulbinds", () => client.wow.covenantSoulbinds(), client.wow.covenantSoulbind),
        ),
        c("wow.creatureFamilies", () => client.wow.creatureFamilies()),
        c(
            "wow.creatureFamily",
            detail("wow.creatureFamilies", () => client.wow.creatureFamilies(), client.wow.creatureFamily),
        ),
        c(
            "wow.creatureFamilyMedia",
            detail("wow.creatureFamilies", () => client.wow.creatureFamilies(), client.wow.creatureFamilyMedia),
        ),
        c("wow.creatureTypes", () => client.wow.creatureTypes()),
        c("wow.creatureType", detail("wow.creatureTypes", () => client.wow.creatureTypes(), client.wow.creatureType)),
        c(
            "wow.creature",
            async () => await client.wow.creature(searchFirstId(await client.wow.searchCreature({ pageSize: 1 }))),
        ),
        c("wow.searchCreature", () => client.wow.searchCreature({ pageSize: 1 })),
        c("wow.creatureDisplayMedia", async () => {
            const creatureId = searchFirstId(await client.wow.searchCreature({ pageSize: 1 }));
            const creature = await client.wow.creature(creatureId);
            const display = creature.creature_displays[0];
            if (!display) throw new Error("creature has no displays");
            return await client.wow.creatureDisplayMedia(display.id);
        }),
        c("wow.guildCrests", () => client.wow.guildCrests()),
        c(
            "wow.guildCrestBorder",
            detail("wow.guildCrests", () => client.wow.guildCrests(), client.wow.guildCrestBorder, "borders"),
        ),
        c(
            "wow.guildCrestEmblem",
            detail("wow.guildCrests", () => client.wow.guildCrests(), client.wow.guildCrestEmblem, "emblems"),
        ),
        c("wow.heirlooms", () => client.wow.heirlooms()),
        c("wow.heirloom", detail("wow.heirlooms", () => client.wow.heirlooms(), client.wow.heirloom)),
        c("wow.decors", () => client.wow.decors()),
        c("wow.decor", detail("wow.decors", () => client.wow.decors(), client.wow.decor)),
        c("wow.searchDecor", () => client.wow.searchDecor({ pageSize: 1 })),
        c("wow.fixtures", () => client.wow.fixtures()),
        c("wow.fixture", detail("wow.fixtures", () => client.wow.fixtures(), client.wow.fixture)),
        c("wow.searchFixture", () => client.wow.searchFixture({ pageSize: 1 })),
        c("wow.fixtureHooks", () => client.wow.fixtureHooks()),
        c("wow.fixtureHook", detail("wow.fixtureHooks", () => client.wow.fixtureHooks(), client.wow.fixtureHook)),
        c("wow.searchFixtureHook", () => client.wow.searchFixtureHook({ pageSize: 1 })),
        c("wow.rooms", () => client.wow.rooms()),
        c("wow.room", detail("wow.rooms", () => client.wow.rooms(), client.wow.room)),
        c("wow.searchRoom", () => client.wow.searchRoom({ pageSize: 1 })),
        c("wow.itemClasses", () => client.wow.itemClasses()),
        c("wow.itemClass", detail("wow.itemClasses", () => client.wow.itemClasses(), client.wow.itemClass)),
        c("wow.itemSets", () => client.wow.itemSets()),
        c("wow.itemSet", detail("wow.itemSets", () => client.wow.itemSets(), client.wow.itemSet)),
        c("wow.itemSubclass", async () => {
            const classes = await client.wow.itemClasses();
            const classId = indexId(classes);
            const cls = await client.wow.itemClass(classId);
            const subclass = cls.item_subclasses[0];
            if (!subclass) throw new Error("item class has no subclasses");
            return await client.wow.itemSubclass(classId, subclass.id);
        }),
        c("wow.item", () => client.wow.item(ITEM_ID)),
        c("wow.itemMedia", () => client.wow.itemMedia(ITEM_ID)),
        c("wow.itemAppearance", async () => {
            const slot = await client.wow.itemAppearanceSlot("HEAD");
            const appearance = slot.appearances[0];
            if (!appearance) throw new Error("item appearance slot has no appearances");
            return await client.wow.itemAppearance(appearance.id);
        }),
        c("wow.itemAppearanceSets", () => client.wow.itemAppearanceSets()),
        c(
            "wow.itemAppearanceSet",
            detail("wow.itemAppearanceSets", () => client.wow.itemAppearanceSets(), client.wow.itemAppearanceSet),
        ),
        c("wow.itemAppearanceSlots", () => client.wow.itemAppearanceSlots()),
        c("wow.itemAppearanceSlot", () => client.wow.itemAppearanceSlot("HEAD")),
        c("wow.searchItem", () => client.wow.searchItem({ pageSize: 1 })),
        c("wow.searchItemAppearance", () => client.wow.searchItemAppearance({ pageSize: 1 })),
        c("wow.searchMedia", () => client.wow.searchMedia({ pageSize: 1 })),
        c("wow.journalExpansions", () => client.wow.journalExpansions()),
        c(
            "wow.journalExpansion",
            detail("wow.journalExpansions", () => client.wow.journalExpansions(), client.wow.journalExpansion),
        ),
        c("wow.journalEncounters", () => client.wow.journalEncounters()),
        c(
            "wow.journalEncounter",
            detail("wow.journalEncounters", () => client.wow.journalEncounters(), client.wow.journalEncounter),
        ),
        c("wow.searchJournalEncounter", () => client.wow.searchJournalEncounter({ pageSize: 1 })),
        c("wow.journalInstances", () => client.wow.journalInstances()),
        c(
            "wow.journalInstance",
            detail("wow.journalInstances", () => client.wow.journalInstances(), client.wow.journalInstance),
        ),
        c(
            "wow.journalInstanceMedia",
            detail("wow.journalInstances", () => client.wow.journalInstances(), client.wow.journalInstanceMedia),
        ),
        c("wow.modifiedCraftingParents", () => client.wow.modifiedCraftingParents()),
        c("wow.modifiedCraftingCategories", () => client.wow.modifiedCraftingCategories()),
        c(
            "wow.modifiedCraftingCategory",
            detail(
                "wow.modifiedCraftingCategories",
                () => client.wow.modifiedCraftingCategories(),
                client.wow.modifiedCraftingCategory,
            ),
        ),
        c("wow.modifiedCraftingSlotTypes", () => client.wow.modifiedCraftingSlotTypes()),
        c(
            "wow.modifiedCraftingSlotType",
            detail(
                "wow.modifiedCraftingSlotTypes",
                () => client.wow.modifiedCraftingSlotTypes(),
                client.wow.modifiedCraftingSlotType,
            ),
        ),
        c("wow.mounts", () => client.wow.mounts()),
        c("wow.mount", () => client.wow.mount(MOUNT_ID)),
        c("wow.searchMount", () => client.wow.searchMount({ pageSize: 1 })),
        c("wow.keystoneAffixes", () => client.wow.keystoneAffixes()),
        c(
            "wow.keystoneAffix",
            detail("wow.keystoneAffixes", () => client.wow.keystoneAffixes(), client.wow.keystoneAffix),
        ),
        c(
            "wow.keystoneAffixMedia",
            detail("wow.keystoneAffixes", () => client.wow.keystoneAffixes(), client.wow.keystoneAffixMedia),
        ),
        c("wow.mythicKeystoneDungeons", () => client.wow.mythicKeystoneDungeons()),
        c(
            "wow.mythicKeystoneDungeon",
            detail(
                "wow.mythicKeystoneDungeons",
                () => client.wow.mythicKeystoneDungeons(),
                client.wow.mythicKeystoneDungeon,
            ),
        ),
        c("wow.mythicKeystoneIndex", () => client.wow.mythicKeystoneIndex()),
        c("wow.mythicKeystonePeriods", () => client.wow.mythicKeystonePeriods()),
        c(
            "wow.mythicKeystonePeriod",
            detail(
                "wow.mythicKeystonePeriods",
                () => client.wow.mythicKeystonePeriods(),
                client.wow.mythicKeystonePeriod,
            ),
        ),
        c("wow.mythicKeystoneSeasons", () => client.wow.mythicKeystoneSeasons()),
        c(
            "wow.mythicKeystoneSeason",
            detail(
                "wow.mythicKeystoneSeasons",
                () => client.wow.mythicKeystoneSeasons(),
                client.wow.mythicKeystoneSeason,
            ),
        ),
        c(
            "wow.mythicKeystoneLeaderboards",
            async () => await client.wow.mythicKeystoneLeaderboards(await connectedRealmId()),
        ),
        c("wow.mythicKeystoneLeaderboard", async () => {
            const realmId = await connectedRealmId();
            const leaderboards = await client.wow.mythicKeystoneLeaderboards(realmId);
            const dungeon = leaderboards.current_leaderboards[0];
            if (!dungeon) throw new Error("no current mythic keystone leaderboards available");
            const periods = await client.wow.mythicKeystonePeriods();
            return await client.wow.mythicKeystoneLeaderboard(realmId, dungeon.id, periods.current_period.id);
        }),
        c("wow.mythicRaidLeaderboard", () => client.wow.mythicRaidLeaderboard("uldir", "alliance")),
        c("wow.neighborhoodMaps", () => client.wow.neighborhoodMaps()),
        c(
            "wow.neighborhoodMap",
            detail("wow.neighborhoodMaps", () => client.wow.neighborhoodMaps(), client.wow.neighborhoodMap),
        ),
        c("wow.neighborhood", async () => {
            const maps = await client.wow.neighborhoodMaps();
            return await client.wow.neighborhood(indexId(maps), 1);
        }),
        c("wow.pets", () => client.wow.pets()),
        c("wow.pet", detail("wow.pets", () => client.wow.pets(), client.wow.pet)),
        c("wow.petMedia", detail("wow.pets", () => client.wow.pets(), client.wow.petMedia)),
        c("wow.petAbilities", () => client.wow.petAbilities()),
        c("wow.petAbility", detail("wow.petAbilities", () => client.wow.petAbilities(), client.wow.petAbility)),
        c(
            "wow.petAbilityMedia",
            detail("wow.petAbilities", () => client.wow.petAbilities(), client.wow.petAbilityMedia),
        ),
        c("wow.playableClasses", () => client.wow.playableClasses()),
        c(
            "wow.playableClass",
            detail("wow.playableClasses", () => client.wow.playableClasses(), client.wow.playableClass),
        ),
        c(
            "wow.playableClassMedia",
            detail("wow.playableClasses", () => client.wow.playableClasses(), client.wow.playableClassMedia),
        ),
        c(
            "wow.playableClassPvpTalentSlots",
            detail(
                "wow.playableClasses",
                () => client.wow.playableClasses(),
                client.wow.playableClassPvpTalentSlots,
            ),
        ),
        c("wow.playableSpecializations", () => client.wow.playableSpecializations()),
        c("wow.playableSpecialization", async () => {
            const index = await client.wow.playableSpecializations();
            return await client.wow.playableSpecialization(index.character_specializations[0].id);
        }),
        c("wow.playableSpecializationMedia", async () => {
            const index = await client.wow.playableSpecializations();
            return await client.wow.playableSpecializationMedia(index.character_specializations[0].id);
        }),
        c("wow.playableRaces", () => client.wow.playableRaces()),
        c("wow.playableRace", detail("wow.playableRaces", () => client.wow.playableRaces(), client.wow.playableRace)),
        c("wow.powerTypes", () => client.wow.powerTypes()),
        c("wow.powerType", detail("wow.powerTypes", () => client.wow.powerTypes(), client.wow.powerType)),
        c("wow.professions", () => client.wow.professions()),
        c("wow.profession", detail("wow.professions", () => client.wow.professions(), client.wow.profession)),
        c("wow.professionMedia", detail("wow.professions", () => client.wow.professions(), client.wow.professionMedia)),
        c("wow.professionSkillTier", async () => {
            const professions = await client.wow.professions();
            const professionId = indexId(professions);
            const profession = await client.wow.profession(professionId);
            const tierId = profession.skill_tiers[0]?.id;
            if (tierId === undefined) throw new Error("profession has no skill tiers");
            return await client.wow.professionSkillTier(professionId, tierId);
        }),
        c("wow.professionRecipie", async () => await client.wow.professionRecipie(await firstRecipeId())),
        c("wow.professionRecipieMedia", async () => await client.wow.professionRecipieMedia(await firstRecipeId())),
        c("wow.pvpSeasons", () => client.wow.pvpSeasons()),
        c("wow.pvpSeason", async () => await client.wow.pvpSeason(await newestPvpSeasonId())),
        c("wow.pvpSeasonLeaderboards", async () => await client.wow.pvpSeasonLeaderboards(await newestPvpSeasonId())),
        c("wow.pvpSeasonLeaderboard", async () => {
            const seasonId = await newestPvpSeasonId();
            const leaderboards = await client.wow.pvpSeasonLeaderboards(seasonId);
            const leaderboard = leaderboards.leaderboards[0];
            if (!leaderboard) throw new Error("pvp season has no leaderboards");
            return await client.wow.pvpSeasonLeaderboard(seasonId, leaderboard.name);
        }),
        c("wow.pvpSeasonRewards", async () => await client.wow.pvpSeasonRewards(await newestPvpSeasonId())),
        c("wow.pvpTiers", () => client.wow.pvpTiers()),
        c("wow.pvpTier", detail("wow.pvpTiers", () => client.wow.pvpTiers(), client.wow.pvpTier)),
        c("wow.pvpTierMedia", detail("wow.pvpTiers", () => client.wow.pvpTiers(), client.wow.pvpTierMedia)),
        c("wow.quests", () => client.wow.quests()),
        c("wow.quest", async () => {
            const categories = await client.wow.questCategories();
            const category = await client.wow.questCategory(indexId(categories));
            const quest = category.quests[0];
            if (!quest) throw new Error("quest category has no quests");
            return await client.wow.quest(quest.id);
        }),
        c("wow.questCategories", () => client.wow.questCategories()),
        c(
            "wow.questCategory",
            detail("wow.questCategories", () => client.wow.questCategories(), client.wow.questCategory),
        ),
        c("wow.questAreas", () => client.wow.questAreas()),
        c("wow.questArea", detail("wow.questAreas", () => client.wow.questAreas(), client.wow.questArea)),
        c("wow.questTypes", () => client.wow.questTypes()),
        c("wow.questType", detail("wow.questTypes", () => client.wow.questTypes(), client.wow.questType)),
        c("wow.realms", () => client.wow.realms()),
        c("wow.realm", () => client.wow.realm(REALM_SLUG)),
        c("wow.searchRealm", () => client.wow.searchRealm({ pageSize: 1 })),
        c("wow.regions", () => client.wow.regions()),
        c("wow.region", detail("wow.regions", () => client.wow.regions(), client.wow.region)),
        c("wow.reputationFactions", () => client.wow.reputationFactions()),
        c(
            "wow.reputationFaction",
            detailStr(
                "wow.reputationFactions",
                () => client.wow.reputationFactions(),
                client.wow.reputationFaction,
            ),
        ),
        c("wow.reputationTiers", () => client.wow.reputationTiers()),
        c(
            "wow.reputationTier",
            detailStr("wow.reputationTiers", () => client.wow.reputationTiers(), client.wow.reputationTier),
        ),
        c("wow.spell", async () => await client.wow.spell(await searchedSpellId())),
        c("wow.spellMedia", async () => await client.wow.spellMedia(await searchedSpellId())),
        c("wow.searchSpell", () => client.wow.searchSpell({ pageSize: 1 })),
        c("wow.titles", () => client.wow.titles()),
        c("wow.title", detail("wow.titles", () => client.wow.titles(), client.wow.title)),
        c("wow.toys", () => client.wow.toys()),
        c("wow.toy", detail("wow.toys", () => client.wow.toys(), client.wow.toy)),
        c("wow.talents", () => client.wow.talents()),
        c("wow.talent", detail("wow.talents", () => client.wow.talents(), client.wow.talent)),
        c("wow.talentTrees", () => client.wow.talentTrees()),
        c("wow.talentTree", async () => {
            const trees = await once("wow.talentTrees", () => client.wow.talentTrees());
            const link = talentTreeLinks(trees, "spec_talent_trees")[0];
            const href = link?.key?.href;
            if (!href) throw new Error("no spec talent trees available");
            const { treeId, specId } = talentTreeIds(href);
            return await client.wow.talentTree(treeId, specId);
        }),
        c("wow.talentTreeNodes", async () => {
            const trees = await once("wow.talentTrees", () => client.wow.talentTrees());
            const link = talentTreeLinks(trees, "class_talent_trees")[0];
            if (!link) throw new Error("no class talent trees available");
            const treeId = typeof link.id === "number" ? link.id : idFromHref(link.key?.href ?? "");
            return await client.wow.talentTreeNodes(treeId);
        }),
        c("wow.pvpTalents", () => client.wow.pvpTalents()),
        c("wow.pvpTalent", detail("wow.pvpTalents", () => client.wow.pvpTalents(), client.wow.pvpTalent)),
        c("wow.techTalentTrees", () => client.wow.techTalentTrees()),
        c(
            "wow.techTalentTree",
            detail("wow.techTalentTrees", () => client.wow.techTalentTrees(), client.wow.techTalentTree),
        ),
        c("wow.techTalents", () => client.wow.techTalents()),
        c("wow.techTalent", detail("wow.techTalents", () => client.wow.techTalents(), client.wow.techTalent)),
        c("wow.techTalentMedia", detail("wow.techTalents", () => client.wow.techTalents(), client.wow.techTalentMedia)),
        c("wow.token", () => client.wow.token()),

        // ----- wow: profile --------------------------------------------------
        c("wow.characterProfile", () => profileCall(client.wow.characterProfile)),
        c("wow.characterProfileStatus", () => profileCall(client.wow.characterProfileStatus)),
        c("wow.characterAchievementSummary", () => profileCall(client.wow.characterAchievementSummary)),
        c("wow.characterAchievementStatistics", () => profileCall(client.wow.characterAchievementStatistics)),
        c("wow.characterAppearanceSummary", () => profileCall(client.wow.characterAppearanceSummary)),
        c("wow.characterCollectionTypes", () => profileCall(client.wow.characterCollectionTypes)),
        c("wow.characterCollectionMounts", () => profileCall(client.wow.characterCollectionMounts)),
        c("wow.characterCollectionPets", () => profileCall(client.wow.characterCollectionPets)),
        c("wow.characterCollectionToys", () => profileCall(client.wow.characterCollectionToys)),
        c("wow.characterCollectionHeirlooms", () => profileCall(client.wow.characterCollectionHeirlooms)),
        c(
            "wow.characterCollectionDecor",
            () => profileCall(client.wow.characterCollectionDecor),
            "character-dependent",
        ),
        c(
            "wow.characterCollectionTransmogs",
            () => profileCall(client.wow.characterCollectionTransmogs),
            "character-dependent",
        ),
        c("wow.characterEncounters", () => profileCall(client.wow.characterEncounters)),
        c("wow.characterEncounterDungeons", () => profileCall(client.wow.characterEncounterDungeons)),
        c("wow.characterEncounterRaids", () => profileCall(client.wow.characterEncounterRaids)),
        c("wow.characterEquipments", () => profileCall(client.wow.characterEquipments)),
        c("wow.characterHunterPets", () => profileCall(client.wow.characterHunterPets), "character-dependent"),
        c("wow.characterMedia", () => profileCall(client.wow.characterMedia)),
        c("wow.characterMythicKeystoneProfile", () => profileCall(client.wow.characterMythicKeystoneProfile)),
        c("wow.characterMythicKeystoneSeasonDetails", async () => {
            const ctx = await getContext();
            const seasons = await client.wow.mythicKeystoneSeasons();
            return await client.wow.characterMythicKeystoneSeasonDetails(
                ctx.realm,
                ctx.name,
                seasons.current_season.id,
            );
        }, "character-dependent"),
        c("wow.characterProfessions", () => profileCall(client.wow.characterProfessions), "character-dependent"),
        c("wow.characterPvpBracketStatistics", async () => {
            const ctx = await getContext();
            return await client.wow.characterPvpBracketStatistics(ctx.realm, ctx.name, "2v2");
        }, "character-dependent"),
        c("wow.characterPvpSummary", () => profileCall(client.wow.characterPvpSummary)),
        c("wow.characterQuests", () => profileCall(client.wow.characterQuests)),
        c("wow.characterCompletedQuests", () => profileCall(client.wow.characterCompletedQuests)),
        c("wow.characterReputations", () => profileCall(client.wow.characterReputations)),
        c("wow.characterSoulbinds", () => profileCall(client.wow.characterSoulbinds), "character-dependent"),
        c("wow.characterSpecializations", () => profileCall(client.wow.characterSpecializations)),
        c("wow.characterStatistics", () => profileCall(client.wow.characterStatistics)),
        c("wow.characterTitles", () => profileCall(client.wow.characterTitles)),
        c("wow.characterHouse", async () => {
            const ctx = await getContext();
            return await client.wow.characterHouse(ctx.realm, ctx.name, 1);
        }, "character-dependent"),
        c("wow.guild", () => guildCall(client.wow.guild)),
        c("wow.guildActivity", () => guildCall(client.wow.guildActivity)),
        c("wow.guildAchievements", () => guildCall(client.wow.guildAchievements)),
        c("wow.guildRoster", () => guildCall(client.wow.guildRoster)),

        // ----- wow classic (progression + Era) -------------------------------
        ...buildSharedClassicCases("wowClassic", client.wowClassic, getProgressionContext),
        ...buildProgressionCases(getProgressionContext),
        ...buildSharedClassicCases("wowClassicEra", client.wowClassicEra, getEraContext),
        ...buildEraCases(),

        // ----- hearthstone ---------------------------------------------------
        c("hearthstone.searchCards", () => client.hearthstone.searchCards({ pageSize: 1 })),
        c("hearthstone.fetchCard", async () => {
            const card = searchFirstStr(await client.hearthstone.searchCards({ pageSize: 1 }));
            return await client.hearthstone.fetchCard(card);
        }),
        c("hearthstone.searchCardbacks", () => client.hearthstone.searchCardbacks({ pageSize: 1 })),
        c("hearthstone.fetchCardback", async () => {
            const cardback = searchFirstStr(await client.hearthstone.searchCardbacks({ pageSize: 1 }));
            return await client.hearthstone.fetchCardback(cardback);
        }),
        c("hearthstone.metadata", () => client.hearthstone.metadata("sets")),
        skipped(
            "hearthstone.fetchDeck",
            "skipped: needs a deck code or card ids (not discoverable from the API)",
        ),

        // ----- starcraft 2 ---------------------------------------------------
        c("sc2.leagueData", () => client.sc2.leagueData(37, 201, 0, 0)),

        // ----- diablo 3 ------------------------------------------------------
        c("diablo3.seasons", () => client.diablo3.seasons()),
        c("diablo3.season", async () => {
            const seasons = await client.diablo3.seasons();
            return await client.diablo3.season(seasons.current_season);
        }),
        c("diablo3.seasonLeaderboard", async () => {
            const seasons = await client.diablo3.seasons();
            const season = await client.diablo3.season(seasons.current_season);
            const leaderboard = season.leaderboard[0];
            if (!leaderboard) throw new Error("season has no leaderboards");
            return await client.diablo3.seasonLeaderboard(seasons.current_season, lastSegment(leaderboard.ladder.href));
        }),
        c("diablo3.eras", () => client.diablo3.eras()),
        c("diablo3.era", async () => {
            const eras = await client.diablo3.eras();
            return await client.diablo3.era(eras.current_era);
        }),
        c("diablo3.eraLeaderboard", async () => {
            const eras = await client.diablo3.eras();
            const era = await client.diablo3.era(eras.current_era);
            const leaderboard = era.leaderboard[0];
            if (!leaderboard) throw new Error("era has no leaderboards");
            return await client.diablo3.eraLeaderboard(eras.current_era, lastSegment(leaderboard.ladder.href));
        }),
        c("diablo3.acts", () => client.diablo3.acts()),
        c("diablo3.act", async () => {
            const acts = await client.diablo3.acts();
            return await client.diablo3.act(acts.acts[0]?.number ?? 1);
        }),
        c("diablo3.artisan", () => client.diablo3.artisan(ARTISAN_SLUG)),
        c("diablo3.artisanRecipe", async () => {
            const artisan = await client.diablo3.artisan(ARTISAN_SLUG);
            const recipes = artisan.training.tiers.flatMap((tier) => [
                ...tier.trainedRecipes,
                ...(tier.taughtRecipes ?? []),
            ]);
            const recipe = recipes[0];
            if (!recipe) throw new Error("artisan has no recipes");
            return await client.diablo3.artisanRecipe(ARTISAN_SLUG, recipe.slug);
        }),
        c("diablo3.follower", () => client.diablo3.follower(FOLLOWER_SLUG)),
        c("diablo3.heroClass", () => client.diablo3.heroClass(HERO_SLUG)),
        c("diablo3.heroSkill", async () => {
            const hero = await client.diablo3.heroClass(HERO_SLUG);
            const skill = hero.skills.active[0] ?? hero.skills.passive[0];
            if (!skill) throw new Error("hero class has no skills");
            return await client.diablo3.heroSkill(HERO_SLUG, skill.slug);
        }),
        c("diablo3.itemTypes", () => client.diablo3.itemTypes()),
        c("diablo3.itemType", async () => {
            const types = await client.diablo3.itemTypes();
            const type = types[0];
            if (!type) throw new Error("no item types available");
            return await client.diablo3.itemType(lastSegment(type.path));
        }),
        // Chaining from the item-type index can land on items the API 500s on (e.g. Ethereals), so use the documented example.
        c("diablo3.item", () => client.diablo3.item("corrupted-ashbringer-Unique_Sword_2H_104_x1")),

        // ----- wow: user-token account profile (client.forUser) ---------------
        userCase("wow.accountProfileSummary", () => requireUserClient().wow.accountProfileSummary()),
        userCase("wow.protectedCharacterProfile", async () => {
            const summary = await requireUserClient().wow.accountProfileSummary();
            const character = summary.wow_accounts[0]?.characters[0];
            if (!character) throw new Error("account has no characters");
            return await requireUserClient().wow.protectedCharacterProfile(character.realm.id, character.id);
        }),
        userCase("wow.accountCollectionsIndex", () => requireUserClient().wow.accountCollectionsIndex()),
        userCase("wow.accountMountsCollection", () => requireUserClient().wow.accountMountsCollection()),
        userCase("wow.accountPetsCollection", () => requireUserClient().wow.accountPetsCollection()),
        userCase("wow.accountToysCollection", () => requireUserClient().wow.accountToysCollection()),
        userCase("wow.accountHeirloomsCollection", () => requireUserClient().wow.accountHeirloomsCollection()),
        userCase("wow.accountTransmogsCollection", () => requireUserClient().wow.accountTransmogsCollection()),
        userCase("wow.accountDecorCollection", () => requireUserClient().wow.accountDecorCollection()),

        // ----- client / legacy compatibility ----------------------------------
        c("client.missingUserToken", async () => {
            try {
                await client.wow.accountProfileSummary();
            } catch (error) {
                if (error instanceof errors.MissingUserTokenError) return { missingUserToken: true };
                throw new Error(
                    `expected MissingUserTokenError but got ${error instanceof Error ? error.name : typeof error}`,
                );
            }
            throw new Error("expected MissingUserTokenError but accountProfileSummary succeeded");
        }),
        c("legacy.setup.wow.mount", async () => {
            setup(config);
            return await legacyWow.mount(MOUNT_ID);
        }),
    ];
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runCase(testCase: Case): Promise<Result> {
    if (testCase.skip) {
        return { name: testCase.name, status: "skipped", durationMs: 0, detail: testCase.skip };
    }
    const start = performance.now();
    try {
        const value = await testCase.fn();
        await Deno.writeTextFile(`fixtures/${testCase.name}.json`, JSON.stringify(value, null, 2));
        return { name: testCase.name, status: "ok", durationMs: performance.now() - start };
    } catch (error) {
        const durationMs = performance.now() - start;
        if (error instanceof SkipError) {
            return { name: testCase.name, status: "skipped", durationMs, detail: error.message };
        }
        if (error instanceof errors.APIError) {
            if (error.statusCode === 404 && testCase.allow404) {
                return { name: testCase.name, status: "pass", durationMs, detail: `PASS* ${testCase.allow404}` };
            }
            const message = error.message.length > 120 ? error.message.slice(0, 120) + "…" : error.message;
            return {
                name: testCase.name,
                status: "failed",
                durationMs,
                detail: `${error.name} (${error.statusCode}): ${message}`,
            };
        }
        const name = error instanceof Error ? error.name : typeof error;
        const message = error instanceof Error ? error.message : String(error);
        return {
            name: testCase.name,
            status: "failed",
            durationMs,
            detail: `${name}: ${message.length > 120 ? message.slice(0, 120) + "…" : message}`,
        };
    }
}

async function runPool(selected: Case[], limit: number, delayMs: number): Promise<Result[]> {
    const results: Result[] = [];
    let next = 0;
    const worker = async () => {
        while (true) {
            const index = next++;
            if (index >= selected.length) return;
            results[index] = await runCase(selected[index]);
            await delay(delayMs);
        }
    };
    await Promise.all(Array.from({ length: Math.min(limit, selected.length) }, () => worker()));
    return results;
}

function pad(value: string, width: number): string {
    return value.length >= width ? value : value + " ".repeat(width - value.length);
}

async function main(): Promise<void> {
    const clientId = Deno.env.get("BLIZZARD_CLIENT_ID");
    const clientSecret = Deno.env.get("BLIZZARD_CLIENT_SECRET");
    if (!clientId || !clientSecret) {
        console.error("Missing BLIZZARD_CLIENT_ID and/or BLIZZARD_CLIENT_SECRET environment variables.");
        Deno.exit(1);
    }
    config = {
        clientId,
        clientSecret,
        region: (Deno.env.get("BLIZZARD_REGION") ?? "eu") as Regions,
        locale: (Deno.env.get("BLIZZARD_LOCALE") ?? "en_GB") as Locales,
    };
    client = createClient(config);
    setup(config);

    if (USER_TOKEN) userClient = client.forUser(USER_TOKEN);

    await Deno.mkdir("fixtures", { recursive: true });

    const cases = buildCases();
    const filter = Deno.args[0];
    const selected = filter ? cases.filter((testCase) => testCase.name.includes(filter)) : cases;
    if (selected.length === 0) {
        console.error(`No cases match filter "${filter}".`);
        Deno.exit(1);
    }

    console.log(`Running ${selected.length} smoke case(s)${filter ? ` matching "${filter}"` : ""}...\n`);
    const results = await runPool(selected, 4, 50);

    const nameWidth = Math.max(24, ...results.map((result) => result.name.length));
    for (const result of results) {
        const icon = result.status === "ok"
            ? "PASS"
            : result.status === "pass"
            ? "PASS*"
            : result.status === "skipped"
            ? "SKIP"
            : "FAIL";
        const detail = result.detail ? `  ${result.detail}` : "";
        console.log(
            `${pad(result.name, nameWidth)}  ${icon}  ${result.durationMs.toFixed(0).padStart(6)}ms${detail}`,
        );
    }

    const passed = results.filter((result) => result.status === "ok" || result.status === "pass").length;
    const failed = results.filter((result) => result.status === "failed").length;
    const skippedCount = results.filter((result) => result.status === "skipped").length;
    const totalMs = results.reduce((sum, result) => sum + result.durationMs, 0);
    console.log(
        `\nTotal: ${results.length} | passed: ${passed} | failed: ${failed} | skipped: ${skippedCount} | ${
            (totalMs / 1000).toFixed(1)
        }s`,
    );

    if (failed > 0) Deno.exit(1);
}

await main();
