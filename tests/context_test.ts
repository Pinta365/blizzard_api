import { assertEquals, assertRejects, assertStrictEquals, assertThrows } from "@std/assert";
import { createClient, errors } from "../mod.ts";

const config = { region: "eu", locale: "en_GB", clientId: "id", clientSecret: "secret" } as const;

interface Call {
    url: string;
    init?: RequestInit;
}

/**
 * Replaces globalThis.fetch for the duration of fn. The handler returns a Response per call.
 */
async function withFetch(
    handler: (call: Call, index: number) => Response | Promise<Response>,
    fn: (calls: Call[]) => Promise<void>,
): Promise<void> {
    const original = globalThis.fetch;
    const calls: Call[] = [];
    globalThis.fetch = (input: string | URL | Request, init?: RequestInit) => {
        const call = { url: String(input), init };
        calls.push(call);
        return Promise.resolve(handler(call, calls.length - 1));
    };
    try {
        await fn(calls);
    } finally {
        globalThis.fetch = original;
    }
}

const tokenResponse = (token: string, expiresIn = 86399) =>
    new Response(JSON.stringify({ access_token: token, token_type: "bearer", expires_in: expiresIn }));
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const isToken = (call: Call) => call.url.endsWith("/token");
const header = (call: Call, name: string) => new Headers(call.init?.headers).get(name);

Deno.test("createClient validates config", () => {
    assertThrows(() => createClient({ ...config, clientId: "" }), errors.MissingClientIdError);
    assertThrows(() => createClient({ ...config, clientSecret: "" }), errors.MissingClientSecretError);
});

Deno.test("reuses the cached token across requests", async () => {
    await withFetch((call) => isToken(call) ? tokenResponse("t1") : json({ id: 6 }), async (calls) => {
        const client = createClient(config);
        await client.wow.mount(6);
        await client.wow.mount(6);
        assertEquals(calls.filter(isToken).length, 1);
        const api = calls.filter((call) => !isToken(call));
        assertEquals(api[0].url, "https://eu.api.blizzard.com/data/wow/mount/6?locale=en_GB");
        assertEquals(header(api[0], "Authorization"), "Bearer t1");
        assertEquals(header(api[0], "Battlenet-Namespace"), "static-eu");
    });
});

Deno.test("concurrent requests share one token request", async () => {
    await withFetch((call) => isToken(call) ? tokenResponse("t1") : json({}), async (calls) => {
        const client = createClient(config);
        await Promise.all([client.wow.mount(1), client.wow.mount(2), client.wow.mount(3)]);
        assertEquals(calls.filter(isToken).length, 1);
    });
});

Deno.test("refreshes a token that is about to expire", async () => {
    let n = 0;
    await withFetch((call) => isToken(call) ? tokenResponse(`t${++n}`, 30) : json({}), async (calls) => {
        const client = createClient(config);
        await client.wow.mount(1);
        await client.wow.mount(1);
        // expires_in 30s is inside the 60s renewal margin, so each request fetches a new token.
        assertEquals(calls.filter(isToken).length, 2);
    });
});

Deno.test("retries once with a fresh token on 401", async () => {
    let n = 0;
    await withFetch(
        (call) => {
            if (isToken(call)) return tokenResponse(`t${++n}`);
            return header(call, "Authorization") === "Bearer t1" ? json({ code: 401 }, 401) : json({ ok: true });
        },
        async (calls) => {
            const client = createClient(config);
            assertEquals(await client.wow.mount(6), { ok: true } as unknown);
            assertEquals(calls.filter(isToken).length, 2);
        },
    );
});

Deno.test("throws APIError with the Blizzard error code", async () => {
    await withFetch(
        (call) => isToken(call) ? tokenResponse("t1") : json({ code: 404, type: "BLZWEBAPI00000404" }, 404),
        async () => {
            const client = createClient(config);
            const error = await assertRejects(() => client.wow.mount(999999), errors.APIError);
            assertEquals(error.statusCode, 404);
        },
    );
});

Deno.test("clients are isolated from each other", async () => {
    await withFetch(
        (call) => isToken(call) ? tokenResponse(call.url.includes("battlenet.com.cn") ? "cn" : "global") : json({}),
        async (calls) => {
            const eu = createClient(config);
            const cn = createClient({ ...config, region: "cn" });
            await eu.wow.mount(1);
            await cn.wow.mount(1);
            const api = calls.filter((call) => !isToken(call));
            assertEquals(header(api[0], "Authorization"), "Bearer global");
            assertEquals(header(api[1], "Authorization"), "Bearer cn");
            assertEquals(api[1].url.startsWith("https://gateway.battlenet.com.cn/"), true);
        },
    );
});

Deno.test("user-scoped endpoints require forUser()", async () => {
    await withFetch(() => json({}), async (calls) => {
        const client = createClient(config);
        await assertRejects(() => client.wow.accountProfileSummary(), errors.MissingUserTokenError);
        assertEquals(calls.length, 0);
    });
});

