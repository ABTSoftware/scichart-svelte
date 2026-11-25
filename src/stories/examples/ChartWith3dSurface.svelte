<script lang="ts">
    import { SciChartSvelte } from "#lib";
    import { initSurface3DChart } from "../../examples/surface3DChart.js";
    import { chartStyle } from "./mountainChart.js";
</script>

<SciChartSvelte initChart={initSurface3DChart} style={chartStyle} />
