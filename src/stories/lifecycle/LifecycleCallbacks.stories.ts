import type { Meta, StoryObj } from "@storybook/sveltekit";
import { renderComponent } from "../storyHelpers.js";
import LoggedChart from "./LoggedChart.svelte";
import LoggedGroup from "./LoggedGroup.svelte";
import MountedChart from "./MountedChart.svelte";
import LoggedSciChartGroup from "./LoggedSciChartGroup.svelte";
import { createEmptyPieSurface } from "./lifecycleLog.js";

/** Stories for tests/lifecycle-callbacks.spec.ts; each logs its lifecycle steps to `window.lifecycleLog` */
const meta = {
    title: "Tests/LifecycleCallbacks",
    component: LoggedChart,
    // hidden from the sidebar and the docs; tests/visual.spec.ts skips "test-only" stories
    tags: ["!dev", "!autodocs", "test-only"]
} satisfies Meta<typeof LoggedChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const MountApi: Story = { render: renderComponent(MountedChart) };

export const DelayedInit: Story = { args: { delayInit: true } };

export const NeverRenders: Story = { args: { createSurface: createEmptyPieSurface } };

export const NoDestructor: Story = { args: { noDestructor: true } };

export const InitChartThrows: Story = { args: { initChartThrows: true } };

export const InitChartThrowsUnhandled: Story = { args: { initChartThrows: true, noOnInitError: true } };

export const OnInitThrows: Story = { args: { onInitThrows: true } };

export const OnInitThrowsUnhandled: Story = { args: { onInitThrows: true, noOnInitError: true } };

export const Group: Story = { render: renderComponent(LoggedGroup) };

export const GroupOnInitThrows: Story = {
    render: renderComponent(LoggedGroup, { onInitThrows: true })
};

export const GroupAtAnyDepth: Story = { render: renderComponent(LoggedSciChartGroup) };
