<script lang="ts">
    import { SciChartSvelte } from "#lib";
    import { chartStyle, initMountainChart } from "./mountainChart.js";

    // an init that never finishes, so the fallback stays
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const initResult = await initMountainChart(rootElement);
        await new Promise(() => {});
        return initResult;
    };
</script>

<SciChartSvelte {initChart} style={chartStyle}>
    {#snippet fallback()}
        <div
            style="height: 100%; display: flex; align-items: center; justify-content: center; background-color: #242529; font-size: 30px; color: grey;"
        >
            Loading...
        </div>
    {/snippet}
</SciChartSvelte>
