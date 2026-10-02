// scripts/build_npm.ts
//
// Builds the npm package (ESM + CommonJS) into ./npm.
// Usage: deno task build_npm [version]   (defaults to the version in deno.jsonc)
import { build, emptyDir } from "@deno/dnt";
import { parse } from "@std/jsonc";

const config = parse(await Deno.readTextFile("./deno.jsonc")) as { version: string };
const version = Deno.args[0] ?? config.version;

await emptyDir("./npm");

await build({
    entryPoints: [
        "./mod.ts",
        { name: "./wow", path: "./src/wow/types.ts" },
        { name: "./wow-classic", path: "./src/wow_classic/types.ts" },
        { name: "./hearthstone", path: "./src/hearthstone/types.ts" },
        { name: "./sc2", path: "./src/starcraft2/types.ts" },
        { name: "./diablo3", path: "./src/diablo3/types.ts" },
    ],
    outDir: "./npm",
    //scriptModule: false,
    test: false,
    shims: {
        deno: "dev",
    },
    package: {
        // package.json properties
        name: "@pinta365/blizzard_api",
        version,
        description:
            "TS library to interact with the Blizzard Battle.net API. World of Warcraft, World of Warcraft Classic, StarCraft 2, Diablo 3, Hearthstone.",
        license: "MIT",
        author: "Pinta <https://github.com/Pinta365>",
        keywords: [
            "blizzard",
            "battlenet",
            "battle.net",
            "bnet",
            "World of Warcraft",
            "StarCraft",
            "Diablo",
            "Hearthstone",
        ],
        repository: {
            type: "git",
            url: "git+https://github.com/Pinta365/blizzard_api.git",
        },
        bugs: {
            url: "https://github.com/Pinta365/blizzard_api/issues",
        },
    },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
