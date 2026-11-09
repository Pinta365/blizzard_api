---
title: Types and links
description: Import response types, and follow the links in responses.
---

## Response types

Every response has a TypeScript type. Import them from the entry point of the game:

```ts
import type { Mount } from "@pinta365/blizzard-api/wow";
import type { Card } from "@pinta365/blizzard-api/hearthstone";
import type { ForeverCharacterProfile } from "@pinta365/blizzard-api/wow-forever";
```

Entry points: `/wow`, `/wow-classic`, `/wow-forever`, `/hearthstone`, `/sc2` and `/diablo3`.

The Classic and Forever clients mostly return the same types as Retail; import those from `/wow`. `/wow-classic` and `/wow-forever` hold the flavor-only types, such as `ClassicCharacterProfile` or `ForeverCharacterProfile`, where fields that only Retail returns are optional.

Fields that only some characters, items or players have are optional, so you may need to handle `undefined`. The types are checked against live responses every week; see [Upgrading](05-upgrading.md) for fields that became optional.

## Following links

Responses contain `href` links to related resources. `requestHref` fetches them with the client's token:

```ts
const mount = await client.wow.mount(6);
const display = await client.requestHref(mount.creature_displays[0].key.href);
```
