<!-- Logs whether the Surface Context holds the chart's init result when this child mounts -->
<script lang="ts">
    import { getSciChartSurface } from "#lib";
    import { log } from "./lifecycleLog.js";

    let { name }: { name: string } = $props();

    const surface = getSciChartSurface();

    $effect(() => {
        log(`${name} context ${surface.current?.sciChartSurface ? "has surface" : "empty"}`);
    });
</script>

<div data-testid="child">child</div>
