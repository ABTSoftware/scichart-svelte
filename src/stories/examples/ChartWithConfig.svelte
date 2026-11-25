<script lang="ts">
    import { SciChartDeclarative } from "#lib";
    import { chartStyle } from "./mountainChart.js";
    import { mountainConfig } from "./mountainConfig.js";
</script>

<SciChartDeclarative config={mountainConfig} style={chartStyle} />
