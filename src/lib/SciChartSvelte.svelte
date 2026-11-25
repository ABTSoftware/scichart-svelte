<!--
@component
The component for rendering a chart surface from an initialization function.
Requires an initialization function passed via `initChart` which should create a surface
on the provided root element and resolve to `{ sciChartSurface }`.

To create a chart from a Builder API config/definition instead, use `SciChartDeclarative`.

- `fallback` snippet: shown over the chart until it is initialized; defaults to `DefaultFallback`
- `children` snippet: rendered once the chart is initialized, with the init result in the Surface Context
- any other attribute goes to the outer div
-->
<script
    lang="ts"
    generics="TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase, TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>"
>
    import "./configureDefaults.js";
    import { untrack } from "svelte";
    import type { ISciChartSurfaceBase } from "scichart";
    import type { IInitResult, TChartComponentPropsWithInit } from "./types.js";
    import { ChartLifecycle } from "./chartLifecycle.svelte.js";
    import { setSciChartSurface } from "./SciChartSurfaceContext.js";
    import { defaultChartStateClassNames } from "./stateClassNames.js";
    import { getStateClassNames, mergeStyle } from "./utils.js";
    import { configOnInitComponentMessage, missingInitChartMessage } from "./constants.js";
    import { fallbackWrapperStyle } from "./fallbackStyles.js";
    import DefaultFallback from "./DefaultFallback.svelte";

    let {
        initChart,
        config,
        fallback,
        children,
        onInit,
        onRendered,
        onDelete,
        onInitError,
        innerContainerProps,
        stateClassNames,
        class: className,
        style,
        ...divElementProps
    }: TChartComponentPropsWithInit<TSurface, TInitResult> = $props();

    untrack(() => {
        if (!initChart) {
            throw new Error(missingInitChartMessage);
        }

        if (config) {
            throw new Error(configOnInitComponentMessage);
        }
    });

    const lifecycle = new ChartLifecycle<TSurface, TInitResult>(() => ({
        initChart,
        onInit,
        onRendered,
        onDelete,
        onInitError
    }));

    setSciChartSurface({
        get current() {
            return lifecycle.initResult;
        }
    });

    const stateClasses = $derived(
        getStateClassNames(
            { isInitialized: lifecycle.isInitialized, isRendered: lifecycle.isRendered },
            stateClassNames,
            defaultChartStateClassNames
        )
    );
</script>

<div {...divElementProps} class={[className, stateClasses]} style={mergeStyle("position: relative;", style)}>
    <div
        {...innerContainerProps}
        style={mergeStyle("height: 100%; width: 100%;", innerContainerProps?.style)}
        bind:this={lifecycle.innerContainer}
    ></div>
    {#if lifecycle.isInitialized}
        {@render children?.()}
    {:else if fallback}
        <div style={fallbackWrapperStyle}>{@render fallback()}</div>
    {:else}
        <DefaultFallback />
    {/if}
</div>
