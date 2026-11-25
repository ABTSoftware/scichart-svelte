<script lang="ts">
    import { SciChartSvelte } from "#lib";
    import { initMountainChart } from "./mountainChart.js";
</script>

<!-- attributes other than the component's own props go to the outer div; innerContainerProps to the inner one -->
<SciChartSvelte
    id="styled-chart"
    class="styled-chart"
    initChart={initMountainChart}
    style="aspect-ratio: 2; min-width: 600px; min-height: 300px; box-sizing: border-box; background-color: darkslategrey; padding: 10px;"
    innerContainerProps={{
        id: "styled-chart-inner",
        style: "background-color: darkgrey; box-sizing: border-box; height: 80%; padding: 10px;"
    }}
    stateClassNames={{ initialized: "styled-chart-ready", rendered: "" }}
>
    <!-- rendered only once the surface is initialized -->
    <div style="background: lightgrey; height: 20%; width: 100%; text-align: center;">Nested Component Content</div>
</SciChartSvelte>
