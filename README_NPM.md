# SciChart.Svelte - Svelte Wrapper for [SciChart.js: High Performance JavaScript Chart Library](https://www.scichart.com/javascript-chart-features/)

:books: [Component API (Storybook)](https://abtsoftware.github.io/scichart-svelte/) · :octocat: [Source and demos](https://github.com/ABTSoftware/scichart-svelte)

![scichart-svelte](https://img.shields.io/npm/v/scichart-svelte) ![license](https://img.shields.io/npm/l/scichart-svelte)

`scichart-svelte` hosts [SciChart.js](https://www.scichart.com/javascript-chart-features/) charts inside Svelte 5
components. It is the Svelte sibling of [scichart-react](https://github.com/ABTSoftware/scichart-react): the same
components, lifecycle callbacks and cleanup order, expressed with runes, snippets and Svelte context.

## What does SciChart.Svelte do?

- Wraps the lifecycle of SciChart.js into a Svelte component to ensure proper initialisation and memory cleanup.
- Creates a chart from an initialization function (`SciChartSvelte`) or from a Builder API config
  (`SciChartDeclarative`).
- Groups several charts behind one loader (`ChartGroupLoader`, `SciChartGroup`) for dashboards.
- Is safe to server-render with SvelteKit: nothing touches SciChart on the server.

## Getting Started

### Prerequisites

- `svelte` 5 (runes)
- `scichart` 6.0.13+
- an ESM-aware bundler: Vite (SvelteKit) or any bundler with the `svelte` export condition. The package is ESM only.

### Installing

```
npm install scichart scichart-svelte
```

### Loading required WASM dependencies

SciChart.js requires WebAssembly binaries to work. Since v6 the engine is modular — a core plus side modules it
loads at runtime — so the payload is the whole `_wasm` **directory**, not a single file: the core
(`scichart.wasm`, with `scichart-nosimd.wasm` and `scichart-64.wasm` picked per browser capability) is fetched for
every chart, and `scichart-charting3d.wasm` for the first 3D chart. Copy the directory into the folder your app
serves at its root — `static/` for SvelteKit, `public/` for plain Vite:

```js
// vite.config.ts, with vite-plugin-static-copy
viteStaticCopy({ targets: [{ src: "node_modules/scichart/_wasm/*.wasm", dest: "" }] });
```

or with a small script before `dev`/`build` (see `demos/*/scripts/copy-wasm.mjs`). Find detailed info at
[Deploying Wasm Docs](https://www.scichart.com/documentation/js/current/2d-charts/surface/deploying-wasm/).

By default scichart-svelte applies the equivalent of:

```typescript
SciChartSurface.configure({
    wasmUrl: "/scichart.wasm"
});
```

The core's own default is the page-relative `"scichart.wasm"`, which resolves to a different file on every route of
a single-page app. The default is applied at import time by the `configureSciChartDefaults` module, which is bundled
whenever your app uses the chart components. It is applied only while your app has not configured wasm loading
itself (`SciChartSurface.configure(...)`, `loadWasmFromCDN()`, `loadWasmLocal()`), so your configuration wins
whichever module is evaluated first.

### SvelteKit (server-side rendering)

The components render on the server like any other: the server sends the outer elements and the fallback, and the
chart is created in the browser after hydration. SciChart is never called on the server.

The server still _imports_ `scichart`, whose ESM build uses extensionless imports that Node cannot load when Vite
externalizes it. Let Vite bundle it for the server:

```ts
// vite.config.ts
export default defineConfig({
    plugins: [sveltekit()],
    ssr: { noExternal: ["scichart"] }
});
```

### Using

There are two chart components:

- **`SciChartSvelte`** — takes an initialization function via the `initChart` prop. This is the primary component
  for code-first apps and produces the smallest bundles.
- **`SciChartDeclarative`** — takes a chart definition (object or JSON string) via the `config` prop and creates
  the chart with the [Builder API](https://www.scichart.com/documentation/js/current/2d-charts/builder-api/builder-api-overview/).
  The Builder API is only bundled by apps that use this component. It registers every built-in chart type, so any
  definition works with no setup.

#### With Initialization Function (SciChartSvelte)

Pass a function which should create a surface on the provided root element and resolve to `{ sciChartSurface }`.
Anything else it resolves with is passed on to the callbacks and to the children.

```svelte
<script lang="ts">
    import { NumericAxis, SciChartSurface, FastLineRenderableSeries, XyDataSeries } from "scichart";
    import { SciChartSvelte } from "scichart-svelte";

    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: [1, 2, 3], yValues: [1, 4, 2] })
            })
        );

        return { sciChartSurface };
    };
</script>

<SciChartSvelte {initChart} style="width: 800px; height: 600px;" />
```

#### With Config (SciChartDeclarative)

```svelte
<script lang="ts">
    import { EAxisType, ESeriesType } from "scichart";
    import { SciChartDeclarative } from "scichart-svelte";
</script>

<SciChartDeclarative
    config={{
        xAxes: [{ type: EAxisType.NumericAxis }],
        yAxes: [{ type: EAxisType.NumericAxis }],
        series: [{ type: ESeriesType.LineSeries, xyData: { xValues: [1, 2, 3], yValues: [1, 4, 2] } }]
    }}
    style="width: 800px; height: 600px;"
/>
```

The surface type passed to the callbacks follows the `type` of the `config` object: an
`ESciChartSurfaceType.Default3D` definition gives a `SciChart3DSurface`, `Pie2D` a `SciChartPieSurface`, `Polar2D` a
`SciChartPolarSurface`, anything else a `SciChartSurface`. A JSON string config gives the base surface type.

**NOTE** `initChart` and `config` are read once, when the chart is created. Changing them later does not re-create
the chart; re-key the component (`{#key ...}`) to do that.

#### Props

Both components accept:

| Prop                                              | Description                                                                                        |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `fallback` (snippet)                              | shown over the chart until it is initialized; defaults to `DefaultFallback`, SciChart's own loader |
| `children` (snippet)                              | rendered once the chart is initialized, with the init result in the Surface Context                |
| `onInit`, `onRendered`, `onDelete`, `onInitError` | lifecycle callbacks, below                                                                         |
| `innerContainerProps`                             | attributes for the inner div the chart is created in (`style`, `class`, `id`, ...)                 |
| `stateClassNames`                                 | renames the state classes (`{ initialized, rendered }`); an empty string adds no class             |
| any other attribute                               | goes to the outer div (`class`, `style`, `id`, `data-*`, event handlers, ...)                      |

The outer div gets `scichart_initialized` once the chart is initialized and `scichart_rendered` once it has also
rendered at least once (`defaultChartStateClassNames`).

#### Children and the Surface Context

Children render only after the chart is initialized. They read its init result with `getSciChartSurface()`:

```svelte
<!-- ToggleThemeButton.svelte, a child of SciChartSvelte -->
<script lang="ts">
    import { getSciChartSurface } from "scichart-svelte";

    const surface = getSciChartSurface(); // { readonly current: IInitResult | null }
</script>

<button onclick={() => console.log(surface.current?.sciChartSurface.id)}>Log surface id</button>
```

`SciChartNestedOverview` (an overview of the parent chart) and `SciChartNestedLegend` (experimental, the parent
chart's legend in a div of its own) are built on it. The raw context key is exported as `SciChartSurfaceContext`.

#### Never put a surface in `$state`

Svelte's `$state` wraps objects in deep proxies, which breaks wasm-backed SciChart objects and leaks memory. Keep
surfaces and init results in plain variables or `$state.raw` — as the components themselves do:

```ts
let surface = $state.raw<SciChartSurface | null>(null); // ok
let surface = $state<SciChartSurface | null>(null); // never
```

#### Chart groups

`ChartGroupLoader` shows one fallback over all the charts beneath it, at any depth, until every one of them is
initialized, and adds `scichart_group_initialized` / `scichart_group_rendered` to its div. `SciChartGroup` does the
same tracking without any markup. Both take `onInit`, `onRendered` and `onInitError` with every chart's init result;
`SciChartGroup` also takes `onDelete`. A chart joins the nearest enclosing group.

```svelte
<ChartGroupLoader onInit={initResults => console.log(initResults.length, "charts")}>
    {#snippet fallback()}<div>Loading dashboard...</div>{/snippet}
    <SciChartSvelte initChart={initFirstChart} />
    <SciChartSvelte initChart={initSecondChart} />
</ChartGroupLoader>
```

## Lifecycle callbacks and cleanup

`SciChartSvelte` and `SciChartDeclarative` call these synchronous callbacks:

| Callback      | When it is called                                       | Fallback shown | Children mounted |
| ------------- | ------------------------------------------------------- | -------------- | ---------------- |
| `onInit`      | the init function has resolved                          | yes            | no               |
| `onRendered`  | the chart is initialized and has rendered at least once | no             | yes              |
| `onDelete`    | the component is destroyed                              | -              | -                |
| `onInitError` | the init function or `onInit` threw                     | yes            | no               |

`onInit` and `onRendered` may return a cleanup function, called when the component is destroyed.

`onInit` and `onDelete` are not called when the component is destroyed before the init function has resolved, so use
`onDelete` only for what `onInit` set up.

To release what the init function itself created besides the surface — subscriptions, objects holding the surface,
timers — return a `destructor` with the surface. It is called on destroy, even if the init function has not resolved
yet, before the surface is deleted:

```ts
const initChart = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface } = await SciChartSurface.create(rootElement);

    // ... create something that has to be released, e.g. a subscription
    const subscription = subscribeToData(sciChartSurface);

    return { sciChartSurface, destructor: () => subscription.unsubscribe() };
};
```

When the component is destroyed, the element the chart was created in is removed at once. Then, once the init
function has settled, the steps run in this order:

1. the cleanup returned by `onRendered`, if it was called
2. the cleanup returned by `onInit`, if it was called
3. `onDelete`, if `onInit` was called
4. `destructor`
5. the chart leaves its group, if any
6. the surface is deleted, along with everything added to it with `sciChartSurface.addDeletable()`

If the init function or `onInit` throws, what init created is deleted (`destructor`, then the surface) and the error
goes to `onInitError` and to the group's `onInitError`. With neither, it is left as an unhandled rejection.

`ChartGroupLoader` calls its `onInit` while its fallback is still shown, and its `onRendered` once the fallback has
been removed.

The callbacks are read when they are called, so a callback prop that changes takes effect for the steps still to
come.

## Type registration (SciChart v6)

A chart definition names its parts as strings — `{ type: "LineSeries" }`. A string cannot pull code into a bundle,
so since SciChart v6 the Builder API registers nothing on import: the types a definition names have to be
registered, or building it fails with `Nothing registered for RenderableSeries:LineSeries`.

`SciChartDeclarative` handles this for you by registering every built-in type, so any definition works with no
setup. The trade-off is bundle size: the whole type universe is included. If that matters, use `SciChartSvelte` with
an `initChart` function — types you construct yourself register automatically. You can also call the Builder API
from an `initChart` function, registering only the types your definition names (`scichart/Builder/register/*`).

## Packaging and tree-shaking

The package is ESM only and ships the Svelte sources (`svelte-package`). The root export holds everything; every
module is also reachable on its own:

```ts
import { SciChartSvelte } from "scichart-svelte";
import SciChartDeclarative from "scichart-svelte/SciChartDeclarative.svelte";
import { defaultChartStateClassNames } from "scichart-svelte/stateClassNames";
```

Every module is side-effect free except `configureDefaults` (the wasm default above), so an app that never uses
`SciChartDeclarative` never bundles the Builder API.

## Differences from scichart-react

The behaviour is the same; the syntax is Svelte's:

| scichart-react                               | scichart-svelte                                                                    |
| -------------------------------------------- | ---------------------------------------------------------------------------------- |
| `SciChartReact`                              | `SciChartSvelte`                                                                   |
| `fallback={<Loader />}`, `children`          | `{#snippet fallback()}`, children snippet                                          |
| div props (`className`, `style={{...}}`)     | attributes (`class`, `style="..."`) on the component                               |
| `useContext(SciChartSurfaceContext)`         | `getSciChartSurface().current`                                                     |
| `<SciChartDeclarative<SciChart3DSurface>>`   | not available: Svelte has no explicit type arguments; the type comes from `config` |
| `SciChartNestedOverview` replaces `onDelete` | `SciChartNestedOverview` calls your `onDelete`, then deletes the overview          |

## Useful Links

### Onboarding

- [Getting Started Guide](https://scichart.com/getting-started/scichart-javascript/)
- [SciChart.js Demos](https://www.scichart.com/demo/)
- [SciChart.js Documentation](https://www.scichart.com/documentation/js/current/intro/)
- [Component API (Storybook)](https://abtsoftware.github.io/scichart-svelte/)

### Support

- [Community forums](https://scichart.com/questions)
- [Stackoverflow tag](https://stackoverflow.com/tags/scichart)
- [Contact Us (Technical support or sales)](https://scichart.com/contact-us)
