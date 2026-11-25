import { SciChartDefaults, SciChartSurface } from "scichart";
import { applySciChartConfig } from "scichart/Charting/Visuals/sciChartConfig";

/**
 * Applies scichart-svelte's default global SciChart configuration.
 *
 * This module executes at import time and is the ONLY module in this package listed in the
 * "sideEffects" array of package.json, so bundlers preserve it while tree-shaking everything else.
 * Every other module in this package must stay side-effect-free at import time.
 *
 * The `wasmUrl` default never overrides the app's own configuration: it is applied only while
 * `SciChartSurface.isWasmConfigured` is false, i.e. the app has not called
 * `SciChartSurface.configure(...)`, `loadWasmFromCDN()` or `loadWasmLocal()`. The order in which
 * the app's code and this module are evaluated therefore does not matter.
 *
 * Nothing is configured during server-side rendering, where no chart is ever created.
 */
export function configureSciChartDefaults(): void {
    if (typeof window === "undefined") {
        return;
    }

    if (!SciChartSurface.isWasmConfigured) {
        // Root-absolute, so every route of a single-page app fetches the same file (the core's
        // own default is the page-relative "scichart.wasm"). applySciChartConfig writes the
        // config without marking it as configured by the app, unlike configure().
        applySciChartConfig({ wasmUrl: "/scichart.wasm" });
    }

    // The wrapper renders its own Svelte fallback; disable the core DOM loader.
    SciChartDefaults.defaultLoader = false;
    SciChartDefaults.disableAspect = true;
}

configureSciChartDefaults();
