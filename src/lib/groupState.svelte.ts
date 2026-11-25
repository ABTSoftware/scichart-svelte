import type { ISciChartGroupContext, TGroupChartState } from "./SciChartGroupContext.js";
import type { IInitResult } from "./types.js";

/**
 * The state of a {@link SciChartGroup}: every chart registered with it, and the group state derived from them.
 * The chart map is replaced, never mutated, so the derived flags follow each change.
 * @ignore
 */
export class SciChartGroupState implements ISciChartGroupContext {
    // a plain Map in $state.raw, not a SvelteMap: it is replaced on every change, and never deeply reactive
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    charts: ReadonlyMap<unknown, TGroupChartState> = $state.raw(new Map());

    groupInitialized: boolean = $derived(
        this.charts.size > 0 && Array.from(this.charts.values()).every(({ isInitialized }) => isInitialized)
    );

    groupRendered: boolean = $derived(
        this.groupInitialized && Array.from(this.charts.values()).every(({ isRendered }) => isRendered)
    );

    readonly #notifyError: (error: any) => boolean;

    constructor(notifyError: (error: any) => boolean) {
        this.#notifyError = notifyError;
    }

    addChartToGroup = (chart: unknown, isInitialized: boolean, initResult: IInitResult | null): void => {
        this.#update(charts => charts.set(chart, { isInitialized, isRendered: false, initResult }));
    };

    setChartRendered = (chart: unknown): void => {
        const chartState = this.charts.get(chart);

        if (!chartState) {
            return;
        }

        this.#update(charts => charts.set(chart, { ...chartState, isRendered: true }));
    };

    removeChartFromGroup = (chart: unknown): void => {
        this.#update(charts => charts.delete(chart));
    };

    notifyError = (error: any): boolean => this.#notifyError(error);

    #update(change: (charts: Map<unknown, TGroupChartState>) => void): void {
        // eslint-disable-next-line svelte/prefer-svelte-reactivity -- a copy, published by the assignment below
        const charts = new Map(this.charts);
        change(charts);
        this.charts = charts;
    }
}

/**
 * Collects the init result of every chart within a group
 * @param charts the state of each chart within the group
 * @returns the init results, or `undefined` while any chart has none
 * @ignore
 */
export function getGroupInitResults(charts: ReadonlyMap<unknown, TGroupChartState>): IInitResult[] | undefined {
    const initResults = Array.from(charts.values()).map(({ initResult }) => initResult);

    if (!initResults.every((initResult): initResult is IInitResult => initResult !== null)) {
        return undefined;
    }

    return initResults;
}
