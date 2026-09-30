// scripts/smoke.ts
//
// Live smoke test for the Blizzard API library.
//
// Usage:
//   deno run --env-file=.env -A scripts/smoke.ts [filter]
//
// Reads BLIZZARD_CLIENT_ID / BLIZZARD_CLIENT_SECRET from the environment plus
// the optional BLIZZARD_REGION (default "eu") and BLIZZARD_LOCALE (default
// "en_GB"). Successful raw responses are written to fixtures/<case>.json.

import { diablo3, errors, hearthstone, sc2, setup, wow, wowClassic } from "../mod.ts";
import type { Locales, Regions } from "../src/shared/types.ts";

const REALM_SLUG = "silvermoon";
const ITEM_ID = 19019;
const MOUNT_ID = 6;
const ARTISAN_SLUG = "blacksmith";
const FOLLOWER_SLUG = "templar";
const HERO_SLUG = "barbarian";

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

function afterPrefix(value: string, prefix: string): string {
    const marker = prefix.endsWith("/") ? prefix : prefix + "/";
    const index = value.indexOf(marker);
    return index >= 0 ? value.slice(index + marker.length) : lastSegment(value);
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
    return once("wow.connectedRealms", () => wow.connectedRealms()).then((source) => indexId(source));
}

function searchedSpellId(): Promise<number> {
    return once("wow.searchSpell", () => wow.searchSpell({ pageSize: 1 })).then((result) => searchFirstId(result));
}

function firstRecipeId(): Promise<number> {
    return once("wow.firstRecipe", async () => {
        const professions = await wow.professions();
        const professionId = indexId(professions);
        const profession = await wow.profession(professionId);
        const tierId = profession.skill_tiers[0]?.id;
        if (tierId === undefined) throw new Error("profession has no skill tiers");
        const tier = await wow.professionSkillTier(professionId, tierId);
        const recipe = tier.categories[0]?.recipes[0];
        if (!recipe) throw new Error("skill tier has no recipes");
        return recipe.id;
    });
}

