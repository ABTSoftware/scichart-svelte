<!-- A chart two components below its group, to show any descendant joins the nearest group -->
<script lang="ts">
    import { SciChartSvelte } from "#lib";
    import { chartStyle, createLineSurface } from "./lifecycleLog.js";
    import ContextProbe from "./ContextProbe.svelte";

    let { name }: { name: string } = $props();
</script>

<section>
    <SciChartSvelte initChart={async root => ({ sciChartSurface: await createLineSurface(root) })} style={chartStyle}>
        <ContextProbe {name} />
    </SciChartSvelte>
</section>
