// scripts/gen_docs.ts
//
// Generates the endpoint reference of the docs site (docs/content/03-reference/) from the client interfaces in
// src/generated/, which gen_api.ts writes from the endpoint modules. The pages are build output and not committed.
//
// Usage:
//   deno task docs:gen

import ts from "typescript";
import { dirname, fromFileUrl, join } from "@std/path";

const root = join(dirname(fromFileUrl(import.meta.url)), "..");
const outDir = join(root, "docs/content/03-reference");
const JSR = "https://jsr.io/@pinta365/blizzard-api/doc/~/";

interface Client {
    /** File name in src/generated/. */
    file: string;
    /** The endpoint module the client binds. */
    module: string;
    /** The generated interface. */
    name: string;
    /** The client property. */
    property: string;
    title: string;
    slug: string;
    intro: string;
}

const clients: Client[] = [
    {
        file: "wow_api.ts",
        module: "src/wow/index.ts",
        name: "WowApi",
        property: "wow",
        title: "World of Warcraft",
        slug: "wow",
        intro: "World of Warcraft (Retail): game data and profile endpoints.",
    },
    {
        file: "wow_classic_api.ts",
        module: "src/wow_classic/index.ts",
        name: "WowClassicApi",
        property: "wowClassic",
        title: "WoW Classic",
        slug: "wow-classic",
        intro: "WoW Classic progression (currently Mists of Pandaria Classic).",
    },
    {
        file: "wow_classic_era_api.ts",
        module: "src/wow_classic/era.ts",
        name: "WowClassicEraApi",
        property: "wowClassicEra",
        title: "WoW Classic Era",
        slug: "wow-classic-era",
        intro: "WoW Classic Era, Season of Discovery, Hardcore and Anniversary realms.",
    },
    {
        file: "wow_forever_api.ts",
        module: "src/wow_forever/index.ts",
        name: "WowForeverApi",
        property: "wowForever",
        title: "WoW: Forever",
        slug: "wow-forever",
        intro:
            "WoW: Forever. Blizzard hasn't documented this API yet: see the [Forever notes](../02-forever/_index.md).",
    },
    {
        file: "hearthstone_api.ts",
        module: "src/hearthstone/index.ts",
        name: "HearthstoneApi",
        property: "hearthstone",
        title: "Hearthstone",
        slug: "hearthstone",
        intro: "Hearthstone game data.",
    },
    {
        file: "sc2_api.ts",
        module: "src/starcraft2/index.ts",
        name: "Sc2Api",
        property: "sc2",
        title: "StarCraft II",
        slug: "sc2",
        intro: "StarCraft II game data and community endpoints, including the legacy ones.",
    },
    {
        file: "diablo3_api.ts",
        module: "src/diablo3/index.ts",
        name: "Diablo3Api",
        property: "diablo3",
        title: "Diablo III",
        slug: "diablo3",
        intro: "Diablo III game data and community endpoints.",
    },
];

interface Endpoint {
    name: string;
    section: string;
    category: string;
    params: string;
    returns: string;
    summary: string;
    userToken: boolean;
}

function endpoints(client: Client): Endpoint[] {
    const files = definingFiles(client.module);
    const path = join(root, "src/generated", client.file);
    const source = ts.createSourceFile(path, Deno.readTextFileSync(path), ts.ScriptTarget.Latest, true);
    const found: Endpoint[] = [];
    source.forEachChild((node) => {
        if (!ts.isInterfaceDeclaration(node) || node.name.text !== client.name) return;
        for (const member of node.members) {
            if (!ts.isMethodSignature(member) || !member.type) continue;
            const doc = ts.getJSDocCommentsAndTags(member).filter(ts.isJSDoc).map((d) =>
                ts.getTextOfJSDocComment(d.comment) ?? ""
            )
                .join("\n");
            const name = member.name.getText(source);
            found.push({
                name,
                ...group(name, files),
                params: member.parameters.map((p) => p.getText(source)).join(", "),
                returns: member.type.getText(source).replace(/^Promise<(.*)>$/s, "$1"),
                // The user token line becomes a marker of its own.
                summary: doc.split(/\n\s*\n/)[0].split("\n").filter((line) => !/user access token/i.test(line))
                    .join(" ").replace(/\s+/g, " ").trim(),
                userToken: /user access token/i.test(doc),
            });
        }
    });
    if (!found.length) throw new Error(`no endpoints found for ${client.name} in ${client.file}`);
    return found.sort((a, b) => a.name.localeCompare(b.name));
}

