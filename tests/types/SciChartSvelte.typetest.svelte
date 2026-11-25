<!-- Compile-time checks for SciChartSvelte typing; run by `npm run typecheck` (svelte-check), never rendered. -->
<script lang="ts">
    import type { SciChart3DSurface } from "scichart";
    import SciChartSvelte from "../../src/lib/SciChartSvelte.svelte";
    import { getSciChartSurface } from "../../src/lib/SciChartSurfaceContext.js";
    import type { IInitResult, TChartComponentPropsWithInit, TResolvedReturnType } from "../../src/lib/types.js";
    import { assertType, type TExact } from "./assertType.js";

    const initChart = async (_rootElement: string | HTMLDivElement) => ({
        sciChartSurface: {} as SciChart3DSurface,
        extra: 42
    });

    // the Surface Context is read as the caller's init result type, null until init
    const surface = getSciChartSurface<TResolvedReturnType<typeof initChart>>();
    assertType<TExact<typeof surface.current, { sciChartSurface: SciChart3DSurface; extra: number } | null>>();

    const wrongInitChart: TChartComponentPropsWithInit<SciChart3DSurface, IInitResult<SciChart3DSurface>> = {
        // @ts-expect-error initChart must resolve to an init result
        initChart: async () => 42
    };
    void wrongInitChart;
</script>

<!-- the init result type, extra fields included, flows from initChart into every callback -->
<SciChartSvelte
    {initChart}
    onInit={initResult => {
        assertType<TExact<typeof initResult.sciChartSurface, SciChart3DSurface>>();
        assertType<TExact<typeof initResult.extra, number>>();
        return () => {};
    }}
    onRendered={({ extra }) => {
        assertType<TExact<typeof extra, number>>();
    }}
    onDelete={({ sciChartSurface }) => {
        assertType<TExact<typeof sciChartSurface, SciChart3DSurface>>();
    }}
    onInitError={(error: unknown) => void error}
    id="any-div-attribute"
    data-testid="also-data-attributes"
/>

<SciChartSvelte
    initChart={async () => ({ sciChartSurface: {} as SciChart3DSurface }) satisfies IInitResult<SciChart3DSurface>}
    stateClassNames={{ initialized: "ready" }}
    innerContainerProps={{ class: "inner", style: "height: 80%" }}
/>
