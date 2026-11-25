import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

/**
 * Vite configuration for the client-only demo. There is no SSR here: the whole app is browser code.
 */
export default defineConfig({
    plugins: [svelte()],
    resolve: {
        /*
         * `scichart-svelte` is consumed as `"file:../.."`, so npm puts a SYMLINK at
         * node_modules/scichart-svelte -> the repo root, and Vite resolves it to its real path. The wrapper's own
         * bare imports (`svelte`, `scichart`) would then resolve from the repo root's node_modules - a second
         * Svelte runtime and a second SciChart engine. `dedupe` resolves them from this app instead, which is
         * also what a published-npm consumer would use to collapse a duplicated `scichart`.
         */
        dedupe: ["svelte", "scichart"]
    },
    server: {
        // the symlinked wrapper lives outside this app's folder; its files are served from there in dev
        fs: { allow: ["../.."] }
    }
});
