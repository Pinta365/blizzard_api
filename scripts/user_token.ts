// scripts/user_token.ts
//
// Gets a user access token with the OAuth authorization code flow, for testing the user-scoped endpoints
// (WoW account profile). It starts a local callback server, prints the Battle.net login URL, and exchanges the
// returned code for a token.
//
// One-time setup: add the redirect URI (default http://localhost:8787/callback) to your API client at
// https://develop.battle.net/access/clients.
//
// Usage:
//   deno task user-token          print the token
//   deno task user-token --save   also write it to .env as BLIZZARD_USER_TOKEN (used by `deno task smoke`)
//
// Environment: BLIZZARD_CLIENT_ID, BLIZZARD_CLIENT_SECRET, optional BLIZZARD_REGION (default eu),
// BLIZZARD_REDIRECT_PORT (default 8787) and BLIZZARD_SCOPE (default "wow.profile").

import { createClient } from "../mod.ts";
import type { Regions } from "../mod.ts";

const clientId = Deno.env.get("BLIZZARD_CLIENT_ID");
const clientSecret = Deno.env.get("BLIZZARD_CLIENT_SECRET");
if (!clientId || !clientSecret) {
    console.error("Set BLIZZARD_CLIENT_ID and BLIZZARD_CLIENT_SECRET (e.g. in .env).");
    Deno.exit(1);
}

const region = (Deno.env.get("BLIZZARD_REGION") ?? "eu") as Regions;
const port = Number(Deno.env.get("BLIZZARD_REDIRECT_PORT") ?? 8787);
const scope = (Deno.env.get("BLIZZARD_SCOPE") ?? "wow.profile").split(/[\s,]+/).filter(Boolean);
const redirectUri = `http://localhost:${port}/callback`;
const save = Deno.args.includes("--save");

const client = createClient({ region, clientId, clientSecret });
const state = crypto.randomUUID();
const authorizeUrl = client.authorizeUrl({ redirectUri, scope, state });

const page = (title: string, message: string) =>
    new Response(
        `<!doctype html><meta charset="utf-8"><title>${title}</title>` +
            `<body style="font-family: system-ui; margin: 3rem"><h1>${title}</h1><p>${message}</p>`,
        { headers: { "content-type": "text/html; charset=utf-8" } },
    );

async function saveToEnv(token: string): Promise<void> {
    const path = ".env";
    let content = "";
    try {
        content = await Deno.readTextFile(path);
    } catch {
        // No .env yet.
    }
    const line = `BLIZZARD_USER_TOKEN=${token}`;
    content = /^BLIZZARD_USER_TOKEN=.*$/m.test(content)
        ? content.replace(/^BLIZZARD_USER_TOKEN=.*$/m, line)
        : content + (content && !content.endsWith("\n") ? "\n" : "") + line + "\n";
    await Deno.writeTextFile(path, content, { mode: 0o600 });
}

const controller = new AbortController();
const done = Promise.withResolvers<void>();

const server = Deno.serve({
    hostname: "127.0.0.1",
    port,
    signal: controller.signal,
    onListen: () => {
        console.log(`Redirect URI (must be registered on your API client): ${redirectUri}`);
        console.log(`Region: ${region}, scope: ${["openid", ...scope].join(" ")}\n`);
        console.log("Open this URL and log in with Battle.net:\n");
        console.log(authorizeUrl + "\n");
    },
}, async (request) => {
    const url = new URL(request.url);
    if (url.pathname !== "/callback") return new Response("Not found", { status: 404 });

    const error = url.searchParams.get("error");
    if (error) {
        console.error(`Authorization failed: ${error} ${url.searchParams.get("error_description") ?? ""}`);
        done.resolve();
        return page("Authorization failed", error);
    }
    if (url.searchParams.get("state") !== state) {
        // Not our request (or a stale tab): ignore it and keep waiting.
        return page("State mismatch", "Ignoring this callback. Use the URL printed in the terminal.");
    }
    const code = url.searchParams.get("code");
    if (!code) return page("Missing code", "The callback had no authorization code.");

    try {
        const token = await client.exchangeCode({ code, redirectUri });
        const expires = new Date(Date.now() + token.expires_in * 1000);
        console.log(`Got a user token (scope: ${token.scope ?? "?"}, expires ${expires.toISOString()}).`);
        if (save) {
            await saveToEnv(token.access_token);
            console.log(
                "Saved to .env as BLIZZARD_USER_TOKEN. Test it with `deno task smoke account` and `deno task smoke protected`.",
            );
            console.log(
                "Remove it from .env when you're done testing; it grants access to the account's profile data.",
            );
        } else {
            // Printed only on request: the token grants access to the account's profile data.
            console.log("\n" + token.access_token + "\n");
            console.log("Rerun with --save to write it to .env as BLIZZARD_USER_TOKEN instead of printing it.");
        }
        return page("Done", "You can close this tab and return to the terminal.");
    } catch (e) {
        console.error("Code exchange failed:", (e as Error).message);
        return page("Code exchange failed", "See the terminal for details.");
    } finally {
        done.resolve();
    }
});

await done.promise;
// Let the response reach the browser before shutting down.
setTimeout(() => controller.abort(), 200);
await server.finished;
