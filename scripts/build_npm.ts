// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
    entryPoints: ["./mod.ts"],
    outDir: "./npm",
    //scriptModule: false,
    test: false,
    shims: {
        deno: "dev",
    },
    package: {
        // package.json properties
        name: "blizzard_api",
        version: Deno.args[0],
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
