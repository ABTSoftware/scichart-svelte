<script lang="ts">
    import { EColor, GradientParams, PieSegment, Point, SciChartPieSurface } from "scichart";
    import { SciChartSvelte } from "#lib";
    import { chartStyle } from "./mountainChart.js";

    const segment = (color: EColor, text: string, value: number, from: string, to: string) =>
        new PieSegment({
            color,
            value,
            text,
            delta: value,
            colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: from, offset: 0 },
                { color: to, offset: 1 }
            ])
        });

    const initChart = async (rootElement: string | HTMLDivElement) => {
        const sciChartPieSurface = await SciChartPieSurface.create(rootElement);

        const green = segment(EColor.Green, "Green", 10, "#1D976C", "#93F9B9");
        green.radiusAdjustment = 1.2;
        const red = segment(EColor.Red, "Red", 20, "#DD5E89", "#F7BB97");
        red.radiusAdjustment = 0.7;

        sciChartPieSurface.pieSegments.add(
            green,
            red,
            segment(EColor.Blue, "Blue", 30, "#2b2828", "#656565"),
            segment(EColor.Yellow, "Yellow", 40, "#F09819", "#EDDE5D")
        );

        return { sciChartSurface: sciChartPieSurface };
    };
</script>

<SciChartSvelte {initChart} style={chartStyle} />
