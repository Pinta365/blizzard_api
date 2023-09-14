import { KeyId, KeyNameId, LinkSelfHref, LocalizedString, request } from "../shared/index.ts";

interface PlayableClasses extends LinkSelfHref {
    classes: KeyNameId[];
}

interface PlayableClass extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    gender_name: {
        male: LocalizedString;
        female: LocalizedString;
    };
    power_type: KeyNameId;
    specializations: KeyNameId[];
    media: KeyId;
    pvp_talent_slots: {
        href: string;
    };
    playable_races: KeyNameId[];
    additional_power_types: KeyNameId[];
}

interface Asset {
    key: string;
    value: string;
    file_data_id: number;
}

interface PlayableClassMedia extends LinkSelfHref {
    assets: Asset[];
    id: number;
}

interface PlayableClassPvpTalentSlots extends LinkSelfHref {
    talent_slots: {
        slot_number: number;
        unlock_player_level: number;
    }[];
}

/**
 * Returns an index of playable classes.
 *
 * @returns A promise that resolves to an object representing a list of the index of playable classes.
 */
export async function playableClasses(): Promise<PlayableClasses> {
    return await request({
        method: "GET",
        url: "/data/wow/playable-class/index",
        namespace: "static",
    });
}

/**
 * Returns a playable class by ID.
 *
 * @param classId - The unique identifier for the playable class
 * @returns A promise that resolves to an object representing details about a playable class.
 */
export async function playableClass(classId: number): Promise<PlayableClass> {
    return await request({
        method: "GET",
        url: `/data/wow/playable-class/${classId}`,
        namespace: "static",
    });
}

/**
 * Returns media for a playable class by ID.
 *
 * @param playableClassId - The unique identifier for the playable class
 * @returns A promise that resolves to an object representing media details about a playable class.
 */
export async function playableClassMedia(playableClassId: number): Promise<PlayableClassMedia> {
    return await request({
        method: "GET",
        url: `/data/wow/media/playable-class/${playableClassId}`,
        namespace: "static",
    });
}

/**
 * Returns the PvP talent slots for a playable class by ID.
 *
 * @param classId - The unique identifier for the playable class
 * @returns A promise that resolves to an object representing PvP talent slots for a playable class.
 */
export async function playableClassPvpTalentSlots(classId: number): Promise<PlayableClassPvpTalentSlots> {
    return await request({
        method: "GET",
        url: `/data/wow/playable-class/${classId}/pvp-talent-slots`,
        namespace: "static",
    });
}
