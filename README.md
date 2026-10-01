# BLIZZARD API

[![JSR Version](https://jsr.io/badges/@pinta365/blizzard-api)](https://jsr.io/@pinta365/blizzard-api)

TypeScript client for the Blizzard Battle.net APIs: World of Warcraft (Retail, Classic and Classic Era), Hearthstone,
StarCraft II and Diablo III. Runs on Deno, Node.js, Bun and in the browser.

Available as:

- ESM module: [JSR](https://jsr.io/@pinta365/blizzard-api)
- CommonJS module: [NPM](https://www.npmjs.com/package/@pinta365/blizzard_api)

### APIs implemented

| APIs                                        | Status | Note                                                 |
| ------------------------------------------- | ------ | ---------------------------------------------------- |
| **World of Warcraft:** Game Data APIs       | ✅     | Including housing, item appearances, hero talents    |
| **World of Warcraft:** Profile APIs         | ✅     | Account profile endpoints need a user token          |
| **World of Warcraft Classic:** Game Data    | ✅     | Progression (`wowClassic`) and Era (`wowClassicEra`) |
| **World of Warcraft Classic:** Profile APIs | ✅     | Progression (`wowClassic`) and Era (`wowClassicEra`) |
| **Diablo III:** Community APIs              | ✅     | Including account and hero profiles                  |
| **Diablo III:** Game Data APIs              | ✅     |                                                      |
| **Hearthstone:** Game Data APIs             | ✅     |                                                      |
| **StarCraft II:** Community APIs            | ✅     | Including the legacy endpoints                       |
| **StarCraft II:** Game Data APIs            | ✅     |                                                      |

Every endpoint is checked against the live API by the project's smoke test.

## ⚡️ Quickstart

**Installation**

```bash
# Deno
deno add jsr:@pinta365/blizzard-api

# Bun
bunx jsr add @pinta365/blizzard-api

# Node.js
npx jsr add @pinta365/blizzard-api

# NPM (CommonJS)
npm install @pinta365/blizzard_api --save
```

**Usage**

Create an API client at <https://develop.battle.net/access/clients> to get a client ID and secret.

```ts
import { createClient } from "@pinta365/blizzard-api";

const client = createClient({
    region: "eu", // "us" | "eu" | "kr" | "tw" | "cn"
    locale: "en_GB", // optional: without it, localized fields contain every locale
    clientId: "<YOUR CLIENT ID>",
    clientSecret: "<YOUR SECRET>",
});

const sword = await client.wow.item(33791);
const realms = await client.wowClassicEra.realms();
const card = await client.hearthstone.fetchCard("52119-arch-villain-rafaam");
const season = await client.sc2.season(2);
const hero = await client.diablo3.heroClass("barbarian");
```

The client fetches and caches the access token for you and renews it before it expires. Each client has its own
configuration and token, so you can use several regions or credentials side by side.

**CommonJS**

```js
const { createClient } = require("@pinta365/blizzard_api");
```

## Games and flavors

| Client property        | Game                                                          |
| ---------------------- | ------------------------------------------------------------- |
| `client.wow`           | World of Warcraft (Retail)                                    |
| `client.wowClassic`    | WoW Classic progression (currently Mists of Pandaria Classic) |
| `client.wowClassicEra` | WoW Classic Era, Season of Discovery, Hardcore, Anniversary   |
| `client.hearthstone`   | Hearthstone                                                   |
| `client.sc2`           | StarCraft II                                                  |
| `client.diablo3`       | Diablo III                                                    |

The two Classic properties only include the endpoints Blizzard supports for that flavor.

## Response types

Every response has a TypeScript type. Import them from the entry point of the game:

```ts
import type { Mount } from "@pinta365/blizzard-api/wow";
import type { Card } from "@pinta365/blizzard-api/hearthstone";
```

Entry points: `/wow`, `/wow-classic`, `/hearthstone`, `/sc2` and `/diablo3`. The Classic clients mostly return the same
types as Retail (import those from `/wow`); `/wow-classic` holds the Classic-only ones.

## Following links

Responses contain `href` links to related resources. `requestHref` fetches them with the client's token:

```ts
const mount = await client.wow.mount(6);
const display = await client.requestHref(mount.creature_displays[0].key.href);
```

## User tokens (account profile)

The WoW account profile endpoints (`accountProfileSummary`, `protectedCharacterProfile` and the `account*Collection`
endpoints) need a user access token from the OAuth authorization code flow:

```ts
// 1. Send the user to Battle.net to log in.
const state = crypto.randomUUID(); // store it, and check it on the redirect
const url = client.authorizeUrl({ redirectUri: "https://example.com/callback", scope: ["wow.profile"], state });

// 2. On your redirect URI, exchange the code for a user token.
const { access_token } = await client.exchangeCode({ code, redirectUri: "https://example.com/callback" });

// 3. Use a user-scoped client. It is cheap to create, and it shares the app token with its parent.
const user = client.forUser(access_token);
const profile = await user.wow.accountProfileSummary();
```

The redirect URI must be registered on your API client. Calling a user-scoped endpoint without a user token throws
`MissingUserTokenError`.

## Errors and retries

- Failed requests throw `errors.APIError`, with `statusCode` and the response body.
- A `401` is retried once with a fresh token.
- A `429 Too Many Requests` is retried up to three times, honouring `Retry-After`.

```ts
import { errors } from "@pinta365/blizzard-api";

try {
    await client.wow.characterProfile("silvermoon", "nosuchcharacter");
} catch (error) {
    if (error instanceof errors.APIError && error.statusCode === 404) {
        // Not found
    }
}
```

## Module-level API

The module-level API from earlier versions still works. It uses a built-in default client:

```ts
import * as blizzardAPI from "@pinta365/blizzard-api";

blizzardAPI.setup({ region: "eu", locale: "en_GB", clientId, clientSecret });
const sword = await blizzardAPI.wow.item(33791);
```

## Upgrading from 0.4

- `wowClassic` now targets Classic **progression**. For Classic Era realms, use `wowClassicEra`.
- `mythicRaidLeaderboard(raid, faction)` takes a raid slug and `"alliance"` or `"horde"`, e.g. `("uldir", "alliance")`.
- `pvpSeasonLeaderboard(seasonId, bracket)` takes a bracket name, e.g. `"3v3"` or `"shuffle-overall"`.
- `wow`, `hearthstone` and the other namespaces are plain objects. Import types from the game entry points (see
  [Response types](#response-types)).
- Some types were renamed to remove duplicates. For example, entries of the character collections are now
  `CollectedMount`, `CollectedPet`, `CollectedToy` and `CollectedHeirloom`.

## Development

```bash
deno task test        # offline unit tests
deno task smoke       # live smoke test of every endpoint (needs .env with BLIZZARD_CLIENT_ID / BLIZZARD_CLIENT_SECRET)
deno task gen:api     # regenerate src/generated/ after adding or changing endpoints
```

## Issues

Issues or questions concerning the library can be raised at the
[github repository](https://github.com/Pinta365/blizzard_api/issues) page.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
