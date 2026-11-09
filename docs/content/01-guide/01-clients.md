---
title: Clients and regions
description: Create a client, pick a region and locale, and use the game properties.
---

## Creating a client

```ts
import { createClient } from "@pinta365/blizzard-api";

const client = createClient({
    region: "eu", // "us" | "eu" | "kr" | "tw" | "cn"
    locale: "en_GB", // optional: defaults to the main locale of the region
    clientId: "<YOUR CLIENT ID>",
    clientSecret: "<YOUR SECRET>",
});
```

The client fetches and caches the access token for you and renews it before it expires. Each client has its own configuration and token, so you can use several regions or credentials side by side.

CommonJS works the same way:

```js
const { createClient } = require("@pinta365/blizzard_api");
```

## Regions and locales

A locale is always sent. Without `locale`, the region's main locale is used:

| Region | Default locale |
| :- | :- |
| `us` | `en_US` |
| `eu` | `en_GB` |
| `kr` | `ko_KR` |
| `tw` | `zh_TW` |
| `cn` | `zh_CN` |

Localized fields (`name`, `description`, ...) are therefore always strings.

:::note[China]
`cn` needs an API client registered in China. Credentials from <https://develop.battle.net> are refused there.
:::

## Games and flavors

| Client property | Game |
| :- | :- |
| `client.wow` | World of Warcraft (Retail) |
| `client.wowClassic` | WoW Classic progression (currently Mists of Pandaria Classic) |
| `client.wowClassicEra` | WoW Classic Era, Season of Discovery, Hardcore, Anniversary |
| `client.wowForever` | WoW: Forever |
| `client.hearthstone` | Hearthstone |
| `client.sc2` | StarCraft II |
| `client.diablo3` | Diablo III |

The Classic and Forever properties only include the endpoints Blizzard supports for that flavor. The [reference](../03-reference/_index.md) lists them all.

## Module-level API

The module-level API from earlier versions still works. It uses a built-in default client:

```ts
import * as blizzardAPI from "@pinta365/blizzard-api";

blizzardAPI.setup({ region: "eu", locale: "en_GB", clientId, clientSecret });
const sword = await blizzardAPI.wow.item(33791);
```
