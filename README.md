# BLIZZARD API

[![JSR Version](https://jsr.io/badges/@pinta365/blizzard-api)](https://jsr.io/@pinta365/blizzard-api)

TypeScript client for the Blizzard Battle.net APIs: World of Warcraft (Retail, Classic, Classic Era and WoW: Forever),
Hearthstone, StarCraft II and Diablo III. Runs on Deno, Node.js, Bun and in the browser, and every response has a type.

**Documentation: <https://blizzard.pinta.land>**: guide, [WoW: Forever notes](https://blizzard.pinta.land/forever/) and
a reference of every endpoint.

## Installation

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

## Usage

Create an API client at <https://develop.battle.net/access/clients> to get a client ID and secret.

```ts
import { createClient } from "@pinta365/blizzard-api";

const client = createClient({
    region: "eu", // "us" | "eu" | "kr" | "tw" | "cn"
    clientId: "<YOUR CLIENT ID>",
    clientSecret: "<YOUR SECRET>",
});

const sword = await client.wow.item(33791);
const realms = await client.wowClassicEra.realms();
const profile = await client.wowForever.characterProfile("Anduin", "Wrynn");
const card = await client.hearthstone.fetchCard("52119-arch-villain-rafaam");
```

The client fetches and renews the access token for you. See the [guide](https://blizzard.pinta.land/guide/) for regions
and locales, response types, user tokens (account profile endpoints), errors and retries, and upgrading from earlier
versions.

## APIs

| Client property        | API                                                              |
| ---------------------- | ---------------------------------------------------------------- |
| `client.wow`           | World of Warcraft (Retail): game data and profile                |
| `client.wowClassic`    | WoW Classic progression (currently Mists of Pandaria Classic)    |
| `client.wowClassicEra` | WoW Classic Era, Season of Discovery, Hardcore, Anniversary      |
| `client.wowForever`    | WoW: Forever (undocumented by Blizzard; see the Forever notes)   |
| `client.hearthstone`   | Hearthstone game data                                            |
| `client.sc2`           | StarCraft II game data and community, including legacy endpoints |
| `client.diablo3`       | Diablo III game data and community                               |

Every endpoint is checked against the live API by the project's smoke test, and weekly in CI.

## Development

```bash
deno task test        # offline unit tests
deno task smoke       # live smoke test of every endpoint (needs .env with BLIZZARD_CLIENT_ID / BLIZZARD_CLIENT_SECRET)
deno task gen:api     # regenerate src/generated/ after adding or changing endpoints
deno task user-token --save # log in with Battle.net and save a user token to .env (for the account endpoints)
deno task check:types # check the response types against the responses saved by the smoke test (fixtures/)
deno task check:fields # list fields the API returns that the response types don't declare
deno task docs:gen    # generate the docs site's endpoint reference (docs/), built with tryck
```

## Issues

Issues or questions concerning the library can be raised at the
[github repository](https://github.com/Pinta365/blizzard_api/issues) page.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
