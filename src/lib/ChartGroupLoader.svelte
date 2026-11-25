<!--
@component
Hides its content behind one shared fallback until every chart within it is initialized.
Any other attribute goes to its div.
-->
<script lang="ts">
    import type { IInitResult } from "./types.js";
    import type { TChartGroupLoaderProps } from "./groupTypes.js";
    import SciChartGroup from "./SciChartGroup.svelte";
    import DefaultFallback from "./DefaultFallback.svelte";
    import { groupFallbackWrapperStyle } from "./fallbackStyles.js";
    import { defaultGroupStateClassNames } from "./stateClassNames.js";
    import { getStateClassNames, mergeStyle } from "./utils.js";

    let {
        fallback,
        children,
        onInit,
        onRendered,
        onInitError,
        stateClassNames,
        class: className,
        style,
        ...divProps
    }: TChartGroupLoaderProps = $props();

    let isInitialized = $state(false);
    let isRendered = $state(false);

    const stateClasses = $derived(
        getStateClassNames({ isInitialized, isRendered }, stateClassNames, defaultGroupStateClassNames)
    );
</script>

<SciChartGroup
    onInit={(chartInitResults: IInitResult[]) => {
        onInit?.(chartInitResults);
        isInitialized = true;
    }}
    onRendered={(chartInitResults: IInitResult[]) => {
        onRendered?.(chartInitResults);
        isRendered = true;
    }}
    {onInitError}
>
    <!-- the fallback below is absolutely positioned and must resolve against this element, so it needs a
         positioned ancestor here. A caller's own position wins, since their style comes last. -->
    <div {...divProps} class={[className, stateClasses]} style={mergeStyle("position: relative;", style)}>
        {@render children?.()}
        <!-- both branches are wrapped, so the default overlay is layered above the per-chart overlays
             exactly as a custom one is -->
        {#if !isInitialized}
            <div style={groupFallbackWrapperStyle}>
                {#if fallback}
                    {@render fallback()}
                {:else}
                    <DefaultFallback />
                {/if}
            </div>
        {/if}
    </div>
</SciChartGroup>
