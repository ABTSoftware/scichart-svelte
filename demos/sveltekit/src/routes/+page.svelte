<script lang="ts">
    import { EAxisType, ESeriesType, ESciChartSurfaceType } from "scichart";
    import { SciChartDeclarative } from "scichart-svelte";
    import LineChart from "./LineChart.svelte";
</script>

<svelte:head>
    <title>scichart-svelte on SvelteKit</title>
</svelte:head>

<main>
    <h1>scichart-svelte on SvelteKit</h1>
    <p>
        This page is server-rendered: the HTML carries the chart elements and their fallbacks, and the charts are
        created after hydration. Nothing calls SciChart on the server.
    </p>

    <LineChart />

    <SciChartDeclarative
        style="height: 300px;"
        config={{
            type: ESciChartSurfaceType.Default2D,
            xAxes: [{ type: EAxisType.NumericAxis }],
            yAxes: [{ type: EAxisType.NumericAxis }],
            series: [
                {
                    type: ESeriesType.ColumnSeries,
                    options: { fill: "#50C7E0", dataPointWidth: 0.6 },
                    xyData: { xValues: [1, 2, 3, 4, 5], yValues: [3, 5, 2, 6, 4] }
                }
            ]
        }}
        onInit={({ sciChartSurface }) => {
            // inferred from the config's type: a 2D SciChartSurface
            sciChartSurface.title = "Declarative column chart";
        }}
    >
        {#snippet fallback()}<div class="loading">Loading the column chart...</div>{/snippet}
    </SciChartDeclarative>
</main>

<style>
    main {
        font-family: sans-serif;
        max-width: 900px;
        margin: 0 auto;
        display: grid;
        gap: 12px;
    }

    .loading {
        height: 100%;
        display: grid;
        place-items: center;
        background: #242529;
        color: grey;
    }
</style>
