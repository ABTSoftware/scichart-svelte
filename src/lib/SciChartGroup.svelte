<!--
@component
Provides a common context for multiple chart components at any depth beneath it.
Accepts callbacks used after all charts within the group are initialized, after they have also rendered,
and when they are deleted.
-->
<script lang="ts">
    import { untrack } from "svelte";
    import type { TSciChartGroupProps } from "./groupTypes.js";
    import { SciChartGroupState, getGroupInitResults } from "./groupState.svelte.js";
    import { setSciChartGroup } from "./SciChartGroupContext.js";

    let { onInit, onRendered, onDelete, onInitError, children }: TSciChartGroupProps = $props();

    const groupState = new SciChartGroupState(error => {
        if (!onInitError) {
            return false;
        }

        onInitError(error);

        return true;
    });

    setSciChartGroup(groupState);

    // set in the effect that calls onInit, so onRendered waits for the DOM update of whatever onInit changed
    let isInitHandled = $state(false);

    // once per group initialization
    $effect(() => {
        const groupInitialized = groupState.groupInitialized;

        untrack(() => {
            const initResults = getGroupInitResults(groupState.charts);
            const isGroupInitialized = groupInitialized && initResults !== undefined;

            if (onInit && isGroupInitialized) {
                onInit(initResults);
            }

            isInitHandled = isGroupInitialized;
        });
    });

    // once each time every chart within the group has rendered
    $effect(() => {
        const groupRendered = groupState.groupRendered;
        const initHandled = isInitHandled;

        untrack(() => {
            const initResults = getGroupInitResults(groupState.charts);

            if (onRendered && groupRendered && initHandled && initResults) {
                onRendered(initResults);
            }
        });
    });

    // onDelete runs when the group stops being initialized or is destroyed
    $effect(() => {
        const groupInitialized = groupState.groupInitialized;

        return untrack(() => {
            const initResults = getGroupInitResults(groupState.charts);
            const handleDelete = onDelete;

            if (handleDelete && groupInitialized && initResults) {
                return () => {
                    handleDelete(initResults);
                };
            }
        });
    });
</script>

{@render children?.()}
