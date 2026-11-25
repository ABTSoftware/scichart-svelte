import { expect, test, type Page } from "@playwright/test";
import { defaultChartStateClassNames as chart, defaultGroupStateClassNames as group } from "../src/lib/stateClassNames";

const TIMEOUT = 120_000;

const openStory = (page: Page, id: string) =>
    page.goto(`/iframe.html?viewMode=story&id=${id}`, { waitUntil: "domcontentloaded" });

test.beforeEach(async ({ page }) => {
    // SciChart reads this at module load, so it must be set before navigation
    await page.addInitScript(() => localStorage.setItem("IS_WEB_GPU", "0"));
});

test("SciChartSvelte adds the initialized and rendered classes", async ({ page }) => {
    await openStory(page, "example-scichartsvelte--chart-with-init-function");

    await expect(page.locator(`.${chart.rendered}`)).toContainClass(chart.initialized, { timeout: TIMEOUT });
});

test("ChartGroupLoader adds the initialized and rendered classes", async ({ page }) => {
    await openStory(page, "example-chartgrouploader--basic-chart-group-loader");

    await expect(page.locator(`.${group.rendered}`)).toContainClass(group.initialized, {
        timeout: TIMEOUT
    });
});

test("ChartGroupLoader adds no class when an init function throws", async ({ page }) => {
    await openStory(page, "example-chartgrouploader--custom-chart-group-loader");

    await page.getByText("This is a custom Error Message").waitFor({ timeout: TIMEOUT });

    await expect(page.locator(`.${group.initialized}, .${group.rendered}`)).toHaveCount(0);
});

test("attributes, innerContainerProps and stateClassNames reach the right elements", async ({ page }) => {
    await openStory(page, "example-scichartsvelte--chart-wrapper-styling");

    const outer = page.locator("#styled-chart");
    // the custom initialized class replaces the default; an empty rendered class adds none
    await expect(outer).toContainClass("styled-chart styled-chart-ready", { timeout: TIMEOUT });
    await expect(outer).not.toContainClass(chart.initialized);
    await expect(outer).toHaveCSS("position", "relative");
    await expect(outer).toHaveCSS("background-color", "rgb(47, 79, 79)");

    const inner = outer.locator("> #styled-chart-inner");
    await expect(inner).toHaveCSS("background-color", "rgb(169, 169, 169)");
    // the chart root is created inside the inner container
    await expect(inner.locator('> [id^="chart-root-"]')).toHaveCount(1);
    await expect(page.getByText("Nested Component Content")).toBeVisible();

    // wait for the first render, then check no rendered class was added
    await page.waitForFunction(() => document.querySelector("#styled-chart canvas") !== null, null, {
        timeout: TIMEOUT
    });
    await expect(page.locator(`.${chart.rendered}`)).toHaveCount(0);
});

test("a custom fallback is layered at z-index 12, the group's at 13", async ({ page }) => {
    await openStory(page, "example-scichartsvelte--chart-with-fallback");
    await expect(page.getByText("Loading...").locator("..")).toHaveCSS("z-index", "12", { timeout: TIMEOUT });

    await openStory(page, "example-chartgrouploader--custom-chart-group-loader");
    await expect(page.getByText("Loading...").locator("..")).toHaveCSS("z-index", "13", { timeout: TIMEOUT });
});
