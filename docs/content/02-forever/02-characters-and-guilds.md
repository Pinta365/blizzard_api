---
title: Characters and guilds
description: Realmless character names, when characters appear in the API, media, and guilds.
---

*Last checked 2026-11-09.*

## Names

Characters have a first name and a surname, unique across the region. The API looks them up by `{name}-{surname}` in lowercase, without a realm:

```ts
const profile = await client.wowForever.characterProfile("Anduin", "Wrynn");
const gear = await client.wowForever.characterEquipments("Anduin", "Wrynn");
```

The library builds the slug and URL-encodes it, so names with accents work as they are (`"Pröudmoore"`). Every slug seen so far follows the rule, including names like `sédexus-shimizu`.

The profile has `surname` and `ruleset` instead of `realm`. `active_spec` and `active_title` are absent.

## When characters appear

A character only appears in the API **from level 10, and only after logging out** at that level. Before that, every character endpoint returns 404, while the account summary (with a user token) already lists the character.

The profile updates on logout, usually within seconds. All values are a snapshot of that moment: the level, gear and [statistics](04-character-statistics.md) as they were when the character logged out.

The account summary is cached separately. It can show an older level than the profile, from minutes to many hours behind.

## Character media

`characterMedia` returns the usual assets: `avatar`, `avatar-sd`, `main-raw` and `main-sd-raw`, served from `render.worldofwarcraft.com/forever-{region}/`.

Media appears well after the profile. It can return 404 for many hours, in some cases more than a day, after the character is first served. If the profile works and media doesn't, try again later.

## Guilds

Guilds are realmless too: one slug per region, the guild name in lowercase with spaces as hyphens.

```ts
const guild = await client.wowForever.guild("my-guild");
const roster = await client.wowForever.guildRoster("my-guild");
```

A guild has a `ruleset` instead of a realm. The roster lists every member, including characters below level 10, with `name`, `surname`, `slug`, `level`, class, race and faction.

`crest` and the achievement totals are absent, and `guildActivity` is empty, so far.

## Collections

The character collection endpoints leave out `mounts`, `pets` and `toys` when the character has none; the types make them optional.
