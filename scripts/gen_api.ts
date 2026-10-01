// scripts/gen_api.ts
//
// Generates the client API interfaces (WowApi, HearthstoneApi, ...) in src/generated/ from the endpoint modules.
// Each endpoint function `fn(ctx: ApiContext, ...args): R` becomes a documented method `fn(...args): R`, so the
// JSR docs and editor hovers list every endpoint. src/client.ts checks at compile time that each generated
// interface matches the bound endpoints exactly.
//
// Usage:
//   deno task gen:api            regenerate
//   deno task gen:api --check    fail if the generated files are out of date (CI)

import ts from "typescript";
import { dirname, fromFileUrl, join, relative } from "@std/path";

const root = join(dirname(fromFileUrl(import.meta.url)), "..");
const outDir = join(root, "src/generated");

interface Target {
    /** The endpoint module, relative to the repo root. */
    module: string;
    /** The generated interface name. */
    name: string;
    /** Description of the interface. */
    description: string;
}

const targets: Target[] = [
    { module: "src/wow/index.ts", name: "WowApi", description: "World of Warcraft endpoints." },
    {
        module: "src/wow_classic/index.ts",
        name: "WowClassicApi",
        description: "World of Warcraft Classic (progression, e.g. Mists of Pandaria Classic) endpoints.",
    },
    {
        module: "src/wow_classic/era.ts",
        name: "WowClassicEraApi",
        description: "World of Warcraft Classic Era endpoints (Era, Season of Discovery, Hardcore, Anniversary).",
    },
    { module: "src/hearthstone/index.ts", name: "HearthstoneApi", description: "Hearthstone endpoints." },
    { module: "src/starcraft2/index.ts", name: "Sc2Api", description: "StarCraft II endpoints." },
    { module: "src/diablo3/index.ts", name: "Diablo3Api", description: "Diablo III endpoints." },
];

const program = ts.createProgram(targets.map((t) => join(root, t.module)), {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    allowImportingTsExtensions: true,
    noEmit: true,
    strict: true,
});
const checker = program.getTypeChecker();
/** Referenced types that their module does not export (they must be, to be importable). */
const unexported = new Set<string>();

function fileName(target: Target): string {
    return target.name.replace(/Api$/, "").replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase() + "_api.ts";
}

/** Collects the type names referenced in a node and the file that declares each of them. */
function collectTypeImports(node: ts.Node, imports: Map<string, string>, context: string): void {
    const visit = (n: ts.Node) => {
        if (ts.isTypeReferenceNode(n) && ts.isIdentifier(n.typeName)) {
            const name = n.typeName.text;
            const symbol = checker.getSymbolAtLocation(n.typeName);
            const resolved = symbol && symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
            const declaration = resolved?.declarations?.[0];
            // Built-ins (Promise, Record, ...) come from lib files and need no import.
            // Type parameters (e.g. the T of metadata<T>) are declared on the method itself.
            if (
                declaration && !ts.isTypeParameterDeclaration(declaration) &&
                !declaration.getSourceFile().isDeclarationFile
            ) {
                const file = declaration.getSourceFile().fileName;
                const isExported = ts.canHaveModifiers(declaration) &&
                    ts.getModifiers(declaration)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
                if (!isExported) {
                    unexported.add(`${relative(root, file)}: ${name}`);
                }
                const previous = imports.get(name);
                if (previous && previous !== file) {
                    throw new Error(`${context}: type ${name} is declared in both ${previous} and ${file}`);
                }
                imports.set(name, file);
            }
        }
        ts.forEachChild(n, visit);
    };
    visit(node);
}

function jsDocOf(declaration: ts.Node): string {
    const text = declaration.getSourceFile().getFullText();
    const ranges = ts.getLeadingCommentRanges(text, declaration.getFullStart()) ?? [];
    const doc = ranges.filter((r) => text.slice(r.pos, r.pos + 3) === "/**").pop();
    return doc ? text.slice(doc.pos, doc.end) : "";
}

function indent(text: string, prefix: string): string {
    return text.split("\n").map((line) => (line.trim() ? prefix + line.trimStart() : "")).map((line) =>
        line.startsWith(prefix + "*") ? prefix + " " + line.slice(prefix.length) : line
    ).join("\n");
}

