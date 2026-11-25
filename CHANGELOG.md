# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This file is not shipped in the npm package, which carries `README_NPM.md` as its readme.

## [1.0.0]

First release: the Svelte 5 counterpart of scichart-react 2.3.0, with the same components, lifecycle
callbacks, cleanup order and state classes.

### Added

- `SciChartSvelte`, the chart component taking an `initChart` function, generic over the surface and
  the init result.
- `SciChartDeclarative`, the chart component taking a Builder API `config`, inferring the surface type
  from the config's `type` (`TSurfaceFromConfig`). The only module that bundles the Builder API.
- `onInit`, `onRendered`, `onDelete` and `onInitError` callbacks; `onInit` and `onRendered` may return a
  cleanup, and the init result may carry a `destructor`, run even if the chart is destroyed before init
  finishes.
- `fallback` and `children` snippets, `DefaultFallback`, `innerContainerProps`, attributes passed to the
  outer div, and the `scichart_initialized` / `scichart_rendered` state classes (`stateClassNames`,
  `defaultChartStateClassNames`).
- `SciChartGroup` and `ChartGroupLoader` (`scichart_group_*` classes, `defaultGroupStateClassNames`),
  tracking every chart beneath them at any depth.
- `getSciChartSurface()` / `SciChartSurfaceContext` and `getSciChartGroup()` / `SciChartGroupContext`.
- `SciChartNestedOverview`, `SciChartNestedLegend` (experimental) and `SciChartMemoryDebugWrapper`.
- `configureSciChartDefaults`, the package's only import-time side effect: a `/scichart.wasm` default
  that never overrides an app's own wasm configuration.
- Types: `IInitResult`, `TInitFunction`, `IStateClassNames`, `TSurfaceFromConfig`, `TResolvedReturnType`
  and the prop types of every component.

[1.0.0]: https://github.com/ABTSoftware/scichart-svelte/releases/tag/v1.0.0
