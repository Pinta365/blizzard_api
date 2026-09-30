/**
 * This module provides the StarCraft II profile endpoints (static, metadata, profile, ladder summary and ladder) using
 * the Blizzard API.
 */

import type { ApiContext } from "../../shared/index.ts";

export interface Sc2StaticAchievement {
    categoryId: string;
    chainAchievementIds: string[];
    chainRewardSize: number;
    criteriaIds: string[];
    description: string;
    flags: number;
    id: string;
    imageUrl: string;
    isChained: boolean;
    points: number;
    title: string;
    uiOrderHint: number;
}

export interface Sc2StaticCriterion {
    achievementId: string;
    description: string;
    evaluationClass: string;
    flags: number;
    id: string;
    necessaryQuantity: number;
    uiOrderHint: number;
}

export interface Sc2StaticCategory {
    childrenCategoryIds: string[];
    featuredAchievementId: string;
    id: string;
    name: string;
    parentCategoryId: string;
    points: number;
    uiOrderHint: number;
    medalTiers: number[];
}

export interface Sc2StaticReward {
    flags: number;
    id: string;
    achievementId: string;
    name: string;
    imageUrl: string;
    unlockableType: string;
    isSkin: boolean;
    uiOrderHint: number;
}

export interface Sc2StaticProfile {
    achievements: Sc2StaticAchievement[];
    criteria: Sc2StaticCriterion[];
    categories: Sc2StaticCategory[];
    rewards: Sc2StaticReward[];
}

export interface Sc2ProfileMetadata {
    name: string;
    profileUrl: string;
    avatarUrl: string;
    profileId: string;
    regionId: number;
    realmId: number;
}

export interface Sc2ProfileSummary {
    id: string;
    realm: number;
    displayName: string;
    clanName: string;
    clanTag: string;
    portrait: string;
    decalTerran: string;
    decalProtoss: string;
    decalZerg: string;
    totalSwarmLevel: number;
    totalAchievementPoints: number;
}

export interface Sc2SeasonSnapshotEntry {
    rank: number;
    leagueName: string | null;
    totalGames: number;
    totalWins: number;
}

export interface Sc2Career {
    terranWins: number;
    zergWins: number;
    protossWins: number;
    totalCareerGames: number;
    totalGamesThisSeason: number;
    current1v1LeagueName: string | null;
    currentBestTeamLeagueName: string | null;
    best1v1Finish: {
        leagueName: string | null;
        timesAchieved: number;
    };
    bestTeamFinish: {
        leagueName: string | null;
        timesAchieved: number;
    };
}

export interface Sc2SwarmLevel {
    level: number;
    maxLevelPoints: number;
    currentLevelPoints: number;
}

export interface Sc2SwarmLevels {
    level: number;
    terran: Sc2SwarmLevel;
    zerg: Sc2SwarmLevel;
    protoss: Sc2SwarmLevel;
}

export interface Sc2CategoryPointProgress {
    categoryId: string;
    pointsEarned: number;
}

export interface Sc2EarnedReward {
    rewardId: string;
    selected: boolean;
}

export interface Sc2EarnedAchievement {
    achievementId: string;
    completionDate: number;
    numCompletedAchievementsInSeries: number;
    totalAchievementsInSeries: number;
    isComplete: boolean;
    inProgress: boolean;
    criteria: unknown[];
}

export interface Sc2PlayerProfile {
    summary: Sc2ProfileSummary;
    snapshot: {
        seasonSnapshot: Record<string, Sc2SeasonSnapshotEntry>;
        totalRankedSeasonGamesPlayed: number;
    };
    career: Sc2Career;
    swarmLevels: Sc2SwarmLevels;
    campaign: Record<string, unknown>;
    categoryPointProgress: Sc2CategoryPointProgress[];
    achievementShowcase: unknown[];
    earnedRewards: Sc2EarnedReward[];
    earnedAchievements: Sc2EarnedAchievement[];
}

export interface Sc2LadderTeamMember {
    id: string;
    realm: number;
    region: number;
    displayName: string;
    clanTag: string;
    favoriteRace: string;
}

export interface Sc2LadderTeam {
    teamMembers: Sc2LadderTeamMember[];
    previousRank: number;
    points: number;
    wins: number;
    losses: number;
    mmr: number;
    joinTimestamp: number;
}

export interface Sc2LadderMembership {
    ladderId: string;
    localizedGameMode: string;
    rank: number;
}

