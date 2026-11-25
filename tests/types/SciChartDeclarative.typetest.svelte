<!-- Compile-time checks for SciChartDeclarative typing; run by `npm run typecheck` (svelte-check), never rendered. -->
<script lang="ts">
    import {
        ESciChartSurfaceType,
        type ISciChartSurfaceBase,
        type SciChart3DSurface,
        type SciChartPieSurface,
        type SciChartPolarSurface,
        type SciChartSurface
    } from "scichart";
    import SciChartDeclarative from "../../src/lib/SciChartDeclarative.svelte";
    import { assertType, type TExact } from "./assertType.js";

    let { jsonConfig }: { jsonConfig: string } = $props();
</script>

<SciChartDeclarative
    config={{ type: ESciChartSurfaceType.Default3D, options: {} }}
    onInit={({ sciChartSurface }) => {
        assertType<TExact<typeof sciChartSurface, SciChart3DSurface>>();
    }}
/>

<SciChartDeclarative
    config={{ type: ESciChartSurfaceType.Pie2D, options: {} }}
    onInit={({ sciChartSurface }) => {
        assertType<TExact<typeof sciChartSurface, SciChartPieSurface>>();
    }}
/>

<SciChartDeclarative
    config={{ type: ESciChartSurfaceType.Polar2D, options: {} }}
    onInit={({ sciChartSurface }) => {
        assertType<TExact<typeof sciChartSurface, SciChartPolarSurface>>();
    }}
/>

<SciChartDeclarative
    config={{ type: ESciChartSurfaceType.Default2D, options: {} }}
    onInit={({ sciChartSurface }) => {
        assertType<TExact<typeof sciChartSurface, SciChartSurface>>();
    }}
/>

<SciChartDeclarative
    config={{}}
    onRendered={({ sciChartSurface }) => {
        assertType<TExact<typeof sciChartSurface, SciChartSurface>>();
    }}
/>

<SciChartDeclarative
    config={jsonConfig}
    onDelete={({ sciChartSurface }) => {
        assertType<TExact<typeof sciChartSurface, ISciChartSurfaceBase>>();
    }}
/>

<SciChartDeclarative
    config={{ type: ESciChartSurfaceType.Default3D, options: {} }}
    onInit={({ sciChartSurface }) => {
        void sciChartSurface.camera.position;
        // @ts-expect-error 2D axes do not exist on a 3D surface
        void sciChartSurface.xAxes;
    }}
/>
