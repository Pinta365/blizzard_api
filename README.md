# BLIZZARD_API

Start of what will cover the whole Blizzard Battle.net API when its done.

Link to the module on [Deno Land](https://deno.land/x/blizzard_api)

Link to the module on [JSR](https://jsr.io/@pinta365/blizzard-api)

## WORK IN PROGRESS

Let me know if you want certain APIs to be prioritized.
Currently only supports client credentials flow but the plan is to implement authorization code flow also.

### APIs implemented

| APIs                                          | Status | Note                                                                                |
| --------------------------------------------- | ------ | ----------------------------------------------------------------------------------- |
| **World of Warcraft:** Game Data APIs         | ✅     |                                                                                     |
| **World of Warcraft:** Profile APIs           | ✅     |                                                                                     |
|                                               |        |                                                                                     |
| **World of Warcraft Classic:** Game Data APIs |        |                                                                                     |
|                                               |        |                                                                                     |
| **Diablo III:** Community APIs                |        |                                                                                     |
| **Diablo III:** Game Data APIs                | ✅     |                                                                                     |
|                                               |        |                                                                                     |
| **Hearthstone:** Game Data APIs               | ✅     |                                                                                     |
|                                               |        |                                                                                     |
| **Overwatch League:** Community APIs          | ✅     | Only seem to support US region and some data types are partially defined as Unknown |
|                                               |        |                                                                                     |
| **StarCraft II:** Community APIs              |        |                                                                                     |
| **StarCraft II:** Game Data APIs              | ✅     |                                                                                     |

## Example

```javascript
import * as blizzardAPI from "@pinta365/blizzard-api";

const ClientId = "<YOUR CLIENT ID>";
const ClientSecret = "<YOUR SECRET>";

blizzardAPI.setup({
    clientId: ClientId,
    clientSecret: ClientSecret,
    region: "eu",
    locale: "en_GB",
});

try {
    const sword = await blizzardAPI.wow.item(33791);
    console.log(sword);
} catch (error) {
    console.log(error);
}
```

## Issues

Issues or questions concerning the library can be raised at the
[github repository](https://github.com/Pinta365/blizzard_api/issues) page.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
