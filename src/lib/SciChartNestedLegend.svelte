<!--
@component
@experimental This is a draft version of the component. Recommended to use only as a reference.

Places an external-placement legend for the chart of the enclosing `SciChartSvelte`: adds a `LegendModifier`
to the surface, drawing into this component's div. Render it as a child of a chart component.
Any other attribute goes to the div.
-->
<script lang="ts">
    import { untrack } from "svelte";
    import { LegendModifier } from "scichart";
    import type { SciChartSurface } from "scichart";
    import type { ISciChartNestedLegendProps } from "./legendTypes.js";
    import type { IInitResult } from "./types.js";
    import { getSciChartSurface } from "./SciChartSurfaceContext.js";

    let { options, ...divProps }: ISciChartNestedLegendProps = $props();

    const surfaceContext = getSciChartSurface<IInitResult<SciChartSurface>>();

    let legendPlacementDiv: HTMLDivElement;

    // re-created only when the parent surface changes
    $effect(() => {
        const parentSurface = surfaceContext.current?.sciChartSurface;

        if (!parentSurface) {
            return;
        }

        const legendModifier = untrack(() => new LegendModifier({ ...options, placementDivId: legendPlacementDiv }));

        parentSurface.chartModifiers.add(legendModifier);

        return () => {
            parentSurface.chartModifiers.remove(legendModifier, true);
        };
    });
</script>

<div {...divProps} bind:this={legendPlacementDiv}></div>
