---
title: Errors and retries
description: What failed requests throw, and which ones are retried.
---

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

A `404` doesn't always mean the thing doesn't exist. WoW: Forever characters, for example, only appear from level 10, after a logout: see [Characters and guilds](../02-forever/02-characters-and-guilds.md).
