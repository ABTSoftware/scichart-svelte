<script lang="ts">
    import { SciChartSvelte } from "#lib";
    import { chartStyle, initMountainChart } from "./mountainChart.js";
</script>

<SciChartSvelte initChart={initMountainChart} style={chartStyle} />
