# Contributing

How to check a change before opening a pull request, how CI judges it, and how a release is published.
CI uses Node 22.

## Parity with the other wrappers

scichart-svelte is one of four SciChart.js wrappers (React, Angular, Vue, Svelte). They share no code, but
they share behaviour: **scichart-react is the reference**. A change to what a component does — when a callback
runs, the cleanup order, which class is added when, what a group reports, which module may import the Builder
API — must match scichart-react, or be made there first. Express it in Svelte's idiom (snippets, attributes,
context, runes); never change the semantics to fit the idiom.

The port of scichart-react's `useChartLifecycle` is `src/lib/chartLifecycle.svelte.ts`. Keep its steps in the
same order as the React hook, and keep `tests/lifecycle-callbacks.spec.ts` in step with scichart-react's spec of
the same name.

Two rules that are easy to break:

- **SciChart objects are never deeply reactive.** Surfaces and init results live in plain variables or
  `$state.raw`, never in `$state`: a deep proxy breaks wasm-backed objects and leaks memory.
- **Builder Isolation.** Only `SciChartDeclarative.svelte` may reference `buildChart` or `registerAllTypes`.
  Every module except `configureDefaults` must stay side-effect free at import time. `npm run build` checks
  both (`scripts/verify-lib.ts`).

## Checking a change locally

```bash
npm ci
npm run lint          # prettier and eslint; any warning fails
npm run typecheck     # svelte-check, including the type tests in tests/types
npm run build         # builds dist/ and checks the package (verify-lib, publint, attw)
npm test              # every browser test, below
```

`npm test` starts its own servers on `127.0.0.1:6116` (a static Storybook build) and `127.0.0.1:3110` (the
showcase app in `src/routes`, `npm run dev`). Locally it reuses whatever is already running there, so stop
anything else on those ports first.

| Spec                                 | Runs against | Checks                                                                  |
| ------------------------------------ | ------------ | ----------------------------------------------------------------------- |
| `tests/lifecycle-callbacks.spec.ts`  | Storybook    | callback timing and unmount order, init errors, groups                  |
| `tests/group-loader-classes.spec.ts` | Storybook    | state classes, attributes, `innerContainerProps`, fallback layering     |
| `tests/visual.spec.ts`               | Storybook    | every story against its reference screenshot                            |
| `tests/ssr.spec.ts`                  | showcase app | every component server-renders without SciChart, then hydrates          |
| `tests/memory-leak.spec.ts`          | showcase app | nothing is left undeleted or in memory after repeated mount and unmount |

`npm run test:docker` runs all of them inside the same Docker image CI uses.

### Visual tests

Every story is screenshotted and compared with a reference image in `tests/__screenshots__/linux/`. Screenshots
differ slightly from machine to machine, so **only CI records and judges these images**. Never commit screenshots
taken on your own machine.

- `npm run test:docker` runs the tests in CI's image, which is the closest you can get locally. It can still
  differ by a few pixels from CI, for example on an Apple Silicon Mac.
- Running the tests directly on macOS or Windows compares against a separate set for that system, kept only on
  your machine (git ignores it). The first run records it.

### Updating the reference screenshots

When a change is meant to alter how a story looks:

1. Push the branch. The `browser-tests` job in CI fails on the changed stories.
2. Open the failed run in GitHub Actions and download two artifacts:
    - `playwright-report`: shows each difference. Check that it is the change you intended.
    - `visual-baselines-linux`: the screenshots CI just recorded.
3. Unzip `visual-baselines-linux` into `tests/__screenshots__/linux/`, commit and push.

New stories work the same way: CI fails until their reference image is committed.

### Demos

`demos/vite-svelte` (client-only Vite) and `demos/sveltekit` (server-rendered) consume the built package. Run
`npm run build` in the repo root first, then in the demo folder:

```bash
npm ci
npm run build
```

## What CI runs

`.github/workflows/ci.yaml`, on every pull request and on pushes to `main`:

| Job             | What it does                                                 |
| --------------- | ------------------------------------------------------------ |
| `verify`        | lint, typecheck, build                                       |
| `browser-tests` | every Playwright spec, inside `mcr.microsoft.com/playwright` |
| `demos`         | builds each demo                                             |

The Playwright image tag in `ci.yaml`, `deploy.yaml` and `tests/Dockerfile` must match the `@playwright/test`
version in `package.json`. Update all four together.

On every push to `main`, `.github/workflows/deploy.yaml` publishes the Storybook docs to GitHub Pages and checks
the live site.

## Releasing

Releases go through the **Publish to npm** workflow (`.github/workflows/publish.yaml`). Nothing is published
automatically. The branch you run it on decides the npm tag:

| Branch  | npm tag  | Version                                  |
| ------- | -------- | ---------------------------------------- |
| `alpha` | `alpha`  | bumped by the workflow (`x.y.z-alpha.N`) |
| `beta`  | `beta`   | bumped by the workflow (`x.y.z-beta.N`)  |
| `main`  | `latest` | bumped in the pull request into `main`   |

Before publishing, the workflow runs the install, typecheck and build checks again, then publishes with npm
trusted publishing (no npm token is stored). `prepack` swaps `README_NPM.md` in as the package readme and
`postpack` swaps it back; if a pack is interrupted, `node scripts/swap-readme.mjs github` restores the GitHub one.

Start it with `npm run release:latest`, `npm run release:alpha` or `npm run release:beta`, which need the
[GitHub CLI](https://cli.github.com/) installed and logged in (`gh auth login`). Or in GitHub: Actions →
**Publish to npm** → Run workflow → pick the branch. Never run `npm publish` yourself: it skips the checks and
the provenance.

### A release (`latest`)

1. In the pull request into `main`, set the version with `npm version <x.y.z> --no-git-tag-version` and rename
   `[Unreleased]` in `CHANGELOG.md` to it. Merge it.
2. `npm run release:latest`. The workflow refuses a prerelease version and a version that is already on npm.
   After publishing, it tags the published commit `v<x.y.z>`.
3. Create a GitHub Release on the tag, with the CHANGELOG entry as its text.

Check the result with `npm view scichart-svelte dist-tags`.
