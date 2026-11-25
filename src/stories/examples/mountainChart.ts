import {
    MouseWheelZoomModifier,
    NumericAxis,
    SciChartJSDarkTheme,
    SciChartJSLightTheme,
    SciChartSurface,
    SplineMountainRenderableSeries,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier
} from "scichart";

/** The mountain chart most examples draw; resolves with a theme toggle next to the surface */
export const initMountainChart = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    sciChartSurface.renderableSeries.add(
        new SplineMountainRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: [1, 2, 3, 4],
                yValues: [1, 4, 7, 3],
                dataSeriesName: "Mountain series"
            }),
            fill: "#3ca832",
            stroke: "#eb911c",
            strokeThickness: 4,
            opacity: 0.4
        })
    );

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ enableZoom: true }),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier()
    );

    const toggleChartTheme = () => {
        sciChartSurface.applyTheme(
            sciChartSurface.themeProvider.isLightBackground ? new SciChartJSDarkTheme() : new SciChartJSLightTheme()
        );
    };

    return { sciChartSurface, toggleChartTheme };
};

export const chartStyle = "aspect-ratio: 2; min-width: 600px; min-height: 300px;";