function newestPvpSeasonId(): Promise<number> {
    return once("wow.pvpSeasons", () => wow.pvpSeasons()).then((seasons) => {
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
    const realm = await wow.realm(REALM_SLUG);
    const realmId = idFromHref(realm.connected_realm.href);
    const periods = await wow.mythicKeystonePeriods();
    const period = periods.current_period.id;
    const leaderboards = await wow.mythicKeystoneLeaderboards(realmId);
    const dungeon = leaderboards.current_leaderboards[0];
    if (!dungeon) throw new Error("no current mythic keystone leaderboards available");
    const leaderboard = await wow.mythicKeystoneLeaderboard(realmId, dungeon.id, period);

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
        let profile: Awaited<ReturnType<typeof wow.characterProfile>>;
        try {
            profile = await wow.characterProfile(memberRealm, memberName);
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

const cases: Case[] = [
    // ----- wow: game data ------------------------------------------------
    c("wow.achievementCategories", () => wow.achievementCategories()),
    c(
        "wow.achievementCategory",
        detail("wow.achievementCategories", () => wow.achievementCategories(), wow.achievementCategory),
    ),
    c("wow.achievements", () => wow.achievements()),
    c("wow.achievement", detail("wow.achievements", () => wow.achievements(), wow.achievement)),
    c("wow.achievementMedia", detail("wow.achievements", () => wow.achievements(), wow.achievementMedia)),
    c("wow.auctions", async () => await wow.auctions(await connectedRealmId())),
    c("wow.commodities", () => wow.commodities()),
    c("wow.azeriteEssences", () => wow.azeriteEssences()),
    c("wow.azeriteEssence", detail("wow.azeriteEssences", () => wow.azeriteEssences(), wow.azeriteEssence)),
    c("wow.azeriteEssenceMedia", detail("wow.azeriteEssences", () => wow.azeriteEssences(), wow.azeriteEssenceMedia)),
    c("wow.searchAzeriteEssence", () => wow.searchAzeriteEssence({ pageSize: 1 })),
    c("wow.connectedRealms", () => wow.connectedRealms()),
    c("wow.connectedRealm", detail("wow.connectedRealms", () => wow.connectedRealms(), wow.connectedRealm)),
    c("wow.searchConnectedRealm", () => wow.searchConnectedRealm({ pageSize: 1 })),
    c("wow.covenants", () => wow.covenants()),
    c("wow.covenant", detail("wow.covenants", () => wow.covenants(), wow.covenant)),
    c("wow.covenantConduits", () => wow.covenantConduits()),
    c("wow.covenantConduit", detail("wow.covenantConduits", () => wow.covenantConduits(), wow.covenantConduit)),
    c("wow.covenantSoulbinds", () => wow.covenantSoulbinds()),
    c("wow.covenantSoulbind", detail("wow.covenantSoulbinds", () => wow.covenantSoulbinds(), wow.covenantSoulbind)),
    c("wow.creatureFamilies", () => wow.creatureFamilies()),
    c("wow.creatureFamily", detail("wow.creatureFamilies", () => wow.creatureFamilies(), wow.creatureFamily)),
    c("wow.creatureFamilyMedia", detail("wow.creatureFamilies", () => wow.creatureFamilies(), wow.creatureFamilyMedia)),
    c("wow.creatureTypes", () => wow.creatureTypes()),
    c("wow.creatureType", detail("wow.creatureTypes", () => wow.creatureTypes(), wow.creatureType)),
    c("wow.creature", async () => await wow.creature(searchFirstId(await wow.searchCreature({ pageSize: 1 })))),
    c("wow.searchCreature", () => wow.searchCreature({ pageSize: 1 })),
    c("wow.creatureDisplayMedia", async () => {
        const creatureId = searchFirstId(await wow.searchCreature({ pageSize: 1 }));
        const creature = await wow.creature(creatureId);
        const display = creature.creature_displays[0];
        if (!display) throw new Error("creature has no displays");
        return await wow.creatureDisplayMedia(display.id);
    }),
    c("wow.guildCrests", () => wow.guildCrests()),
    c("wow.guildCrestBorder", detail("wow.guildCrests", () => wow.guildCrests(), wow.guildCrestBorder, "borders")),
    c("wow.guildCrestEmblem", detail("wow.guildCrests", () => wow.guildCrests(), wow.guildCrestEmblem, "emblems")),
    c("wow.heirlooms", () => wow.heirlooms()),
    c("wow.heirloom", detail("wow.heirlooms", () => wow.heirlooms(), wow.heirloom)),
    c("wow.decors", () => wow.decors()),
    c("wow.decor", detail("wow.decors", () => wow.decors(), wow.decor)),
    c("wow.searchDecor", () => wow.searchDecor({ pageSize: 1 })),
    c("wow.fixtures", () => wow.fixtures()),
    c("wow.fixture", detail("wow.fixtures", () => wow.fixtures(), wow.fixture)),
    c("wow.searchFixture", () => wow.searchFixture({ pageSize: 1 })),
    c("wow.fixtureHooks", () => wow.fixtureHooks()),
    c("wow.fixtureHook", detail("wow.fixtureHooks", () => wow.fixtureHooks(), wow.fixtureHook)),
    c("wow.searchFixtureHook", () => wow.searchFixtureHook({ pageSize: 1 })),
    c("wow.rooms", () => wow.rooms()),
    c("wow.room", detail("wow.rooms", () => wow.rooms(), wow.room)),
    c("wow.searchRoom", () => wow.searchRoom({ pageSize: 1 })),
    c("wow.itemClasses", () => wow.itemClasses()),
    c("wow.itemClass", detail("wow.itemClasses", () => wow.itemClasses(), wow.itemClass)),
    c("wow.itemSets", () => wow.itemSets()),
    c("wow.itemSet", detail("wow.itemSets", () => wow.itemSets(), wow.itemSet)),
    c("wow.itemSubclass", async () => {
        const classes = await wow.itemClasses();
        const classId = indexId(classes);
        const cls = await wow.itemClass(classId);
        const subclass = cls.item_subclasses[0];
        if (!subclass) throw new Error("item class has no subclasses");
        return await wow.itemSubclass(classId, subclass.id);
    }),
    c("wow.item", () => wow.item(ITEM_ID)),
    c("wow.itemMedia", () => wow.itemMedia(ITEM_ID)),
    c("wow.searchItem", () => wow.searchItem({ pageSize: 1 })),
    c("wow.searchMedia", () => wow.searchMedia({ pageSize: 1 })),
    c("wow.journalExpansions", () => wow.journalExpansions()),
    c("wow.journalExpansion", detail("wow.journalExpansions", () => wow.journalExpansions(), wow.journalExpansion)),
    c("wow.journalEncounters", () => wow.journalEncounters()),
    c("wow.journalEncounter", detail("wow.journalEncounters", () => wow.journalEncounters(), wow.journalEncounter)),
    c("wow.searchJournalEncounter", () => wow.searchJournalEncounter({ pageSize: 1 })),
    c("wow.journalInstances", () => wow.journalInstances()),
    c("wow.journalInstance", detail("wow.journalInstances", () => wow.journalInstances(), wow.journalInstance)),
    c(
        "wow.journalInstanceMedia",
        detail("wow.journalInstances", () => wow.journalInstances(), wow.journalInstanceMedia),
    ),
    c("wow.modifiedCraftingParents", () => wow.modifiedCraftingParents()),
    c("wow.modifiedCraftingCategories", () => wow.modifiedCraftingCategories()),
    c(
        "wow.modifiedCraftingCategory",
        detail(
            "wow.modifiedCraftingCategories",
            () => wow.modifiedCraftingCategories(),
            wow.modifiedCraftingCategory,
        ),
    ),
    c("wow.modifiedCraftingSlotTypes", () => wow.modifiedCraftingSlotTypes()),
    c(
        "wow.modifiedCraftingSlotType",
        detail(
            "wow.modifiedCraftingSlotTypes",
            () => wow.modifiedCraftingSlotTypes(),
            wow.modifiedCraftingSlotType,
        ),
    ),
    c("wow.mounts", () => wow.mounts()),
    c("wow.mount", () => wow.mount(MOUNT_ID)),
    c("wow.searchMount", () => wow.searchMount({ pageSize: 1 })),
    c("wow.keystoneAffixes", () => wow.keystoneAffixes()),
    c("wow.keystoneAffix", detail("wow.keystoneAffixes", () => wow.keystoneAffixes(), wow.keystoneAffix)),
    c("wow.keystoneAffixMedia", detail("wow.keystoneAffixes", () => wow.keystoneAffixes(), wow.keystoneAffixMedia)),
    c("wow.mythicKeystoneDungeons", () => wow.mythicKeystoneDungeons()),
    c(
        "wow.mythicKeystoneDungeon",
        detail(
            "wow.mythicKeystoneDungeons",
            () => wow.mythicKeystoneDungeons(),
            wow.mythicKeystoneDungeon,
        ),
    ),
    c("wow.mythicKeystoneIndex", () => wow.mythicKeystoneIndex()),
    c("wow.mythicKeystonePeriods", () => wow.mythicKeystonePeriods()),
    c(
        "wow.mythicKeystonePeriod",
        detail(
            "wow.mythicKeystonePeriods",
            () => wow.mythicKeystonePeriods(),
            wow.mythicKeystonePeriod,
        ),
    ),
    c("wow.mythicKeystoneSeasons", () => wow.mythicKeystoneSeasons()),
    c(
        "wow.mythicKeystoneSeason",
        detail(
            "wow.mythicKeystoneSeasons",
            () => wow.mythicKeystoneSeasons(),
            wow.mythicKeystoneSeason,
        ),
    ),
    c("wow.mythicKeystoneLeaderboards", async () => await wow.mythicKeystoneLeaderboards(await connectedRealmId())),
    c("wow.mythicKeystoneLeaderboard", async () => {
        const realmId = await connectedRealmId();
        const leaderboards = await wow.mythicKeystoneLeaderboards(realmId);
        const dungeon = leaderboards.current_leaderboards[0];
        if (!dungeon) throw new Error("no current mythic keystone leaderboards available");
        const periods = await wow.mythicKeystonePeriods();
        return await wow.mythicKeystoneLeaderboard(realmId, dungeon.id, periods.current_period.id);
    }),
    c("wow.mythicRaidLeaderboard", () => wow.mythicRaidLeaderboard("uldir", "alliance")),
    c("wow.neighborhoodMaps", () => wow.neighborhoodMaps()),
    c("wow.neighborhoodMap", detail("wow.neighborhoodMaps", () => wow.neighborhoodMaps(), wow.neighborhoodMap)),
    c("wow.neighborhood", async () => {
        const maps = await wow.neighborhoodMaps();
        return await wow.neighborhood(indexId(maps), 1);
    }),
    c("wow.pets", () => wow.pets()),
    c("wow.pet", detail("wow.pets", () => wow.pets(), wow.pet)),
    c("wow.petMedia", detail("wow.pets", () => wow.pets(), wow.petMedia)),
    c("wow.petAbilities", () => wow.petAbilities()),
    c("wow.petAbility", detail("wow.petAbilities", () => wow.petAbilities(), wow.petAbility)),
    c("wow.petAbilityMedia", detail("wow.petAbilities", () => wow.petAbilities(), wow.petAbilityMedia)),
    c("wow.playableClasses", () => wow.playableClasses()),
    c("wow.playableClass", detail("wow.playableClasses", () => wow.playableClasses(), wow.playableClass)),
    c("wow.playableClassMedia", detail("wow.playableClasses", () => wow.playableClasses(), wow.playableClassMedia)),
    c(
        "wow.playableClassPvpTalentSlots",
        detail(
            "wow.playableClasses",
            () => wow.playableClasses(),
            wow.playableClassPvpTalentSlots,
        ),
    ),
    c("wow.playableRaces", () => wow.playableRaces()),
    c("wow.playableRace", detail("wow.playableRaces", () => wow.playableRaces(), wow.playableRace)),
    c("wow.powerTypes", () => wow.powerTypes()),
    c("wow.powerType", detail("wow.powerTypes", () => wow.powerTypes(), wow.powerType)),
    c("wow.professions", () => wow.professions()),
    c("wow.profession", detail("wow.professions", () => wow.professions(), wow.profession)),
    c("wow.professionMedia", detail("wow.professions", () => wow.professions(), wow.professionMedia)),
    c("wow.professionSkillTier", async () => {
        const professions = await wow.professions();
        const professionId = indexId(professions);
        const profession = await wow.profession(professionId);
        const tierId = profession.skill_tiers[0]?.id;
        if (tierId === undefined) throw new Error("profession has no skill tiers");
        return await wow.professionSkillTier(professionId, tierId);
    }),
    c("wow.professionRecipie", async () => await wow.professionRecipie(await firstRecipeId())),
    c("wow.professionRecipieMedia", async () => await wow.professionRecipieMedia(await firstRecipeId())),
    c("wow.pvpSeasons", () => wow.pvpSeasons()),
    c("wow.pvpSeason", async () => await wow.pvpSeason(await newestPvpSeasonId())),
    c("wow.pvpSeasonLeaderboards", async () => await wow.pvpSeasonLeaderboards(await newestPvpSeasonId())),
    c("wow.pvpSeasonLeaderboard", async () => {
        const seasonId = await newestPvpSeasonId();
        const leaderboards = await wow.pvpSeasonLeaderboards(seasonId);
        const leaderboard = leaderboards.leaderboards[0];
        if (!leaderboard) throw new Error("pvp season has no leaderboards");
        return await wow.pvpSeasonLeaderboard(seasonId, leaderboard.name);
    }),
    c("wow.pvpSeasonRewards", async () => await wow.pvpSeasonRewards(await newestPvpSeasonId())),
    c("wow.pvpTiers", () => wow.pvpTiers()),
    c("wow.pvpTier", detail("wow.pvpTiers", () => wow.pvpTiers(), wow.pvpTier)),
    c("wow.pvpTierMedia", detail("wow.pvpTiers", () => wow.pvpTiers(), wow.pvpTierMedia)),
    c("wow.quests", () => wow.quests()),
    c("wow.quest", async () => {
        const categories = await wow.questCategories();
        const category = await wow.questCategory(indexId(categories));
        const quest = category.quests[0];
        if (!quest) throw new Error("quest category has no quests");
        return await wow.quest(quest.id);
    }),
    c("wow.questCategories", () => wow.questCategories()),
    c("wow.questCategory", detail("wow.questCategories", () => wow.questCategories(), wow.questCategory)),
    c("wow.questAreas", () => wow.questAreas()),
    c("wow.questArea", detail("wow.questAreas", () => wow.questAreas(), wow.questArea)),
    c("wow.questTypes", () => wow.questTypes()),
    c("wow.questType", detail("wow.questTypes", () => wow.questTypes(), wow.questType)),
    c("wow.realms", () => wow.realms()),
    c("wow.realm", () => wow.realm(REALM_SLUG)),
    c("wow.searchRealm", () => wow.searchRealm({ pageSize: 1 })),
    c("wow.regions", () => wow.regions()),
    c("wow.region", detail("wow.regions", () => wow.regions(), wow.region)),
    c("wow.reputationFactions", () => wow.reputationFactions()),
    c(
        "wow.reputationFaction",
        detailStr(
            "wow.reputationFactions",
            () => wow.reputationFactions(),
            wow.reputationFaction,
        ),
    ),
    c("wow.reputationTiers", () => wow.reputationTiers()),
    c("wow.reputationTier", detailStr("wow.reputationTiers", () => wow.reputationTiers(), wow.reputationTier)),
    c("wow.spell", async () => await wow.spell(await searchedSpellId())),
    c("wow.spellMedia", async () => await wow.spellMedia(await searchedSpellId())),
    c("wow.searchSpell", () => wow.searchSpell({ pageSize: 1 })),
    c("wow.titles", () => wow.titles()),
    c("wow.title", detail("wow.titles", () => wow.titles(), wow.title)),
    c("wow.toys", () => wow.toys()),
    c("wow.toy", detail("wow.toys", () => wow.toys(), wow.toy)),
    c("wow.talents", () => wow.talents()),
    c("wow.talent", detail("wow.talents", () => wow.talents(), wow.talent)),
    c("wow.talentTrees", () => wow.talentTrees()),
    c("wow.talentTree", async () => {
        const trees = await once("wow.talentTrees", () => wow.talentTrees());
        const link = talentTreeLinks(trees, "spec_talent_trees")[0];
        const href = link?.key?.href;
        if (!href) throw new Error("no spec talent trees available");
        const { treeId, specId } = talentTreeIds(href);
        return await wow.talentTree(treeId, specId);
    }),
    c("wow.talentTreeNodes", async () => {
        const trees = await once("wow.talentTrees", () => wow.talentTrees());
        const link = talentTreeLinks(trees, "class_talent_trees")[0];
        if (!link) throw new Error("no class talent trees available");
        const treeId = typeof link.id === "number" ? link.id : idFromHref(link.key?.href ?? "");
        return await wow.talentTreeNodes(treeId);
    }),
    c("wow.pvpTalents", () => wow.pvpTalents()),
    c("wow.pvpTalent", detail("wow.pvpTalents", () => wow.pvpTalents(), wow.pvpTalent)),
    c("wow.techTalentTrees", () => wow.techTalentTrees()),
    c("wow.techTalentTree", detail("wow.techTalentTrees", () => wow.techTalentTrees(), wow.techTalentTree)),
    c("wow.techTalents", () => wow.techTalents()),
    c("wow.techTalent", detail("wow.techTalents", () => wow.techTalents(), wow.techTalent)),
    c("wow.techTalentMedia", detail("wow.techTalents", () => wow.techTalents(), wow.techTalentMedia)),
    c("wow.token", () => wow.token()),

    // ----- wow: profile --------------------------------------------------
    c("wow.characterProfile", () => profileCall(wow.characterProfile)),
    c("wow.characterProfileStatus", () => profileCall(wow.characterProfileStatus)),
    c("wow.characterAchievementSummary", () => profileCall(wow.characterAchievementSummary)),
    c("wow.characterAchievementStatistics", () => profileCall(wow.characterAchievementStatistics)),
    c("wow.characterAppearanceSummary", () => profileCall(wow.characterAppearanceSummary)),
    c("wow.characterCollectionTypes", () => profileCall(wow.characterCollectionTypes)),
    c("wow.characterCollectionMounts", () => profileCall(wow.characterCollectionMounts)),
    c("wow.characterCollectionPets", () => profileCall(wow.characterCollectionPets)),
    c("wow.characterCollectionToys", () => profileCall(wow.characterCollectionToys)),
    c("wow.characterCollectionHeirlooms", () => profileCall(wow.characterCollectionHeirlooms)),
    c("wow.characterCollectionDecor", () => profileCall(wow.characterCollectionDecor), "character-dependent"),
    c("wow.characterEncounters", () => profileCall(wow.characterEncounters)),
    c("wow.characterEncounterDungeons", () => profileCall(wow.characterEncounterDungeons)),
    c("wow.characterEncounterRaids", () => profileCall(wow.characterEncounterRaids)),
    c("wow.characterEquipments", () => profileCall(wow.characterEquipments)),
    c("wow.characterHunterPets", () => profileCall(wow.characterHunterPets), "character-dependent"),
    c("wow.characterMedia", () => profileCall(wow.characterMedia)),
    c("wow.characterMythicKeystoneProfile", () => profileCall(wow.characterMythicKeystoneProfile)),
    c("wow.characterMythicKeystoneSeasonDetails", async () => {
        const ctx = await getContext();
        const seasons = await wow.mythicKeystoneSeasons();
        return await wow.characterMythicKeystoneSeasonDetails(ctx.realm, ctx.name, seasons.current_season.id);
    }, "character-dependent"),
    c("wow.characterProfessions", () => profileCall(wow.characterProfessions), "character-dependent"),
    c("wow.characterPvpBracketStatistics", async () => {
        const ctx = await getContext();
        return await wow.characterPvpBracketStatistics(ctx.realm, ctx.name, "2v2");
    }, "character-dependent"),
    c("wow.characterPvpSummary", () => profileCall(wow.characterPvpSummary)),
    c("wow.characterQuests", () => profileCall(wow.characterQuests)),
    c("wow.characterCompletedQuests", () => profileCall(wow.characterCompletedQuests)),
    c("wow.characterReputations", () => profileCall(wow.characterReputations)),
    c("wow.characterSoulbinds", () => profileCall(wow.characterSoulbinds), "character-dependent"),
    c("wow.characterSpecializations", () => profileCall(wow.characterSpecializations)),
    c("wow.characterStatistics", () => profileCall(wow.characterStatistics)),
    c("wow.characterTitles", () => profileCall(wow.characterTitles)),
    c("wow.characterHouse", async () => {
        const ctx = await getContext();
        return await wow.characterHouse(ctx.realm, ctx.name, 1);
    }, "character-dependent"),
    c("wow.guild", () => guildCall(wow.guild)),
    c("wow.guildActivity", () => guildCall(wow.guildActivity)),
    c("wow.guildAchievements", () => guildCall(wow.guildAchievements)),
    c("wow.guildRoster", () => guildCall(wow.guildRoster)),

    // ----- wow classic ---------------------------------------------------
    c("wowClassic.realms", () => wowClassic.realms()),
    c("wowClassic.realm", async () => {
        const realms = await wowClassic.realms();
        const realm = realms.realms[0];
        if (!realm) throw new Error("no classic realms available");
        return await wowClassic.realm(realm.slug);
    }),
    c("wowClassic.searchRealm", () => wowClassic.searchRealm({ pageSize: 1 })),

    // ----- hearthstone ---------------------------------------------------
    c("hearthstone.searchCards", () => hearthstone.searchCards({ pageSize: 1 })),
    c("hearthstone.fetchCard", async () => {
        const card = searchFirstStr(await hearthstone.searchCards({ pageSize: 1 }));
        return await hearthstone.fetchCard(card);
    }),
    c("hearthstone.searchCardbacks", () => hearthstone.searchCardbacks({ pageSize: 1 })),
    c("hearthstone.fetchCardback", async () => {
        const cardback = searchFirstStr(await hearthstone.searchCardbacks({ pageSize: 1 }));
        return await hearthstone.fetchCardback(cardback);
    }),
    c("hearthstone.metadata", () => hearthstone.metadata("sets")),
    skipped(
        "hearthstone.fetchDeck",
        "skipped: needs a deck code or card ids (not discoverable from the API)",
    ),

    // ----- starcraft 2 ---------------------------------------------------
    c("sc2.leagueData", () => sc2.leagueData(37, 201, 0, 0)),

    // ----- diablo 3 ------------------------------------------------------
    c("diablo3.seasons", () => diablo3.seasons()),
    c("diablo3.season", async () => {
        const seasons = await diablo3.seasons();
        return await diablo3.season(seasons.current_season);
    }),
    c("diablo3.seasonLeaderboard", async () => {
        const seasons = await diablo3.seasons();
        const season = await diablo3.season(seasons.current_season);
        const leaderboard = season.leaderboard[0];
        if (!leaderboard) throw new Error("season has no leaderboards");
        return await diablo3.seasonLeaderboard(seasons.current_season, lastSegment(leaderboard.ladder.href));
    }),
    c("diablo3.eras", () => diablo3.eras()),
    c("diablo3.era", async () => {
        const eras = await diablo3.eras();
        return await diablo3.era(eras.current_era);
    }),
    c("diablo3.eraLeaderboard", async () => {
        const eras = await diablo3.eras();
        const era = await diablo3.era(eras.current_era);
        const leaderboard = era.leaderboard[0];
        if (!leaderboard) throw new Error("era has no leaderboards");
        return await diablo3.eraLeaderboard(eras.current_era, lastSegment(leaderboard.ladder.href));
    }),
    c("diablo3.acts", () => diablo3.acts()),
    c("diablo3.act", async () => {
        const acts = await diablo3.acts();
        return await diablo3.act(acts.acts[0]?.number ?? 1);
    }),
    c("diablo3.artisan", () => diablo3.artisan(ARTISAN_SLUG)),
    c("diablo3.artisanRecipe", async () => {
        const artisan = await diablo3.artisan(ARTISAN_SLUG);
        const recipes = artisan.training.tiers.flatMap((tier) => [
            ...tier.trainedRecipes,
            ...(tier.taughtRecipes ?? []),
        ]);
        const recipe = recipes[0];
        if (!recipe) throw new Error("artisan has no recipes");
        return await diablo3.artisanRecipe(ARTISAN_SLUG, recipe.slug);
    }),
    c("diablo3.follower", () => diablo3.follower(FOLLOWER_SLUG)),
    c("diablo3.heroClass", () => diablo3.heroClass(HERO_SLUG)),
    c("diablo3.heroSkill", async () => {
        const hero = await diablo3.heroClass(HERO_SLUG);
        const skill = hero.skills.active[0] ?? hero.skills.passive[0];
        if (!skill) throw new Error("hero class has no skills");
        return await diablo3.heroSkill(HERO_SLUG, skill.slug);
    }),
    c("diablo3.itemTypes", () => diablo3.itemTypes()),
    c("diablo3.itemType", async () => {
        const types = await diablo3.itemTypes();
        const type = types[0];
        if (!type) throw new Error("no item types available");
        return await diablo3.itemType(lastSegment(type.path));
    }),
    // Chaining from the item-type index can land on items the API 500s on (e.g. Ethereals), so use the documented example.
    c("diablo3.item", () => diablo3.item("corrupted-ashbringer-Unique_Sword_2H_104_x1")),
];

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
    setup({
        clientId,
        clientSecret,
        region: (Deno.env.get("BLIZZARD_REGION") ?? "eu") as Regions,
        locale: (Deno.env.get("BLIZZARD_LOCALE") ?? "en_GB") as Locales,
    });

    await Deno.mkdir("fixtures", { recursive: true });

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
