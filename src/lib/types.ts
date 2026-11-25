import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import type {
    ESciChartSurfaceType,
    ISciChartSurfaceBase,
    SciChart3DSurface,
    SciChartPieSurface,
    SciChartPolarSurface,
    SciChartSurface,
    TSurfaceDefinition
} from "scichart";

/** Describes the core return type of a chart initialization function */
export interface IInitResult<TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase> {
    /** the created surface; deleted on unmount */
    sciChartSurface: TSurface;
    /**
     * an optional callback to clean up disposable entities, other than the surface, created within `initChart`.
     * Executes on unmount, even if init has not finished, before the surface is deleted
     */
    destructor?: TCleanupCallback;
}

/**
 * Describes the type of a chart initialization function
 * @param rootElement the internal element that should be used to create a chart
 * @returns a Promise with the initialization result object containing the created surface reference as `sciChartSurface` property
 */
export type TInitFunction<
    TSurface extends ISciChartSurfaceBase = SciChartSurface,
    TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
> = (rootElement: string | HTMLDivElement) => Promise<TInitResult>;

/** The attributes of a div element */
export type TDivProps = HTMLAttributes<HTMLDivElement>;

/** A function that releases what a callback set up */
export type TCleanupCallback = () => void;

/** Class names a component adds to its element as its charts reach each state */
export interface IStateClassNames {
    /** added once the charts are initialized */
    initialized: string;
    /**
     * added once the charts are initialized and have rendered at least once.
     * A chart has rendered once its surface has raised its `rendered` event, which does not mean it is on screen
     * yet; a pie chart raises it only once it has a segment
     */
    rendered: string;
}

/** Describes the common properties shared by {@link SciChartSvelte} and {@link SciChartDeclarative} */
export interface IChartComponentPropsCore<
    TSurface extends ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
> extends Omit<TDivProps, "children"> {
    /** content rendered over the chart while it is being initialized; defaults to {@link DefaultFallback} */
    fallback?: Snippet;
    /** content rendered inside the chart element once the chart is initialized */
    children?: Snippet;
    /**
     * called after init, before the fallback is removed; skipped if unmounted earlier.
     * May return a cleanup function
     */
    onInit?: (initResult: TInitResult) => TCleanupCallback | void;
    /**
     * called after the first render, once the fallback is removed; see {@link IStateClassNames.rendered}.
     * May return a cleanup function
     */
    onRendered?: (initResult: TInitResult) => TCleanupCallback | void;
    /**
     * called on unmount, before the surface is deleted; skipped if `onInit` was.
     * For what `initChart` created, use {@link IInitResult.destructor}
     */
    onDelete?: (initResult: TInitResult) => void;
    /** called when the initialization function or `onInit` throws */
    onInitError?: (err?: any) => void;
    /** attributes passed to the inner container of the chart */
    innerContainerProps?: TDivProps;
    /**
     * class names added to the element as the chart reaches each state;
     * a state left out uses its {@link defaultChartStateClassNames} entry, and an empty string adds no class
     */
    stateClassNames?: Partial<IStateClassNames>;
}

/** Describes allowed properties for {@link SciChartSvelte} */
export type TChartComponentPropsWithInit<
    TSurface extends ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface>
> = IChartComponentPropsCore<TSurface, TInitResult> & {
    /**
     * An initialization function which should return surface instance created on the provided root element.
     */
    initChart: TInitFunction<TSurface, TInitResult>;
    config?: never;
};

/** Describes allowed properties for {@link SciChartDeclarative} */
export type TChartComponentPropsWithConfig<TSurface extends ISciChartSurfaceBase> = IChartComponentPropsCore<
    TSurface,
    IInitResult<TSurface>
> & {
    initChart?: never;
    /**
     * A string with chart definition or configuration object acceptable by SciChart Builder API
     */
    config: string | TSurfaceDefinition;
};

/**
 * The surface type a Builder API chart definition creates, chosen by its `type` field.
 * A definition without `type` creates a 2D {@link SciChartSurface}.
 * A JSON string is opaque at compile time, so it maps to {@link ISciChartSurfaceBase}.
 */
export type TSurfaceFromConfig<TConfig extends string | TSurfaceDefinition> = TConfig extends string
    ? ISciChartSurfaceBase
    : TConfig extends { type: ESciChartSurfaceType.Default3D }
      ? SciChart3DSurface
      : TConfig extends { type: ESciChartSurfaceType.Pie2D }
        ? SciChartPieSurface
        : TConfig extends { type: ESciChartSurfaceType.Polar2D }
          ? SciChartPolarSurface
          : SciChartSurface;

/** The value an async function resolves to, e.g. the init result of an `initChart` function */
export type TResolvedReturnType<TFunc extends (...args: any) => any> = Awaited<ReturnType<TFunc>>;
