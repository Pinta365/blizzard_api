import { request } from "../../shared/index.ts";

interface SkillRune {
    slug: string;
    type: string;
    name: string;
    level: number;
    description: string;
    descriptionHtml: string;
}

interface HeroSkill {
    slug: string;
    name: string;
    icon: string;
    level: number;
    tooltipUrl: string;
    description: string;
    descriptionHtml: string;
    flavorText?: string;
    runes?: SkillRune[];
}

interface SkillCategories {
    slug: string;
    name: string;
}

interface Skills {
    active: HeroSkill[];
    passive: HeroSkill[];
}

interface HeroClass {
    slug: string;
    name: string;
    maleName: string;
    femaleName: string;
    icon: string;
    skillCategories: SkillCategories[];
    skills: Skills;
}

/**
 * Returns a single character class by slug.
 *
 * @param classSlug - The slug of the character class to retrieve.
 * @returns A promise that resolves to an object representing the data for a single follower by slug.
 */
export async function heroClass(classSlug: string): Promise<HeroClass> {
    return await request({
        method: "GET",
        url: `/d3/data/hero/${classSlug}`,
    }) as HeroClass;
}

/**
 * Returns a single skill by slug for a specific character class.
 *
 * @param classSlug - The slug of the character class to retrieve.
 * @param skillSlug - The slug of the skill to retrieve.
 * @returns A promise that resolves to an object representing the data for a single skill by slug for a specific character class.
 */
export async function heroSkill(classSlug: string, skillSlug: string): Promise<HeroSkill> {
    return await request({
        method: "GET",
        url: `/d3/data/hero/${classSlug}/skill/${skillSlug}`,
    }) as HeroSkill;
}
