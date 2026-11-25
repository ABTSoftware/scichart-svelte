<!-- A SciChartGroup with charts at different depths, logging the group callbacks, with an "Unmount" button -->
<script lang="ts">
    import { SciChartGroup } from "#lib";
    import { log } from "./lifecycleLog.js";
    import DeepChart from "./DeepChart.svelte";

    let mounted = $state(true);
</script>

<button onclick={() => (mounted = false)}>Unmount</button>
{#if mounted}
    <SciChartGroup
        onInit={initResults => log(`group onInit ${initResults.length}`)}
        onRendered={initResults => log(`group onRendered ${initResults.length}`)}
        onDelete={initResults => log(`group onDelete ${initResults.length}`)}
    >
        <div>
            <DeepChart name="first" />
            <div><DeepChart name="second" /></div>
        </div>
    </SciChartGroup>
{/if}
