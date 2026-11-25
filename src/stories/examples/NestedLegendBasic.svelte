<script lang="ts">
    import { SciChartSvelte, SciChartNestedLegend } from "#lib";
    import { chartStyle, initMountainChart } from "./mountainChart.js";
</script>

<SciChartSvelte initChart={initMountainChart} style={chartStyle} innerContainerProps={{ style: "height: 80%;" }}>
    <!-- the legend draws into its own div, here a strip below the chart -->
    <SciChartNestedLegend style="height: 20%; background: #1c1c1e;" />
</SciChartSvelte>
