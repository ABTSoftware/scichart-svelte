import type { Meta, StoryObj } from "@storybook/sveltekit";
import { renderComponent } from "./storyHelpers.js";
import { ChartGroupLoader } from "#lib";
import ChartGroupLoaderBasic from "./examples/ChartGroupLoaderBasic.svelte";
import ChartGroupLoaderBasicSource from "./examples/ChartGroupLoaderBasic.svelte?raw";
import ChartGroupLoaderCustom from "./examples/ChartGroupLoaderCustom.svelte";
import ChartGroupLoaderCustomSource from "./examples/ChartGroupLoaderCustom.svelte?raw";

const meta = {
    title: "Example/ChartGroupLoader",
    component: ChartGroupLoader,
    parameters: { layout: "centered" },
    tags: ["autodocs"]
} satisfies Meta<typeof ChartGroupLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** ChartGroupLoader shows one shared fallback until every chart within it is initialized */
export const BasicChartGroupLoader: Story = {
    render: renderComponent(ChartGroupLoaderBasic),
    parameters: { docs: { source: { code: ChartGroupLoaderBasicSource, language: "svelte" } } }
};

/** A custom fallback snippet, swapped for an error message by `onInitError` */
export const CustomChartGroupLoader: Story = {
    render: renderComponent(ChartGroupLoaderCustom),
    parameters: { docs: { source: { code: ChartGroupLoaderCustomSource, language: "svelte" } } }
};
