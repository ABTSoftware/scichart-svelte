<script lang="ts">
    // Drives tests/memory-leak.spec.ts: a ChartGroupLoader with two 2D charts and a 3D chart behind the
    // memory-debug wrapper. The page must not log chart objects: the console keeps them alive while
    // Playwright is attached. It is server-rendered like any SvelteKit page, so it also shows the components
    // stay off SciChart during SSR.
    import { SciChartDefaults } from "scichart";
    import {
        ChartGroupLoader,
        SciChartMemoryDebugWrapper,
        SciChartSvelte,
        type IInitResult,
        type TResolvedReturnType
    } from "#lib";
    import { initStreamingLineChart } from "../../examples/lineChart.js";
    import { initSurface3DChart } from "../../examples/surface3DChart.js";

    SciChartDefaults.performanceWarnings = false;

    type TLineChartInitResult = TResolvedReturnType<typeof initStreamingLineChart>;
</script>

{#snippet fallbackText(text: string)}
    <div class="fallback"><div>{text}</div></div>
{/snippet}

<SciChartMemoryDebugWrapper>
    <div class="App">
        <ChartGroupLoader
            onInit={(initResults: IInitResult[]) => console.log("Group onInit", initResults.length, "charts")}
            onInitError={(error: unknown) => console.log("Group error", String(error))}
        >
            <SciChartSvelte
                style="width: 600px; height: 300px;"
                initChart={initStreamingLineChart}
                onInit={(initResult: TLineChartInitResult) => {
                    const token = setInterval(initResult.updateData, 500);
                    return () => clearInterval(token);
                }}
            >
                {#snippet fallback()}{@render fallbackText(
                        "Data fetching & Chart Initialization in progress"
                    )}{/snippet}
            </SciChartSvelte>
            <hr />
            <SciChartSvelte style="width: 600px; height: 300px;" initChart={initStreamingLineChart} />
            <hr />
            <SciChartSvelte style="width: 600px; height: 300px;" initChart={initSurface3DChart}>
                {#snippet fallback()}{@render fallbackText("3D Chart Initialization in progress")}{/snippet}
            </SciChartSvelte>
        </ChartGroupLoader>
    </div>
</SciChartMemoryDebugWrapper>

<style>
    .App {
        font-family: sans-serif;
        text-align: center;
    }

    .fallback {
        display: flex;
        align-items: center;
        background-color: #242529;
        width: 100%;
        height: 300px;
        font-size: 30px;
        color: grey;
    }

    .fallback > div {
        flex: auto;
    }
</style>
