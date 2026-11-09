---
title: "WoW: Forever notes"
weight: 2
description: "What the undocumented WoW: Forever API does, as far as we've found out."
---

:::warning[Undocumented and changing]
Blizzard hasn't documented the WoW: Forever API. These notes come from testing the live API since launch on 4 November 2026, and comparing it with the game. They can be wrong or out of date, and the API can change without notice. Each page says when it was last checked.
:::

| Area | Status (checked 2026-11-09) | Library |
| :- | :- | :- |
| Game data (static) | Works, current version `1.60.1_70399` | Most game data endpoints |
| Rulesets | Work; they replace realms | `rulesets`, `ruleset` |
| Characters | Work from level 10, after a logout | `character*` |
| Character media | Works, but lags behind the profile | `characterMedia` |
| Guilds | Work, looked up by slug | `guild`, `guildRoster`, `guildActivity`, `guildAchievements` |
| Auctions | Work, per auction house | `auctionHouses`, `auctionHouse`, `auctionHouseCommodities` |
| Account profile | Works with a user token | `account*` |
| Realms, connected realms | 404 | Not included |
| WoW Token, PvP and Mythic+ seasons | 404 | Not included |
| Hunter pets | 404 | Not included |
| China (`cn`) | Needs a China API client | |

The pages:

- [Basics](01-basics.md): namespaces, regions, rulesets.
- [Characters and guilds](02-characters-and-guilds.md): realmless names, when characters appear, media.
- [Auctions](03-auctions.md): auction houses, commodities, missing item data.
- [Character statistics](04-character-statistics.md): what `base` and `effective` mean.
- [Open questions](05-open-questions.md): what doesn't work yet.

Found something new or different? [Open an issue](https://github.com/Pinta365/blizzard_api/issues).
