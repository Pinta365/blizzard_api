import { request } from "../../shared/index.ts";
import type { Character, KeyNameId, LinkSelfHref, LocalizedString } from "../../shared/index.ts";

export interface AchievementCriteria {
    id: number;
    amount?: number;
    is_completed: boolean;
    child_criteria?: AchievementCriteria[];
}

export interface CharacterAchievementSummary extends LinkSelfHref {
    total_quantity: number;
    total_points: number;
    achievements: {
        id: number;
        achievement: KeyNameId;
        criteria?: AchievementCriteria;
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
    character: Character;
    statistics: {
        href: string;
    };
}

export interface AchievementStatistic {
    id: number;
    name: LocalizedString;
    last_updated_timestamp: number;
    description?: string;
    quantity: number;
}

export interface AchievementsubCategory {
    id: number;
    name: LocalizedString;
    statistics: {
        id: number;
        name: LocalizedString;
        last_updated_timestamp: number;
        description?: LocalizedString;
        quantity: number;
    }[];
}

export interface CharacterAchievementStatistics extends LinkSelfHref {
    character: {
        key: {
            href: string;
        };
        name: LocalizedString;
        id: number;
        realm: {
            key: {
                href: string;
            };
            name: LocalizedString;
            id: number;
            slug: string;
        };
    };
    categories: {
        id: number;
        name: LocalizedString;
        sub_categories: AchievementsubCategory[];
        statistics: AchievementStatistic[];
    }[];
}

/**
 * Returns a summary of the achievements a character has completed.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing details about a characters achievement summary.
 */
export async function characterAchievementSummary(
    realmSlug: string,
    characterName: string,
): Promise<CharacterAchievementSummary> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/achievements`,
        namespace: "profile",
    });
}

/**
 * Returns a character's statistics as they pertain to achievements.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing details about a characters achievement statistics.
 */
export async function characterAchievementStatistics(
    realmSlug: string,
    characterName: string,
): Promise<CharacterAchievementStatistics> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/achievements/statistics`,
        namespace: "profile",
    });
}
