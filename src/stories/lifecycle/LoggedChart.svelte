<!-- A chart that logs every lifecycle step, with an "Unmount" button -->
<script lang="ts">
    import type { IInitResult } from "#lib";
    import { SciChartSvelte } from "#lib";
    import { chartStyle, createLineSurface, log, type TCreateSurface } from "./lifecycleLog.js";

    let {
        createSurface = createLineSurface,
        delayInit = false,
        noDestructor = false,
        initChartThrows = false,
        onInitThrows = false,
        noOnInitError = false
    }: {
        createSurface?: TCreateSurface;
        /** init waits for the "Finish init" button */
        delayInit?: boolean;
        noDestructor?: boolean;
        initChartThrows?: boolean;
        onInitThrows?: boolean;
        /** leaves out onInitError, so init errors are unhandled */
        noOnInitError?: boolean;
    } = $props();

    let mounted = $state(true);
    let finishInit: (() => void) | undefined;

    const initChart = async (rootElement: string | HTMLDivElement): Promise<IInitResult> => {
        log("initChart");

        if (initChartThrows) {
            throw new Error("initChart failed");
        }

        const sciChartSurface = await createSurface(rootElement);
        sciChartSurface.addDeletable({ delete: () => log("surface deleted") });

        if (delayInit) {
            await new Promise<void>(resolve => (finishInit = resolve));
        }

        log("initChart resolved");

        return noDestructor ? { sciChartSurface } : { sciChartSurface, destructor: () => log("destructor") };
    };
</script>

<div>
    <button onclick={() => (mounted = false)}>Unmount</button>
    {#if delayInit}
        <button onclick={() => finishInit?.()}>Finish init</button>
    {/if}
    {#if mounted}
        <SciChartSvelte
            {initChart}
            style={chartStyle}
            onInit={({ sciChartSurface }) => {
                window.lifecycleManagedExternally = (
                    sciChartSurface as typeof sciChartSurface & { isLifecycleManagedExternally?: boolean }
                ).isLifecycleManagedExternally;
                log("onInit");

                if (onInitThrows) {
                    throw new Error("onInit failed");
                }

                return () => log("onInit cleanup");
            }}
            onInitError={noOnInitError ? undefined : () => log("onInitError")}
            onRendered={() => {
                log("onRendered");
                return () => log("onRendered cleanup");
            }}
            onDelete={() => log("onDelete")}
        >
            {#snippet fallback()}
                <div data-testid="fallback">Loading...</div>
            {/snippet}
            <div data-testid="child">child</div>
        </SciChartSvelte>
    {/if}
</div>
