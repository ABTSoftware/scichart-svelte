<script lang="ts">
    // Server-renders every component (tests/ssr.spec.ts): the server must send the fallbacks and no chart,
    // without calling SciChart, and the browser then creates the charts as usual.
    import {
        ChartGroupLoader,
        DefaultFallback,
        SciChartDeclarative,
        SciChartGroup,
        SciChartNestedLegend,
        SciChartNestedOverview,
        SciChartSvelte
    } from "#lib";
    import { NumericAxis, SciChartSurface } from "scichart";

    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
        return { sciChartSurface };
    };
</script>

<div style="position: relative; width: 400px; height: 100px;"><DefaultFallback /></div>

<SciChartSvelte {initChart} id="ssr-chart" style="width: 400px; height: 200px;">
    {#snippet fallback()}<div id="ssr-fallback">Loading...</div>{/snippet}
    <SciChartNestedOverview style="height: 50px;" />
    <SciChartNestedLegend />
</SciChartSvelte>

<ChartGroupLoader id="ssr-group" style="width: 400px;">
    <SciChartDeclarative id="ssr-declarative" config={{}} style="width: 400px; height: 200px;" />
</ChartGroupLoader>

<SciChartGroup>
    <SciChartSvelte {initChart} id="ssr-grouped-chart" style="width: 400px; height: 200px;" />
</SciChartGroup>
