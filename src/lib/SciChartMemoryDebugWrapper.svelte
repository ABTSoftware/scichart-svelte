<!--
@component
Helps checking memory leaks related to SciChart. Rendering the component enables Memory Debug Mode and adds
extra UI elements to mount/unmount its children and log SciChart's object registry.
See the [Memory Leak Debugging docs](https://www.scichart.com/documentation/js/v6/2d-charts/performance-tips/memory-leak-debugging/).
-->
<script lang="ts">
    import type { Snippet } from "svelte";
    import { MemoryUsageHelper, SciChartSurface } from "scichart";

    let {
        defaultRenderChildren = false,
        children
    }: {
        /** Whether the children are rendered on the first render. Defaults to false */
        defaultRenderChildren?: boolean;
        children?: Snippet;
    } = $props();

    // nothing to debug during server-side rendering
    if (typeof window !== "undefined") {
        MemoryUsageHelper.isMemoryUsageDebugEnabled = true;
        SciChartSurface.autoDisposeWasmContext = true;
        SciChartSurface.wasmContextDisposeTimeout = 0;
    }

    // svelte-ignore state_referenced_locally
    let drawChart = $state(defaultRenderChildren);

    const handleClick = () => {
        // force garbage collection in Chrome if enabled with --js-flags="--expose-gc"
        (window as Window & { gc?: () => void }).gc?.();
        const state = MemoryUsageHelper.objectRegistry.getState();
        console.log("state", state);
    };
</script>

<!-- Sticky rather than fixed, and the children sit outside it: the controls stay in view while the children
     keep their normal flow and sizing. -->
<div style="position: sticky; top: 0; z-index: 20; background: #fff;">
    <input type="checkbox" bind:checked={drawChart} /> Render Child Components Tree
    <br />
    <input type="button" onclick={handleClick} value="Log Object Registry State" />
</div>
{#if drawChart}
    {@render children?.()}
{/if}
