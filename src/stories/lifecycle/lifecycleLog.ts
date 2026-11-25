import { NumericAxis, SciChartPieSurface, SciChartSurface } from "scichart";
import type { ISciChartSurfaceBase } from "scichart";

/**
 * Helpers for the stories of tests/lifecycle-callbacks.spec.ts. Each lifecycle step is logged to
 * `window.lifecycleLog`, with whether the fallback and the children were in the DOM at that moment
 */

/** One logged lifecycle step */
export type TLifecycleEntry = { step: string; fallbackShown: boolean; childMounted: boolean };

declare global {
    interface Window {
        lifecycleLog: TLifecycleEntry[];
        /** the surface's `isLifecycleManagedExternally` flag, read in `onInit` */
        lifecycleManagedExternally?: boolean;
    }
}

const isInDom = (testId: string): boolean => document.querySelector(`[data-testid="${testId}"]`) !== null;

export const log = (step: string): void => {
    window.lifecycleLog ??= [];
    window.lifecycleLog.push({ step, fallbackShown: isInDom("fallback"), childMounted: isInDom("child") });
};

export type TCreateSurface = (rootElement: string | HTMLDivElement) => Promise<ISciChartSurfaceBase>;

export const createLineSurface: TCreateSurface = async rootElement => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    return sciChartSurface;
};

/** An empty pie surface never renders */
export const createEmptyPieSurface: TCreateSurface = rootElement => SciChartPieSurface.create(rootElement);

export const chartStyle = "width: 400px; height: 200px;";
