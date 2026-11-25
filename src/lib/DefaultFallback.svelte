<!--
@component
SciChart's own loading animation, shown over a chart until it is initialized when no `fallback` snippet is given.
-->
<script lang="ts">
    import { DefaultSciChartLoader, SciChartSurfaceBase } from "scichart";
    import { defaultFallbackStyle } from "./fallbackStyles.js";

    let rootElement: HTMLDivElement;

    // effects never run during server-side rendering, so SciChart is only touched in the browser
    $effect(() => {
        const element = rootElement;
        element.style.background = SciChartSurfaceBase.DEFAULT_THEME.sciChartBackground;

        const loader = new DefaultSciChartLoader();
        const loaderDiv = loader.addChartLoader(element, SciChartSurfaceBase.DEFAULT_THEME);

        return () => {
            loader.removeChartLoader(element, loaderDiv);
        };
    });
</script>

<div bind:this={rootElement} style={defaultFallbackStyle}></div>
