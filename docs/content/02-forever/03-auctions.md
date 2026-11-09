---
title: Auctions
description: Auction houses, auctions, commodities and missing item data.
---

*Last checked 2026-11-09.*

Auction data has been served since 6 November 2026.

## Auction houses

Each ruleset lists 15 auction houses: five each of "Alliance Auction House", "Horde Auction House" and the neutral "Blackwater Auction House", with IDs 110–121 and 123–125.

```ts
const houses = await client.wowForever.auctionHouses(2);
const houseId = houses.auctions[0].id;

const auctions = await client.wowForever.auctionHouse(2, houseId);
const commodities = await client.wowForever.auctionHouseCommodities(2, houseId);
```

| Path | Returns |
| :- | :- |
| `/data/wow/ruleset/{id}/auctions/` | The auction houses. The trailing slash is required. |
| `/data/wow/ruleset/{id}/auctions/{houseId}` | The house's auctions. |
| `/data/wow/ruleset/{id}/auctions/{houseId}/commodities` | The house's commodities. |

:::warning[Shared across rulesets]
Every ruleset of a region currently lists the same auction houses with identical auctions. The ruleset ID must be valid, but doesn't filter anything, so don't add up totals across rulesets.
:::

The old `/data/wow/auctions/commodities` returns 404.

## Auctions and commodities

The entries have the Retail shape:

- **Auctions**: `id`, `item` (`id`, and on some items `context`, `bonus_lists`, `modifiers`), `buyout`, `bid` on some, `quantity` and `time_left`. A few are bid-only, without `buyout`.
- **Commodities**: `id`, `item.id`, `quantity`, `unit_price` and `time_left`.

There is no seller or owner, as on Retail.

Some houses are empty and have no `auctions` field (112, 115 and 118 so far). The busiest hold 50,000–70,000 auctions, about 9 MB per response.

## Missing item data

Many items on the auction house aren't in Forever's item data. In one house, 652 of 1,515 distinct item IDs (43%) returned 404 from `wowForever.item(id)`. Most of them exist in Retail's item data (`client.wow.item(id)`), which works as a fallback for names, quality and class, though Retail's stats may differ from Forever's.
