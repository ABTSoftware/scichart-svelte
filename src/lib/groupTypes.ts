import type { Snippet } from "svelte";
import type { IInitResult, IStateClassNames, TDivProps } from "./types.js";

/** Props for {@link SciChartGroup} */
export type TSciChartGroupProps = {
    /** called once every chart within the group is initialized */
    onInit?: (chartInitResults: IInitResult[]) => void;
    /**
     * called once every chart within the group is initialized and has rendered at least once,
     * whichever happens last; see {@link IStateClassNames.rendered}. Called after `onInit`
     */
    onRendered?: (chartInitResults: IInitResult[]) => void;
    /** called when the group's charts are deleted, or the group is destroyed, after it was initialized */
    onDelete?: (chartInitResults: IInitResult[]) => void;
    /** called when an initialization function within the group, or its `onInit`, throws */
    onInitError?: (error: any) => void;
    /** the content holding the group's charts, at any depth */
    children?: Snippet;
};

/** Props for {@link ChartGroupLoader}: a div's own attributes, plus the group's loading, init and state-class options */
export type TChartGroupLoaderProps = Omit<TDivProps, "children"> & {
    /** content rendered over the group while its charts are being initialized; defaults to {@link DefaultFallback} */
    fallback?: Snippet;
    /** the content holding the group's charts, at any depth */
    children?: Snippet;
    /** called once all charts are initialized, while the fallback is still shown */
    onInit?: (chartInitResults: IInitResult[]) => void;
    /**
     * called once all charts are initialized and have rendered at least once, after the fallback is removed;
     * see {@link IStateClassNames.rendered}
     */
    onRendered?: (chartInitResults: IInitResult[]) => void;
    /** a callback function used when an initialization function has thrown an error */
    onInitError?: (error: any) => void;
    /**
     * class names added to the element as the charts within the group reach each state;
     * a state left out uses its {@link defaultGroupStateClassNames} entry, and an empty string adds no class
     */
    stateClassNames?: Partial<IStateClassNames>;
};
