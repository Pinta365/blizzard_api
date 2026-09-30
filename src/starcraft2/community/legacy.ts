/**
 * This module provides the legacy StarCraft II community endpoints (profile, ladders, matches, ladder, achievements and
 * rewards) using the Blizzard API.
 */

import type { ApiContext } from "../../shared/index.ts";

export interface Sc2LegacyIcon {
    x: number;
    y: number;
    w: number;
    h: number;
    offset: number;
    url: string;
}

export interface Sc2LegacyCharacter {
    id: string;
    realm: number;
    region: number;
    displayName: string;
    clanName: string;
    clanTag: string;
    profilePath: string;
}

export interface Sc2LegacyCareer {
    primaryRace: string;
    terranWins: number;
    protossWins: number;
    zergWins: number;
    highest1v1Rank: string | null;
    highestTeamRank: string | null;
    seasonTotalGames: number;
    careerTotalGames: number;
}

export interface Sc2LegacySwarmLevel {
    level: number;
    totalLevelXP: number;
    currentLevelXP: number;
}

export interface Sc2LegacySwarmLevels {
    level: number;
    terran: Sc2LegacySwarmLevel;
    zerg: Sc2LegacySwarmLevel;
    protoss: Sc2LegacySwarmLevel;
}

export interface Sc2LegacySeason {
    seasonId: number;
    seasonNumber: number;
    seasonYear: number;
    totalGamesThisSeason: number;
    stats: {
        type: string;
        wins: number;
        games: number;
    }[];
}

export interface Sc2LegacyAchievementsSummary {
    points: {
        totalPoints: number;
        categoryPoints: Record<string, number>;
    };
    achievements: {
        achievementId: string;
        completionDate: number;
    }[];
}

export interface Sc2LegacyProfile {
    id: string;
    realm: number;
    displayName: string;
    clanName: string;
    clanTag: string;
    profilePath: string;
    portrait: Sc2LegacyIcon;
    career: Sc2LegacyCareer;
    swarmLevels: Sc2LegacySwarmLevels;
    campaign: Record<string, unknown>;
    season: Sc2LegacySeason;
    rewards: {
        selected: string[];
        earned: string[];
    };
    achievements: Sc2LegacyAchievementsSummary;
}

export interface Sc2LegacyLadderGroup {
    ladder: unknown[];
    characters: Sc2LegacyCharacter[];
    nonRanked: {
        mmq: string;
        gamesPlayed: number;
    }[];
}

export interface Sc2LegacyLadders {
    currentSeason: Sc2LegacyLadderGroup[];
    previousSeason: Sc2LegacyLadderGroup[];
    showcasePlacement: Sc2LegacyLadderGroup[];
}

export interface Sc2LegacyMatch {
    map: string;
    type: string;
    decision: string;
    speed: string;
    date: number;
}

export interface Sc2LegacyMatches {
    matches: Sc2LegacyMatch[];
}

export interface Sc2LegacyLadder {
    ladderMembers: {
        character: Sc2LegacyCharacter;
        joinTimestamp: number;
        points: number;
        wins: number;
        losses: number;
        highestRank: number;
        previousRank: number;
        favoriteRaceP1: string;
    }[];
}

export interface Sc2LegacyAchievement {
    title: string;
    description: string;
    achievementId: string;
    categoryId: string;
    points: number;
    icon: Sc2LegacyIcon;
}

export interface Sc2LegacyAchievementCategory {
    title: string;
    categoryId: string;
    featuredAchievementId: string;
    children: {
        title: string;
        categoryId: string;
        featuredAchievementId: string;
    }[];
}

export interface Sc2LegacyAchievements {
    achievements: Sc2LegacyAchievement[];
    categories: Sc2LegacyAchievementCategory[];
}

export interface Sc2LegacyReward {
    title: string;
    id: string;
    icon: Sc2LegacyIcon;
    achievementId: string;
}

