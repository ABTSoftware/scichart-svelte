import { defineConfig } from "@playwright/test";
import config from "./playwright.config";

/** The deployed Storybook docs; deploy.yaml passes the URL GitHub Pages reports */
const url = process.env.DEPLOYED_URL || "https://abtsoftware.github.io/scichart-svelte/";

const DEPLOYED_URL = url.endsWith("/") ? url : `${url}/`;

export default defineConfig({
    ...config,
    projects: [{ name: "deployed", testMatch: /deployed\.spec\.ts/ }],
    webServer: undefined,
    use: { ...config.use, baseURL: DEPLOYED_URL }
});
