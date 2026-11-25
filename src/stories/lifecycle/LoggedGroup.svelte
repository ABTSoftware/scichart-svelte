<!-- A chart group that logs its callbacks; with `onInitThrows`, its chart's onInit throws -->
<script lang="ts">
    import { ChartGroupLoader, SciChartSvelte } from "#lib";
    import { chartStyle, createLineSurface, log } from "./lifecycleLog.js";

    let { onInitThrows = false }: { onInitThrows?: boolean } = $props();
</script>

<ChartGroupLoader
    onInit={() => log("group onInit")}
    onRendered={() => log("group onRendered")}
    onInitError={() => log("group onInitError")}
>
    {#snippet fallback()}
        <div data-testid="fallback">Loading...</div>
    {/snippet}
    <SciChartSvelte
        initChart={async rootElement => {
            const sciChartSurface = await createLineSurface(rootElement);
            sciChartSurface.addDeletable({ delete: () => log("surface deleted") });

            return { sciChartSurface, destructor: () => log("destructor") };
        }}
        onInit={() => {
            log("onInit");

            if (onInitThrows) {
                throw new Error("onInit failed");
            }
        }}
        style={chartStyle}
    >
        <div data-testid="child">child</div>
    </SciChartSvelte>
</ChartGroupLoader>
