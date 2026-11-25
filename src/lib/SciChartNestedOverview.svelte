<!--
@component
Creates a `SciChartOverview` for the chart of the enclosing `SciChartSvelte` or `SciChartDeclarative`.
Render it as a child of that component. Accepts every prop of a chart component except `initChart`,
plus the overview `options`.
-->
<script lang="ts">
    import { untrack } from "svelte";
    import { SciChartOverview } from "scichart";
    import type { IOverviewOptions, SciChartSurface } from "scichart";
    import type { IChartComponentPropsCore, IInitResult } from "./types.js";
    import { getSciChartSurface } from "./SciChartSurfaceContext.js";
    import SciChartSvelte from "./SciChartSvelte.svelte";

    let {
        options,
        onDelete,
        ...chartComponentProps
    }: IChartComponentPropsCore<SciChartSurface, IInitResult<SciChartSurface>> & { options?: IOverviewOptions } =
        $props();

    const surfaceContext = getSciChartSurface<IInitResult<SciChartSurface>>();
    const parentSurface = $derived(surfaceContext.current?.sciChartSurface);

    let overview: SciChartOverview | null = null;

    const initChart = async (divElementId: string | HTMLDivElement): Promise<IInitResult<SciChartSurface>> => {
        const { surface, overviewOptions } = untrack(() => ({ surface: parentSurface!, overviewOptions: options }));
        overview = await SciChartOverview.create(surface, divElementId, overviewOptions);
        return { sciChartSurface: overview.overviewSciChartSurface };
    };

    // scichart-react replaces the caller's onDelete here; this component calls it, then deletes the overview
    const handleDelete = (initResult: IInitResult<SciChartSurface>) => {
        onDelete?.(initResult);
        overview?.delete();
        overview = null;
    };
</script>

{#if parentSurface}
    <SciChartSvelte {...chartComponentProps} {initChart} onDelete={handleDelete} />
{/if}
