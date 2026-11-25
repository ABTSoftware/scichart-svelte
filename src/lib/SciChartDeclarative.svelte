<!--
@component
The component for rendering a chart surface from a Builder API config.
Requires a chart definition (JSON string or configuration object) passed via `config`.

Every built-in chart type is registered, so any definition works with no setup. That
convenience means the whole type universe is bundled — to avoid it, use `SciChartSvelte`
with an `initChart` function, which does not involve the Builder API at all.

The surface type passed to callbacks follows the `type` field of a `config` object
(see `TSurfaceFromConfig`); a JSON string gives `ISciChartSurfaceBase`.
The config is read once, when the chart is created.
-->
<script lang="ts" generics="TConfig extends string | TSurfaceDefinition">
    import { untrack } from "svelte";
    import { buildChart, registerAllTypes } from "scichart";
    import type {
        ISciChartSurfaceBase,
        SciChartPieSurface,
        TSurfaceDefinition,
        TWebAssemblyChart,
        TWebAssemblyChart3D
    } from "scichart";
    import SciChartSvelte from "./SciChartSvelte.svelte";
    import type { TChartComponentPropsWithConfig, TInitFunction, TSurfaceFromConfig } from "./types.js";
    import { initChartOnDeclarativeMessage, missingConfigMessage } from "./constants.js";

    type TSurface = TSurfaceFromConfig<TConfig>;

    let {
        config,
        initChart: _initChart,
        ...chartComponentProps
    }: TChartComponentPropsWithConfig<TSurface> & { config: TConfig } = $props();

    untrack(() => {
        if (!config) {
            throw new Error(missingConfigMessage);
        }

        if (_initChart) {
            throw new Error(initChartOnDeclarativeMessage);
        }
    });

    /**
     * buildChart for any definition. Its overloads each accept one surface kind, so none
     * takes the `string | TSurfaceDefinition` union; this signature is the union of all of them.
     */
    const buildAnyChart = buildChart as (
        divElementId: string | HTMLDivElement,
        definition: string | TSurfaceDefinition
    ) => Promise<TWebAssemblyChart | TWebAssemblyChart3D | SciChartPieSurface>;

    /**
     * Creates the chart from the config. This component is the only module in the package referencing the
     * Builder API, so apps that only use SciChartSvelte don't bundle it.
     */
    const initChart: TInitFunction<ISciChartSurfaceBase> = async chartRoot => {
        // Since SciChart v6 the Builder API registers nothing on import: a chart type named only as
        // a string in a definition cannot pull its class into the bundle. Registering here rather
        // than at module scope is deliberate — this package declares every module except
        // configureDefaults side-effect-free, so a bundler may keep only the bindings it needs and
        // drop a module-scope call. registerAllTypes is idempotent.
        registerAllTypes();

        const chart = await buildAnyChart(chartRoot, config);

        if ("sciChartSurface" in chart) {
            // 2D and polar
            return { sciChartSurface: chart.sciChartSurface };
        }

        if ("sciChart3DSurface" in chart) {
            return { sciChartSurface: chart.sciChart3DSurface };
        }

        // Pie
        return { sciChartSurface: chart };
    };
</script>

<SciChartSvelte {...chartComponentProps} initChart={initChart as TInitFunction<TSurface>} />
