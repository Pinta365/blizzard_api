# BLIZZARD API

[![JSR Version](https://jsr.io/badges/@pinta365/blizzard-api)](https://jsr.io/@pinta365/blizzard-api)

TypeScript client for the Blizzard Battle.net APIs: World of Warcraft (Retail, Classic and Classic Era), Hearthstone,
StarCraft II and Diablo III. Runs on Deno, Node.js, Bun and in the browser.

Available as:

- ESM module: [JSR](https://jsr.io/@pinta365/blizzard-api)
- CommonJS module: [NPM](https://www.npmjs.com/package/@pinta365/blizzard_api)

### APIs implemented

| APIs                                        | Status | Note                                                   |
| ------------------------------------------- | ------ | ------------------------------------------------------ |
| **World of Warcraft:** Game Data APIs       | ✅     | Including housing, item appearances, hero talents      |
| **World of Warcraft:** Profile APIs         | ✅     | Account profile endpoints need a user token            |
| **World of Warcraft Classic:** Game Data    | ✅     | Progression (`wowClassic`) and Era (`wowClassicEra`)   |
| **World of Warcraft Classic:** Profile APIs | ✅     | Progression (`wowClassic`) and Era (`wowClassicEra`)   |
| **World of Warcraft: Forever**              | ✅     | Game data, characters, guilds, auctions (`wowForever`) |
| **Diablo III:** Community APIs              | ✅     | Including account and hero profiles                    |
| **Diablo III:** Game Data APIs              | ✅     |                                                        |
| **Hearthstone:** Game Data APIs             | ✅     |                                                        |
| **StarCraft II:** Community APIs            | ✅     | Including the legacy endpoints                         |
| **StarCraft II:** Game Data APIs            | ✅     |                                                        |

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
    locale: "en_GB", // optional: defaults to the main locale of the region (us: en_US, eu: en_GB, ...)
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
| `client.wowForever`    | WoW: Forever (game data, characters and account profile)      |
| `client.hearthstone`   | Hearthstone                                                   |
| `client.sc2`           | StarCraft II                                                  |
| `client.diablo3`       | Diablo III                                                    |

The Classic and Forever properties only include the endpoints Blizzard supports for that flavor.

### WoW: Forever

Blizzard hasn't documented the Forever API yet; `wowForever` covers what answers so far: game data, rulesets, character
profiles, guilds, auction houses and the account profile.

Forever is realmless. Players pick a ruleset (Normal, PvP, Roleplay, Roleplay PvP) instead of a realm, so use
`rulesets()` and `ruleset(id)` instead of the realm endpoints. Characters have a two-part name, unique per region, and
are looked up by `name` and `surname`:

```ts
const profile = await client.wowForever.characterProfile("Anduin", "Wrynn");
const gear = await client.wowForever.characterEquipments("Anduin", "Wrynn");
```

Characters only show up from level 10, after they log out; before that the API returns 404. Guilds are realmless too, so
they are looked up by their slug alone: `client.wowForever.guildRoster("my-guild")`.

Auctions are listed per auction house (Alliance, Horde and neutral), under a ruleset. List the houses, then fetch the
auctions and commodities of one:

```ts
const houses = await client.wowForever.auctionHouses(2); // ruleset 2: Normal
const auctions = await client.wowForever.auctionHouse(2, houses.auctions[0].id);
const commodities = await client.wowForever.auctionHouseCommodities(2, houses.auctions[0].id);
```

For now, every ruleset of a region lists the same auction houses with the same auctions: the ruleset ID must be valid,
but doesn't filter them.

Static game data uses `static-forever-{region}`, which serves the current game version. To pin a specific version, set
`foreverStaticVersion`:

```ts
const client = createClient({ region: "eu", clientId, clientSecret, foreverStaticVersion: "1.60.1_70399" });
const races = await client.wowForever.playableRaces();
```

The version is in the `namespace` of the `self` link of any static response.

## Response types

Every response has a TypeScript type. Import them from the entry point of the game:

```ts
import type { Mount } from "@pinta365/blizzard-api/wow";
import type { Card } from "@pinta365/blizzard-api/hearthstone";
```

Entry points: `/wow`, `/wow-classic`, `/wow-forever`, `/hearthstone`, `/sc2` and `/diablo3`. The Classic and Forever
clients mostly return the same types as Retail (import those from `/wow`). `/wow-classic` and `/wow-forever` hold the
flavor-only ones, such as `ClassicCharacterProfile` or `ForeverCharacterProfile`, where fields that only Retail returns
are optional.

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
- A server error (`500`, `502`, `503`, `504`) is retried once.

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

## Upgrading

### From 0.7 to 0.8

- New `wowForever` client for WoW: Forever (see [WoW: Forever](#wow-forever)).
- Retail `Item.preview_item.stats`, `requirements` and `durability` are optional: the API omits them for items without
  them, such as companion pets, so you may need to handle `undefined`.

### From 0.6 to 0.7

- More response fields that only some characters, players or brackets have are now optional, so you may need to handle
  `undefined`. Among them: `active_spec`, `guild_crest`, `current_mythic_rating`, `PvpSeasons.current_season`,
  `PvpSeasonLeaderboard.entries` (omitted for empty brackets), StarCraft II `clanName`/`clanTag`, and the Diablo III
  hero `followers`, `legendaryPowers` and `seasonCreated`.

### From 0.5 to 0.6

- A locale is always sent: when `locale` is not set, the region's main locale is used (`us`: `en_US`, `eu`: `en_GB`,
  `kr`: `ko_KR`, `tw`: `zh_TW`, `cn`: `zh_CN`). Localized fields (`name`, `description`, ...) are therefore always
  strings, and the types say so. Before, omitting `locale` returned an object with every locale.
- Response types were checked against live responses and corrected. Fields that only some characters have are now
  optional, so you may need to handle `undefined`.
- The Classic clients return `Classic*` types (e.g. `ClassicCharacterProfile`, from `/wow-classic`) where fields that
  only Retail returns are optional. The Retail types keep those fields required.
- `hearthstone.metadata(type)` is typed per type: `metadata("sets")` returns `MetadataSet[]`.

### From 0.4 to 0.5

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
deno task user-token --save # log in with Battle.net and save a user token to .env (for the account endpoints)
deno task check:types # check the response types against the responses saved by the smoke test (fixtures/)
deno task check:fields # list fields the API returns that the response types don't declare
```

## Issues

Issues or questions concerning the library can be raised at the
[github repository](https://github.com/Pinta365/blizzard_api/issues) page.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
