<script lang="ts">
    import { getSciChartSurface, type IInitResult } from "#lib";

    // the init result of the enclosing chart, which also carries the theme toggle
    const surface = getSciChartSurface<IInitResult & { toggleChartTheme: () => void }>();
</script>

<input type="button" onclick={() => surface.current?.toggleChartTheme()} value="Toggle Chart Theme" />
