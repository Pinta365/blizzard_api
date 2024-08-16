import { request } from "../../shared/index.ts";
import { search } from "../search.ts";
import type { Asset, KeyId, KeyNameId, LinkSelfHref, LocalizedString, NameId, TypeName } from "../../shared/index.ts";
import type { Search, SearchParameters } from "../search.ts";

export interface JournalExpansions extends LinkSelfHref {
    tiers: KeyNameId[];
}

export interface JournalExpansion extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    dungeons: KeyNameId[];
    raids: KeyNameId[];
}

export interface JournalEncounters extends LinkSelfHref {
    encounters: KeyNameId[];
}

export interface EncounterSection {
    id: number;
    title: string;
    body_text?: string;
    sections?: EncounterSection[];
    spell?: KeyNameId;
    creature_display?: KeyId;
}

export interface JournalEncounter extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    description: LocalizedString;
    creatures: {
        id: number;
        name: LocalizedString;
        creature_display: KeyId;
    }[];
    items: {
        id: number;
        item: KeyNameId;
    }[];
    sections: EncounterSection[];
    instance: KeyNameId;
    category: {
        type: string;
    };
    modes: TypeName[];
}

export interface JournalInstances extends LinkSelfHref {
    instances: KeyNameId[];
}

export interface JournalInstance extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    map: NameId;
    area?: NameId;
    description: LocalizedString;
    encounters: KeyNameId[];
    expansion: KeyNameId;
    location?: NameId;
    modes: {
        mode: TypeName;
        players: 5;
        is_tracked: true;
    }[];
    media: KeyId;
    minimum_level: number;
    category: {
        type: string;
    };
}

export interface JournalInstanceMedia extends LinkSelfHref {
    assets: Asset[];
}

/**
 * Returns an index of journal expansions.
 *
 * @returns A promise that resolves to an object representing a list of journal expansions.
 */
export async function journalExpansions(): Promise<JournalExpansions> {
    return await request({
        method: "GET",
        url: "/data/wow/journal-expansion/index",
        namespace: "static",
    });
}

/**
 * Returns a journal expansion by ID.
 *
 * @param journalExpansionId - The unique identifier for the journal expansion.
 * @returns A promise that resolves to an object representing details about a journal expansion.
 */
export async function journalExpansion(journalExpansionId: number): Promise<JournalExpansion> {
    return await request({
        method: "GET",
        url: `/data/wow/journal-expansion/${journalExpansionId}`,
        namespace: "static",
    });
}

/**
 * Returns an index of journal encounters.
 *
 * @returns A promise that resolves to an object representing a list of journal expansions.
 */
export async function journalEncounters(): Promise<JournalEncounters> {
    return await request({
        method: "GET",
        url: "/data/wow/journal-encounter/index",
        namespace: "static",
    });
}

/**
 * Returns a journal encounter by ID.
 *
 * @param journalEncounterId - The unique identifier for the journal encounter.
 * @returns A promise that resolves to an object representing details about a journal encounter.
 */
export async function journalEncounter(journalEncounterId: number): Promise<JournalEncounter> {
    return await request({
        method: "GET",
        url: `/data/wow/journal-encounter/${journalEncounterId}`,
        namespace: "static",
    });
}

/**
 * Performs a search of journal encounters.
 *
 * @param SearchParameters - Object containing search parameters.
 * @returns A promise that resolves to an object representing details about a journal encounter search.
 */
export async function searchJournalEncounter(searchParameters: SearchParameters): Promise<Search> {
    return await search("/journal-encounter", "static", searchParameters);
}

/**
 * Returns an index of journal instances.
 *
 * @returns A promise that resolves to an object representing a list of journal instances.
 */
export async function journalInstances(): Promise<JournalInstances> {
    return await request({
        method: "GET",
        url: "/data/wow/journal-instance/index",
        namespace: "static",
    });
}

/**
 * Returns a journal instances by ID.
 *
 * @param journalInstanceId - The unique identifier for the journal instances.
 * @returns A promise that resolves to an object representing details about a journal instances.
 */
export async function journalInstance(journalInstanceId: number): Promise<JournalInstance> {
    return await request({
        method: "GET",
        url: `/data/wow/journal-instance/${journalInstanceId}`,
        namespace: "static",
    });
}

/**
 * Returns media for a journal instance by ID.
 *
 * @param journalInstanceId - The unique identifier for the journal instance
 * @returns A promise that resolves to an object representing media details about a journal instance.
 */
export async function journalInstanceMedia(journalInstanceId: number): Promise<JournalInstanceMedia> {
    return await request({
        method: "GET",
        url: `/data/wow/media/journal-instance/${journalInstanceId}`,
        namespace: "static",
    });
}