// Each endpoint is grouped by the file that defines it: its section (game data, profile, community) and category
// (achievement, auction house, ...). Classic and Forever re-export some Retail endpoints through files of their own,
// so an endpoint Retail has too takes Retail's file.
const program = ts.createProgram(clients.map((c) => join(root, c.module)), {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    allowImportingTsExtensions: true,
    noEmit: true,
});
const checker = program.getTypeChecker();

function definingFiles(module: string): Map<string, string> {
    const source = program.getSourceFile(join(root, module));
    const symbol = source && checker.getSymbolAtLocation(source);
    if (!symbol) throw new Error(`cannot read ${module}`);
    const files = new Map<string, string>();
    for (const exported of checker.getExportsOfModule(symbol)) {
        const resolved = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
        const file = resolved.declarations?.[0]?.getSourceFile().fileName;
        if (file) files.set(exported.name, file);
    }
    return files;
}

const retailFiles = definingFiles("src/wow/index.ts");

const SECTIONS: [string, string][] = [["/game_data/", "Game data"], ["/profile/", "Profile"], [
    "/community/",
    "Community",
]];
const WORDS: Record<string, string> = { pvp: "PvP", wow: "WoW" };
/** Files whose name says little about what they hold. */
const FILE_TITLES: Record<string, string> = { d3: "Eras and seasons" };

function group(name: string, files: Map<string, string>): { section: string; category: string } {
    const file = retailFiles.get(name) ?? files.get(name) ?? "";
    const section = SECTIONS.find(([dir]) => file.includes(dir))?.[1] ??
        (/^(account|character|guild|protected)/.test(name) ? "Profile" : "Game data");
    const base = file.replace(/^.*\//, "").replace(/\.ts$/, "");
    const words = base.split("_").map((w) => WORDS[w] ?? w);
    const category = FILE_TITLES[base] ?? words.join(" ").replace(/^./, (c) => c.toUpperCase());
    return { section, category };
}

function page(client: Client, weight: number): string {
    const list = endpoints(client);
    const userTokens = list.filter((e) => e.userToken).length;
    // The signature on one line, the description under it (a backslash is a hard line break).
    const item = (e: Endpoint) =>
        `- \`${e.name}(${e.params}): ${e.returns}\`\\\n  ${e.summary}${e.userToken ? " **User token.**" : ""}`;
    const sections: string[] = [];
    for (const [, section] of SECTIONS) {
        const inSection = list.filter((e) => e.section === section);
        if (!inSection.length) continue;
        const categories = [...new Set(inSection.map((e) => e.category))].sort((a, b) => a.localeCompare(b));
        const parts = categories.map((category) =>
            `### ${category}\n\n${inSection.filter((e) => e.category === category).map(item).join("\n")}`
        );
        sections.push(`## ${section}\n\n${parts.join("\n\n")}`);
    }
    return `---
title: ${JSON.stringify(client.title)}
description: ${JSON.stringify(`Every ${client.title} endpoint of blizzard_api, on client.${client.property}.`)}
weight: ${weight}
---

${client.intro}

${list.length} endpoints on \`client.${client.property}\`${
        userTokens ? `, ${userTokens} of them needing a [user token](../01-guide/03-user-tokens.md)` : ""
    }. Response types are documented on JSR: [\`${client.name}\`](${JSR}${client.name}).

${sections.join("\n\n")}
`;
}

await Deno.remove(outDir, { recursive: true }).catch(() => {});
await Deno.mkdir(outDir, { recursive: true });
await Deno.writeTextFile(
    join(outDir, "_index.md"),
    `---
title: Reference
weight: 3
description: "Every endpoint function of blizzard_api, per game: World of Warcraft, Classic, Classic Era, WoW: Forever, Hearthstone, StarCraft II and Diablo III."
---

Every endpoint function, per game. Generated from the library's client interfaces, so it always matches the code.
`,
);
for (const [i, client] of clients.entries()) {
    await Deno.writeTextFile(join(outDir, `${String(i + 1).padStart(2, "0")}-${client.slug}.md`), page(client, i + 1));
}
console.log(`wrote ${clients.length} reference pages to docs/content/03-reference/`);
