// scripts/check_fields.ts
//
// Reports fields that the live API returns but the response types don't declare. It walks every saved response
// (fixtures/<api>.<function>.json, written by `deno task smoke`) alongside the declared return type of its endpoint.
// The counterpart `deno task check:types` reports declared fields that are missing or have the wrong type.
//
// Usage:
//   deno task check:fields [filter]

import ts from "typescript";
import { dirname, fromFileUrl, join } from "@std/path";

const root = join(dirname(fromFileUrl(import.meta.url)), "..");
const fixturesDir = join(root, "fixtures");

const apis: Record<string, { type: string; module: string }> = {
    wow: { type: "WowApi", module: "wow_api.ts" },
    wowClassic: { type: "WowClassicApi", module: "wow_classic_api.ts" },
    wowClassicEra: { type: "WowClassicEraApi", module: "wow_classic_era_api.ts" },
    hearthstone: { type: "HearthstoneApi", module: "hearthstone_api.ts" },
    sc2: { type: "Sc2Api", module: "sc2_api.ts" },
    diablo3: { type: "Diablo3Api", module: "diablo3_api.ts" },
};

const program = ts.createProgram(Object.values(apis).map((api) => join(root, "src/generated", api.module)), {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    allowImportingTsExtensions: true,
    noEmit: true,
    strict: true,
});
const checker = program.getTypeChecker();

function apiInterface(prefix: string): ts.Type | undefined {
    const api = apis[prefix];
    const source = api && program.getSourceFile(join(root, "src/generated", api.module));
    const declaration = source?.statements.find((s): s is ts.InterfaceDeclaration =>
        ts.isInterfaceDeclaration(s) && s.name.text === api.type
    );
    return declaration && checker.getTypeAtLocation(declaration);
}

function returnType(api: ts.Type, fn: string): ts.Type | undefined {
    const method = api.getProperty(fn);
    if (!method?.valueDeclaration) return undefined;
    const signature = checker.getTypeOfSymbolAtLocation(method, method.valueDeclaration).getCallSignatures()[0];
    return signature && checker.getAwaitedType(signature.getReturnType());
}

/** The object-like members of a type (drops null/undefined and primitives from unions). */
function objectMembers(type: ts.Type): ts.Type[] {
    const members = type.isUnion() ? type.types : [type];
    return members.filter((t) => t.flags & ts.TypeFlags.Object || t.isIntersection());
}

function walk(value: unknown, type: ts.Type, path: string, out: Set<string>): void {
    if (Array.isArray(value)) {
        const element = objectMembers(type).map((t) => checker.getIndexTypeOfType(t, ts.IndexKind.Number))
            .find((t): t is ts.Type => !!t);
        if (!element) return;
        // Check every element: optional fields often only appear on some of them.
        for (const item of value) walk(item, element, path + "[]", out);
        return;
    }
    if (value === null || typeof value !== "object") return;
    const candidates = objectMembers(type);
    if (!candidates.length) return;
    // Index signatures (Record<string, X>) accept any key.
    const indexed = candidates.map((t) => checker.getIndexTypeOfType(t, ts.IndexKind.String)).find((t) => !!t);
    for (const [key, child] of Object.entries(value)) {
        const property = candidates.map((t) => t.getProperty(key)).find((p) => !!p);
        if (!property) {
            if (indexed) walk(child, indexed, `${path}.${key}`, out);
            else out.add(`${path}.${key}`);
            continue;
        }
        const declaration = property.valueDeclaration ?? property.declarations?.[0];
        if (declaration) walk(child, checker.getTypeOfSymbolAtLocation(property, declaration), `${path}.${key}`, out);
    }
}

const filter = Deno.args[0] ?? "";
let checked = 0;
let withUndeclared = 0;
const names: string[] = [];
for await (const entry of Deno.readDir(fixturesDir)) {
    if (entry.isFile && /^\w+\.\w+\.json$/.test(entry.name)) names.push(entry.name);
}
for (const file of names.sort()) {
    const [prefix, fn] = file.split(".");
    const name = `${prefix}.${fn}`;
    const api = apiInterface(prefix);
    if (!api || !name.includes(filter)) continue;
    const type = returnType(api, fn);
    if (!type) continue;
    checked++;
    const undeclared = new Set<string>();
    walk(JSON.parse(await Deno.readTextFile(join(fixturesDir, file))), type, "", undeclared);
    if (undeclared.size) {
        withUndeclared++;
        console.log(`\n=== ${name}`);
        for (const path of [...undeclared].sort()) console.log("  " + path.slice(1));
    }
}
console.log(
    `\nChecked ${checked} fixtures: ${
        checked - withUndeclared
    } fully declared, ${withUndeclared} with undeclared fields.`,
);
if (withUndeclared) Deno.exit(1);
