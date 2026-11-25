import type { Meta, StoryObj } from "@storybook/sveltekit";
import { renderComponent } from "./storyHelpers.js";
import { SciChartNestedOverview } from "#lib";
import NestedOverviewBasic from "./examples/NestedOverviewBasic.svelte";
import NestedOverviewBasicSource from "./examples/NestedOverviewBasic.svelte?raw";
import NestedLegendBasic from "./examples/NestedLegendBasic.svelte";
import NestedLegendBasicSource from "./examples/NestedLegendBasic.svelte?raw";

const meta = {
    title: "Example/NestedComponents",
    component: SciChartNestedOverview,
    parameters: { layout: "centered" },
    tags: ["autodocs"]
} satisfies Meta<typeof SciChartNestedOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

/** `SciChartNestedOverview` creates an overview of the enclosing chart */
export const BasicNestedOverview: Story = {
    render: renderComponent(NestedOverviewBasic),
    parameters: { docs: { source: { code: NestedOverviewBasicSource, language: "svelte" } } }
};

/** `SciChartNestedLegend` (experimental) draws the enclosing chart's legend into its own div */
export const BasicNestedLegend: Story = {
    render: renderComponent(NestedLegendBasic),
    parameters: { docs: { source: { code: NestedLegendBasicSource, language: "svelte" } } }
};
