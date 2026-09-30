/**
 * This module provides the Diablo III profile endpoints (account, hero and hero items) using the Blizzard API.
 */

import type { ApiContext } from "../../shared/index.ts";

export interface D3ItemType {
    twoHanded: boolean;
    id: string;
}

export interface D3Attributes {
    primary: string[];
    secondary: string[];
}

export interface D3ItemColor {
    id: string;
    name: string;
    icon: string;
    tooltipParams: string;
}

export interface D3ItemRef {
    id: string;
    name: string;
    icon: string;
    displayColor: string;
    tooltipParams: string;
}

export interface D3Gem {
    item: {
        id: string;
        slug: string;
        name: string;
        icon: string;
        path: string;
    };
    jewelRank: number;
    jewelSecondaryUnlockRank: number;
    attributes: string[];
    isGem: boolean;
    isJewel: boolean;
}

export interface D3ItemSet {
    name: string;
    slug: string;
    description: string;
    descriptionHtml: string;
}

export interface D3CraftedBy {
    id: string;
    slug: string;
    name: string;
    cost: number;
    reagents: {
        quantity: number;
        item: {
            id: string;
            slug: string;
            name: string;
            icon: string;
            path: string;
        };
    }[];
    itemProduced: {
        id: string;
        path: string;
    };
}

export interface D3HeroItem {
    id: string;
    name: string;
    icon: string;
    displayColor: string;
    tooltipParams: string;
    requiredLevel?: number;
    itemLevel?: number;
    stackSizeMax?: number;
    accountBound?: boolean;
    flavorText?: string;
    typeName?: string;
    type?: D3ItemType;
    armor?: number;
    attacksPerSecond?: number;
    minDamage?: number;
    maxDamage?: number;
    damage?: string;
    dps?: string;
    elementalType?: string;
    slots?: string;
    augmentation?: string;
    attributes?: D3Attributes;
    attributesHtml?: D3Attributes;
    openSockets?: number;
    gems?: D3Gem[];
    set?: D3ItemSet;
    dye?: D3ItemColor;
    transmog?: D3ItemRef;
    craftedBy?: D3CraftedBy;
    seasonRequiredToDrop?: number;
    isSeasonRequiredToDrop?: boolean;
}

export interface D3HeroItems {
    head?: D3HeroItem;
    neck?: D3HeroItem;
    torso?: D3HeroItem;
    shoulders?: D3HeroItem;
    legs?: D3HeroItem;
    waist?: D3HeroItem;
    hands?: D3HeroItem;
    bracers?: D3HeroItem;
    feet?: D3HeroItem;
    leftFinger?: D3HeroItem;
    rightFinger?: D3HeroItem;
    mainHand?: D3HeroItem;
    offHand?: D3HeroItem;
}

export interface D3FollowerItems {
    head?: D3HeroItem;
    neck?: D3HeroItem;
    torso?: D3HeroItem;
    shoulders?: D3HeroItem;
    legs?: D3HeroItem;
    waist?: D3HeroItem;
    hands?: D3HeroItem;
    bracers?: D3HeroItem;
    feet?: D3HeroItem;
    leftFinger?: D3HeroItem;
    rightFinger?: D3HeroItem;
    mainHand?: D3HeroItem;
    offHand?: D3HeroItem;
    special?: D3HeroItem;
}

export interface D3HeroFollowerItems {
    templar: D3FollowerItems;
    scoundrel: D3FollowerItems;
    enchantress: D3FollowerItems;
}

export interface D3Skill {
    slug: string;
    name: string;
    icon: string;
    level: number;
    tooltipUrl: string;
    description: string;
    descriptionHtml: string;
    flavorText?: string;
}

export interface D3SkillRune {
    slug: string;
    type: string;
    name: string;
    level: number;
    description: string;
    descriptionHtml: string;
}

export interface D3FollowerStats {
    goldFind: number;
    magicFind: number;
    experienceBonus: number;
}

export interface D3Follower {
    slug: string;
    level: number;
    items: D3FollowerItems;
    stats: D3FollowerStats;
    skills: D3Skill[];
}

export interface D3ActProgress {
    completed: boolean;
    completedQuests: unknown[];
}

export interface D3HeroStats {
    life: number;
    damage: number;
    toughness: number;
    healing: number;
    attackSpeed: number;
    armor: number;
    strength: number;
    dexterity: number;
    vitality: number;
    intelligence: number;
    physicalResist: number;
    fireResist: number;
    coldResist: number;
    lightningResist: number;
    poisonResist: number;
    arcaneResist: number;
    blockChance: number;
    blockAmountMin: number;
    blockAmountMax: number;
    goldFind: number;
    critChance: number;
    thorns: number;
    lifeSteal: number;
    lifePerKill: number;
    lifeOnHit: number;
    primaryResource: number;
    secondaryResource: number;
}

