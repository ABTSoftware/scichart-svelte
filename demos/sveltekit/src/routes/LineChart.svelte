<script lang="ts">
    import { FastLineRenderableSeries, NumericAxis, SciChartSurface, XyDataSeries } from "scichart";
    import { SciChartSvelte, SciChartNestedOverview } from "scichart-svelte";

    // only ever called in the browser: the component creates its chart after hydration
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

        const xValues = Array.from({ length: 500 }, (_, i) => i);
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: xValues.map(x => Math.sin(x / 20)) }),
                stroke: "#eb911c"
            })
        );

        return { sciChartSurface };
    };
</script>

<SciChartSvelte {initChart} style="height: 360px;" innerContainerProps={{ style: "height: 80%;" }}>
    <!-- rendered once the chart is initialized -->
    <SciChartNestedOverview style="height: 20%;" />
</SciChartSvelte>
