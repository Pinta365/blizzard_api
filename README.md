# BLIZZARD API

[![JSR Version](https://jsr.io/badges/@pinta365/blizzard-api)](https://jsr.io/@pinta365/blizzard-api)

Start of what will cover the whole Blizzard Battle.net API when its done.

Available as:

- ESM module: [JSR](https://jsr.io/@pinta365/blizzard-api)
- CommonJS module: [NPM](https://www.npmjs.com/package/@pinta365/blizzard_api)

## WORK IN PROGRESS

Let me know if you want certain APIs to be prioritized. Currently only supports client credentials flow but the plan is
to implement authorization code flow also.

### APIs implemented

| APIs                                          | Status | Note                      |
| --------------------------------------------- | ------ | ------------------------- |
| **World of Warcraft:** Game Data APIs         | ✅     |                           |
| **World of Warcraft:** Profile APIs           | ✅     |                           |
|                                               |        |                           |
| **World of Warcraft Classic:** Game Data APIs |        |                           |
| **World of Warcraft Classic:** Profile APIs   |        |                           |
|                                               |        |                           |
| **Diablo III:** Community APIs                | ✅     | Missing profile endpoints |
| **Diablo III:** Game Data APIs                | ✅     |                           |
|                                               |        |                           |
| **Hearthstone:** Game Data APIs               | ✅     |                           |
|                                               |        |                           |
| **StarCraft II:** Community APIs              |        |                           |
| **StarCraft II:** Game Data APIs              | ✅     |                           |

## ⚡️ Quickstart

**Installation**

```bash
# Deno
deno add @pinta365/blizzard-api

# Bun
bunx jsr add @pinta365/blizzard-api

# Node.js
npx jsr add @pinta365/blizzard-api

# NPM (CommonJS)
npm install @pinta365/blizzard_api --save
```

**Basic Usage (ESM)**

```javascript
import * as blizzardAPI from "@pinta365/blizzard-api";

const clientId = "<YOUR CLIENT ID>";
const clientSecret = "<YOUR SECRET>";

blizzardAPI.setup({
    clientId,
    clientSecret,
    region: "eu",
    locale: "en_GB",
});

const sword = await blizzardAPI.wow.item(33791);
console.log(sword);
```

**Basic Usage (CommonJS)**

```javascript
const blizzardAPI = require("@pinta365/blizzard_api");

// Use blizzardAPI the same way as in the previous example.
```

## Issues

Issues or questions concerning the library can be raised at the
[github repository](https://github.com/Pinta365/blizzard_api/issues) page.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
