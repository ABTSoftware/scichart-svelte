import type { Component } from "svelte";

/**
 * A story `render` that mounts an example component of its own instead of the meta's component.
 * Returns `any` because the meta's generic components cannot name the example's props.
 */
export const renderComponent = (Component: Component<any>, props: Record<string, unknown> = {}): (() => any) => {
    return () => ({ Component, props });
};
