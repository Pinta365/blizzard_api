---
title: Basics
description: Forever namespaces, regions and rulesets.
---

*Last checked 2026-11-09.*

## Namespaces

Forever has its own namespaces. The library picks them for you.

| Namespace | Used for |
| :- | :- |
| `static-forever-{region}` | Game data. Serves the current game version. |
| `static-{version}-forever-{region}` | Game data of one version, e.g. `static-1.60.1_70399-forever-eu`. |
| `dynamic-forever-{region}` | Rulesets and auctions. |
| `profile-forever-{region}` | Characters, guilds and the account profile. |

To pin a static version, set `foreverStaticVersion`:

```ts
const client = createClient({
    region: "eu",
    clientId,
    clientSecret,
    foreverStaticVersion: "1.60.1_70399",
});
```

The current version is in the `namespace` of the `self` link of any static response.

## Regions

`us`, `eu`, `kr` and `tw` work with the usual credentials. `cn` refuses them; it needs an API client registered in China.

## Rulesets replace realms

Forever is realmless. Players pick a ruleset instead of a realm, and the realm index returns 404 (realm search returns no results).

```ts
const { rulesets } = await client.wowForever.rulesets();
const normal = await client.wowForever.ruleset(2);
```

| ID | Ruleset | Regions |
| :- | :- | :- |
| 1 | PvP | all |
| 2 | Normal | all |
| 3 | Roleplay | `us`, `eu` |
| 15 | Roleplay PvP | `us`, `eu` |

A ruleset has `id`, `name`, `status` (`UP` or `DOWN`) and a link to its [auction houses](03-auctions.md).

## Game data gaps

Some indexes are empty: heirlooms, journal expansions, instances and encounters, and pet abilities. Item data is incomplete too: many items listed on the auction house return 404. See [Auctions](03-auctions.md#missing-item-data).
