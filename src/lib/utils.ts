import { generateGuid } from "scichart";
import type { ISciChartSurfaceBase, SciChartPieSurface } from "scichart";
import type { IStateClassNames } from "./types.js";

/** Creates the Chart Root: the div an init function creates its surface in */
export const createChartRoot = (): HTMLDivElement => {
    const internalRootElement = document.createElement("div");
    // generate or provide a unique root element id to avoid chart rendering collisions
    internalRootElement.id = `chart-root-${generateGuid()}`;
    internalRootElement.style.width = "100%";
    internalRootElement.style.height = "100%";
    return internalRootElement;
};

/**
 * Tells whether a surface has rendered at least once
 * @param surface the surface to check
 * @returns `true` if the surface has rendered at least once; `false` if it has not or its kind is unknown
 */
const hasSurfaceRendered = (surface: ISciChartSurfaceBase): boolean => {
    // declared on SciChartSurfaceBase (2D, 3D, polar and sub-surfaces), not on the interface;
    // undefined until the surface's first render pass sets it
    if ("seriesViewRect" in surface) {
        return surface.seriesViewRect !== undefined;
    }

    // declared on SciChartPieSurface, which does not extend SciChartSurfaceBase;
    // a pie draws as soon as it gets a segment and draws nothing without one
    if ("pieSegments" in surface) {
        return (surface.pieSegments as SciChartPieSurface["pieSegments"]).size() > 0;
    }

    return false;
};

/**
 * Calls back once a surface has rendered at least once: right away if it already has, otherwise on its first
 * `rendered` event
 * @param surface the surface to watch
 * @param onRendered called once the surface has rendered
 * @returns a function that stops waiting
 */
export const waitForFirstRender = (surface: ISciChartSurfaceBase, onRendered: () => void): (() => void) => {
    if (hasSurfaceRendered(surface)) {
        onRendered();
        return () => {};
    }

    const handleRendered = () => {
        surface.rendered.unsubscribe(handleRendered);
        onRendered();
    };

    surface.rendered.subscribe(handleRendered);

    return () => surface.rendered.unsubscribe(handleRendered);
};

/**
 * Lists the state classes of the states reached
 * @param state the states reached
 * @param stateClassNames the class names that override the defaults; an empty string adds no class
 * @param defaultStateClassNames the class names used for any state not overridden
 * @returns the class names to add, possibly none
 */
export const getStateClassNames = (
    state: { isInitialized: boolean; isRendered: boolean },
    stateClassNames: Partial<IStateClassNames> | undefined,
    defaultStateClassNames: Readonly<IStateClassNames>
): string[] => {
    const initializedClassName = stateClassNames?.initialized ?? defaultStateClassNames.initialized;
    const renderedClassName = stateClassNames?.rendered ?? defaultStateClassNames.rendered;
    const classNames: string[] = [];

    if (state.isInitialized && initializedClassName) {
        classNames.push(initializedClassName);
    }

    if (state.isRendered && renderedClassName) {
        classNames.push(renderedClassName);
    }

    return classNames;
};

/**
 * Prepends a component's own declarations to the caller's `style` attribute, so the caller's win
 * @param ownStyle the component's declarations
 * @param style the caller's `style` attribute
 */
export const mergeStyle = (ownStyle: string, style: string | null | undefined): string =>
    style ? `${ownStyle} ${style}` : ownStyle;
