---
title: Upgrading
description: Changes that may need code changes, per version.
---

## From 0.7 to 0.8

- New `wowForever` client for WoW: Forever (see the [Forever notes](../02-forever/_index.md)).
- Retail `Item.preview_item.stats`, `requirements` and `durability` are optional: the API omits them for items without them, such as companion pets.
- 0.8.3: `Item.preview_item.binding` and `requirements.level` are optional, because recipe items have neither.

## From 0.6 to 0.7

- More response fields that only some characters, players or brackets have are now optional. Among them: `active_spec`, `guild_crest`, `current_mythic_rating`, `PvpSeasons.current_season`, `PvpSeasonLeaderboard.entries` (omitted for empty brackets), StarCraft II `clanName`/`clanTag`, and the Diablo III hero `followers`, `legendaryPowers` and `seasonCreated`.

## From 0.5 to 0.6

- A locale is always sent: when `locale` is not set, the region's main locale is used. Localized fields are therefore always strings, and the types say so. Before, omitting `locale` returned an object with every locale.
- Response types were checked against live responses and corrected. Fields that only some characters have are now optional.
- The Classic clients return `Classic*` types (e.g. `ClassicCharacterProfile`, from `/wow-classic`) where fields that only Retail returns are optional. The Retail types keep those fields required.
- `hearthstone.metadata(type)` is typed per type: `metadata("sets")` returns `MetadataSet[]`.

## From 0.4 to 0.5

- `wowClassic` now targets Classic **progression**. For Classic Era realms, use `wowClassicEra`.
- `mythicRaidLeaderboard(raid, faction)` takes a raid slug and `"alliance"` or `"horde"`, e.g. `("uldir", "alliance")`.
- `pvpSeasonLeaderboard(seasonId, bracket)` takes a bracket name, e.g. `"3v3"` or `"shuffle-overall"`.
- `wow`, `hearthstone` and the other namespaces are plain objects. Import types from the game entry points (see [Types and links](02-types-and-links.md)).
- Some types were renamed to remove duplicates. For example, entries of the character collections are now `CollectedMount`, `CollectedPet`, `CollectedToy` and `CollectedHeirloom`.
