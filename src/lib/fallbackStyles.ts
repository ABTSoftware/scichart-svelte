/**
 * Stacking order for the two kinds of loading overlay. A group's overlay has to cover the
 * per-chart overlays of the charts inside it, so it sits one layer above. Both participate in
 * the same stacking context: a chart's wrapper is positioned but has z-index auto, so it
 * creates no context of its own and its fallback's z-index competes with the group's directly.
 */
const chartFallbackZIndex = 12;
const groupFallbackZIndex = chartFallbackZIndex + 1;

const overlayStyle = "position: absolute; height: 100%; width: 100%; top: 0; left: 0;";

/** @ignore Wrapper for a chart's custom fallback */
export const fallbackWrapperStyle = `${overlayStyle} z-index: ${chartFallbackZIndex};`;

/**
 * @ignore Wrapper for a chart group's loading overlay. Identical to {@link fallbackWrapperStyle} but one
 * layer higher, so the group's overlay hides the charts and their own overlays rather than
 * showing through the gaps between them.
 */
export const groupFallbackWrapperStyle = `${overlayStyle} z-index: ${groupFallbackZIndex};`;

/** @ignore The element {@link DefaultFallback} draws SciChart's loader in */
export const defaultFallbackStyle = `${overlayStyle} text-align: center;`;
