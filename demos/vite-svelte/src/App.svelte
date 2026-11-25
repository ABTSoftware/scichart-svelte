<script lang="ts">
    import {
        EAxisType,
        ESeriesType,
        FastLineRenderableSeries,
        NumericAxis,
        SciChartSurface,
        XyDataSeries
    } from "scichart";
    import { ChartGroupLoader, SciChartDeclarative, SciChartSvelte } from "scichart-svelte";

    // wasm comes from public/ (npm run copyWasm), at the "/scichart.wasm" default scichart-svelte applies

    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

        const dataSeries = new XyDataSeries(wasmContext, { fifoCapacity: 200 });
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: "#50C7E0" })
        );

        let x = 0;
        const appendPoint = () => dataSeries.append(x++, Math.sin(x / 10));

        return { sciChartSurface, appendPoint };
    };

    let initMs = $state<number | null>(null);
    const startedAt = performance.now();
</script>

<main>
    <h1>scichart-svelte on Vite</h1>
    <p>Both charts sit in one <code>ChartGroupLoader</code>: one loader until both are initialized.</p>
    {#if initMs !== null}<p id="group-ready">Group initialized after {initMs} ms</p>{/if}

    <ChartGroupLoader
        style="display: flex; gap: 8px;"
        onInit={() => (initMs = Math.round(performance.now() - startedAt))}
    >
        <SciChartSvelte
            {initChart}
            style="flex: 1; height: 300px;"
            onInit={initResult => {
                // streams while mounted; the returned cleanup stops it
                const timer = setInterval(initResult.appendPoint, 20);
                return () => clearInterval(timer);
            }}
        />
        <SciChartDeclarative
            style="flex: 1; height: 300px;"
            config={{
                xAxes: [{ type: EAxisType.NumericAxis }],
                yAxes: [{ type: EAxisType.NumericAxis }],
                series: [
                    {
                        type: ESeriesType.SplineMountainSeries,
                        options: { fill: "#3ca832", stroke: "#eb911c", strokeThickness: 4, opacity: 0.4 },
                        xyData: { xValues: [1, 2, 3, 4], yValues: [1, 4, 7, 3] }
                    }
                ]
            }}
        />
    </ChartGroupLoader>
</main>

<style>
    main {
        font-family: sans-serif;
        max-width: 1000px;
        margin: 0 auto;
    }
</style>
