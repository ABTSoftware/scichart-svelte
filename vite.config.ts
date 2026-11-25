import adapter from "@sveltejs/adapter-node";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

/**
 * The SvelteKit app in src/routes is not published: it is the development showcase and the page the
 * memory-leak test drives (`npm run dev`). The published package is src/lib, built by `svelte-package`
 * into dist/ (`npm run build`), which reads the Svelte options below too.
 */
export default defineConfig({
    plugins: [
        sveltekit({
            compilerOptions: {
                // Force runes mode for this project; dependencies decide for themselves
                runes: ({ filename }) => (filename.split(/[/\\]/).includes("node_modules") ? undefined : true)
            },
            adapter: adapter()
        })
    ],
    ssr: {
        // scichart's ESM build uses extensionless relative imports, which Node cannot load when Vite
        // externalizes the package for server-side rendering. Bundling it lets Vite resolve them; nothing
        // in it runs on the server beyond module evaluation. The README tells SvelteKit apps to do the same.
        noExternal: ["scichart"]
    }
});
