import {
    EAutoRange,
    EAxisType,
    EThemeProviderType,
    FastLineRenderableSeries,
    NumberRange,
    XyDataSeries,
    build2DChart
} from "scichart";

const generateData = (offset: number) => {
    const xValues = Array.from(Array(20).keys()).map(x => x + offset);
    const yValues = xValues.map(() => Math.abs(Math.random() * 10));
    return { xValues, yValues };
};

/** A line chart whose data arrives after a simulated fetch; `updateData` appends more */
export const initStreamingLineChart = async (rootElement: string | HTMLDivElement) => {
    const createChart = async () => {
        // for demonstration purposes, the Builder API is used explicitly here
        const { sciChartSurface } = await build2DChart(rootElement, {
            xAxes: {
                type: EAxisType.NumericAxis,
                options: { autoRange: EAutoRange.Always, growBy: new NumberRange(0.2, 0.2) }
            },
            yAxes: { type: EAxisType.NumericAxis, options: { autoRange: EAutoRange.Always } },
            surface: {
                theme: { type: EThemeProviderType.Dark },
                title: "Line Chart",
                titleStyle: { fontSize: 20 }
            }
        });

        return sciChartSurface;
    };

    // a function that simulates an async data fetching
    const getData = async (offset: number = 0) => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return generateData(offset);
    };

    const [sciChartSurface, data] = await Promise.all([createChart(), getData()]);

    const wasmContext = sciChartSurface.webAssemblyContext2D;
    const dataSeries = new XyDataSeries(wasmContext, { fifoCapacity: 100, ...data });
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, { dataSeries, strokeThickness: 4, stroke: "#216939" })
    );

    let lastX = data.xValues.length;
    const updateData = () => {
        const { xValues, yValues } = generateData(lastX);
        dataSeries.appendRange(xValues, yValues);
        lastX += xValues.length;
    };

    return { sciChartSurface, updateData };
};
