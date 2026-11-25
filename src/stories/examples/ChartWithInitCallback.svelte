<script lang="ts">
    import {
        EAutoRange,
        MountainAnimation,
        NumberRange,
        NumericAxis,
        SciChartSurface,
        SplineMountainRenderableSeries,
        XyDataSeries,
        easing
    } from "scichart";
    import { SciChartSvelte } from "#lib";
    import { chartStyle } from "./mountainChart.js";

    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, { autoRange: EAutoRange.Never, visibleRange: new NumberRange(0, 9) })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { autoRange: EAutoRange.Never, visibleRange: new NumberRange(0, 12) })
        );

        const mountainSeries = new SplineMountainRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                yValues: [1, 4, 7, 3, 7, 6, 7, 4, 2, 5]
            }),
            fill: "#3ca832",
            stroke: "#eb911c",
            strokeThickness: 4,
            opacity: 0.4
        });

        sciChartSurface.renderableSeries.add(mountainSeries);

        const animationSeries = new XyDataSeries(wasmContext);
        sciChartSurface.addDeletable(animationSeries);

        const updatePoints = () => {
            const xValues = Array.from({ length: 10 }, (_, j) => j);
            const yValues = xValues.map(() => Math.random() * 10 + 1);

            animationSeries.clear();
            animationSeries.appendRange(xValues, yValues);

            mountainSeries.runAnimation(
                new MountainAnimation({ duration: 300, ease: easing.outQuad, dataSeries: animationSeries })
            );
        };

        return { sciChartSurface, updatePoints };
    };
</script>

<!-- onInit returns its cleanup: the interval stops when the chart is deleted -->
<SciChartSvelte
    {initChart}
    onInit={initResult => {
        const timerId = setInterval(initResult.updatePoints, 400);
        return () => clearInterval(timerId);
    }}
    style={chartStyle}
/>