export interface Sc2LadderShowcaseEntry {
    ladderId: string;
    team: {
        localizedGameMode: string;
        members: {
            favoriteRace: string;
            name: string;
            playerId: string;
            region: number;
        }[];
    };
    leagueName: string;
    localizedDivisionName: string;
    rank: number;
    wins: number;
    losses: number;
}

export interface Sc2PlacementMatch {
    localizedGameMode: string;
    members: {
        name: string;
        playerId: string;
        region: number;
    }[];
    gamesRemaining: number;
}

export interface Sc2LadderSummary {
    showCaseEntries: Sc2LadderShowcaseEntry[];
    placementMatches: Sc2PlacementMatch[];
    allLadderMemberships: Sc2LadderMembership[];
}

export interface Sc2Ladder {
    ladderTeams: Sc2LadderTeam[];
    allLadderMemberships: Sc2LadderMembership[];
    league: string;
    currentLadderMembership: {
        ladderId: string;
        localizedGameMode: string;
    };
    ranksAndPools: {
        rank: number;
        mmr: number;
    }[];
}

/**
 * Returns the static StarCraft II profile data (achievements, criteria, categories and rewards) for a region.
 *
 * @param regionId - The region: 1=US, 2=EU, 3=KR/TW, 5=CN.
 * @returns A promise that resolves to an object representing the static profile data.
 */
export async function staticProfile(ctx: ApiContext, regionId: number): Promise<Sc2StaticProfile> {
    return await ctx.request({
        method: "GET",
        url: `/sc2/static/profile/${regionId}`,
    }) as Sc2StaticProfile;
}

/**
 * Returns the metadata of a StarCraft II profile.
 *
 * @param regionId - The region: 1=US, 2=EU, 3=KR/TW, 5=CN.
 * @param realmId - The realm: 1 or 2.
 * @param profileId - The unique identifier for the profile.
 * @returns A promise that resolves to an object representing the profile metadata.
 */
export async function metadataProfile(
    ctx: ApiContext,
    regionId: number,
    realmId: number,
    profileId: number,
): Promise<Sc2ProfileMetadata> {
    return await ctx.request({
        method: "GET",
        url: `/sc2/metadata/profile/${regionId}/${realmId}/${profileId}`,
    }) as Sc2ProfileMetadata;
}

/**
 * Returns a StarCraft II profile.
 *
 * @param regionId - The region: 1=US, 2=EU, 3=KR/TW, 5=CN.
 * @param realmId - The realm: 1 or 2.
 * @param profileId - The unique identifier for the profile.
 * @returns A promise that resolves to an object representing the profile.
 */
export async function profile(
    ctx: ApiContext,
    regionId: number,
    realmId: number,
    profileId: number,
): Promise<Sc2PlayerProfile> {
    return await ctx.request({
        method: "GET",
        url: `/sc2/profile/${regionId}/${realmId}/${profileId}`,
    }) as Sc2PlayerProfile;
}

/**
 * Returns the ladder summary of a StarCraft II profile.
 *
 * @param regionId - The region: 1=US, 2=EU, 3=KR/TW, 5=CN.
 * @param realmId - The realm: 1 or 2.
 * @param profileId - The unique identifier for the profile.
 * @returns A promise that resolves to an object representing the ladder summary.
 */
export async function ladderSummary(
    ctx: ApiContext,
    regionId: number,
    realmId: number,
    profileId: number,
): Promise<Sc2LadderSummary> {
    return await ctx.request({
        method: "GET",
        url: `/sc2/profile/${regionId}/${realmId}/${profileId}/ladder/summary`,
    }) as Sc2LadderSummary;
}

/**
 * Returns a StarCraft II ladder.
 *
 * @param regionId - The region: 1=US, 2=EU, 3=KR/TW, 5=CN.
 * @param realmId - The realm: 1 or 2.
 * @param profileId - The unique identifier for the profile.
 * @param ladderId - The unique identifier for the ladder.
 * @returns A promise that resolves to an object representing the ladder.
 */
export async function ladder(
    ctx: ApiContext,
    regionId: number,
    realmId: number,
    profileId: number,
    ladderId: string,
): Promise<Sc2Ladder> {
    return await ctx.request({
        method: "GET",
        url: `/sc2/profile/${regionId}/${realmId}/${profileId}/ladder/${ladderId}`,
    }) as Sc2Ladder;
}
