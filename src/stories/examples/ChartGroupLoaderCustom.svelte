<script lang="ts">
    import { NumericAxis, SciChartSurface } from "scichart";
    import { ChartGroupLoader, SciChartDeclarative, SciChartSvelte } from "#lib";

    let hasError = $state(false);

    const initFailingChart = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

        await new Promise(resolve => setTimeout(resolve, 2000));

        // an init function that fails: the group's onInitError swaps the loader for an error message
        sciChartSurface.delete();
        throw new Error("Something wrong!");
    };
</script>

<ChartGroupLoader
    style="min-width: 600px; display: flex; position: relative;"
    onInit={initResults => console.log("initialized", initResults.length, "charts")}
    onInitError={() => (hasError = true)}
>
    {#snippet fallback()}
        {#if hasError}
            <div style="background: red; height: 100%; display: flex; justify-content: center;">
                <div style="flex: none; align-self: center; font-size: 1.5em; max-width: 100%; text-align: center;">
                    This is a custom Error Message: An error occurred during initialization!
                </div>
            </div>
        {:else}
            <div
                style="height: 100%; display: flex; align-items: center; justify-content: center; background-color: #242529; font-size: 30px; color: grey;"
            >
                Loading...
            </div>
        {/if}
    {/snippet}
    <SciChartSvelte id="slowLoadingChart" initChart={initFailingChart} style="flex: auto; min-height: 200px;" />
    <SciChartDeclarative config={{}} style="flex: auto; min-height: 200px;" />
    <SciChartDeclarative config={{}} style="flex: auto; min-height: 200px;" />
</ChartGroupLoader>
