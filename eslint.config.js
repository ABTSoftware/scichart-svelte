import prettier from "eslint-config-prettier";
import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import storybook from "eslint-plugin-storybook";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import ts from "typescript-eslint";

export default defineConfig(
    globalIgnores([
        ".svelte-kit/",
        "dist/",
        "build/",
        "storybook-static/",
        "static/",
        "playwright-report/",
        "test-results/",
        // each demo is its own project, checked by its own `npm run check` (svelte-check)
        "demos/"
    ]),
    js.configs.recommended,
    ts.configs.recommended,
    svelte.configs.recommended,
    prettier,
    svelte.configs.prettier,
    storybook.configs["flat/recommended"],
    {
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
        rules: {
            // typescript-eslint recommends leaving undefined globals to the TypeScript compiler
            "no-undef": "off",
            // SciChart's own APIs type errors and option bags loosely; matching them needs `any`
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }]
        }
    },
    {
        files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
        languageOptions: {
            parserOptions: {
                projectService: true,
                extraFileExtensions: [".svelte"],
                parser: ts.parser
            }
        }
    },
    {
        // type tests declare values only to inspect their types
        files: ["tests/types/**"],
        rules: { "@typescript-eslint/no-unused-vars": "off" }
    },
    {
        // the showcase app links between its own pages without SvelteKit's resolve()
        files: ["src/routes/**/*.svelte"],
        rules: { "svelte/no-navigation-without-resolve": "off" }
    }
);
