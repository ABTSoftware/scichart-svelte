import type { Meta, StoryObj } from "@storybook/sveltekit";
import { SciChartSvelte } from "#lib";
import ChartWithInitFunctionExample from "./examples/ChartWithInitFunction.svelte";
import ChartWithInitFunctionSource from "./examples/ChartWithInitFunction.svelte?raw";
import ChartWithConfigExample from "./examples/ChartWithConfig.svelte";
import ChartWithConfigSource from "./examples/ChartWithConfig.svelte?raw";
import ChartWithFallbackExample from "./examples/ChartWithFallback.svelte";
import ChartWithFallbackSource from "./examples/ChartWithFallback.svelte?raw";
import ChartWrapperStylingExample from "./examples/ChartWrapperStyling.svelte";
import ChartWrapperStylingSource from "./examples/ChartWrapperStyling.svelte?raw";
import ChartWithInitCallbackExample from "./examples/ChartWithInitCallback.svelte";
import ChartWithInitCallbackSource from "./examples/ChartWithInitCallback.svelte?raw";
import ChartWithNestedComponentsExample from "./examples/ChartWithNestedComponents.svelte";
import ChartWithNestedComponentsSource from "./examples/ChartWithNestedComponents.svelte?raw";
import ChartWith3dSurfaceExample from "./examples/ChartWith3dSurface.svelte";
import ChartWith3dSurfaceSource from "./examples/ChartWith3dSurface.svelte?raw";
import ChartWithPieSurfaceExample from "./examples/ChartWithPieSurface.svelte";
import ChartWithPieSurfaceSource from "./examples/ChartWithPieSurface.svelte?raw";
import type { Component } from "svelte";
import { renderComponent } from "./storyHelpers.js";

const meta = {
    title: "Example/SciChartSvelte",
    component: SciChartSvelte,
    parameters: { layout: "centered" },
    tags: ["autodocs"]
} satisfies Meta<typeof SciChartSvelte>;

export default meta;
// every story renders an example component of its own, so none passes args to SciChartSvelte
type Story = StoryObj;

/** A story rendering one example component, with that component's source shown in the docs */
const example = (component: Component, code: string): Story => ({
    render: renderComponent(component),
    parameters: { docs: { source: { code, language: "svelte" } } }
});

/** A chart created by an initialization function */
export const ChartWithInitFunction = example(ChartWithInitFunctionExample, ChartWithInitFunctionSource);

/** A chart created from a Builder API config by `SciChartDeclarative` */
export const ChartWithConfig = example(ChartWithConfigExample, ChartWithConfigSource);

/** A custom `fallback` snippet, shown while the chart is initialized (here: forever) */
export const ChartWithFallback = example(ChartWithFallbackExample, ChartWithFallbackSource);

/** Attributes go to the outer div, `innerContainerProps` to the inner one, and `stateClassNames` renames the state classes */
export const ChartWrapperStyling = example(ChartWrapperStylingExample, ChartWrapperStylingSource);

/** `onInit` starts an animation and returns the cleanup that stops it */
export const ChartWithInitCallback = example(ChartWithInitCallbackExample, ChartWithInitCallbackSource);

/** Children render once the chart is initialized and read its init result with `getSciChartSurface()` */
export const ChartWithNestedComponents = example(ChartWithNestedComponentsExample, ChartWithNestedComponentsSource);

/** A 3D surface */
export const ChartWith3dSurface = example(ChartWith3dSurfaceExample, ChartWith3dSurfaceSource);

/** A pie surface */
export const ChartWithPieSurface = example(ChartWithPieSurfaceExample, ChartWithPieSurfaceSource);
