import { KeyNameId, LinkSelfHref, LocalizedString, request, TypeName } from "../../shared/index.ts";

export interface Href {
    href: string;
}

export interface Realm extends KeyNameId {
    slug: string;
}

export interface CharacterProfile extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    gender: TypeName;
    faction: TypeName;
    race: KeyNameId;
    character_class: KeyNameId;
    active_spec: KeyNameId;
    realm: Realm;
    guild: {
        key: Href;
        name: LocalizedString;
        id: number;
        realm: Realm;
        faction: TypeName;
    };
    level: number;
    experience: number;
    achievement_points: number;
    achievements: Href;
    titles: Href;
    pvp_summary: Href;
    encounters: Href;
    media: Href;
    last_login_timestamp: number;
    average_item_level: number;
    equipped_item_level: number;
    specializations: Href;
    statistics: Href;
    mythic_keystone_profile: Href;
    equipment: Href;
    appearance: Href;
    collections: Href;
    reputations: Href;
    quests: Href;
    achievements_statistics: Href;
    professions: Href;
    covenant_progress: {
        chosen_covenant: KeyNameId;
        renown_level: number;
        soulbinds: Href;
    };
}

export interface CharacterProfileStatus extends LinkSelfHref {
    id: number;
    is_valid: boolean;
}
/**
 * Returns a profile summary for a character.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing a profile summary.
 */
export async function characterProfile(
    realmSlug: string,
    characterName: string,
): Promise<CharacterProfile> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}`,
        namespace: "profile",
    });
}

/**
 * Returns the status and a unique ID for a character. A client should delete information about a character from their application if any of the following conditions occur:
 *
 * an HTTP 404 Not Found error is returned
 * the is_valid value is false
 * the returned character ID doesn't match the previously recorded value for the character
 *
 * The following example illustrates how to use this endpoint:
 *
 * A client requests and stores information about a character, including its unique character ID and the timestamp of the request.
 * After 30 days, the client makes a request to the status endpoint to verify if the character information is still valid.
 * If character cannot be found, is not valid, or the characters IDs do not match, the client removes the information from their application.
 * If the character is valid and the character IDs match, the client retains the data for another 30 days.
 *
 * @param realmSlug - The slug of the realm.
 * @param characterName - The lowercase name of the character.
 * @returns A promise that resolves to an object representing a profile summary status.
 */
export async function characterProfileStatus(
    realmSlug: string,
    characterName: string,
): Promise<CharacterProfileStatus> {
    return await request({
        method: "GET",
        url: `/profile/wow/character/${realmSlug}/${characterName}/status`,
        namespace: "profile",
    });
}
