<script lang="ts">
    import { SciChartDeclarative, SciChartNestedOverview } from "#lib";
    import { chartStyle } from "./mountainChart.js";
    import { mountainConfig } from "./mountainConfig.js";
</script>

<SciChartDeclarative config={mountainConfig} style={chartStyle} innerContainerProps={{ style: "height: 80%;" }}>
    <SciChartNestedOverview style="height: 20%;" />
</SciChartDeclarative>
