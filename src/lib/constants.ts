export const wrongInitResultMessage = `"initChart" function should resolve to an object with "sciChartSurface" property ({ sciChartSurface })`;
export const missingInitChartMessage = `SciChartSvelte requires the "initChart" prop. To create a chart from a Builder API config, use the "SciChartDeclarative" component instead.`;
export const configOnInitComponentMessage = `SciChartSvelte does not accept the "config" prop. Use <SciChartDeclarative config={...} /> instead.`;
export const initChartOnDeclarativeMessage = `SciChartDeclarative accepts only the "config" prop. To initialize a chart with a function, use "SciChartSvelte" with the "initChart" prop.`;
export const missingConfigMessage = `SciChartDeclarative requires the "config" prop with a chart definition or configuration object acceptable by SciChart Builder API.`;