export interface D3Hero {
    id: number;
    name: string;
    class: string;
    gender: number;
    level: number;
    paragonLevel: number;
    kills: {
        elites: number;
    };
    hardcore: boolean;
    seasonal: boolean;
    seasonCreated: number;
    skills: {
        active: {
            skill: D3Skill;
            rune: D3SkillRune;
        }[];
        passive: {
            skill: D3Skill;
        }[];
    };
    items: D3HeroItems;
    followers: {
        templar: D3Follower;
        scoundrel: D3Follower;
        enchantress: D3Follower;
    };
    legendaryPowers: D3ItemRef[];
    progression: {
        act1: D3ActProgress;
        act2: D3ActProgress;
        act3: D3ActProgress;
        act4: D3ActProgress;
        act5: D3ActProgress;
    };
    alive: boolean;
    lastUpdated: number;
    highestSoloRiftCompleted: number;
    stats: D3HeroStats;
}

export interface D3Kills {
    monsters: number;
    elites: number;
    hardcoreMonsters: number;
}

export interface D3AccountHero {
    id: number;
    name: string;
    class: string;
    classSlug: string;
    gender: number;
    level: number;
    kills: {
        elites: number;
    };
    paragonLevel: number;
    hardcore: boolean;
    seasonal: boolean;
    dead: boolean;
    "last-updated": number;
}

export interface D3FallenHero {
    heroId: number;
    name: string;
    class: string;
    level: number;
    elites: number;
    hardcore: boolean;
    death: {
        killer: number;
        time: number;
    };
    gender: number;
}

export interface D3SeasonalProfile {
    seasonId: number;
    paragonLevel: number;
    paragonLevelHardcore: number;
    kills: D3Kills;
    timePlayed: Record<string, number>;
    highestHardcoreLevel: number;
}

export interface D3Artisan {
    slug: string;
    level: number;
}

export interface D3Account {
    battleTag: string;
    paragonLevel: number;
    paragonLevelHardcore: number;
    paragonLevelSeason: number;
    paragonLevelSeasonHardcore: number;
    guildName: string;
    heroes: D3AccountHero[];
    lastHeroPlayed: number;
    lastUpdated: number;
    kills: D3Kills;
    highestHardcoreLevel: number;
    timePlayed: Record<string, number>;
    progression: {
        act1: boolean;
        act2: boolean;
        act3: boolean;
        act4: boolean;
        act5: boolean;
    };
    fallenHeroes: D3FallenHero[];
    seasonalProfiles: Record<string, D3SeasonalProfile>;
    blacksmith: D3Artisan;
    jeweler: D3Artisan;
    mystic: D3Artisan;
    blacksmithSeason: D3Artisan;
    blacksmithHardcore: D3Artisan;
    blacksmithSeasonHardcore: D3Artisan;
    jewelerSeason: D3Artisan;
    jewelerHardcore: D3Artisan;
    jewelerSeasonHardcore: D3Artisan;
    mysticSeason: D3Artisan;
    mysticHardcore: D3Artisan;
    mysticSeasonHardcore: D3Artisan;
}

/**
 * The Battle.net APIs address battle tags with a `-` instead of the `#` separator, e.g. `Name#1234` becomes
 * `Name-1234` in the URL.
 */
function battleTagPath(battleTag: string): string {
    return battleTag.replace("#", "-");
}

/**
 * Returns the account profile of a battle tag, including its heroes.
 *
 * @param battleTag - The battle tag, e.g. "Name#1234" (the "#" is sent as "-").
 * @returns A promise that resolves to an object representing the account profile.
 */
export async function account(ctx: ApiContext, battleTag: string): Promise<D3Account> {
    return await ctx.request({
        method: "GET",
        url: `/d3/profile/${battleTagPath(battleTag)}/`,
    }) as D3Account;
}

/**
 * Returns a hero of a battle tag.
 *
 * @param battleTag - The battle tag, e.g. "Name#1234" (the "#" is sent as "-").
 * @param heroId - The unique identifier for the hero.
 * @returns A promise that resolves to an object representing the hero.
 */
export async function hero(ctx: ApiContext, battleTag: string, heroId: number): Promise<D3Hero> {
    return await ctx.request({
        method: "GET",
        url: `/d3/profile/${battleTagPath(battleTag)}/hero/${heroId}`,
    }) as D3Hero;
}

/**
 * Returns the equipped items of a hero.
 *
 * @param battleTag - The battle tag, e.g. "Name#1234" (the "#" is sent as "-").
 * @param heroId - The unique identifier for the hero.
 * @returns A promise that resolves to an object representing the hero's equipped items.
 */
export async function heroItems(ctx: ApiContext, battleTag: string, heroId: number): Promise<D3HeroItems> {
    return await ctx.request({
        method: "GET",
        url: `/d3/profile/${battleTagPath(battleTag)}/hero/${heroId}/items`,
    }) as D3HeroItems;
}

/**
 * Returns the items equipped by a hero's followers.
 *
 * @param battleTag - The battle tag, e.g. "Name#1234" (the "#" is sent as "-").
 * @param heroId - The unique identifier for the hero.
 * @returns A promise that resolves to an object representing the hero's follower items.
 */
export async function heroFollowerItems(
    ctx: ApiContext,
    battleTag: string,
    heroId: number,
): Promise<D3HeroFollowerItems> {
    return await ctx.request({
        method: "GET",
        url: `/d3/profile/${battleTagPath(battleTag)}/hero/${heroId}/follower-items`,
    }) as D3HeroFollowerItems;
}
