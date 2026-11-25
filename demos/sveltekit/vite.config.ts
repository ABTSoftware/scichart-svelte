import adapter from "@sveltejs/adapter-node";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

/**
 * A server-rendered SvelteKit app. Every page is rendered on the server first: the chart components send their
 * outer elements and fallbacks, and create the charts in the browser after hydration.
 */
export default defineConfig({
    plugins: [sveltekit({ adapter: adapter() })],
    ssr: {
        // scichart's ESM build uses extensionless relative imports, which Node cannot load when Vite externalizes
        // the package for server-side rendering. Bundling it lets Vite resolve them. Every SvelteKit app using
        // scichart-svelte needs this line.
        noExternal: ["scichart"]
    },
    resolve: {
        // `scichart-svelte` is linked from the repo root (`file:../..`); resolve its bare imports from this app,
        // so there is one Svelte runtime and one SciChart engine (see demos/vite-svelte/vite.config.ts)
        dedupe: ["svelte", "scichart"]
    },
    server: {
        fs: { allow: ["../.."] }
    }
});
