import type { ILegendModifierOptions } from "scichart";
import type { TDivProps } from "./types.js";

/** Props for {@link SciChartNestedLegend}: the legend options, plus the attributes of the div it is placed in */
export interface ISciChartNestedLegendProps extends Omit<TDivProps, "children"> {
    options?: Omit<ILegendModifierOptions, "placementDivId">;
}