Deno.test("forUser() sends the user token only to user-scoped endpoints", async () => {
    await withFetch((call) => isToken(call) ? tokenResponse("app") : json({}), async (calls) => {
        const client = createClient(config);
        const user = client.forUser("user-token");
        await user.wow.accountProfileSummary();
        await user.wow.mount(6);
        await client.wow.mount(6);
        const api = calls.filter((call) => !isToken(call));
        assertEquals(api[0].url, "https://eu.api.blizzard.com/profile/user/wow?locale=en_GB");
        assertEquals(header(api[0], "Authorization"), "Bearer user-token");
        assertEquals(header(api[1], "Authorization"), "Bearer app");
        // The parent and the user client share one app token.
        assertEquals(calls.filter(isToken).length, 1);
    });
});

Deno.test("requestHref keeps the href namespace and adds locale", async () => {
    await withFetch((call) => isToken(call) ? tokenResponse("t1") : json({}), async (calls) => {
        const client = createClient(config);
        await client.requestHref("https://eu.api.blizzard.com/data/wow/mount/6?namespace=static-12.1.0_68914-eu");
        const api = calls.filter((call) => !isToken(call));
        const url = new URL(api[0].url);
        assertEquals(url.searchParams.get("namespace"), "static-12.1.0_68914-eu");
        assertEquals(url.searchParams.get("locale"), "en_GB");
        assertStrictEquals(header(api[0], "Battlenet-Namespace"), null);
    });
});

Deno.test("authorizeUrl builds the authorization code flow URL", () => {
    const client = createClient(config);
    const url = new URL(client.authorizeUrl({ redirectUri: "https://app/cb", scope: ["wow.profile"], state: "s" }));
    assertEquals(url.origin + url.pathname, "https://oauth.battle.net/authorize");
    assertEquals(url.searchParams.get("client_id"), "id");
    assertEquals(url.searchParams.get("response_type"), "code");
    assertEquals(url.searchParams.get("scope"), "openid wow.profile");
    assertEquals(url.searchParams.get("state"), "s");
});

Deno.test("exchangeCode posts the code with client credentials", async () => {
    await withFetch(() => tokenResponse("user"), async (calls) => {
        const client = createClient(config);
        const token = await client.exchangeCode({ code: "abc", redirectUri: "https://app/cb" });
        assertEquals(token.access_token, "user");
        const body = new URLSearchParams(String(calls[0].init?.body));
        assertEquals(body.get("grant_type"), "authorization_code");
        assertEquals(body.get("code"), "abc");
        assertEquals(header(calls[0], "Authorization"), "Basic " + btoa("id:secret"));
    });
});

Deno.test("module-level setup() API still works", async () => {
    const legacy = await import("../mod.ts");
    await withFetch((call) => isToken(call) ? tokenResponse("legacy") : json({ id: 6 }), async (calls) => {
        legacy.setup(config);
        await legacy.wow.mount(6);
        assertEquals(legacy.getAccessToken(), "legacy");
        assertEquals(calls.filter((call) => !isToken(call)).length, 1);
    });
});

Deno.test("retries after 429 using Retry-After", async () => {
    let apiCalls = 0;
    await withFetch(
        (call) => {
            if (isToken(call)) return tokenResponse("t1");
            return ++apiCalls < 3
                ? new Response("", { status: 429, headers: { "Retry-After": "0" } })
                : json({ ok: true });
        },
        async () => {
            const client = createClient(config);
            assertEquals(await client.wow.mount(6), { ok: true } as unknown);
            assertEquals(apiCalls, 3);
        },
    );
});

Deno.test("gives up after repeated 429s", async () => {
    await withFetch(
        (call) =>
            isToken(call) ? tokenResponse("t1") : new Response("", { status: 429, headers: { "Retry-After": "0" } }),
        async (calls) => {
            const client = createClient(config);
            const error = await assertRejects(() => client.wow.mount(6), errors.APIError);
            assertEquals(error.statusCode, 429);
            assertEquals(calls.filter((call) => !isToken(call)).length, 4);
        },
    );
});

Deno.test("classic clients add the namespace variant", async () => {
    await withFetch((call) => isToken(call) ? tokenResponse("t1") : json({}), async (calls) => {
        const client = createClient(config);
        await client.wowClassic.item(19019);
        await client.wowClassicEra.realms();
        await client.wowClassicEra.characterProfile("dragonfang", "aragorn");
        await client.wow.item(19019);
        const namespaces = calls.filter((call) => !isToken(call)).map((call) => header(call, "Battlenet-Namespace"));
        assertEquals(namespaces, ["static-classic-eu", "dynamic-classic1x-eu", "profile-classic1x-eu", "static-eu"]);
        // All flavors share one token.
        assertEquals(calls.filter(isToken).length, 1);
    });
});
