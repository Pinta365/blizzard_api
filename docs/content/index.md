---
title: blizzard_api
description: TypeScript client for the Blizzard Battle.net APIs, with types for every response.
toc: false
---

A TypeScript client for the Blizzard Battle.net APIs: World of Warcraft (Retail, Classic, Classic Era and WoW: Forever), Hearthstone, StarCraft II and Diablo III. It runs on Deno, Node.js, Bun and in the browser, and every response has a type.

```bash
deno add jsr:@pinta365/blizzard-api        # Deno
npx jsr add @pinta365/blizzard-api         # Node.js (ESM)
bunx jsr add @pinta365/blizzard-api        # Bun
npm install @pinta365/blizzard_api         # npm (CommonJS)
```

```ts
import { createClient } from "@pinta365/blizzard-api";

const client = createClient({
    region: "eu",
    clientId: "<YOUR CLIENT ID>",
    clientSecret: "<YOUR SECRET>",
});

const sword = await client.wow.item(33791);
const profile = await client.wowForever.characterProfile("Anduin", "Wrynn");
```

Create an API client at <https://develop.battle.net/access/clients> to get a client ID and secret.

- [Guide](01-guide/_index.md): clients, regions, types, user tokens, errors and upgrading.
- [WoW: Forever notes](02-forever/_index.md): what the undocumented Forever API does, as far as we've found out.
- [Reference](03-reference/_index.md): every endpoint, per game.

:::note[Not affiliated with Blizzard]
This is a community library. Blizzard's own API documentation is at <https://community.developer.battle.net/documentation>.
:::
