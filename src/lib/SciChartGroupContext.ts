import { getContext, setContext } from "svelte";
import type { IInitResult } from "./types.js";

/** @ignore */
export type TGroupChartState = { isInitialized: boolean; isRendered: boolean; initResult: IInitResult | null };

/** The Group Context: how the chart components within a {@link SciChartGroup} register with it */
export interface ISciChartGroupContext {
    readonly groupInitialized: boolean;
    readonly groupRendered: boolean;
    readonly charts: ReadonlyMap<unknown, TGroupChartState>;
    addChartToGroup: (chart: unknown, isInitialized: boolean, initResult: IInitResult | null) => void;
    setChartRendered: (chart: unknown) => void;
    removeChartFromGroup: (chart: unknown) => void;
    /** passes an init error to the group's `onInitError`; returns whether the group has one */
    notifyError: (error: any) => boolean;
}

/** The Svelte context key under which a {@link SciChartGroup} provides its {@link ISciChartGroupContext} */
export const SciChartGroupContext: unique symbol = Symbol("SciChartGroupContext");

/**
 * Reads the closest enclosing {@link SciChartGroup}. Call it during component initialisation.
 * @returns the group context, or `undefined` outside any group
 */
export function getSciChartGroup(): ISciChartGroupContext | undefined {
    return getContext<ISciChartGroupContext | undefined>(SciChartGroupContext);
}

/** @ignore */
export function setSciChartGroup(context: ISciChartGroupContext): void {
    setContext(SciChartGroupContext, context);
}