function generate(target: Target): string {
    const source = program.getSourceFile(join(root, target.module));
    if (!source) throw new Error(`cannot load ${target.module}`);
    const moduleSymbol = checker.getSymbolAtLocation(source);
    if (!moduleSymbol) throw new Error(`${target.module} has no exports`);

    const imports = new Map<string, string>();
    const methods: string[] = [];
    const exports = checker.getExportsOfModule(moduleSymbol).sort((a, b) => a.name.localeCompare(b.name));

    for (const exported of exports) {
        const symbol = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
        const declaration = symbol.declarations?.[0];
        if (!declaration || !ts.isFunctionDeclaration(declaration)) continue;

        const [ctxParam, ...params] = declaration.parameters;
        if (!ctxParam || ctxParam.type?.getText() !== "ApiContext") continue;
        if (!declaration.type) throw new Error(`${exported.name} has no explicit return type`);

        const context = `${target.name}.${exported.name}`;
        const paramText = params.map((p) => {
            if (!p.type) throw new Error(`${context}: parameter ${p.name.getText()} has no type`);
            collectTypeImports(p.type, imports, context);
            const optional = p.questionToken || p.initializer ? "?" : "";
            return `${p.name.getText()}${optional}: ${p.type.getText()}`;
        }).join(", ");
        collectTypeImports(declaration.type, imports, context);

        const typeParams = declaration.typeParameters
            ? `<${
                declaration.typeParameters.map((tp) => {
                    if (tp.constraint) collectTypeImports(tp.constraint, imports, context);
                    return tp.getText();
                }).join(", ")
            }>`
            : "";
        const doc = jsDocOf(declaration);
        methods.push(
            (doc ? indent(doc, "    ") + "\n" : "") +
                `    ${exported.name}${typeParams}(${paramText}): ${declaration.type.getText()};`,
        );
    }

    const byFile = new Map<string, string[]>();
    for (const [name, file] of imports) {
        byFile.set(file, [...(byFile.get(file) ?? []), name]);
    }
    const importLines = [...byFile].map(([file, names]) => {
        let path = relative(outDir, file);
        if (!path.startsWith(".")) path = "./" + path;
        return `import type { ${names.sort().join(", ")} } from "${path}";`;
    }).sort();

    return [
        "// Generated by scripts/gen_api.ts from " + target.module + ". Do not edit; run `deno task gen:api`.",
        "",
        ...importLines,
        "",
        `/**\n * ${target.description}\n */`,
        `export interface ${target.name} {`,
        methods.join("\n\n"),
        "}",
        "",
    ].join("\n");
}

async function format(code: string): Promise<string> {
    const command = new Deno.Command(Deno.execPath(), {
        args: ["fmt", "--config", join(root, "deno.jsonc"), "--ext", "ts", "-"],
        stdin: "piped",
        stdout: "piped",
    });
    const child = command.spawn();
    const writer = child.stdin.getWriter();
    await writer.write(new TextEncoder().encode(code));
    await writer.close();
    const { code: status, stdout } = await child.output();
    if (status !== 0) throw new Error("deno fmt failed");
    return new TextDecoder().decode(stdout);
}

const generated = targets.map((target) => ({ target, code: generate(target) }));
if (unexported.size) {
    console.error("These types are used by endpoints but not exported from their module:");
    for (const entry of [...unexported].sort()) console.error("  " + entry);
    Deno.exit(1);
}

const check = Deno.args.includes("--check");
let stale = 0;
await Deno.mkdir(outDir, { recursive: true });
for (const { target, code: raw } of generated) {
    const path = join(outDir, fileName(target));
    const code = await format(raw);
    let current = "";
    try {
        current = await Deno.readTextFile(path);
    } catch {
        // New file.
    }
    if (current === code) continue;
    if (check) {
        console.error(`out of date: ${relative(root, path)}`);
        stale++;
    } else {
        await Deno.writeTextFile(path, code);
        console.log(`wrote ${relative(root, path)}`);
    }
}
if (stale) {
    console.error("Run `deno task gen:api` and commit the result.");
    Deno.exit(1);
}
