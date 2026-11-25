import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";

/**
 * Copies every WebAssembly binary shipped by the installed `scichart` package into the folder given as the
 * first argument (relative to the working directory), which the app serves at the site root.
 *
 * All of them, not only `scichart.wasm`: the core picks a variant per browser (`-nosimd`, `-64`) and fetches
 * the 3D engine (`scichart-charting3d*.wasm`) on demand, all relative to the `wasmUrl` scichart-svelte
 * configures by default, `/scichart.wasm`.
 *
 *   node scripts/copy-wasm.mjs static
 */

const targetDir = resolve(process.argv[2] ?? "static");

// resolve scichart as the app in the working directory sees it
const require = createRequire(join(process.cwd(), "package.json"));
const wasmSourceDir = join(dirname(require.resolve("scichart/package.json")), "_wasm");

if (!existsSync(wasmSourceDir) || !statSync(wasmSourceDir).isDirectory()) {
    console.error(`copy-wasm: no _wasm folder found in the installed scichart package (${wasmSourceDir}).`);
    process.exit(1);
}

const wasmFileNames = readdirSync(wasmSourceDir).filter(fileName => fileName.endsWith(".wasm"));

if (wasmFileNames.length === 0) {
    console.error(`copy-wasm: no *.wasm files found in ${wasmSourceDir}. Is the scichart install complete?`);
    process.exit(1);
}

mkdirSync(targetDir, { recursive: true });

for (const fileName of wasmFileNames) {
    copyFileSync(join(wasmSourceDir, fileName), join(targetDir, fileName));
}

console.log(`copy-wasm: copied ${wasmFileNames.length} file(s) to ${targetDir} -> ${wasmFileNames.join(", ")}`);
