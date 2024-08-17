import { request } from "../../shared/index.ts";

interface FollowerSkill {
    slug: string;
    name: string;
    icon: string;
    level: number;
    tooltipUrl: string;
    description: string;
    descriptionHtml: string;
}

interface Follower {
    slug: string;
    name: string;
    realName: string;
    portrait: string;
    skills: FollowerSkill[];
}

/**
 * Returns a single follower by slug.
 *
 * @param followerSlug - The slug of the follower to retrieve.
 * @returns A promise that resolves to an object representing the data for a single follower by slug.
 */
export async function follower(followerSlug: string): Promise<Follower> {
    return await request({
        method: "GET",
        url: `/d3/data/follower/${followerSlug}`,
    });
}
