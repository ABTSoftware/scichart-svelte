import { getContext, hasContext, setContext } from "svelte";
import type { ISciChartSurfaceBase } from "scichart";
import type { IInitResult } from "./types.js";

/** The Surface Context: what a chart component exposes to its descendants */
export interface ISciChartSurfaceContext<TInitResult extends IInitResult = IInitResult<ISciChartSurfaceBase>> {
    /** the chart's init result, or `null` until the chart is initialized */
    readonly current: TInitResult | null;
}

/**
 * The Svelte context key under which {@link SciChartSvelte} and {@link SciChartDeclarative} provide their
 * {@link ISciChartSurfaceContext}. Read it with {@link getSciChartSurface}.
 */
export const SciChartSurfaceContext: unique symbol = Symbol("SciChartSurfaceContext");

const noSurface: ISciChartSurfaceContext<never> = Object.freeze({ current: null });

/**
 * Reads the init result of the closest enclosing chart component. Call it during component initialisation.
 * @returns a reactive holder whose `current` is the init result, or `null` until the chart is initialized
 * or outside any chart component
 */
export function getSciChartSurface<
    TInitResult extends IInitResult = IInitResult<ISciChartSurfaceBase>
>(): ISciChartSurfaceContext<TInitResult> {
    return hasContext(SciChartSurfaceContext)
        ? getContext<ISciChartSurfaceContext<TInitResult>>(SciChartSurfaceContext)
        : noSurface;
}

/** @ignore */
export function setSciChartSurface(context: ISciChartSurfaceContext): void {
    setContext(SciChartSurfaceContext, context);
}
