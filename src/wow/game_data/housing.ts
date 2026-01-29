/**
 * This module provides interfaces and API function definitions for fetching World of Warcraft housing data (decor, fixtures, fixture hooks, rooms) using the Blizzard API.
 */

import { request } from "../../shared/index.ts";
import { search } from "../search.ts";
import type { KeyNameId, LinkSelfHref, LocalizedString } from "../../shared/index.ts";
import type { Search, SearchParameters } from "../search.ts";

// Decor
export interface Decors extends LinkSelfHref {
    decor_items: KeyNameId[];
}

export interface Decor extends LinkSelfHref {
    id: number;
    /** Reference to the in-game item. */
    items: KeyNameId;
    name: LocalizedString;
}

// Fixture
export interface Fixtures extends LinkSelfHref {
    fixtures: KeyNameId[];
}

export interface Fixture extends LinkSelfHref {
    id: number;
    name: LocalizedString;
    /** Fixture hooks (e.g. Door, Window) on this fixture. */
    hooks: KeyNameId[];
}

// Fixture Hook
export interface FixtureHooks extends LinkSelfHref {
    fixture_hooks: KeyNameId[];
}

export interface FixtureHook extends LinkSelfHref {
    id: number;
    /** Hook type (e.g. "Door", "Window"). */
    type_name: string;
    /** Parent fixture this hook belongs to. */
    parent_fixture: KeyNameId;
}

// Room
export interface Rooms extends LinkSelfHref {
    rooms: KeyNameId[];
}

export interface Room extends LinkSelfHref {
    id: number;
    name: LocalizedString;
}

/**
 * Returns an index of decor.
 */
export async function decors(): Promise<Decors> {
    return await request({
        method: "GET",
        url: "/data/wow/decor/index",
        namespace: "static",
    }) as Decors;
}

/**
 * Returns a decor by ID.
 *
 * @param decorId - The ID of the decor.
 */
export async function decor(decorId: number): Promise<Decor> {
    return await request({
        method: "GET",
        url: `/data/wow/decor/${decorId}`,
        namespace: "static",
    }) as Decor;
}

/**
 * Performs a search of decor.
 *
 * @param searchParameters - Object containing search parameters.
 */
export async function searchDecor(searchParameters: SearchParameters): Promise<Search> {
    return await search("/decor", "static", searchParameters) as Search;
}

/**
 * Returns an index of fixtures.
 */
export async function fixtures(): Promise<Fixtures> {
    return await request({
        method: "GET",
        url: "/data/wow/fixture/index",
        namespace: "static",
    }) as Fixtures;
}

/**
 * Returns a fixture by ID.
 *
 * @param fixtureId - The ID of the fixture.
 */
export async function fixture(fixtureId: number): Promise<Fixture> {
    return await request({
        method: "GET",
        url: `/data/wow/fixture/${fixtureId}`,
        namespace: "static",
    }) as Fixture;
}

/**
 * Performs a search of fixtures.
 *
 * @param searchParameters - Object containing search parameters.
 */
export async function searchFixture(searchParameters: SearchParameters): Promise<Search> {
    return await search("/fixture", "static", searchParameters) as Search;
}

/**
 * Returns an index of fixture hooks.
 */
export async function fixtureHooks(): Promise<FixtureHooks> {
    return await request({
        method: "GET",
        url: "/data/wow/fixture-hook/index",
        namespace: "static",
    }) as FixtureHooks;
}

/**
 * Returns a fixture hook by ID.
 *
 * @param fixtureHookId - The ID of the fixture hook.
 */
export async function fixtureHook(fixtureHookId: number): Promise<FixtureHook> {
    return await request({
        method: "GET",
        url: `/data/wow/fixture-hook/${fixtureHookId}`,
        namespace: "static",
    }) as FixtureHook;
}

/**
 * Performs a search of fixture hooks.
 *
 * @param searchParameters - Object containing search parameters.
 */
export async function searchFixtureHook(searchParameters: SearchParameters): Promise<Search> {
    return await search("/fixture-hook", "static", searchParameters) as Search;
}

/**
 * Returns an index of rooms.
 */
export async function rooms(): Promise<Rooms> {
    return await request({
        method: "GET",
        url: "/data/wow/room/index",
        namespace: "static",
    }) as Rooms;
}

/**
 * Returns a room by ID.
 *
 * @param roomId - The ID of the room.
 */
export async function room(roomId: number): Promise<Room> {
    return await request({
        method: "GET",
        url: `/data/wow/room/${roomId}`,
        namespace: "static",
    }) as Room;
}

/**
 * Performs a search of rooms.
 *
 * @param searchParameters - Object containing search parameters.
 */
export async function searchRoom(searchParameters: SearchParameters): Promise<Search> {
    return await search("/room", "static", searchParameters) as Search;
}
