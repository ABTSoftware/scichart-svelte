import { untrack } from "svelte";
import { generateGuid } from "scichart";
import type { ISciChartSurfaceBase, SciChartSurfaceBase } from "scichart";
import { getSciChartGroup } from "./SciChartGroupContext.js";
import type { IInitResult, TChartComponentPropsWithInit, TCleanupCallback } from "./types.js";
import { createChartRoot, waitForFirstRender } from "./utils.js";
import { wrongInitResultMessage } from "./constants.js";

/** @ignore */
export type TChartLifecycleOptions<
    TSurface extends ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface>
> = Pick<
    TChartComponentPropsWithInit<TSurface, TInitResult>,
    "initChart" | "onInit" | "onRendered" | "onDelete" | "onInitError"
>;

function validateResult<TSurface extends ISciChartSurfaceBase, TInitResult extends IInitResult<TSurface>>(
    result: TInitResult
): TInitResult {
    if (!result?.sciChartSurface) {
        throw new Error(wrongInitResultMessage);
    }
    markLifecycleManagedExternally(result.sciChartSurface);
    return result;
}

/**
 * This component removes the chart root before the async delete and may delete a surface twice
 * (e.g. the nested overview), so the matching memory-debug warnings are expected noise here.
 */
function markLifecycleManagedExternally(surface: ISciChartSurfaceBase): void {
    // The flag lives on SciChartSurfaceBase; the ISciChartSurfaceBase interface does not expose it.
    (
        surface as ISciChartSurfaceBase & Pick<SciChartSurfaceBase, "isLifecycleManagedExternally">
    ).isLifecycleManagedExternally = true;
}

/**
 * Creates a chart in {@link ChartLifecycle.innerContainer} once the component is mounted and deletes it once
 * the component is destroyed, registering it with the enclosing group, if any.
 *
 * The port of scichart-react's `useChartLifecycle`: construct it during component initialisation, bind the
 * element the chart is created in to `innerContainer` (`bind:this`), and read the reactive state.
 * Callbacks are read from `getOptions` when they are called, so the latest props are used.
 * @ignore
 */
export class ChartLifecycle<TSurface extends ISciChartSurfaceBase, TInitResult extends IInitResult<TSurface>> {
    /** the element the chart is created in; must be bound before the component mounts */
    innerContainer: HTMLDivElement | undefined = undefined;
    /** the init result, or `null` until the chart is initialized. Never deeply reactive: SciChart objects must not be proxied */
    initResult: TInitResult | null = $state.raw(null);
    /** `true` once the init function has resolved, until the chart is deleted */
    isInitialized = $state(false);
    /** `true` once the chart is initialized and has rendered at least once, until the chart is deleted */
    isRendered = $state(false);

    /** the init result, set before `onInit` runs, unlike the reactive {@link initResult} */
    #initResult: TInitResult | null = null;
    #renderedCleanup: TCleanupCallback | void = undefined;

    constructor(getOptions: () => TChartLifecycleOptions<TSurface, TInitResult>) {
        const groupContext = getSciChartGroup();

        // runs once per component instance: nothing it reads is tracked
        $effect(() => untrack(() => this.#mount(getOptions, groupContext)));

        // runs onRendered once the fallback is removed and the children are mounted
        $effect(() => {
            if (!this.isInitialized || !this.isRendered) {
                return;
            }

            untrack(() => {
                const initResult = this.#initResult;

                if (initResult) {
                    this.#renderedCleanup = getOptions().onRendered?.(initResult);
                }
            });
        });
    }

    #mount(
        getOptions: () => TChartLifecycleOptions<TSurface, TInitResult>,
        groupContext: ReturnType<typeof getSciChartGroup>
    ): () => void {
        const chartId = generateGuid();
        groupContext?.addChartToGroup(chartId, false, null);

        const rootElement = this.innerContainer!;

        const chartRoot = createChartRoot();
        rootElement.appendChild(chartRoot);

        let isMounted = true;
        let cancelled = false;
        // the props as they were when the component was destroyed; callbacks that run later use them
        let lastOptions: TChartLifecycleOptions<TSurface, TInitResult> | undefined;
        const options = () => lastOptions ?? getOptions();
        let cleanupCallback: TCleanupCallback | void;
        let stopWaitingForRender: (() => void) | undefined;

        const runInit = async (): Promise<TInitResult | undefined> => {
            try {
                const result = validateResult<TSurface, TInitResult>(await options().initChart(chartRoot));

                // check if the component was destroyed before init finished
                if (isMounted) {
                    this.#initResult = result;

                    // called before the state updates below, so it runs before the fallback is removed
                    const { onInit } = options();

                    if (onInit) {
                        cleanupCallback = onInit(result);
                    }

                    groupContext?.addChartToGroup(chartId, true, result);
                    this.initResult = result;
                    this.isInitialized = true;

                    stopWaitingForRender = waitForFirstRender(result.sciChartSurface, () => {
                        this.isRendered = true;
                        groupContext?.setChartRendered(chartId);
                    });
                } else {
                    cancelled = true;
                }

                return result;
            } catch (error: any) {
                const initResult = this.#initResult;

                // onInit threw: the surface exists, so it is deleted as a failed init
                if (initResult) {
                    this.#initResult = null;

                    if (typeof initResult.destructor === "function") {
                        initResult.destructor();
                    }

                    initResult.sciChartSurface!.delete();
                }

                const { onInitError } = options();

                if (onInitError) {
                    onInitError(error);
                }

                const isHandledByGroup = groupContext?.notifyError(error) ?? false;

                // leave an unhandled error visible unless an onInitError handled it
                if (!onInitError && !isHandledByGroup) {
                    throw error;
                }

                return undefined;
            }
        };

        const initPromise = runInit();

        const performCleanup = (initResult: TInitResult) => {
            stopWaitingForRender?.();

            if (!cancelled && this.#renderedCleanup) {
                this.#renderedCleanup();
                this.#renderedCleanup = undefined;
            }

            if (!cancelled && cleanupCallback) {
                cleanupCallback();
                cleanupCallback = undefined;
            }

            if (!cancelled) {
                options().onDelete?.(initResult);
            }

            // runs whether or not the component was destroyed before init finished
            if (typeof initResult.destructor === "function") {
                initResult.destructor();
            }

            // the component is gone, so its reactive state is not reset (scichart-react resets it only
            // while mounted, which a Svelte component never is at this point)
            this.#initResult = null;

            groupContext?.removeChartFromGroup(chartId);
            initResult.sciChartSurface!.delete();
        };

        return () => {
            isMounted = false;
            lastOptions = getOptions();
            chartRoot.remove();
            // wait for init to finish before deleting it; a failed init has nothing left to delete
            initPromise.then(
                result => result && performCleanup(result),
                () => undefined
            );
        };
    }
}
