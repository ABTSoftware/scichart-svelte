<!--
Mounts LoggedChart with Svelte's imperative `mount()` and removes it with `unmount()`, the API a non-Svelte host
(e.g. a React or plain-DOM page) uses: the counterpart of scichart-react's legacy-root story
-->
<script lang="ts">
    import { mount, unmount } from "svelte";
    import LoggedChart from "./LoggedChart.svelte";

    let container: HTMLDivElement;

    $effect(() => {
        const chart = mount(LoggedChart, { target: container });

        return () => {
            void unmount(chart);
        };
    });
</script>

<div bind:this={container}></div>