export interface Sc2LegacyRewards {
    portraits: Sc2LegacyReward[];
    terranDecals: Sc2LegacyReward[];
    zergDecals: Sc2LegacyReward[];
    protossDecals: Sc2LegacyReward[];
    skins: (Sc2LegacyReward & { name: string })[];
    animations: (Sc2LegacyReward & { command: string })[];
}

/**
 * Returns the legacy StarCraft II profile of a player.
 *
 * @param regionId - The region: 1=US, 2=EU, 3=KR/TW, 5=CN.
 * @param realmId - The realm: 1 or 2.
 * @param profileId - The unique identifier for the profile.
 * @returns A promise that resolves to an object representing the legacy profile.
 */
export async function legacyProfile(
    ctx: ApiContext,
    regionId: number,
    realmId: number,
    profileId: number,
): Promise<Sc2LegacyProfile> {
    return await ctx.request({
        method: "GET",
        url: `/sc2/legacy/profile/${regionId}/${realmId}/${profileId}`,
    }) as Sc2LegacyProfile;
}

/**
 * Returns the legacy StarCraft II ladders of a player.
 *
 * @param regionId - The region: 1=US, 2=EU, 3=KR/TW, 5=CN.
 * @param realmId - The realm: 1 or 2.
 * @param profileId - The unique identifier for the profile.
 * @returns A promise that resolves to an object representing the legacy ladders.
 */
export async function legacyLadders(
    ctx: ApiContext,
    regionId: number,
    realmId: number,
    profileId: number,
): Promise<Sc2LegacyLadders> {
    return await ctx.request({
        method: "GET",
        url: `/sc2/legacy/profile/${regionId}/${realmId}/${profileId}/ladders`,
    }) as Sc2LegacyLadders;
}

/**
 * Returns the legacy StarCraft II matches of a player.
 *
 * @param regionId - The region: 1=US, 2=EU, 3=KR/TW, 5=CN.
 * @param realmId - The realm: 1 or 2.
 * @param profileId - The unique identifier for the profile.
 * @returns A promise that resolves to an object representing the legacy matches.
 */
export async function legacyMatches(
    ctx: ApiContext,
    regionId: number,
    realmId: number,
    profileId: number,
): Promise<Sc2LegacyMatches> {
    return await ctx.request({
        method: "GET",
        url: `/sc2/legacy/profile/${regionId}/${realmId}/${profileId}/matches`,
    }) as Sc2LegacyMatches;
}

/**
 * Returns a legacy StarCraft II ladder.
 *
 * @param regionId - The region: 1=US, 2=EU, 3=KR/TW, 5=CN.
 * @param ladderId - The unique identifier for the ladder.
 * @returns A promise that resolves to an object representing the legacy ladder.
 */
export async function legacyLadder(
    ctx: ApiContext,
    regionId: number,
    ladderId: string,
): Promise<Sc2LegacyLadder> {
    return await ctx.request({
        method: "GET",
        url: `/sc2/legacy/ladder/${regionId}/${ladderId}`,
    }) as Sc2LegacyLadder;
}

/**
 * Returns the legacy StarCraft II achievements for a region.
 *
 * @param regionId - The region: 1=US, 2=EU, 3=KR/TW, 5=CN.
 * @returns A promise that resolves to an object representing the legacy achievements.
 */
export async function legacyAchievements(ctx: ApiContext, regionId: number): Promise<Sc2LegacyAchievements> {
    return await ctx.request({
        method: "GET",
        url: `/sc2/legacy/data/achievements/${regionId}`,
    }) as Sc2LegacyAchievements;
}

/**
 * Returns the legacy StarCraft II rewards for a region.
 *
 * @param regionId - The region: 1=US, 2=EU, 3=KR/TW, 5=CN.
 * @returns A promise that resolves to an object representing the legacy rewards.
 */
export async function legacyRewards(ctx: ApiContext, regionId: number): Promise<Sc2LegacyRewards> {
    return await ctx.request({
        method: "GET",
        url: `/sc2/legacy/data/rewards/${regionId}`,
    }) as Sc2LegacyRewards;
}
