import type { StorybookConfig } from "@storybook/sveltekit";

const config: StorybookConfig = {
    stories: ["../src/stories/**/*.mdx", "../src/stories/**/*.stories.ts"],
    addons: ["@storybook/addon-docs"],
    // the whole _wasm directory, not a single file: the core picks a variant per browser and fetches side
    // modules (charting3d) relative to it, matching what the README tells consumers
    staticDirs: [{ from: "../node_modules/scichart/_wasm", to: "/" }],
    framework: { name: "@storybook/sveltekit", options: {} }
};

export default config;
