/**
 * This module provides interfaces and API function definitions for fetching World of Warcraft housing data (decor, fixtures, fixture hooks, rooms) using the Blizzard API.
 */

import type { ApiContext } from "../../shared/index.ts";

import { search } from "../search.ts";
import type { LinkSelfHref, NamedRef } from "../../shared/index.ts";
import type { Search, SearchParameters } from "../search.ts";

// Decor
export interface Decors extends LinkSelfHref {
    decor_items: NamedRef[];
}

export interface Decor extends LinkSelfHref {
    id: number;
    name: string;
    /** Reference to the in-game item (a single item despite the plural name). */
    items: NamedRef;
    /** How many of this decor a new collection starts with. */
    default_collection_count: number;
}

// Fixture
export interface Fixtures extends LinkSelfHref {
    fixtures: NamedRef[];
}

export interface Fixture extends LinkSelfHref {
    id: number;
    name: string;
    /** Fixture hooks (e.g. Door, Window) on this fixture. Absent when the fixture has none. */
    hooks?: NamedRef[];
}

// Fixture Hook
export interface FixtureHooks extends LinkSelfHref {
    fixture_hooks: NamedRef[];
}

export interface FixtureHook extends LinkSelfHref {
    id: number;
    /** Hook type (e.g. "Door", "Window"). */
    type_name: string;
    /** Parent fixture this hook belongs to. */
    parent_fixture: NamedRef;
}

// Room
export interface Rooms extends LinkSelfHref {
    rooms: NamedRef[];
}

export interface Room extends LinkSelfHref {
    id: number;
    name: string;
}

/**
 * Returns an index of decor.
 */
export async function decors(ctx: ApiContext): Promise<Decors> {
    return await ctx.request({
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
export async function decor(ctx: ApiContext, decorId: number): Promise<Decor> {
    return await ctx.request({
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
export async function searchDecor(ctx: ApiContext, searchParameters: SearchParameters): Promise<Search> {
    return await search(ctx, "/decor", "static", searchParameters) as Search;
}

/**
 * Returns an index of fixtures.
 */
export async function fixtures(ctx: ApiContext): Promise<Fixtures> {
    return await ctx.request({
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
export async function fixture(ctx: ApiContext, fixtureId: number): Promise<Fixture> {
    return await ctx.request({
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
export async function searchFixture(ctx: ApiContext, searchParameters: SearchParameters): Promise<Search> {
    return await search(ctx, "/fixture", "static", searchParameters) as Search;
}

/**
 * Returns an index of fixture hooks.
 */
export async function fixtureHooks(ctx: ApiContext): Promise<FixtureHooks> {
    return await ctx.request({
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
export async function fixtureHook(ctx: ApiContext, fixtureHookId: number): Promise<FixtureHook> {
    return await ctx.request({
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
export async function searchFixtureHook(ctx: ApiContext, searchParameters: SearchParameters): Promise<Search> {
    return await search(ctx, "/fixture-hook", "static", searchParameters) as Search;
}

/**
 * Returns an index of rooms.
 */
export async function rooms(ctx: ApiContext): Promise<Rooms> {
    return await ctx.request({
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
export async function room(ctx: ApiContext, roomId: number): Promise<Room> {
    return await ctx.request({
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
export async function searchRoom(ctx: ApiContext, searchParameters: SearchParameters): Promise<Search> {
    return await search(ctx, "/room", "static", searchParameters) as Search;
}
