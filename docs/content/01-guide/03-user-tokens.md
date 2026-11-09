---
title: User tokens
description: Use the account profile endpoints, which need a user's permission.
---

The account profile endpoints (`accountProfileSummary`, `protectedCharacterProfile` and the `account*Collection` endpoints) return a player's own account, so they need a user access token from the OAuth authorization code flow. The [reference](../03-reference/_index.md) marks them with **User token**.

```ts
const redirectUri = "https://example.com/callback";

// 1. Send the user to Battle.net to log in.
const state = crypto.randomUUID(); // store it, and check it on the redirect
const url = client.authorizeUrl({ redirectUri, scope: ["wow.profile"], state });

// 2. On your redirect URI, exchange the code for a user token.
const { access_token } = await client.exchangeCode({ code, redirectUri });

// 3. Use a user-scoped client. It's cheap to create,
//    and it shares the app token with its parent.
const user = client.forUser(access_token);
const profile = await user.wow.accountProfileSummary();
```

The redirect URI must be registered on your API client. Calling a user-scoped endpoint without a user token throws `MissingUserTokenError`.

User tokens expire after about a day. Get a new one with the same flow.
