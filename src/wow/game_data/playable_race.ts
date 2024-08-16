import { request } from "../../shared/index.ts";
import type { KeyNameId, LinkSelfHref, LocalizedString, TypeName } from "../../shared/index.ts";

export interface PlayableRaces extends LinkSelfHref {
    races: KeyNameId[];
}

export interface PlayableRace extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    gender_name: {
        male: LocalizedString;
        female: LocalizedString;
    };
    faction: TypeName;
    is_selectable: boolean;
    is_allied_race: boolean;
    playable_classes: KeyNameId[];
}

/**
 * Returns an index of playable races.
 *
 * @returns A promise that resolves to an object representing a list of the index of playable races.
 */
export async function playableRaces(): Promise<PlayableRaces> {
    return await request({
        method: "GET",
        url: "/data/wow/playable-race/index",
        namespace: "static",
    });
}

/**
 * Returns a playable race by ID.
 *
 * @param playableRaceId - The unique identifier for the playable race
 * @returns A promise that resolves to an object representing details about a playable race.
 */
export async function playableRace(playableRaceId: number): Promise<PlayableRace> {
    return await request({
        method: "GET",
        url: `/data/wow/playable-race/${playableRaceId}`,
        namespace: "static",
    });
}
