<script lang="ts">
    import { NumericAxis, SciChartSurface } from "scichart";
    import { ChartGroupLoader, SciChartDeclarative, SciChartSvelte } from "#lib";

    const initSlowChart = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

        await new Promise(resolve => setTimeout(resolve, 2000));

        return { sciChartSurface };
    };
</script>

<!-- one shared fallback until every chart is initialized -->
<ChartGroupLoader style="min-width: 600px; display: flex;">
    <SciChartSvelte id="slowLoadingChart" initChart={initSlowChart} style="flex: auto; min-height: 200px;" />
    <SciChartDeclarative config={{}} style="flex: auto; min-height: 200px;" />
    <SciChartDeclarative config={{}} style="flex: auto; min-height: 200px;" />
</ChartGroupLoader>
