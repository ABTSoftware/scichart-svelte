<script lang="ts">
    import { SciChartSvelte } from "#lib";
    import { chartStyle, initMountainChart } from "./mountainChart.js";
    import ToggleThemeButton from "./ToggleThemeButton.svelte";
</script>

<SciChartSvelte initChart={initMountainChart} style={chartStyle} innerContainerProps={{ style: "height: 80%;" }}>
    <!-- rendered only once the surface is initialized, with its init result in the Surface Context -->
    <ToggleThemeButton />
</SciChartSvelte>
