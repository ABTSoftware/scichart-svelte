import { existsSync, readFileSync, readdirSync } from "node:fs";
import * as path from "node:path";

/**
 * Post-build sanity checks for the published artifact layout in dist/ and the package.json that ships with it.
 * Run via `npm run verifyLib` (the last step of `npm run build`), before publint and attw.
 * Guards the invariants ESM-only packaging and tree-shaking rely on — see README "Packaging and tree-shaking".
 */

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");

const errors: string[] = [];

function fail(message: string) {
    errors.push(message);
}

function readDist(relativePath: string): string {
    return readFileSync(path.join(distDir, relativePath), "utf8");
}

// every public module, under the name a deep import uses
const EXPECTED_FILES = [
    "index.js",
    "index.d.ts",
    "SciChartSvelte.svelte",
    "SciChartDeclarative.svelte",
    "SciChartGroup.svelte",
    "ChartGroupLoader.svelte",
    "DefaultFallback.svelte",
    "SciChartNestedOverview.svelte",
    "SciChartNestedLegend.svelte",
    "SciChartMemoryDebugWrapper.svelte",
    "SciChartSurfaceContext.js",
    "SciChartGroupContext.js",
    "configureDefaults.js",
    "stateClassNames.js",
    "types.d.ts"
];

// Builder API isolation: only this module may reach the Builder, so apps using SciChartSvelte with an
// initChart function never bundle it
const BUILDER_MODULE = "SciChartDeclarative.svelte";

const SIDE_EFFECTS_MODULE = "configureDefaults.js";
const EXPECTED_SIDE_EFFECTS = [`./dist/${SIDE_EFFECTS_MODULE}`];

// the reactive init result must never be a deep $state proxy (ADR 0006)
const LIFECYCLE_MODULE = "chartLifecycle.svelte.js";

if (!existsSync(distDir)) {
    console.error("verify-lib: dist/ does not exist — run the build first");
    process.exit(1);
}

for (const fileName of EXPECTED_FILES) {
    if (!existsSync(path.join(distDir, fileName))) {
        fail(`dist/${fileName}: file is missing`);
    }
}

for (const fileName of EXPECTED_FILES.filter(name => name.endsWith(".svelte"))) {
    if (!existsSync(path.join(distDir, `${fileName}.d.ts`))) {
        fail(`dist/${fileName}.d.ts: type declarations are missing`);
    }
}

const codeFiles = readdirSync(distDir, { recursive: true, encoding: "utf8" }).filter(
    fileName => (fileName.endsWith(".js") || fileName.endsWith(".svelte")) && !fileName.endsWith(".d.ts")
);

for (const fileName of codeFiles) {
    const content = readDist(fileName);

    if (/\brequire\(/.test(content) || /\bmodule\.exports\b/.test(content)) {
        fail(`dist/${fileName}: contains CommonJS — the package is ESM only`);
    }

    if (/\bbuildChart\b/.test(content) && fileName !== BUILDER_MODULE) {
        fail(`dist/${fileName}: references the Builder API — only ${BUILDER_MODULE} may do so`);
    }

    if (/\bregisterAllTypes\b/.test(content) && fileName !== BUILDER_MODULE) {
        fail(`dist/${fileName}: references registerAllTypes — only ${BUILDER_MODULE} may register every built-in type`);
    }

    if (/\.ts["']/.test(content.replace(/\.d\.ts/g, ""))) {
        fail(`dist/${fileName}: imports a .ts file, which does not exist in dist/`);
    }
}

if (!readDist(BUILDER_MODULE).includes("registerAllTypes()")) {
    fail(`dist/${BUILDER_MODULE}: no longer registers the built-in types`);
}

const configContent = readDist(SIDE_EFFECTS_MODULE);

if (!configContent.includes(`"/scichart.wasm"`)) {
    fail(`dist/${SIDE_EFFECTS_MODULE}: default wasmUrl "/scichart.wasm" is missing`);
}

if (!configContent.includes("isWasmConfigured")) {
    fail(`dist/${SIDE_EFFECTS_MODULE}: must not override an app's own wasm configuration (isWasmConfigured)`);
}

if (!/\$state\.raw\(/.test(readDist(LIFECYCLE_MODULE))) {
    fail(`dist/${LIFECYCLE_MODULE}: the init result must be held in $state.raw, never a deep $state proxy`);
}

const manifest = JSON.parse(readFileSync(path.join(rootDir, "package.json"), "utf8"));

if (manifest.type !== "module") {
    fail(`package.json: "type" must be "module"`);
}

if (manifest.main || manifest.module || manifest.require) {
    fail(`package.json: ESM-only — no "main"/"module" entry points`);
}

if (JSON.stringify(manifest.sideEffects) !== JSON.stringify(EXPECTED_SIDE_EFFECTS)) {
    fail(`package.json: sideEffects must be exactly ${JSON.stringify(EXPECTED_SIDE_EFFECTS)}`);
}

const exportsMap = manifest.exports ?? {};

for (const key of [".", "./*", "./*.svelte", "./package.json"]) {
    if (!exportsMap[key]) {
        fail(`package.json: exports map must declare "${key}"`);
    }
}

for (const [key, target] of Object.entries(exportsMap)) {
    if (typeof target === "object" && target !== null && "require" in target) {
        fail(`package.json: exports["${key}"] has a "require" condition — the package is ESM only`);
    }
}

if (manifest.exports?.["."]?.types !== "./dist/index.d.ts" || manifest.exports?.["."]?.svelte !== "./dist/index.js") {
    fail(`package.json: exports["."] must point "types" and "svelte" at dist/index`);
}

if (!manifest.peerDependencies?.svelte || !manifest.peerDependencies?.scichart) {
    fail("package.json: svelte and scichart must be peer dependencies");
}

if (manifest.dependencies && Object.keys(manifest.dependencies).length > 0) {
    fail("package.json: the package must have no runtime dependencies");
}

if (errors.length > 0) {
    console.error(`verify-lib: FAILED with ${errors.length} error(s):`);
    errors.forEach(message => console.error(`  - ${message}`));
    process.exit(1);
}

console.log("verify-lib: all artifact checks passed");
